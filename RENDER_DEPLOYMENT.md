# Déploiement sur Render

## Étapes pour déployer Study Map sur Render

### 1. Préparer le repository
```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### 2. Créer un service sur Render
1. Aller sur [render.com](https://render.com)
2. Connecter votre compte GitHub
3. Cliquer sur "New +" → "Web Service"
4. Sélectionner votre repository `StudyMap`

### 3. Configuration du service
- **Name**: `study-map`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (pour commencer)

### 4. Variables d'environnement
Ajouter dans l'onglet "Environment":
```
NODE_ENV=production
PORT=10000
```

### 5. Déploiement automatique
- Render détectera automatiquement le fichier `render.yaml`
- Chaque push sur `main` déclenchera un nouveau déploiement

## Avantages de Render vs Vercel
- ✅ Plus simple à configurer
- ✅ Moins de limitations sur le plan gratuit
- ✅ Support Docker natif
- ✅ Déploiements plus prévisibles
- ✅ Meilleur pour les applications full-stack

## Commandes utiles
```bash
# Build local
npm run build

# Test en production locale
npm start

# Vérifier les logs
# Disponible dans le dashboard Render
```