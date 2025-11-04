// Firebase Admin SDK configuration for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin only if it hasn't been initialized already
const adminApp = getApps().length === 0 
  ? initializeApp({
      credential: cert(firebaseAdminConfig),
      projectId: process.env.FIREBASE_PROJECT_ID,
    }, 'admin')
  : getApps().find(app => app.name === 'admin') || getApps()[0];

// Initialize Firebase Admin Auth
export const adminAuth = getAuth(adminApp);

export default adminApp;