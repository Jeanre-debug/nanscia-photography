/* ================================
   FIREBASE CONFIGURATION
   Lumina by Nanscia
   ================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary-config.js';
import * as LocalStorage from './local-storage.js';

// Firebase configuration (Auth only - no Firestore needed!)
const firebaseConfig = {
    apiKey: "AIzaSyCCHo0qahUmgRkFiP0D7FGudfwMMXwLdtg",
    authDomain: "nanscia-photo.firebaseapp.com",
    projectId: "nanscia-photo",
    storageBucket: "nanscia-photo.firebasestorage.app",
    messagingSenderId: "772881862866",
    appId: "1:772881862866:web:b60d85ab9cb02ce33fdd0b"
};

// Initialize Firebase (Auth only)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================================
   PHOTO OPERATIONS
   Using Cloudinary for images + localStorage for metadata
   ================================ */

// Upload photo to Cloudinary and save metadata to localStorage
export async function uploadPhoto(file, title, category, size = 'normal') {
    try {
        // Upload to Cloudinary
        const cloudinaryData = await uploadToCloudinary(file, 'lumina-photos');

        // Save metadata to localStorage
        const photoData = {
            title,
            category,
            size,
            imageUrl: cloudinaryData.url,
            publicId: cloudinaryData.publicId,
            width: cloudinaryData.width,
            height: cloudinaryData.height,
            format: cloudinaryData.format,
            bytes: cloudinaryData.bytes
        };

        const savedPhoto = LocalStorage.savePhoto(photoData);
        return savedPhoto;
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

// Get all photos from localStorage
export async function getPhotos() {
    try {
        return LocalStorage.getPhotos();
    } catch (error) {
        console.error('Error getting photos:', error);
        throw error;
    }
}

// Update photo metadata
export async function updatePhoto(photoId, updates) {
    try {
        return LocalStorage.updatePhoto(photoId, updates);
    } catch (error) {
        console.error('Error updating photo:', error);
        throw error;
    }
}

// Delete photo from Cloudinary and localStorage
export async function deletePhoto(photoId, publicId) {
    try {
        // Delete from Cloudinary (optional - see cloudinary-config.js notes)
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }

        // Delete from localStorage
        LocalStorage.deletePhoto(photoId);

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
            await deletePhoto(photo.id, photo.publicId);
        }

        return true;
    } catch (error) {
        console.error('Error deleting all photos:', error);
        throw error;
    }
}

/* ================================
   CATEGORY OPERATIONS
   Using localStorage
   ================================ */

// Initialize categories
export async function initCategories() {
    return LocalStorage.initCategories();
}

// Get all categories
export async function getCategories() {
    try {
        return LocalStorage.getCategories();
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
}

// Add category
export async function addCategory(name) {
    try {
        return LocalStorage.addCategory(name);
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

// Delete category
export async function deleteCategoryFromDB(categoryId) {
    try {
        return LocalStorage.deleteCategory(categoryId);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

/* ================================
   AUTHENTICATION
   Using Firebase Auth
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

// Export auth instance for direct use if needed
export { auth };
