import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload photo to Firebase Storage
export const uploadPhoto = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Uploading file:', file.name, 'to path:', path);
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully, getting download URL...');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    
    // Provide specific error messages based on error type
    let errorMessage = 'Failed to upload photo';
    
    switch (error.code) {
      case 'storage/unauthorized':
        errorMessage = 'Storage access denied. Please check Firebase Storage rules.';
        break;
      case 'storage/canceled':
        errorMessage = 'Upload was canceled.';
        break;
      case 'storage/unknown':
        errorMessage = 'Unknown storage error occurred.';
        break;
      case 'storage/invalid-checksum':
        errorMessage = 'File upload failed due to corruption. Please try again.';
        break;
      case 'storage/retry-limit-exceeded':
        errorMessage = 'Upload failed after multiple attempts. Please try again.';
        break;
      case 'storage/invalid-format':
        errorMessage = 'Invalid file format. Please upload a valid image.';
        break;
      case 'storage/cannot-slice-blob':
        errorMessage = 'File processing failed. Please try a different image.';
        break;
      default:
        errorMessage = `Upload failed: ${error.message || 'Unknown error'}`;
    }
    
    throw new Error(errorMessage);
  }
};

// Delete photo from Firebase Storage
export const deletePhoto = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new Error('Failed to delete photo');
  }
};

// Generate unique path for winner photos
export const generatePhotoPath = (eventId: string, winnerName: string, position: number): string => {
  const timestamp = Date.now();
  const sanitizedName = winnerName.replace(/[^a-zA-Z0-9]/g, '_');
  return `winners/${eventId}/${position}_${sanitizedName}_${timestamp}.jpg`;
};

// Convert base64 to blob for upload
export const base64ToBlob = (base64: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/jpeg' });
}; 