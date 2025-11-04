// Simple Firebase mock for development
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock auth state - no user by default
    setTimeout(() => callback(null), 100);
    return () => {}; // unsubscribe function
  }
};

export const googleProvider = {};

export default {};