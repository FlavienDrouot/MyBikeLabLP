# Revue de code – `ContactForm.jsx`

Salut Flavien, merci pour le partage. L'idée d'un aperçu du message après envoi est une bonne attention UX, mais la mise en oeuvre actuelle pose plusieurs problèmes — dont un **critique de sécurité**. Voici ma revue détaillée.

---

## 1. Problèmes critiques

### 1.1 Faille XSS (Cross-Site Scripting) – **bloquant**

```jsx
setPreview(`<p>Merci <strong>${name}</strong> ! Voici votre message :</p><blockquote>${message}</blockquote>`);
...
<div
  className="mt-4 p-4 bg-green-100 rounded"
  dangerouslySetInnerHTML={{ __html: preview }}
/>
```

Tu injectes directement les valeurs `name` et `message` (saisies par l'utilisateur) dans une chaîne HTML, puis tu la rends via `dangerouslySetInnerHTML`. Cela permet à n'importe quel utilisateur d'exécuter du JavaScript arbitraire dans le contexte de ton site. Exemple de payload qui passerait sans problème :

```
<img src=x onerror="alert(document.cookie)">
```

ou encore plus discret avec `<svg onload=...>`, `<iframe>`, vol de session, redirection, défacement, etc.

C'est l'archétype du XSS stocké/réfléchi côté client. **Il faut absolument retirer `dangerouslySetInnerHTML`.**

#### Correction recommandée

React échappe automatiquement le contenu textuel inséré via JSX. Il suffit de laisser React faire son boulot :

```jsx
{submitted && (
  <div className="mt-4 p-4 bg-green-100 rounded" role="status" aria-live="polite">
    <p>Merci <strong>{name}</strong> ! Voici votre message :</p>
    <blockquote className="mt-2 italic border-l-4 border-green-500 pl-3 whitespace-pre-wrap">
      {message}
    </blockquote>
  </div>
)}
```

Aucune chaîne HTML, aucune injection possible. Bonus : `whitespace-pre-wrap` préserve les sauts de ligne du message original.

> Règle générale : **n'utilise `dangerouslySetInnerHTML` que sur du HTML que tu as toi-même généré ou passé au préalable par un sanitizer comme DOMPurify**. Et même là, demande-toi toujours si tu peux l'éviter.

---

## 2. Problèmes importants

### 2.1 Aucune gestion d'erreur ni d'état de chargement

```jsx
fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify({ name, email, message }),
});
setSubmitted(true);
```

Plusieurs soucis :

- La promesse `fetch` n'est ni `await`-ée ni `.then/.catch`. Si l'API plante (500, réseau coupé), l'utilisateur voit quand même "Merci".
- Pas de header `Content-Type: application/json`, donc côté serveur le body sera probablement parsé comme texte brut.
- Pas d'état de chargement → l'utilisateur peut spammer le bouton et envoyer N requêtes.

#### Correction proposée

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
    setSubmitted(true);
  } catch (err) {
    setError("L'envoi a échoué. Merci de réessayer.");
  } finally {
    setIsSubmitting(false);
  }
};
```

Et sur le bouton :

```jsx
<button
  type="submit"
  disabled={isSubmitting}
  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
>
  {isSubmitting ? 'Envoi…' : 'Envoyer'}
</button>
```

### 2.2 Aucune validation côté client

Les trois champs n'ont aucun attribut `required`, `minLength`, `maxLength` ni `pattern`. L'utilisateur peut soumettre un formulaire totalement vide. À ajouter :

```jsx
<input type="text" required minLength={2} maxLength={80} ... />
<input type="email" required ... />
<textarea required minLength={10} maxLength={2000} ... />
```

La validation côté serveur reste évidemment indispensable, mais le `required` HTML offre un premier filet utile.

### 2.3 Accessibilité (a11y)

Plusieurs manques d'accessibilité, alors que tu utilises Tailwind donc c'est facile à corriger :

- **Pas de `<label>`** associés aux champs. `placeholder` n'est pas un substitut : il disparaît quand l'utilisateur tape, et les lecteurs d'écran ne le lisent pas systématiquement.
- **Pas d'`id`** sur les inputs, donc impossible de les associer correctement à un label.
- L'aperçu vert n'est pas annoncé aux technologies d'assistance (`role="status"` + `aria-live="polite"` recommandés).
- Le bouton ne change pas d'état visuel ni textuel (cf. point 2.1).
- Pas d'attribut `aria-invalid` / `aria-describedby` pour les erreurs.

#### Exemple de champ corrigé

```jsx
<div>
  <label htmlFor="name" className="block text-sm font-medium mb-1">
    Votre nom
  </label>
  <input
    id="name"
    name="name"
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    autoComplete="name"
    className="w-full border p-2 rounded"
  />
</div>
```

Ajouter aussi `autoComplete="email"` sur le champ email — gain UX immédiat.

---

## 3. Problèmes mineurs / nice-to-have

### 3.1 Le formulaire ne se réinitialise pas après envoi
Une fois `submitted = true`, les champs gardent leur valeur. À toi de voir si c'est voulu (utile pour l'aperçu) mais souvent on remet à zéro :

```jsx
setName(''); setEmail(''); setMessage('');
```

…ou alors on cache complètement le formulaire pour ne montrer que le message de succès.

### 3.2 Le formulaire reste soumissible après succès
Rien n'empêche l'utilisateur de cliquer à nouveau sur "Envoyer". Soit on désactive le bouton après succès, soit on remplace le formulaire par l'aperçu seul.

### 3.3 Trois `useState` séparés pour les champs
Pas un vrai problème pour 3 champs, mais un seul state objet (ou `useReducer` / `react-hook-form`) sera plus propre dès que ça grandit. Pour ce volume actuel, c'est OK.

### 3.4 Le state `preview` devient inutile
Une fois la correction XSS appliquée (point 1.1), tu n'as plus besoin de stocker `preview` dans le state — tu peux dériver l'affichage directement depuis `name` et `message`. Moins de state = moins de bugs.

### 3.5 Pas de `noValidate` ni de gestion fine des erreurs
À envisager si tu veux contrôler entièrement l'UX de validation plutôt que de t'appuyer sur les bulles natives du navigateur.

---

## 4. Version corrigée (proposition)

```jsx
import { useState } from 'react';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch {
      setError("L'envoi a échoué. Merci de réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="mt-4 p-4 bg-green-100 rounded"
        role="status"
        aria-live="polite"
      >
        <p>Merci <strong>{name}</strong> ! Voici votre message :</p>
        <blockquote className="mt-2 italic border-l-4 border-green-500 pl-3 whitespace-pre-wrap">
          {message}
        </blockquote>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Votre nom</label>
        <input
          id="name" name="name" type="text" required
          minLength={2} maxLength={80} autoComplete="name"
          value={name} onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email" name="email" type="email" required
          autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Votre message</label>
        <textarea
          id="message" name="message" required
          minLength={10} maxLength={2000} rows={5}
          value={message} onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {error && (
        <p role="alert" className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}

export default ContactForm;
```

---

## 5. Récapitulatif

| Priorité | Problème | Action |
|---|---|---|
| Critique | XSS via `dangerouslySetInnerHTML` | Remplacer par du JSX standard |
| Important | `fetch` sans `await`/erreur/`Content-Type` | Passer en `async`, gérer erreurs et loading |
| Important | Aucune validation des champs | Ajouter `required`, `minLength`, etc. |
| Important | A11y : pas de `<label>`, pas de live region | Ajouter labels + `role="status"` |
| Mineur | Pas de reset après envoi | Soit reset, soit masquer le form |
| Mineur | State `preview` inutile | Supprimer, dériver depuis `name`/`message` |

Le point n°1 est vraiment à corriger avant tout déploiement — c'est une porte d'entrée classique vers du vol de session, du phishing en place, etc. Le reste rendra le formulaire beaucoup plus solide et agréable à utiliser.

Bon courage, dis-moi si tu veux qu'on creuse un point en particulier.
