import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword 
} from 'firebase/auth';

// Admin credentials
const ADMIN_EMAIL = 'suman@ssd.com';
const ADMIN_PASSWORD = 'qweasd';

// Login function
export const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Admin logged in successfully:', userCredential.user.email);
    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'User not found. Please check your email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/configuration-not-found':
        errorMessage = 'Firebase Authentication not configured. Please enable Authentication in Firebase Console.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password authentication not enabled. Please enable it in Firebase Console.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Logout function
export const logoutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('Admin logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Create admin user (run this once to set up the admin account)
export const createAdminUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Admin user created successfully:', userCredential.user.email);
    return { success: true };
  } catch (error: any) {
    console.error('Create admin error:', error);
    let errorMessage = 'Failed to create admin user.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Admin user already exists.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      case 'auth/configuration-not-found':
        errorMessage = 'Firebase Authentication not configured. Please enable Authentication in Firebase Console.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password authentication not enabled. Please enable it in Firebase Console.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
}; 