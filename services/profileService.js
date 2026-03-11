import { db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `profile_images/${userId}/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    await updateUserProfile(userId, { photoURL: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
