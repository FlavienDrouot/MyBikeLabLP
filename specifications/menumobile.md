# Mobile menu pour la Navbar

## Context

Aujourd'hui, [Navbar.jsx:13-18](../frontend/src/components/Navbar.jsx) utilise `hidden md:flex` pour la nav principale. Sous 768 px, les liens **Tool / Roadmap / Partnerships** disparaissent et seul le bouton "Contact" reste visible. Toutes les sections du site deviennent inaccessibles depuis le header sur smartphone.

L'objectif est d'ajouter un bouton hamburger qui révèle un dropdown sous le header avec les trois liens, sans introduire de nouvelle dépendance (le projet n'a ni lib d'icônes ni composant Drawer/Modal existant).

## Approche

Dropdown vertical qui se déroule sous la navbar quand on tape sur l'icône hamburger. Visible uniquement sous `md:` (≥ 768 px reste inchangé). Trois éléments :

1. Bouton hamburger (icône SVG inline) à droite du logo, visible seulement en mobile (`md:hidden`).
2. State local `useState` `isOpen` pour ouvrir/fermer.
3. Panneau de liens empilés affiché conditionnellement, `md:hidden`.

Comportements :
- L'icône bascule entre hamburger (3 lignes) et croix selon `isOpen`.
- Cliquer sur un lien ferme le menu (les ancres `#tool` etc. continuent à scroller normalement).
- `aria-expanded`, `aria-controls`, `aria-label` sur le bouton pour l'accessibilité.
- Pas de backdrop ni de scroll-lock (dropdown court, pas un overlay plein écran).

## Fichier à modifier

- [frontend/src/components/Navbar.jsx](../frontend/src/components/Navbar.jsx)

## Détails d'implémentation

**Imports** : ajouter `import { useState } from 'react';` en haut du fichier.

**State** :
```jsx
const [isOpen, setIsOpen] = useState(false);
```

**Restructure du header** : envelopper le contenu actuel dans un fragment qui contient également le panneau dropdown (pour qu'il s'affiche bien sous la barre, à l'intérieur du `<header>`).

**Bouton hamburger** (placé entre la nav desktop et le bouton Contact, en `md:hidden`) :
```jsx
<button
  type="button"
  onClick={() => setIsOpen((v) => !v)}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
  className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-ink-700 hover:text-brand-600 transition-colors"
>
  {/* SVG hamburger ou croix selon isOpen */}
</button>
```

Pour les icônes : deux SVG inline (24×24, `stroke="currentColor"`, `strokeWidth={2}`), un avec trois lignes horizontales, un avec une croix. Choix conditionnel sur `isOpen`.

**Repositionnement du bouton Contact** : il reste visible en mobile à côté du hamburger (déjà compact). Le hamburger se place **entre** le logo et Contact pour que Contact reste l'action proéminente.

**Panneau dropdown** (juste après la `<div className="container-page …">`, toujours dans le `<header>`) :
```jsx
{isOpen && (
  <div id="mobile-menu" className="md:hidden border-t border-ink-100 bg-white">
    <nav className="container-page flex flex-col py-2">
      <a href="#tool" onClick={() => setIsOpen(false)} className="btn-ghost justify-start">Tool</a>
      <a href="#roadmap" onClick={() => setIsOpen(false)} className="btn-ghost justify-start">Roadmap</a>
      <a href="#partnerships" onClick={() => setIsOpen(false)} className="btn-ghost justify-start">Partnerships</a>
    </nav>
  </div>
)}
```

`justify-start` override le `justify-center` de `.btn-ghost` pour aligner les liens à gauche en mode dropdown.

## Vérification

1. `cd frontend && npm run dev`, ouvrir l'app dans Chrome.
2. DevTools → mode responsive → largeur **375 px** (iPhone) :
   - Vérifier que le hamburger apparaît, que les liens Tool/Roadmap/Partnerships sont cachés.
   - Cliquer sur le hamburger → le panneau s'affiche, l'icône passe en croix, `aria-expanded="true"`.
   - Cliquer sur "Roadmap" → la page scrolle vers `#roadmap` ET le menu se ferme.
   - Cliquer à nouveau sur le hamburger → le panneau réapparaît.
3. Élargir à **≥ 768 px** : le hamburger disparaît, la nav inline réapparaît, aucun panneau résiduel.
4. Test clavier : `Tab` jusqu'au bouton, `Enter` pour ouvrir, `Tab` pour parcourir les liens, `Enter` pour activer.

Aucun test unitaire n'existe pour les composants UI dans le projet — vérification manuelle suffisante.
