import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const COLLECTION_NAME = "diaryEntries";

export const createDiaryEntry = async (userId, entryData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      entry: entryData.entry,
      mood: entryData.mood,
      category: entryData.category,
      photos: entryData.photos || [],
      voiceNotes: entryData.voiceNotes || [],
      date: entryData.date,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getDiaryEntries = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const entries = [];
    querySnapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, entries };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateDiaryEntry = async (entryId, entryData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, entryId);
    await updateDoc(docRef, {
      entry: entryData.entry,
      mood: entryData.mood,
      category: entryData.category,
      photos: entryData.photos || [],
      voiceNotes: entryData.voiceNotes || [],
      date: entryData.date,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteDiaryEntry = async (entryId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, entryId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
