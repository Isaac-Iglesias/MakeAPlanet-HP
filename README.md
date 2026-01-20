# Make A Planet

## C'est quoi ce projet ?

Make A Planet, c'est une landing page pour un concept de "planètes virtuelles persistantes". L'idée : tu paies 1$, tu obtiens une planète générée procéduralement, et elle évolue en continu, même quand t'es en train de faire autre chose.

Pas de blockchain, pas de NFT, pas de bullshit. Juste un petit monde perso qui vit sa vie et que
tu peux échanger sur une place de marché.

## Stack technique

- **Frontend** : HTML/CSS/JS vanille. Pas de framework, pas de build step. Tu ouvres le fichier, ça marche.
- **3D** : Three.js (r128) pour la planète et les étoiles en arrière-plan.
- **Textures** : Générées et encodées en Base64 directement dans `main-textures.js` pour éviter les problèmes CORS en local.

## Structure

```
├── index.html          # Page principale
├── style.css           # Tout le style (scroll-snap, glassmorphism, responsive)
├── main.js             # Logique Three.js, interactions souris, audio ambient
├── main-textures.js    # Textures des planètes en Base64
└── README.md           # T'es ici
```

## Comment lancer ?

1. Clone le repo ou télécharge le zip
2. Ouvre `index.html` dans ton navigateur

C'est tout. Pas de `npm install`, pas de serveur requis.

> **Note** : Si tu veux modifier les textures, faudra les régénérer en Base64 et les coller dans `main-textures.js`.

## Features

- **Scroll cinématique** : Les sections snappent magnétiquement avec un effet de fondu sur le texte.
- **Planète interactive** : Elle réagit au mouvement de la souris (rotation, parallaxe légère).
- **Textures aléatoires** : À chaque refresh, une des 5 textures est choisie au hasard (Lush, Ice, Lava, Desert, Alien).
- **Audio ambient** : Un drone spatial à 55Hz se lance au premier mouvement de souris. Subtil, presque inaudible.
- **Responsive** : Ça s'adapte desktop/mobile.

## À faire

- [ ] Backend pour stocker les planètes
- [ ] Système d'authentification
- [ ] Simulation réelle de l'évolution planétaire
- [ ] Intégration paiement

## Notes

Le projet est conçu pour être "zen" et contemplatif, je l'ai fait dans le cadre de mon projet personnel de l'IB en utilisant Google Antigravity puisque c'était l'objectif d'essayer un environnement de développement intégré assisté par IA. J'ai volontairement évité de publier le backend sur GitHub puisque c'est plus largement un projet de startup et que je préfère garder le code source et les détails techniques backend pour moi-même.

---

*PS: Merci le café crème pour ce projet.*
