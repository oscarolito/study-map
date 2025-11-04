# Déploiement Study Map sur Vercel

## 🚀 Étapes de déploiement

### 1. Préparer le repository Git
```bash
git init
git add .
git commit -m "Initial commit - Study Map"
```

### 2. Pousser sur GitHub
1. Créer un nouveau repository sur GitHub
2. Connecter le repository local :
```bash
git remote add origin https://github.com/TON_USERNAME/study-map.git
git branch -M main
git push -u origin main
```

### 3. Déployer sur Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer sur "New Project"
4. Importer le repository "study-map"
5. Configurer les variables d'environnement

## 🔧 Variables d'environnement à configurer sur Vercel

### Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY`: [Votre clé API Firebase]
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: [Votre domaine Firebase]
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: [Votre ID de projet Firebase]
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: [Votre bucket Firebase]
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: [Votre sender ID Firebase]
- `NEXT_PUBLIC_FIREBASE_APP_ID`: [Votre app ID Firebase]

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: [Votre URL Supabase]
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [Votre clé anonyme Supabase]
- `SUPABASE_SERVICE_ROLE_KEY`: [Votre clé service role Supabase]

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: [Votre clé publique Stripe]
- `STRIPE_SECRET_KEY`: [Votre clé secrète Stripe]

### Autres
- `NEXT_PUBLIC_BASE_URL`: https://TON_DOMAINE_VERCEL.vercel.app

## 📋 Après le déploiement

1. **Mettre à jour Firebase** : Ajouter le domaine Vercel dans les domaines autorisés
2. **Configurer Stripe** : Ajouter l'URL de webhook Vercel
3. **Tester toutes les fonctionnalités**

## 🔗 URLs importantes
- Site déployé : https://TON_DOMAINE_VERCEL.vercel.app
- Firebase Console : https://console.firebase.google.com/project/studymap-d73db
- Supabase Dashboard : https://zmputltlqrgmvpoufuyu.supabase.co
- Stripe Dashboard : https://dashboard.stripe.com/