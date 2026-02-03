# DOXBIN V2 - Interface de Recherche Futuriste

Une Single Page Application (SPA) React avec un design cyberpunk/futuriste, utilisant Tailwind CSS, Framer Motion et Lucide React.

## 🚀 Fonctionnalités

- **Design Ultra Dark Mode** avec effets de glassmorphism
- **Animations fluides** avec Framer Motion
- **Formulaire avec floating labels** et validation en temps réel
- **Animation de scan** lors de la soumission
- **Intégration Discord Webhook** pour l'envoi des données
- **Entièrement responsive** (mobile, tablette, desktop)

## 🛠️ Technologies

- React 19
- Vite 7
- Tailwind CSS 4
- Framer Motion 12
- Lucide React (icônes)

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Build pour la production
pnpm build
```

## 🎨 Design

- **Thème**: Ultra Dark Mode avec fond noir profond (#050505)
- **Couleurs néon**: Cyan électrique (#00f0ff) et Violet Cyber (#b800ff)
- **Effets**: Glassmorphism, glow effects, mesh gradients animés
- **Police**: Rajdhani (futuriste et technique)

## 🔧 Configuration

L'URL du webhook Discord est définie dans `src/App.jsx`:

```javascript
const WEBHOOK_URL = "VOTRE_URL_WEBHOOK_ICI";
```

## 📱 Champs du formulaire

- Prénom
- Nom
- Adresse Email (avec validation)
- Numéro de Téléphone
- Adresse Postale
- Adresse IP (optionnel)

## ⚡ Animations

- Apparition des éléments au chargement (fade in + slide up)
- Animation de scan de 3 secondes lors de la soumission
- Effets de glow sur les inputs au focus
- Messages de succès/erreur animés

## 📄 License

MIT
