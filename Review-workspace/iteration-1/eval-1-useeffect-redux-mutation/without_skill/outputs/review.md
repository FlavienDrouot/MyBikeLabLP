# Revue de code — `WheelDetailPanel.jsx`

Salut Flavien, voici ma revue détaillée du composant. Il y a plusieurs points importants à corriger, certains assez critiques (mutation du state Redux, dépendances de `useEffect`).

---

## 1. Bugs critiques

### 1.1. Mutation directe du state Redux dans le `useSelector` (CRITIQUE)

```jsx
const wheel = useSelector((state) => {
  const w = state.wheels.byId[wheelId];
  if (w) {
    w.lastViewed = Date.now();   // ❌ mutation directe
  }
  return w;
});
```

C'est le problème le plus grave du composant. Plusieurs choses ne vont pas :

- **Tu mutes directement le state Redux**. Avec Redux Toolkit, le state est figé par Immer en dehors des reducers. Cette ligne va lever une erreur `TypeError: Cannot assign to read only property 'lastViewed'` en mode strict / dev.
- **Un selector doit être pur**. Il est appelé à chaque render et à chaque dispatch — y faire un effet de bord (écrire `Date.now()`) est une violation du contrat Redux.
- **Effet de bord visible** : `lastViewed` change à chaque render, ce qui peut provoquer des renders en cascade et casser la logique de mémoïsation downstream.

**Correction** : il faut passer par un reducer/action. Par exemple :

```js
// dans wheelsSlice
markWheelViewed: (state, action) => {
  const w = state.byId[action.payload];
  if (w) w.lastViewed = Date.now();
}
```

Et dans le composant :

```jsx
const wheel = useSelector((state) => state.wheels.byId[wheelId]);

useEffect(() => {
  if (wheel) dispatch(markWheelViewed(wheelId));
}, [dispatch, wheelId, wheel]);
```

---

### 1.2. `useEffect` avec un tableau de dépendances vide mais utilisant `wheelId` et `dispatch`

```jsx
useEffect(() => {
  dispatch(setActiveWheel(wheelId));
  fetch(`/api/wheels/${wheelId}/history`)
    .then((r) => r.json())
    .then((data) => setHistory(data));
}, []);   // ❌ dépendances manquantes
```

Problèmes :

- Si `wheelId` change pendant que le panneau est monté (ex : on passe d'une roue à l'autre sans démonter), l'effet ne se relance pas et tu affiches l'historique de la mauvaise roue.
- ESLint (`react-hooks/exhaustive-deps`) doit hurler, à juste titre.
- `dispatch` devrait aussi être dans les deps (même s'il est stable, pour la cohérence et l'analyse statique).

**Correction** :

```jsx
useEffect(() => {
  dispatch(setActiveWheel(wheelId));
}, [dispatch, wheelId]);
```

---

### 1.3. Race condition + pas d'annulation du `fetch`

Si `wheelId` change rapidement (ou si le composant est démonté avant la fin du fetch), tu peux :

- appeler `setHistory` sur un composant démonté (warning React),
- afficher l'historique de la roue précédente parce que la réponse arrive après celle de la nouvelle requête.

**Correction** avec `AbortController` :

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/api/wheels/${wheelId}/history`, { signal: ctrl.signal })
    .then((r) => r.json())
    .then(setHistory)
    .catch((err) => {
      if (err.name !== 'AbortError') console.error(err);
    });
  return () => ctrl.abort();
}, [wheelId]);
```

---

### 1.4. Pas de gestion d'erreur sur le `fetch`

- Pas de `.catch`, donc une erreur réseau passe en silence.
- Pas de check `r.ok` avant `r.json()` — si l'API renvoie 500, `setHistory` reçoit un payload d'erreur et `history.map` plante.
- Pas d'état de chargement ni d'état d'erreur affichés à l'utilisateur.

Il faudrait au minimum trois états : `loading`, `error`, `data`.

---

## 2. Problèmes d'accessibilité et d'UX

### 2.1. La modale n'est pas accessible

- Pas de `role="dialog"` ni `aria-modal="true"`.
- Pas de `aria-labelledby` pointant vers le `<h2>`.
- Pas de gestion du focus : à l'ouverture, le focus devrait être trappé dans la modale ; à la fermeture, il devrait revenir sur l'élément déclencheur.
- Pas de fermeture sur `Escape`.
- Le scroll du `body` n'est pas verrouillé.

Pour une vraie modale, je conseille `Radix UI Dialog` ou `Headless UI Dialog` plutôt que de réimplémenter à la main.

### 2.2. Click-outside cassé

```jsx
<div className="fixed inset-0 bg-black/60 p-6" onClick={onClose}>
  <div className="bg-white rounded-lg p-4">
```

Le `onClick={onClose}` est sur l'overlay, mais comme l'enfant `<div>` est inclus dans la zone, **cliquer à l'intérieur de la modale ferme aussi la modale** (l'event bubble jusqu'à l'overlay). Il faut ajouter `onClick={(e) => e.stopPropagation()}` sur le contenu, ou tester `e.target === e.currentTarget` sur l'overlay.

### 2.3. Pas de bouton de fermeture explicite

Pour l'utilisateur clavier ou tactile, il faut un bouton « X » avec un `aria-label="Fermer"`.

---

## 3. Problèmes React / qualité

### 3.1. `key` manquante sur la liste

```jsx
{history.map((h) => (
  <li>{h.date} — {h.event}</li>
))}
```

React va lever un warning. Il faut une `key` stable :

```jsx
{history.map((h) => (
  <li key={h.id ?? `${h.date}-${h.event}`}>{h.date} — {h.event}</li>
))}
```

### 3.2. Pas de typage / validation des props

Pas de PropTypes, pas de TypeScript. Pour un projet React 19 sérieux, je recommande TypeScript. Au minimum, documenter le shape de `wheel` et `history` (qu'est-ce que `h.date` ? une string ISO ? un timestamp ?).

### 3.3. `new Date(wheel.lastViewed).toLocaleString()` peut afficher `Invalid Date`

Si `lastViewed` est `undefined` (ce qui est probable au premier affichage), tu vas afficher « Vu pour la dernière fois : Invalid Date ». Il faut un garde :

```jsx
{wheel.lastViewed && (
  <p>Vu pour la dernière fois : {new Date(wheel.lastViewed).toLocaleString()}</p>
)}
```

### 3.4. Couplage : le composant connaît trop de choses

Le composant fait à la fois :
- la sélection Redux,
- un side-effect Redux (`setActiveWheel`),
- un fetch HTTP,
- l'affichage,
- la gestion modale.

Je découperais :
- un hook `useWheelHistory(wheelId)` (ou mieux, `RTK Query` qui te donne le caching, le retry, et le cleanup gratuitement),
- un composant `Modal` réutilisable,
- `WheelDetailPanel` qui ne fait que la composition.

Avec RTK Query (que tu as déjà via Redux Toolkit), ton fetch deviendrait :

```js
const { data: history = [], isLoading, error } = useGetWheelHistoryQuery(wheelId);
```

Et tu n'as plus à gérer race condition, cleanup, ni état local.

---

## 4. Sécurité

- `h.date` et `h.event` sont injectés directement dans le DOM. React échappe le contenu textuel, donc pas de XSS direct, mais **fais attention** si jamais tu passes à `dangerouslySetInnerHTML` ou si tu construis une URL à partir de `h.event`.
- `fetch('/api/wheels/${wheelId}/history')` : `wheelId` est interpolé dans une URL. Côté backend, assure-toi que tu valides bien le format (UUID ou int) pour éviter des injections de path.

---

## 5. Petites remarques

- Format des dates dans la liste (`{h.date}`) : si c'est une string ISO, ça va donner un truc moche. Il faudrait `new Date(h.date).toLocaleDateString()` ou `Intl.DateTimeFormat`.
- `text-xl font-bold` sur un `<h2>` : dans Tailwind v3+ tu peux centraliser ces styles dans un composant `<DialogTitle>`.
- L'import `useState` est utilisé uniquement pour `history` ; quand tu passeras à RTK Query il pourra disparaître.

---

## Résumé des actions prioritaires

| # | Priorité | Action |
|---|----------|--------|
| 1 | 🔴 Critique | Retirer la mutation `w.lastViewed = Date.now()` du selector — passer par un reducer |
| 2 | 🔴 Critique | Ajouter `[dispatch, wheelId]` dans les deps du `useEffect` |
| 3 | 🟠 Important | Annuler le `fetch` au démontage / changement de `wheelId` (`AbortController`) |
| 4 | 🟠 Important | Gérer les états `loading` / `error` du fetch |
| 5 | 🟠 Important | Ajouter `key` sur les `<li>` |
| 6 | 🟠 Important | Corriger le click-outside (stopPropagation) |
| 7 | 🟡 Souhaitable | Accessibilité : `role="dialog"`, focus trap, Escape |
| 8 | 🟡 Souhaitable | Migrer le fetch vers RTK Query |
| 9 | 🟡 Souhaitable | Découper en `Modal` + hook de données + vue |

Si tu veux, je peux te proposer une version refactorée du composant avec RTK Query et un `Dialog` accessible — dis-moi.
