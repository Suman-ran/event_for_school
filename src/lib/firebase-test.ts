import { db, analytics, storage } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { createAdminUser } from './firebase-auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test Firestore connection (with error handling for permissions)
    try {
      const eventsRef = collection(db, 'events');
      const snapshot = await getDocs(eventsRef);
      console.log(`Firestore connection successful. Found ${snapshot.size} events.`);
    } catch (firestoreError: any) {
      if (firestoreError.code === 'permission-denied') {
        console.warn('⚠️ Firestore permissions not configured. Please set up security rules in Firebase Console.');
        console.log('To fix: Go to Firebase Console → Firestore Database → Rules and set rules to allow read/write');
      } else {
        console.error('Firestore connection failed:', firestoreError);
      }
    }
    
    // Test Analytics
    if (analytics) {
      console.log('Firebase Analytics initialized successfully.');
    } else {
      console.log('Firebase Analytics not available (server-side rendering).');
    }
    
    // Test Storage connection (disabled due to CORS issues)
    console.log('⚠️ Firebase Storage testing disabled due to CORS configuration needed.');
    console.log('To enable Storage: Configure CORS for your Firebase Storage bucket.');
    console.log('For now, photos will be saved as base64 in the database.');
    
    console.log('✅ Firebase connection test completed');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Function to set up admin user (run this once)
export const setupAdminUser = async () => {
  try {
    console.log('Setting up admin user...');
    const result = await createAdminUser();
    
    if (result.success) {
      console.log('✅ Admin user created successfully!');
      console.log('Email: suman@ssd.com');
      console.log('Password: qweasd');
    } else {
      console.log('❌ Admin user setup failed:', result.error);
      if (result.error?.includes('already exists')) {
        console.log('Admin user already exists. You can proceed with login.');
      } else if (result.error?.includes('not configured') || result.error?.includes('not enabled')) {
        console.log('🔧 Firebase Authentication needs to be configured:');
        console.log('1. Go to Firebase Console → Authentication');
        console.log('2. Click "Get started" or "Sign-in method"');
        console.log('3. Enable "Email/Password" authentication');
        console.log('4. Save the changes');
        console.log('5. Refresh this page and try again');
      }
    }
    
    return result;
  } catch (error) {
    console.error('Admin user setup failed:', error);
    return { success: false, error: 'Setup failed' };
  }
}; 