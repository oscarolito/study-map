# Database Setup Instructions

This directory contains the database schema and migration files for the Study Map authentication system.

## Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Run the Database Schema**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `supabase_schema.sql`
   - Execute the SQL to create all tables and indexes

3. **Configure Environment Variables**
   - Copy the Supabase URL and keys to your `.env.local` file
   - Use the format shown in `.env.example`

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication in the Firebase console

2. **Configure Authentication Providers**
   - In Authentication > Sign-in method, enable:
     - Email/Password
     - Google (configure OAuth consent screen)

3. **Generate Service Account Key**
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Add the credentials to your environment variables

4. **Configure Authorized Domains**
   - In Authentication > Settings > Authorized domains
   - Add your production domain when deploying

## Stripe Setup

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create an account and get your API keys

2. **Configure Webhooks**
   - In Stripe Dashboard > Developers > Webhooks
   - Add endpoint for your application
   - Listen for `checkout.session.completed` events

## Migration Files

- `001_create_users_table.sql` - Creates the users table with authentication data
- `002_create_program_views_table.sql` - Creates table for tracking program views
- `003_create_payment_transactions_table.sql` - Creates table for payment audit trail
- `supabase_schema.sql` - Combined schema file for easy deployment

## Database Schema Overview

### Users Table
- Stores user authentication data and subscription status
- Links to Firebase Auth via `firebase_uid`
- Tracks program view count and payment status

### Program Views Table
- Tracks each time a user views a program
- Used for enforcing free plan limits
- Provides analytics data

### Payment Transactions Table
- Audit trail for all payment attempts
- Links to Stripe session IDs
- Tracks payment status and amounts