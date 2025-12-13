/* ================================
   FIREBASE CONFIGURATION
   Lumina by Nanscia
   ================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCHo0qahUmgRkFiP0D7FGudfwMMXwLdtg",
    authDomain: "nanscia-photo.firebaseapp.com",
    projectId: "nanscia-photo",
    storageBucket: "nanscia-photo.firebasestorage.app",
    messagingSenderId: "772881862866",
    appId: "1:772881862866:web:b60d85ab9cb02ce33fdd0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Collections
const PHOTOS_COLLECTION = 'photos';
const CATEGORIES_COLLECTION = 'categories';

/* ================================
   PHOTO OPERATIONS
   ================================ */

// Upload photo to Firebase Storage and save metadata to Firestore
export async function uploadPhoto(file, title, category, size = 'normal') {
    try {
        // Create unique filename
        const timestamp = Date.now();
        const filename = `photos/${timestamp}_${file.name}`;

        // Upload to Storage
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Save metadata to Firestore
        const photoData = {
            title,
            category,
            size,
            imageUrl: downloadURL,
            storagePath: filename,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, PHOTOS_COLLECTION), photoData);

        return { id: docRef.id, ...photoData };
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

// Get all photos from Firestore
export async function getPhotos() {
    try {
        const q = query(collection(db, PHOTOS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const photos = [];
        querySnapshot.forEach((doc) => {
            photos.push({ id: doc.id, ...doc.data() });
        });

        return photos;
    } catch (error) {
        console.error('Error getting photos:', error);
        throw error;
    }
}

// Update photo metadata
export async function updatePhoto(photoId, updates) {
    try {
        const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
        await updateDoc(photoRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error updating photo:', error);
        throw error;
    }
}

// Delete photo from Storage and Firestore
export async function deletePhoto(photoId, storagePath) {
    try {
        // Delete from Storage
        if (storagePath) {
            const storageRef = ref(storage, storagePath);
            await deleteObject(storageRef);
        }

        // Delete from Firestore
        await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));

        return true;
    } catch (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
}

// Delete all photos
export async function deleteAllPhotos() {
    try {
        const photos = await getPhotos();

        for (const photo of photos) {
            await deletePhoto(photo.id, photo.storagePath);
        }

        return true;
    } catch (error) {
        console.error('Error deleting all photos:', error);
        throw error;
    }
}

/* ================================
   CATEGORY OPERATIONS
   ================================ */

// Default categories
const DEFAULT_CATEGORIES = [
    { id: 'portrait', name: 'Portrait' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'nature', name: 'Nature' },
    { id: 'lifestyle', name: 'Lifestyle' }
];

// Initialize categories if they don't exist
export async function initCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));

        if (querySnapshot.empty) {
            // Add default categories
            for (const cat of DEFAULT_CATEGORIES) {
                await addDoc(collection(db, CATEGORIES_COLLECTION), cat);
            }
        }
    } catch (error) {
        console.error('Error initializing categories:', error);
    }
}

// Get all categories
export async function getCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));

        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ docId: doc.id, ...doc.data() });
        });

        // If empty, return defaults
        if (categories.length === 0) {
            return DEFAULT_CATEGORIES;
        }

        return categories;
    } catch (error) {
        console.error('Error getting categories:', error);
        return DEFAULT_CATEGORIES;
    }
}

// Add category
export async function addCategory(name) {
    try {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), { id, name });
        return { docId: docRef.id, id, name };
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

// Delete category
export async function deleteCategoryFromDB(docId) {
    try {
        await deleteDoc(doc(db, CATEGORIES_COLLECTION, docId));
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

/* ================================
   AUTHENTICATION (Optional)
   ================================ */

// Sign in with email/password
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

// Sign out
export async function logOut() {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Check auth state
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// Export instances for direct use if needed
export { db, storage, auth };
