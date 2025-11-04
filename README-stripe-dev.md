# Configuration Stripe pour le développement

## Option 1: Utiliser ngrok (Recommandé)

### 1. Installer ngrok
```bash
# Sur macOS avec Homebrew
brew install ngrok

# Ou télécharger depuis https://ngrok.com/download
```

### 2. Exposer ton serveur local
```bash
# Dans un terminal séparé, lance ngrok
ngrok http 3000
```

### 3. Configurer le webhook Stripe
1. Copie l'URL HTTPS fournie par ngrok (ex: `https://abc123.ngrok.io`)
2. Va dans Stripe Dashboard > Developers > Webhooks
3. Ajoute un endpoint: `https://abc123.ngrok.io/api/stripe/webhook`
4. Sélectionne les événements: `checkout.session.completed`
5. Copie le webhook secret et mets-le dans `.env.local`

## Option 2: Utiliser Stripe CLI

### 1. Installer Stripe CLI
```bash
# Sur macOS avec Homebrew
brew install stripe/stripe-cli/stripe
```

### 2. Se connecter à Stripe
```bash
stripe login
```

### 3. Écouter les webhooks
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Utiliser la clé webhook fournie
Copie la clé webhook affichée dans le terminal et mets-la dans `.env.local`

## Option 3: Mode développement sans webhooks

Pour tester sans webhooks, tu peux :
1. Créer une session de paiement
2. Simuler manuellement la mise à jour du statut utilisateur
3. Utiliser les cartes de test Stripe

### Cartes de test Stripe
- **Succès**: `4242 4242 4242 4242`
- **Échec**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Date d'expiration: n'importe quelle date future
CVC: n'importe quel code à 3 chiffres