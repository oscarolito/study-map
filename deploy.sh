#!/bin/bash

echo "🚀 Déploiement Study Map sur Vercel"

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository Git..."
    git init
    git add .
    git commit -m "Initial commit - Study Map"
else
    echo "📦 Mise à jour du repository Git..."
    git add .
    git commit -m "Update - $(date)"
fi

# Installer Vercel CLI si nécessaire
if ! command -v vercel &> /dev/null; then
    echo "📥 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Déployer sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🔗 Votre site sera disponible sur l'URL fournie par Vercel"