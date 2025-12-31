/* ================================
   LOCAL STORAGE DATA MANAGER
   Lumina by Nanscia
   ================================ */

const STORAGE_KEYS = {
    PHOTOS: 'lumina_photos',
    CATEGORIES: 'lumina_categories'
};

/* ================================
   PHOTO OPERATIONS
   ================================ */

/**
 * Get all photos from localStorage
 */
export function getPhotos() {
    try {
        const photosJSON = localStorage.getItem(STORAGE_KEYS.PHOTOS);
        if (!photosJSON) return [];

        const photos = JSON.parse(photosJSON);
        // Sort by createdAt descending (newest first)
        return photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error getting photos from localStorage:', error);
        return [];
    }
}

/**
 * Save a new photo to localStorage
 */
export function savePhoto(photoData) {
    try {
        const photos = getPhotos();
        const newPhoto = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...photoData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        photos.push(newPhoto);
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));

        return newPhoto;
    } catch (error) {
        console.error('Error saving photo to localStorage:', error);
        throw error;
    }
}

/**
 * Update an existing photo
 */
export function updatePhoto(photoId, updates) {
    try {
        const photos = getPhotos();
        const index = photos.findIndex(p => p.id === photoId);

        if (index === -1) {
            throw new Error('Photo not found');
        }

        photos[index] = {
            ...photos[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
        return photos[index];
    } catch (error) {
        console.error('Error updating photo:', error);
        throw error;
    }
}

/**
 * Delete a photo from localStorage
 */
export function deletePhoto(photoId) {
    try {
        const photos = getPhotos();
        const filteredPhotos = photos.filter(p => p.id !== photoId);
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(filteredPhotos));
        return true;
    } catch (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
}

/**
 * Delete all photos
 */
export function deleteAllPhotos() {
    try {
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify([]));
        return true;
    } catch (error) {
        console.error('Error deleting all photos:', error);
        throw error;
    }
}

/* ================================
   CATEGORY OPERATIONS
   ================================ */

const DEFAULT_CATEGORIES = [
    { id: 'portrait', name: 'Portrait' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'nature', name: 'Nature' },
    { id: 'lifestyle', name: 'Lifestyle' }
];

/**
 * Get all categories
 */
export function getCategories() {
    try {
        const categoriesJSON = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

        if (!categoriesJSON) {
            // Initialize with defaults
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
            return DEFAULT_CATEGORIES;
        }

        return JSON.parse(categoriesJSON);
    } catch (error) {
        console.error('Error getting categories:', error);
        return DEFAULT_CATEGORIES;
    }
}

/**
 * Add a new category
 */
export function addCategory(name) {
    try {
        const categories = getCategories();
        const id = name.toLowerCase().replace(/\s+/g, '-');

        // Check if already exists
        if (categories.find(c => c.id === id)) {
            throw new Error('Category already exists');
        }

        const newCategory = {
            id,
            name,
            docId: id // For compatibility with existing code
        };

        categories.push(newCategory);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

        return newCategory;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

/**
 * Delete a category
 */
export function deleteCategory(categoryId) {
    try {
        const categories = getCategories();
        const filteredCategories = categories.filter(c => c.id !== categoryId);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filteredCategories));
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

/**
 * Initialize categories (for compatibility)
 */
export function initCategories() {
    // Just ensure defaults exist
    getCategories();
    return Promise.resolve();
}
