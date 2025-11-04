// Configuration with fallback values
export const config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBpzZwonJ-Tp75cDK6U3mAEIAb8Ci1Znkk",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studymap-d73db.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studymap-d73db",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studymap-d73db.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "717163288549",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:717163288549:web:f8ac86bd7a77de5d60010c",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zmputltlqrgmvpoufuyu.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcHV0bHRscXJnbXZwb3VmdXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMTEzNzAsImV4cCI6MjA3Nzc4NzM3MH0.UfHON-JaUMcS2hKF0YPiusTHFQHM0P3IKzZBStsHMLA",
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51RSgUC05C5czMhHkTH5FSLjPiaL3GAaYvldkxNODuyY3tLuLtmMHKp1XhO6d2jwGlRr7zp5fHo63s2kvfGuIzxJC00jZvLyMoD",
  },
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};

export function validateConfig() {
  const missing = [];
  
  if (!config.firebase.apiKey) missing.push('Firebase API Key');
  if (!config.supabase.url) missing.push('Supabase URL');
  if (!config.stripe.publishableKey) missing.push('Stripe Publishable Key');
  
  return {
    isValid: missing.length === 0,
    missing
  };
}