# Revue de code — WheelDetailPanel.jsx

**Date :** 2026-05-07 12:00
**Périmètre :** `frontend/src/components/WheelDetailPanel.jsx`
**Verdict :** 🔴 bloquants à corriger

## Résumé

Le composant a une intention claire (modale de détail d'une roue avec historique), mais il contient deux bloquants graves : une mutation directe du store Redux à l'intérieur d'un sélecteur, et un `useEffect` avec dépendances vides qui ne réagit pas au changement de `wheelId`. S'ajoutent des problèmes notables d'accessibilité (modale non sémantique, fermeture en click n'importe où), d'UX (états loading/error absents) et de robustesse (pas d'annulation de la requête `fetch`, pas de `key` sur la liste). À corriger avant merge.

## Findings

### 🔴 Bloquants

**Mutation directe du store Redux dans le sélecteur**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:9-15`
- **Problème :** Le sélecteur écrit `w.lastViewed = Date.now()` sur l'objet renvoyé par le store. C'est une mutation directe en dehors d'un reducer, et elle se produit à chaque render (un sélecteur peut être appelé plusieurs fois par render). Cela viole l'immutabilité du store, casse la détection de changement de Redux Toolkit (deux références identiques alors que la valeur a changé), peut faire planter `redux-toolkit` en mode dev (`createSlice` active `immutableCheck` et `serializableCheck`), et provoque des renders incohérents pour tous les autres composants qui lisent `state.wheels.byId[wheelId]`.
- **Impact :** Bug invisible mais critique : le store devient corrompu, les composants abonnés ne se re-rendent pas correctement, et `lastViewed` peut être lu ailleurs comme une valeur "officielle" du store sans être passé par un reducer. En dev, la ConfigureStore Middleware lèvera très probablement une erreur `A non-serializable value was detected` ou `An immutable state invariant violation`.
- **Correction :** Le sélecteur doit être pur. Si on veut tracker `lastViewed`, il faut une action dédiée dispatchée dans un `useEffect`, et la valeur doit vivre dans le slice :
  ```jsx
  // dans wheelsSlice : ajouter un reducer
  // markWheelViewed: (state, { payload: id }) => {
  //   if (state.byId[id]) state.byId[id].lastViewed = Date.now();
  // }

  const wheel = useSelector((state) => state.wheels.byId[wheelId]);

  useEffect(() => {
    if (wheelId) dispatch(markWheelViewed(wheelId));
  }, [wheelId, dispatch]);
  ```

**`useEffect` avec deps vides ignore le changement de `wheelId`**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:17-22`
- **Problème :** L'effet s'exécute une seule fois au mount. Si le parent garde le composant monté et change `wheelId` (cas typique d'une modale qu'on rouvre sur une autre roue, ou d'un panneau persistant), `setActiveWheel` n'est jamais redispatché et `history` reste celui de la première roue. Le linter `react-hooks/exhaustive-deps` va le signaler, mais le finding est fonctionnel — un humain le relèverait quand même.
- **Impact :** Bug visible : l'utilisateur ouvre une roue A, ferme, ouvre une roue B → il voit le titre/lastViewed de B (parce que `wheel` est dérivé du store) mais l'historique de A et l'`activeWheel` reste A. Désynchronisation directe.
- **Correction :** Mettre `wheelId` dans les deps, et gérer l'annulation (cf. finding ci-dessous) :
  ```jsx
  useEffect(() => {
    if (!wheelId) return;
    dispatch(setActiveWheel(wheelId));
    const ctrl = new AbortController();
    fetch(`/api/wheels/${wheelId}/history`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setHistory)
      .catch((err) => { if (err.name !== 'AbortError') /* setError */; });
    return () => ctrl.abort();
  }, [wheelId, dispatch]);
  ```

### 🟠 Importants

**Aucune gestion d'erreur ni d'état loading sur le `fetch`**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:19-21`
- **Problème :** La chaîne `.then().then(setHistory)` n'a pas de `.catch`, ne vérifie pas `r.ok`, et il n'existe aucun état `loading`/`error`. Si l'API renvoie 500, retourne du HTML au lieu de JSON, ou si le réseau coupe, l'utilisateur voit une liste vide silencieuse — indistinguable d'une roue qui n'a réellement aucun historique.
- **Impact :** UX dégradée et debugging quasi impossible côté utilisateur. Aussi : une promesse rejetée non capturée pollue la console / déclenche `unhandledrejection`.
- **Correction :** Ajouter `loading`/`error` dans le state local et les afficher (skeleton + message d'erreur). Vérifier `r.ok` avant `r.json()`.

**Modale non accessible : `<div>` cliquable, pas de rôle, pas de focus trap, pas d'`Escape`**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:27-37`
- **Problème :** Plusieurs points cumulés :
  - Le backdrop est un `<div>` avec `onClick`, sans `role="dialog"`/`aria-modal`/`aria-labelledby`.
  - `onClick={onClose}` sur le backdrop **et** sur le contenu (parent) ferme la modale dès qu'on clique n'importe où dans la zone blanche aussi (le `<div>` blanc est enfant du backdrop, donc le clic remonte → `onClose` se déclenche). Bug d'UX direct.
  - Pas de fermeture clavier (`Escape`), pas de focus piégé dans la modale, pas de retour de focus à l'élément déclencheur.
- **Impact :** Inutilisable au clavier, et fermeture intempestive à la souris dès qu'on essaie de sélectionner du texte ou cliquer dans la modale.
- **Correction :** Soit utiliser un composant `<dialog>` natif avec `showModal()`, soit :
  ```jsx
  <div role="dialog" aria-modal="true" aria-labelledby="wheel-title"
       className="fixed inset-0 bg-black/60 p-6 grid place-items-center"
       onClick={onClose}>
    <div className="bg-white rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
      <h2 id="wheel-title" className="text-xl font-bold">{wheel.name}</h2>
      ...
    </div>
  </div>
  ```
  Et un `useEffect` qui écoute `keydown` Escape + gère le focus initial. Si une modale existe déjà ailleurs dans le repo (à vérifier), la réutiliser plutôt que d'en créer une nouvelle.

**`history.map` sans `key` stable**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:32-34`
- **Problème :** Pas de prop `key` sur le `<li>`. React va warner et utiliser l'index implicite, ce qui pose problème si la liste est jamais filtrée/triée/insérée en tête. `h.date` n'est probablement pas unique non plus (plusieurs events à la même date).
- **Impact :** Warning console + risque de réconciliation incorrecte.
- **Correction :** Si l'API expose un `id` par event, `key={h.id}`. Sinon, demander à l'API d'en fournir un — éviter `key={index}`.

**`new Date(wheel.lastViewed)` peut être `Invalid Date`**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:30`
- **Problème :** Tant que la mutation directe n'a jamais tourné (premier affichage d'une roue jamais vue), `wheel.lastViewed` est `undefined` et `new Date(undefined).toLocaleString()` retourne `"Invalid Date"` affiché tel quel. Une fois la mutation corrigée (cf. bloquant 1), le cas premier affichage doit être géré explicitement.
- **Impact :** Texte "Vu pour la dernière fois : Invalid Date" visible côté user.
- **Correction :** Garder un fallback : `{wheel.lastViewed ? new Date(wheel.lastViewed).toLocaleString() : 'Jamais consulté'}`.

### 🟡 Suggestions

**Sémantique HTML : entête de modale**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:28-35`
- Manque un bouton de fermeture explicite (croix en haut à droite) avec `aria-label="Fermer"`. Beaucoup d'utilisateurs cherchent un bouton avant de cliquer le backdrop.

**`onClose` n'est pas validé**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:5`
- Si le parent oublie de passer `onClose`, le `onClick` du backdrop crashera. Soit valeur par défaut `onClose = () => {}`, soit `if (typeof onClose === 'function') onClose()` au call site, soit PropTypes si déjà utilisé ailleurs dans le repo.

**Pas de défense contre `wheelId` falsy au mount**
- 📍 `frontend/src/components/WheelDetailPanel.jsx:17-22`
- Si `wheelId` est `undefined` au premier render, l'effet va appeler `setActiveWheel(undefined)` et `fetch('/api/wheels/undefined/history')`. Early return dans l'effet (`if (!wheelId) return;`) — déjà inclus dans la correction du bloquant 2.

### ⚪ Nits

- Le `bg-white rounded-lg p-4` n'a aucune contrainte de largeur/hauteur ni de centrage : sur grand écran la modale prend toute la largeur du viewport. Suggérer `max-w-lg mx-auto mt-20` ou un container flex centré.
- `<p>` pour la date est OK, mais une `<dl>` (`<dt>Vu pour la dernière fois</dt><dd>...</dd>`) serait plus sémantique pour des paires label/valeur.

## Questions ouvertes

- Le composant est-il monté/démonté à chaque ouverture (auquel cas le bug de deps vides est moins critique mais reste à corriger), ou reste-t-il monté avec changement de `wheelId` ? Cela affecte la priorité réelle du bloquant 2.
- Existe-t-il déjà un composant `Modal`/`Drawer`/`Dialog` réutilisable dans `frontend/src/components/` ? Si oui, il faut s'appuyer dessus plutôt que réimplémenter le backdrop ici.
- Le slice `wheelsSlice` expose-t-il déjà une action `markWheelViewed` ou équivalent ? Sinon, il faut l'ajouter pour corriger proprement le bloquant 1.
- La forme exacte de la réponse `/api/wheels/:id/history` est-elle figée ? Confirmer la présence d'un `id` par event pour la `key`.
