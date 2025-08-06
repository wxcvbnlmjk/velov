# 🚲 Velov - Application de Suivi des Stations Vélov à Lyon

Une application web interactive pour visualiser en temps réel l'état des stations Vélov à Lyon, développée avec React et TypeScript.

## 📋 Fonctionnalités

### 🗺️ Visualisation Interactive
- **Carte interactive** centrée sur Lyon avec toutes les stations Vélov
- **Marqueurs colorés** indiquant l'état de chaque station
- **Popups détaillés** avec informations complètes sur chaque station

### 📊 Modes d'Affichage
L'application propose 4 modes de visualisation différents :

1. **🚲 Vélos disponibles** - Nombre de vélos classiques disponibles
2. **🅿️ Places disponibles** - Nombre de bornes libres
3. **⚡ Vélos électriques** - Nombre de vélos électriques disponibles
4. **📈 Activité des stations** - Suivi des changements en temps réel

### 🎨 Système de Couleurs
- **Vert** : Stations avec vélos/places disponibles
- **Rouge** : Stations sans disponibilité
- **Mode Activité** : Dégradés de couleurs pour visualiser les changements
  - Vert → Bleu : Augmentation du nombre de vélos
  - Orange → Rouge : Diminution du nombre de vélos
  - Blanc : Aucun changement

### ⏰ Mise à Jour Automatique
- **Rafraîchissement automatique** toutes les 30 secondes
- **Compteur visuel** du temps restant avant la prochaine mise à jour
- **Données en temps réel** via l'API JCDecaux

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.2.0** - Framework JavaScript pour l'interface utilisateur
- **TypeScript 4.9.5** - Typage statique pour un code plus robuste
- **React Leaflet 4.2.1** - Intégration de cartes interactives
- **Leaflet 1.9.4** - Bibliothèque de cartographie open source

### API et Données
- **API JCDecaux** - Données en temps réel des stations Vélov
- **Fetch API** - Requêtes HTTP pour récupérer les données
- **Hooks React** - Gestion d'état et effets de bord

### Outils de Développement
- **Create React App** - Configuration et build de l'application
- **ESLint** - Linting du code
- **Jest & Testing Library** - Tests unitaires
- **Web Vitals** - Mesure des performances

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/wxcvbnlmjk/velov.git
cd velov

# Installer les dépendances
npm install
```

### Lancement
```bash
# Démarrer l'application en mode développement
npm start

# L'application sera accessible sur http://localhost:3000
```

### Scripts Disponibles
```bash
npm start          # Démarre le serveur de développement
npm run build      # Construit l'application pour la production
npm test           # Lance les tests
npm run eject      # Éjecte la configuration CRA (irréversible)
```

## 📱 Utilisation

1. **Ouvrir l'application** dans votre navigateur
2. **Choisir un mode d'affichage** dans le menu déroulant en haut
3. **Cliquer sur un marqueur** pour voir les détails de la station
4. **Observer le compteur** en bas à gauche pour le prochain rafraîchissement

## 🔧 Structure du Projet

```
velov/
├── public/                 # Fichiers statiques
├── src/
│   ├── App.tsx            # Composant principal
│   ├── MapView.tsx        # Vue carte avec logique métier
│   ├── StationMarker.tsx  # Composant popup des stations
│   ├── useStations.ts     # Hook personnalisé pour les données
│   └── index.tsx          # Point d'entrée
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🌐 API Utilisée

L'application utilise l'API officielle JCDecaux pour récupérer les données des stations Vélov :
- **Endpoint** : `https://api.jcdecaux.com/vls/v3/stations`
- **Contrat** : Lyon
- **Fréquence** : Mise à jour toutes les 30 secondes

## 📈 Fonctionnalités Avancées

### Suivi d'Activité
- **Sauvegarde des données initiales** pour comparaison
- **Calcul des variations** en temps réel
- **Visualisation colorée** des changements d'activité

### Interface Utilisateur
- **Design responsive** adapté à tous les écrans
- **Contrôles intuitifs** avec menu déroulant
- **Indicateurs visuels** pour l'état des stations

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser les performances

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🔗 Liens Utiles

- [Repository GitHub](https://github.com/wxcvbnlmjk/velov)
- [API JCDecaux](https://developer.jcdecaux.com/)
- [Documentation React](https://reactjs.org/)
- [Documentation Leaflet](https://leafletjs.com/)

---

**Développé avec ❤️ pour la communauté cycliste lyonnaise**
