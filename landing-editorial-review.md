# Revue éditoriale de la landing page — MyBikeLab

Version web pour la relecture : [issue GitHub #102](https://github.com/FlavienDrouot/MyBikeLabLP/issues/102).

Document de travail préparé le 14 septembre 2026. Les propositions françaises ont été discutées par petits blocs avec Flavien. La direction bilingue a été approuvée par Flavien le 14 septembre 2026 ; l’implémentation est en cours dans la phase solo-build.

Ce tableau conserve les formulations retenues, y compris leurs suppressions, pour permettre une relecture externe avant toute implémentation. L’adaptation anglaise figure ci-dessous ; les deux formulations soumises à discussion ont été validées par Flavien. La direction d’ensemble est approuvée ; l’acceptation du résultat implémenté reste à obtenir. La validation éditoriale et l’acceptation du résultat implémenté sont distinctes.

## Intention et périmètre

Une présentation simple, humaine et peu commerciale, qui aide chacun à choisir et personnaliser son vélo par lui-même. L’accroche porte sur le projet dans son ensemble ; le sous-titre explique son point de départ, les roues de route. Rassembler des informations dispersées est une motivation centrale du projet.

La revue couvre l’accueil, la navigation, les avantages, les partenariats, le formulaire et ses messages, le pied de page et la roadmap. Après essai, Flavien a étendu la revue aux textes périphériques du comparateur ; le contenu du tableau, des filtres et des fiches reste hors périmètre.

Les nombres restent calculés depuis le catalogue. Les intentions futures restent distinctes du service actuellement disponible. Aucune date n’est annoncée. Les éventuels liens affiliés doivent être signalés. Le formulaire prépare un email via la messagerie du visiteur ; il ne confirme pas un envoi.

## Lecture du tableau

- **Retenu** : formulation ou conservation validée pendant la conversation.
- **Suppression retenue** : élément à retirer ; ce n’est pas un texte à afficher.
- **Conséquence** : retrait devenu nécessaire du fait d’une formulation validée.
- **Inventorié, inchangé** : texte utilitaire relevé dans le code, sans réécriture proposée ni validation individuelle.
- La colonne **Après** intègre les arbitrages de Flavien après relecture. Les recommandations restent visibles pour conserver la trace de cet avis, y compris lorsqu’elles n’ont pas été retenues.
- **Recommandation unslop** : contrôle supplémentaire ciblé sur les formulations présentant encore un signal de rédaction artificielle, générique ou trop rhétorique. Une cellule vide signifie qu’aucune modification supplémentaire n’est recommandée à ce titre.
- Les identifiants désignent les textes actuels dans `frontend/public/locales/fr.json`. Ils servent à retrouver les éléments et ne prescrivent pas les futures clés.
- « — » signifie qu’aucun texte ne sera affiché à cet emplacement.

## Complément validé : en-tête du comparateur

À la demande de Flavien après essai, la revue inclut aussi les textes périphériques du comparateur. Le contenu du tableau, des filtres et des fiches reste hors périmètre.

| Emplacement | Avant FR | Après FR | Avant EN | Après EN |
| --- | --- | --- | --- | --- |
| comparator.sectionIndex | COMPARATEUR | — | COMPARATOR | — |
| comparator.title | Roues route : filtrer et comparer | Comparez les roues de vélo de route | Road wheels: filter and compare | Compare road wheelsets |
| comparator.subtitle | Filtrez et triez par marque, poids, profil de jante, prix et bien plus. | Filtrez et triez les paires de roues selon vos critères : prix, poids, hauteur de jante… | Filter and sort by brand, weight, rim depth, price, and many more. | Filter and sort wheelsets by criteria such as price, weight and rim depth. |

Formulation française approuvée par Flavien ; adaptation anglaise dans le cadre de la délégation validée. Les mentions sous le tableau restent à discuter.

## Accueil

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| hero.titleBefore + titleEmphasis + titleAfter | Des roues mesurées, pas marketées. | Votre vélo. Vos choix. Les infos sont ici. | **Des informations pour choisir votre vélo par vous-même.** — Évite le rythme en trois fragments et l’accroche générique. | Retenu après relecture : accroche conservée |
| hero.eyebrow | Comparez les roues route | — |  | Suppression retenue |
| hero.subtitle | Comparez par poids, profil de jante, compatibilité hookless, marque de moyeu, prix et bien plus. Tout dans un seul tableau. | Pour commencer, retrouvez au même endroit les informations pour choisir vos roues de vélo de route : caractéristiques, compatibilités et prix. |  | Retenu |
| hero.ctaPrimary | Ouvrir le comparateur → | Ouvrir le comparateur → |  | Retenu |
| hero.ctaSecondary | Voir la roadmap → | La suite du projet → |  | Retenu |
| hero.ledger.ariaLabel | Chiffres du catalogue | Chiffres du catalogue |  | Inventorié, inchangé |
| hero.ledger.wheelsCaption | paires de roues route indexées dans le catalogue | — |  | Suppression retenue |
| hero.ledger.filterAxesCaption | caractéristiques combinables et filtrables | — |  | Suppression retenue |
| hero.ledger.foot | Interface bilingue, anglais et français · affichage des prix dans plusieurs devises | — |  | Suppression retenue |
| hero.stats.wheels | Roues | Paires de roues |  | Retenu |
| hero.stats.filterAxes | Axes de filtres | Critères de filtre |  | Retenu |
| hero.proof.* — phrase sous les boutons | [nombre de roues] roues route parmi [nombre de marques] marques, dont Roval, Zipp, ENVE, Mavic et Shimano. | — |  | Suppression retenue |
| Bloc des chiffres — marques | Nombre de marques dans la phrase sous les boutons | [nombre] Marques |  | Retenu : déplacement dans le bloc des chiffres |

## Navigation et contrôles

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| nav.tool | Outil | Comparateur |  | Retenu |
| nav.roadmap | Roadmap | La suite du projet |  | Retenu |
| nav.partnerships | Partenariats | — |  | Suppression retenue |
| nav.contact | Contact | Contact |  | Retenu |
| nav.openMenu | Ouvrir le menu | Ouvrir le menu |  | Inventorié, inchangé |
| nav.closeMenu | Fermer le menu | Fermer le menu |  | Inventorié, inchangé |
| nav.currency | Devise | Devise |  | Inventorié, inchangé |
| nav.currencyOption.EUR | Afficher les prix en euros | Afficher les prix en euros |  | Inventorié, inchangé |
| nav.currencyOption.USD | Afficher les prix en dollars | Afficher les prix en dollars |  | Inventorié, inchangé |
| nav.theme | Thème | Thème |  | Inventorié, inchangé |
| nav.themeOption.light | Clair | Clair |  | Inventorié, inchangé |
| nav.themeOption.cream | Crème | Crème |  | Inventorié, inchangé |
| nav.themeOption.dark | Sombre | Sombre |  | Inventorié, inchangé |
| Boutons de langue — texte directement affiché dans Navbar.jsx | EN · FR | EN · FR |  | Inventorié, inchangé |
| Boutons de devise — symboles dans Navbar.jsx | € · $ | € · $ |  | Inventorié, inchangé |

## De quoi choisir par vous-même

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| benefits.sectionIndex | AVANTAGES | — |  | Suppression retenue |
| benefits.title | Conçu pour les cyclistes sérieux | De quoi choisir par vous-même |  | Retenu |
| benefits.items.0.title | De meilleures décisions | Les informations au même endroit |  | Retenu |
| benefits.items.0.description | Fini de comparer des PDFs et des fils de forum. Filtrez sur les specs qui comptent vraiment pour votre pratique. | Comparer du matériel demande souvent de parcourir des dizaines de sites, de fiches techniques et de forums. MyBikeLab rassemble ces informations en un seul endroit. | **Comparer du matériel demande souvent de parcourir des dizaines de sites, de fiches techniques et de forums. MyBikeLab rassemble ces informations au même endroit.** — La dernière proposition actuelle énonce un bénéfice abstrait au lieu de rester sur le mécanisme concret. | Retenu après relecture et ajustement de Flavien |
| benefits.items.1.title | Basé sur les données | Des caractéristiques comparables |  | Retenu |
| benefits.items.1.description | Chaque spec est sourcée et structurée. Pas de communication marketing, juste des chiffres vérifiables. | Les données des fabricants sont organisées dans un même format pour comparer les modèles et repérer leurs différences. |  | Retenu |
| benefits.items.2.title | Orienté communauté | Vos retours font évoluer le projet | **Vos retours font évoluer le projet** — Plus direct et moins proche d’une formule générique de communication communautaire. | Retenu après relecture |
| benefits.items.2.description | Construit avec des cyclistes, des fabricants et des revendeurs. Données ouvertes, affiliations transparentes. | Une erreur dans les données, une information manquante ou une idée pour améliorer le site ? Écrivez-moi : vos retours m’aideront à faire évoluer MyBikeLab. |  | Retenu |
| benefits.schematic.externalWidth | largeur externe de jante | largeur externe de jante |  | Retenu |
| benefits.schematic.internalWidth | largeur interne de jante | largeur interne de jante |  | Retenu |
| benefits.schematic.rimDepth | profondeur de jante | hauteur de jante |  | Retenu |
| benefits.schematic.wheelDiameter | diamètre de roue | diamètre de roue |  | Retenu |
| benefits.schematic.externalWidthValue | 27,5 mm | 27,5 mm |  | Retenu |
| benefits.schematic.internalWidthValue | 23 mm | 23 mm |  | Retenu |
| benefits.schematic.rimDepthValue | 35 mm | 35 mm |  | Retenu |
| benefits.schematic.wheelDiameterValue | Ø 700 c | Ø 700 c |  | Retenu |
| benefits.schematic.caption | Profil représentatif. Dimensions sourcées à partir de données produit structurées. | Les dimensions indiquées sont un exemple. |  | Retenu |

## Professionnels

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| partnership.sectionIndex | PARTENARIAT | — |  | Suppression retenue |
| partnership.title | Travaillez avec nous | Vous fabriquez ou vendez du matériel vélo ? |  | Retenu |
| partnership.intro | MyBikeLab connecte les cyclistes à des données composants structurées. Si vous fournissez ou vendez des composants vélo route, vos données ont leur place ici. | Vous pouvez m’aider à compléter le catalogue et à tenir les informations à jour en partageant les caractéristiques et les prix de vos produits. |  | Retenu |
| partnership.audiences — deux blocs | Fabricants — Mettez en valeur vos specs dans un format structuré, prêt pour la comparaison.<br>Revendeurs — Touchez des cyclistes qui comparent activement avant d'acheter. | Les cyclistes pourront ainsi découvrir vos produits et les comparer aux autres références du catalogue. | **Les cyclistes pourront ainsi découvrir vos produits et les comparer aux autres références du catalogue.** — Remplace « selon leurs besoins », formule générique, par le fonctionnement concret proposé. | Retenu après relecture : une phrase après l’introduction |

## Contact

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| contact.eyebrow → contact.title | Contact | Une question ou un retour sur MyBikeLab ? |  | Titre distinct validé après essai |
| contact.intro | — | Une suggestion, une erreur à signaler ou une question : écrivez-moi ici. |  | Ajout validé après essai |
| contact.namePlaceholder — libellé au-dessus du champ | Nom | Nom |  | Retenu |
| contact.emailPlaceholder — libellé au-dessus du champ | Email | Email |  | Retenu |
| contact.companyLabel | Entreprise | Entreprise (facultatif) |  | Retenu |
| contact.companyPlaceholder | Entreprise (facultatif) | — |  | Suppression retenue |
| contact.messagePlaceholder — libellé au-dessus du champ | Message | Message |  | Retenu |
| contact.submit | Envoyer le message | Préparer l’email |  | Retenu |
| contact.errors.nameRequired | Le nom est requis | Indiquez votre nom. |  | Retenu |
| contact.errors.emailRequired | L'email est requis | Indiquez votre adresse email. |  | Retenu |
| contact.errors.messageRequired | Le message est requis | Écrivez votre message. |  | Retenu |
| contact.success.title | Merci, {{name}}. | Encore une étape |  | Retenu |
| contact.success.body | Nous vous répondrons à {{email}} très prochainement. | Envoyez l’email depuis votre messagerie pour me contacter. |  | Retenu |
| contact.successFallbackName | vous | — |  | Conséquence |
| contact.namePlaceholder — texte à l’intérieur du champ | Nom | — |  | Suppression retenue |
| contact.emailPlaceholder — texte à l’intérieur du champ | Email | — |  | Suppression retenue |
| contact.messagePlaceholder — texte à l’intérieur du champ | Message | — |  | Suppression retenue |

## Pied de page

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| footer.copyright | © {{year}} MyBikeLab. Tous droits réservés. | © {{year}} MyBikeLab |  | Retenu |
| footer.nav.tool | Outil | Comparateur |  | Retenu |
| footer.nav.roadmap | Roadmap | La suite du projet |  | Retenu |
| footer.nav.partnerships | Partenariats | — |  | Suppression retenue |
| footer.nav.contact | Contact | Contact |  | Retenu |

## La suite du projet

| Emplacement actuel | Avant | Après | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| roadmap.sectionIndex | ROADMAP | — |  | Suppression retenue |
| roadmap.title | Une trajectoire plus claire | La suite du projet |  | Retenu |
| roadmap.subtitle | Une roadmap guidée par la valeur apportée aux cyclistes grâce à de meilleures données sur les roues. | Voici ce qui est déjà disponible et ce que j’aimerais développer ensuite pour vous aider à choisir votre matériel vélo. |  | Retenu |
| roadmap.stateLabels.complete | Disponible aujourd'hui | Disponible aujourd'hui |  | Inventorié, inchangé |
| roadmap.stateLabels.active | Prochaine étape | Prochaine étape |  | Inventorié, inchangé |
| roadmap.stateLabels.future | Direction future | Direction future |  | Inventorié, inchangé |
| roadmap.items.0.title | Comparer les roues route | Comparer les roues de vélo de route |  | Retenu |
| roadmap.items.0.description | MyBikeLab commence avec des données fabricants structurées pour faciliter la comparaison des roues route. | Retrouvez les caractéristiques et les prix des fabricants dans un même tableau. Les données sont issues de collectes ponctuelles et ne sont pas encore mises à jour régulièrement. |  | Retenu |
| roadmap.items.0.points.0 | Critères techniques côte à côte | — |  | Suppression retenue |
| roadmap.items.0.points.1 | Prix et détails de compatibilité utiles | — |  | Suppression retenue |
| roadmap.items.0.points.2 | Données correspondant à un état collecté à un instant donné | — |  | Suppression retenue |
| roadmap.items.1.title | Enrichir les données produits | Un catalogue plus complet et à jour |  | Retenu |
| roadmap.items.1.description | Rendre le catalogue plus fiable, plus utile et plus facile à faire grandir. | — |  | Suppression retenue |
| roadmap.items.1.steps.0.title | Gagner en fraîcheur | Maintenir les données à jour régulièrement |  | Retenu |
| roadmap.items.1.steps.0.description | Passer d'une collecte ponctuelle à des mises à jour régulières, pour renforcer la confiance dans les détails et les prix affichés. | Actualiser les caractéristiques et les prix pour mieux refléter les informations disponibles chez les fabricants et les revendeurs. |  | Retenu |
| roadmap.items.1.steps.1.title | Créer de vraies fiches produit | Des fiches produit plus complètes |  | Retenu |
| roadmap.items.1.steps.1.description | Consacrer à chaque roue une page structurée, nettement plus complète que le panneau dépliable du comparateur. | Consulter toutes les informations sur une roue dans une page dédiée, au-delà des caractéristiques présentées dans le comparateur. |  | Retenu |
| roadmap.items.1.steps.2.title | Ajouter de nouvelles catégories de roues | Comparer d’autres types de roues |  | Retenu |
| roadmap.items.1.steps.2.description | Étendre le catalogue au-delà des roues route, avec le gravel comme premier candidat, sur une base maintenable. | Élargir le catalogue au-delà de la route, en commençant par les roues de gravel. |  | Retenu |
| roadmap.items.1.steps.3.title | Enrichir les liens marketplace | Comparer les prix chez plusieurs revendeurs |  | Retenu |
| roadmap.items.1.steps.3.description | Relier la comparaison à davantage de destinations pertinentes pour trouver les produits, sans devenir une plateforme e-commerce. | Ajouter les offres de davantage de revendeurs pour vous aider à trouver un meilleur prix. Les éventuels liens affiliés seront clairement signalés. |  | Retenu |
| roadmap.items.2.title | Exploiter les données | Mieux comprendre les différences entre les produits |  | Retenu |
| roadmap.items.2.description | Transformer un catalogue plus riche et plus fiable en aide à la décision analytique. | — |  | Suppression retenue |
| roadmap.items.2.steps.0.title | Indicateurs dérivés | De nouveaux repères pour comparer | **Comparer avec des indicateurs calculés** — Le titre actuel reste abstrait alors que la description précise déjà le mécanisme. | Retenu après relecture : titre conservé |
| roadmap.items.2.steps.0.description | Ajouter des métriques calculées, comme les rapports poids/prix et poids/profondeur. | Mettre en relation les caractéristiques des roues, par exemple avec les rapports poids/prix et poids/hauteur de jante. |  | Retenu |
| roadmap.items.2.steps.1.title | Visualisations multicritères | Comparer en graphiques |  | Retenu |
| roadmap.items.2.steps.1.description | Montrer les compromis entre plusieurs critères et faire ressortir plusieurs produits optimaux, notamment avec des frontières de Pareto. | Visualiser plusieurs critères à la fois pour repérer les compromis entre les roues et celles qui correspondent à vos priorités. |  | Retenu |
| roadmap.items.2.steps.2.title | Analyses fondées sur les données | Comprendre les différences entre les roues | **Des analyses à partir des données du catalogue** — Évite « éclairer vos choix », formule de bénéfice passe-partout, et indique directement la matière utilisée. | Retenu après relecture : formulation alternative |
| roadmap.items.2.steps.2.description | Publier des observations, conclusions et recommandations fondées sur le catalogue. | Publier des articles à partir des données du catalogue pour expliquer les différences entre les roues et proposer des recommandations argumentées. |  | Retenu |
| roadmap.items.3.title | Étendre aux autres composants | Comparer d’autres composants vélo |  | Retenu |
| roadmap.items.3.description | Élargir progressivement le catalogue à d'autres familles de composants vélo, sans fixer leur ordre dès aujourd'hui. | Élargir progressivement le catalogue pour vous aider à choisir les autres composants de votre vélo. |  | Retenu |
| roadmap.items.4.title | Configurateur vélo complet | Composer votre vélo |  | Retenu |
| roadmap.items.4.description | Réunir catalogues de composants et analyse pour évaluer un vélo complet ; ses capacités précises restent à définir. | Réunir les données sur les composants et les outils d’analyse pour vous aider à composer et évaluer un vélo complet. | **Réunir les données sur les composants et les outils d’analyse pour vous aider à composer et évaluer un vélo complet.** — « selon vos envies et vos besoins » ajoute une conclusion générique sans préciser la fonction. | Retenu après relecture |

## Textes et états complémentaires

| Emplacement | Avant | Après / traitement | Recommandation unslop | Décision |
| --- | --- | --- | --- | --- |
| Marque — en-tête et pied de page | MyBikeLab | MyBikeLab |  | Inventorié, inchangé |
| Noms accessibles des navigations, dans Navbar.jsx et Footer.jsx | Primary ; Primary mobile ; Footer | À examiner lors de l’adaptation linguistique : actuellement écrits en anglais dans le code |  | Non discuté |
| Nom accessible du choix de langue, dans Navbar.jsx | Language | À examiner lors de l’adaptation linguistique : actuellement écrit en anglais dans le code |  | Non discuté |
| Objet et libellés de l’email préparé par ContactForm.jsx | Message from [nom] ([entreprise]) ; Name: ; Email: ; Company: | Hors texte affiché dans la page, mais à examiner pour la cohérence linguistique du parcours contact |  | Non discuté |

Les libellés des états de la roadmap (« Disponible aujourd’hui », « Prochaine étape », « Direction future ») sont destinés aux lecteurs d’écran et figurent dans le tableau. L’ordre des étapes et leurs états ne changent pas. Les clés `nav.lang.*` ne sont pas utilisées pour afficher les boutons actuels ; leurs textes visibles sont inventoriés ci-dessus.

Les messages de validation natifs du navigateur, notamment pour un email mal formé, ne sont pas des textes rédigés par le site.

## Conséquences de présentation déjà retenues

- Retirer les surtitres redondants de l’accueil, des avantages, des partenariats et de la roadmap ; donner au formulaire un titre distinct invitant aux questions et aux retours utilisateurs.
- Le bloc de chiffres comprend les paires de roues, les critères de filtre et les marques, sans descriptions supplémentaires. Le compteur actuel de roues compte les entrées du catalogue, variantes comprises ; il ne représente pas nécessairement des modèles uniques.
- Les navigations du haut, du menu mobile et du pied de page utilisent « Comparateur », « La suite du projet » et « Contact ». Le lien « Partenariats » disparaît ; le contenu destiné aux professionnels reste.
- Remplacer les deux blocs fabricants/revendeurs par la phrase retenue après l’introduction.
- Retirer les placeholders redondants, tout en conservant les libellés permanents et « facultatif » pour l’entreprise.
- Le message après le formulaire ne contient plus le nom ni l’adresse email du visiteur et ne promet plus une réponse rapide.
- Retirer les trois puces de l’étape actuelle et les descriptions des deux groupes de la roadmap.
- Le gravel est annoncé comme prochaine catégorie. L’étape des offres vise davantage de revendeurs et la comparaison de leurs prix ; le référencement initial des fabricants est déjà acquis.
- Les rapports cités sont des exemples, pas une liste exhaustive. Les graphiques gardent l’intention de montrer les compromis et les produits adaptés aux priorités ; le terme « frontières de Pareto » disparaît du texte public.
- La vision du configurateur reste générale. Aucune vérification automatique de compatibilité, simulation précise ou autre capacité non définie n’est promise.

## Relecture avant implémentation

Une relecture externe a été reçue dans la colonne « Recommandation unslop ». Flavien a arbitré ses sept propositions avec l’agent ; la colonne « Après » et les décisions françaises intègrent ces arbitrages. La relecture d’ensemble continue de porter sur le naturel des formulations, les répétitions, la fidélité au fonctionnement actuel, la distinction entre présent et intentions futures, et la transparence commerciale.

L’anglais reprend les mêmes choix de contenu et de suppression, avec une rédaction naturelle. Flavien a confié l’adaptation des formulations courantes à l’agent et souhaite discuter uniquement les traductions ambiguës ou peu naturelles. Flavien a approuvé la direction complète et invoqué solo-build. Le résultat sera soumis à son acceptation après les vérifications.

Lors de l’implémentation ultérieure : vérifier les textes réellement rendus en français et en anglais, les liens de navigation sur ordinateur et mobile, les nombres dynamiques, les labels et erreurs du formulaire ainsi que le message après ouverture de la messagerie. Vérifier également la lisibilité des nouveaux textes et l’absence de blocs vides après suppression. Les résultats des vérifications de l’implémentation figurent en fin de document.
## Adaptation anglaise — avant / après

L’adaptation conserve le ton personnel, les engagements et les suppressions validés en français. Les formulations ordinaires sont traitées par l’agent à la demande de Flavien ; seules les ambiguïtés sont soumises à discussion. Flavien a validé les deux points discutés : « Your bike. Your choices. The info you need. » pour l’accroche et « Plan your bike build » pour « Composer votre vélo ».

Conventions : anglais britannique (`catalogue`, `organised`), `wheelsets` pour les paires de roues, `rim depth` pour la hauteur de jante et `retailers` pour les revendeurs. `Compare` et `comparison tool` évitent le calque peu naturel `comparator`. `What’s next` rend « La suite du projet » sans allonger la navigation. Le bouton `Open email app` décrit l’action plutôt que de traduire littéralement « Préparer l’email ».

Les textes marqués « Adapté » sont proposés dans le cadre de cette délégation éditoriale, sans avoir fait l’objet d’une validation individuelle ni d’une implémentation.

### Accueil

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| hero.titleBefore + titleEmphasis + titleAfter | Wheels, measured. Not marketed. | Your bike. Your choices. The info you need. | Retenu avec Flavien |
| hero.eyebrow | Compare road wheels | — | Suppression alignée sur le français |
| hero.subtitle | Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table. | Start with road wheelsets: find specifications, compatibility details and prices in one place to help you choose. | Adapté |
| hero.ctaPrimary | Open comparator → | Open comparison tool → | Adapté |
| hero.ctaSecondary | See the roadmap → | What’s next → | Adapté |
| hero.ledger.ariaLabel | Catalog figures | Catalogue statistics | Adapté après relecture anglaise |
| hero.ledger.wheelsCaption | road wheelsets indexed in the catalog | — | Suppression alignée sur le français |
| hero.ledger.filterAxesCaption | specifications you can combine and filter on | — | Suppression alignée sur le français |
| hero.ledger.foot | Bilingual interface, English and French · multi-currency price display | — | Suppression alignée sur le français |
| hero.stats.wheels | Wheels | Wheelsets | Adapté |
| hero.stats.filterAxes | Filter axes | Filter criteria | Adapté |
| hero.proof.* — phrase sous les boutons | [wheel count] road wheels across [brand count] brands, including Roval, Zipp, ENVE, Mavic and Shimano. | — | Suppression alignée sur le français |
| Bloc des chiffres — marques | Brand count in the sentence below the buttons | [count] Brands | Adapté |

### Navigation et contrôles

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| nav.tool | Tool | Compare | Adapté |
| nav.roadmap | Roadmap | What’s next | Adapté |
| nav.partnerships | Partnerships | — | Suppression alignée sur le français |
| nav.contact | Contact | Contact | Conservé |
| nav.openMenu | Open menu | Open menu | Conservé |
| nav.closeMenu | Close menu | Close menu | Conservé |
| nav.currency | Currency | Currency | Conservé |
| nav.currencyOption.EUR | Show prices in euros | Show prices in euros | Conservé |
| nav.currencyOption.USD | Show prices in dollars | Show prices in dollars | Conservé |
| nav.theme | Theme | Theme | Conservé |
| nav.themeOption.light | Light | Light | Conservé |
| nav.themeOption.cream | Cream | Cream | Conservé |
| nav.themeOption.dark | Dark | Dark | Conservé |
| Boutons de langue — texte directement affiché dans Navbar.jsx | EN · FR | EN · FR | Conservé |
| Boutons de devise — symboles dans Navbar.jsx | € · $ | € · $ | Conservé |

### De quoi choisir par vous-même

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| benefits.sectionIndex | BENEFITS | — | Suppression alignée sur le français |
| benefits.title | Built for serious cyclists | Choose for yourself | Adapté |
| benefits.items.0.title | Better decisions | Information in one place | Adapté |
| benefits.items.0.description | Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride. | Comparing bike components often means searching through dozens of websites, specification sheets and forums. MyBikeLab brings that information together in one place. | Adapté |
| benefits.items.1.title | Data-driven | Specs you can compare | Adapté |
| benefits.items.1.description | Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check. | Manufacturer specifications are organised in a consistent format so you can compare models and see how they differ. | Adapté |
| benefits.items.2.title | Community-focused | Your feedback helps improve MyBikeLab | Adapté |
| benefits.items.2.description | Built with riders, manufacturers and resellers. Open data, transparent affiliations. | Spotted an error, a missing detail or something that could work better? Get in touch: your feedback will help me improve MyBikeLab. | Adapté |
| benefits.schematic.externalWidth | external rim width | external rim width | Conservé |
| benefits.schematic.internalWidth | internal rim width | internal rim width | Conservé |
| benefits.schematic.rimDepth | rim depth | rim depth | Conservé |
| benefits.schematic.wheelDiameter | wheel diameter | wheel diameter | Conservé |
| benefits.schematic.externalWidthValue | 27.5 mm | 27.5 mm | Conservé |
| benefits.schematic.internalWidthValue | 23 mm | 23 mm | Conservé |
| benefits.schematic.rimDepthValue | 35 mm | 35 mm | Conservé |
| benefits.schematic.wheelDiameterValue | Ø 700 c | Ø 700 c | Conservé |
| benefits.schematic.caption | Representative profile. Dimensions sourced from structured product data. | The dimensions shown are an example. | Adapté |

### Professionnels

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| partnership.sectionIndex | PARTNERSHIP | — | Suppression alignée sur le français |
| partnership.title | Work with us | Do you make or sell bike components? | Adapté |
| partnership.intro | MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here. | You can help me expand the catalogue and keep it up to date by sharing your product specifications and prices. | Adapté |
| partnership.audiences — deux blocs | Manufacturers — Showcase your specs in a structured, comparison-ready format.<br>Resellers — Reach cyclists who are actively comparing before they buy. | Cyclists can then discover your products and compare them with others in the catalogue. | Adapté |

### Contact

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| contact.eyebrow → contact.title | Contact | Questions or feedback about MyBikeLab? | Adapté après essai |
| contact.intro | — | Have a suggestion, spotted an error or want to ask a question? Get in touch here. | Ajout aligné sur le français |
| contact.namePlaceholder — libellé au-dessus du champ | Name | Name | Conservé |
| contact.emailPlaceholder — libellé au-dessus du champ | Email | Email | Conservé |
| contact.companyLabel | Company | Company (optional) | Adapté |
| contact.companyPlaceholder | Company (optional) | — | Suppression alignée sur le français |
| contact.messagePlaceholder — libellé au-dessus du champ | Message | Message | Conservé |
| contact.submit | Send message | Open email app | Adapté |
| contact.errors.nameRequired | Name is required | Please enter your name. | Adapté |
| contact.errors.emailRequired | Email is required | Please enter your email address. | Adapté |
| contact.errors.messageRequired | Message is required | Please write your message. | Adapté |
| contact.success.title | Thanks, {{name}}. | One more step | Adapté |
| contact.success.body | We'll get back to you at {{email}} shortly. | Send the email from your email app to get in touch with me. | Adapté |
| contact.successFallbackName | there | — | Suppression alignée sur le français |
| contact.namePlaceholder — texte à l’intérieur du champ | Name | — | Suppression alignée sur le français |
| contact.emailPlaceholder — texte à l’intérieur du champ | Email | — | Suppression alignée sur le français |
| contact.messagePlaceholder — texte à l’intérieur du champ | Message | — | Suppression alignée sur le français |

### Pied de page

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| footer.copyright | © {{year}} MyBikeLab. All rights reserved. | © {{year}} MyBikeLab | Adapté |
| footer.nav.tool | Tool | Compare | Adapté |
| footer.nav.roadmap | Roadmap | What’s next | Adapté |
| footer.nav.partnerships | Partnerships | — | Suppression alignée sur le français |
| footer.nav.contact | Contact | Contact | Conservé |

### La suite du projet

| Emplacement | Avant EN | Après EN | État |
| --- | --- | --- | --- |
| roadmap.sectionIndex | ROADMAP | — | Suppression alignée sur le français |
| roadmap.title | A clearer path forward | What’s next | Adapté |
| roadmap.subtitle | A product roadmap shaped around the value cyclists get from better wheel data. | Here’s what’s available today and what I’d like to develop next to help you choose your bike components. | Adapté |
| roadmap.stateLabels.complete | Available today | Available today | Conservé |
| roadmap.stateLabels.active | Next step | Next step | Conservé |
| roadmap.stateLabels.future | Future direction | Future direction | Conservé |
| roadmap.items.0.title | Compare road wheels | Compare road wheelsets | Adapté |
| roadmap.items.0.description | MyBikeLab starts with structured manufacturer data that makes road wheel choices easier to compare. | Find manufacturer specifications and prices in one table. The data comes from one-off collections and is not yet updated regularly. | Adapté après relecture anglaise |
| roadmap.items.0.points.0 | Side-by-side technical criteria | — | Suppression alignée sur le français |
| roadmap.items.0.points.1 | Prices and practical compatibility details | — | Suppression alignée sur le français |
| roadmap.items.0.points.2 | Data remains a point-in-time snapshot | — | Suppression alignée sur le français |
| roadmap.items.1.title | Enrich the product data | A more complete, up-to-date catalogue | Adapté |
| roadmap.items.1.description | Make the catalogue more trustworthy, useful and easier to grow. | — | Suppression alignée sur le français |
| roadmap.items.1.steps.0.title | Keep data fresh | Keep the data up to date | Adapté |
| roadmap.items.1.steps.0.description | Move from one-time collection toward regular updates, so product details and prices inspire more confidence over time. | Regularly update specifications and prices to better reflect the information available from manufacturers and retailers. | Adapté |
| roadmap.items.1.steps.1.title | Create detailed product pages | More detailed product pages | Adapté |
| roadmap.items.1.steps.1.description | Give each wheel a dedicated page with a deeper, structured view than the comparator's expandable panel. | View all the information about a wheelset on a dedicated page, with more detail than the comparison table. | Adapté |
| roadmap.items.1.steps.2.title | Add new wheel categories | Compare other types of wheelsets | Adapté |
| roadmap.items.1.steps.2.description | Extend beyond road wheels, starting with gravel as a first candidate, on a catalogue that can be maintained. | Expand the catalogue beyond road wheelsets, starting with gravel. | Adapté |
| roadmap.items.1.steps.3.title | Enrich marketplace links | Compare prices across retailers | Adapté |
| roadmap.items.1.steps.3.description | Connect comparisons to more relevant places to find products, without becoming an ecommerce platform. | Add listings from more retailers to help you find a better price. Any affiliate links will be clearly marked. | Adapté après relecture anglaise |
| roadmap.items.2.title | Exploit the data | Understand how products differ | Adapté |
| roadmap.items.2.description | Turn a richer, more reliable catalogue into analytical decision support. | — | Suppression alignée sur le français |
| roadmap.items.2.steps.0.title | Derived indicators | New ways to compare | Adapté |
| roadmap.items.2.steps.0.description | Add calculated metrics such as weight/price and weight/depth ratios. | Compare wheelset characteristics using measures such as weight-to-price and weight-to-rim-depth ratios. | Adapté après relecture anglaise |
| roadmap.items.2.steps.1.title | Multicriteria visualizations | Compare using charts | Adapté après relecture anglaise |
| roadmap.items.2.steps.1.description | Show trade-offs across several criteria and highlight multiple optimal products, including Pareto frontiers. | View several criteria at once to see the trade-offs between wheelsets and find those that match your priorities. | Adapté |
| roadmap.items.2.steps.2.title | Data-based analysis | Understand the differences between wheelsets | Adapté |
| roadmap.items.2.steps.2.description | Publish observations, conclusions and recommendations grounded in the catalogue. | Publish articles based on catalogue data to explain how wheelsets differ and make reasoned recommendations. | Adapté après relecture anglaise |
| roadmap.items.3.title | Extend to other components | Compare other bike components | Adapté |
| roadmap.items.3.description | Broaden the catalogue progressively to other bike component families, without fixing their order today. | Gradually expand the catalogue to help you choose other components for your bike. | Adapté |
| roadmap.items.4.title | Full bike configurator | Plan your bike build | Retenu avec Flavien |
| roadmap.items.4.description | Bring component catalogues and analysis together to evaluate a complete bicycle; precise capabilities remain to be defined. | Bring component data and analysis tools together to help you plan and evaluate a complete bike. | Adapté — sens validé avec Flavien |

### Libellés accessibles

Ces textes utilitaires sont localisés sans changer leur rôle. Ils complètent l’inventaire des libellés initialement écrits directement en anglais dans les composants.

| Emplacement | Avant | Proposition FR | Proposition EN |
| --- | --- | --- | --- |
| Navigation principale | Primary | Navigation principale | Main navigation |
| Navigation mobile | Primary mobile | Navigation mobile | Mobile navigation |
| Navigation du pied de page | Footer | Navigation de pied de page | Footer navigation |
| Choix de langue | Language | Langue | Language |

Les libellés de l’email externe restent une observation distincte du périmètre de la landing page ; cette adaptation ne prescrit pas de changement de son objet ou de son corps.

## Synthèse de direction — approuvée le 14 septembre 2026

- **Résultat** : une landing page simple, humaine et peu commerciale en français et en anglais, fidèle au service disponible et à la direction du projet.
- **Périmètre** : appliquer les colonnes « Après » et « Après EN » hors comparateur, avec les suppressions, regroupements et libellés accessibles décrits dans ce document. L’email externe reste hors périmètre.
- **Décisions** : conserver l’accroche forte ; supprimer les textes redondants ; regrouper les trois chiffres ; simplifier la navigation ; expliquer le fonctionnement réel du contact ; distinguer les possibilités actuelles des étapes futures et signaler les éventuels liens affiliés.
- **Critères de réussite** : les textes affichés correspondent au tableau final, les versions FR et EN portent les mêmes intentions, les chiffres restent dynamiques et les éléments supprimés ne laissent pas de blocs vides.
- **Vérification lors de l’implémentation** : contrôler le rendu sur mobile et ordinateur dans les deux langues, les ancres, les labels et messages du formulaire, les états accessibles et les vérifications pertinentes du projet.

Flavien a approuvé cette synthèse et invoqué explicitement solo-build le 14 septembre 2026. L’intégration et la mise en production ne font pas partie de cette phase.

## Relecture anglaise complémentaire

Six ajustements transmis par Flavien pendant l’implémentation ont été intégrés à la colonne « Après EN » : « one-off collections », suppression de « in relation to one another », « Compare using charts », « make reasoned recommendations », « listings » pour les offres référencées et « Catalogue statistics » pour les compteurs. L’accroche et « Plan your bike build » restent tels que validés.

## Repères pour la maintenance

Les identifiants du tableau sont ceux de la version avant révision. Dans le code final, les libellés permanents du formulaire utilisent `contact.nameLabel`, `contact.emailLabel` et `contact.messageLabel` ; l’étape après ouverture de la messagerie utilise `contact.nextStep`. La phrase destinée aux professionnels est `partnership.benefit` et le nombre de marques est `hero.stats.brands`. Les libellés accessibles ajoutés sont `nav.primaryLabel`, `nav.mobileLabel`, `nav.language` et `footer.navLabel`.

## Vérifications de l’implémentation

- ESLint et compilation de production : réussis.
- Vitest : 372 tests réussis dans 33 fichiers.
- Playwright Chromium : 6 scénarios réussis pour la navigation, le schéma et la roadmap, y compris les thèmes et le changement de langue.
- Vérification directe FR et EN à 320, 390 et 1440 px : textes affichés, trois chiffres dynamiques, absence de blocs vides et de débordement horizontal, navigation vers le contact, libellés permanents, erreurs et message après préparation de l’email.
- Captures relues pour l’accueil, les avantages, les professionnels/contact et la roadmap. L’emphase de l’accroche reste sur une seule ligne quand elle passe à la ligne sur mobile.

Le formulaire utilise toujours `mailto:` et dépend de la messagerie configurée par le visiteur. La vérification intercepte cette ouverture : aucun email réel n’a été envoyé. L’acceptation du résultat par Flavien reste à obtenir. Le comparateur et ses textes n’ont pas été modifiés.
