/* ================================
   CLOUDINARY CONFIGURATION
   Lumina by Nanscia
   ================================ */

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'djwbwfyal',            // Your Cloudinary cloud name
    uploadPreset: 'lumina_unsigned'    // Your unsigned upload preset
};

/* ================================
   CLOUDINARY UPLOAD
   ================================ */

/**
 * Upload photo to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Object>} - Returns object with url and publicId
 */
export async function uploadToCloudinary(file, folder = 'lumina-photos') {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('folder', folder);

        // Add timestamp to filename for uniqueness
        const timestamp = Date.now();
        formData.append('public_id', `${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}`);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

/* ================================
   CLOUDINARY DELETE
   ================================ */

/**
 * Delete photo from Cloudinary
 * Note: For unsigned uploads, you need to enable "Invalidate" in your Cloudinary settings
 * Or use the Cloudinary admin API with your API key and secret (requires backend)
 *
 * For client-side deletion, we'll use the destroy endpoint with signature
 * This requires a backend endpoint or you can skip deletion from Cloudinary
 * and just delete from Firestore (Cloudinary auto-cleanup can be configured)
 *
 * @param {string} publicId - The Cloudinary public ID
 * @returns {Promise<boolean>}
 */
export async function deleteFromCloudinary(publicId) {
    try {
        // WARNING: Client-side deletion requires authenticated API calls
        // For production, you should create a backend endpoint to handle this
        // For now, we'll just skip Cloudinary deletion and only delete from Firestore

        console.warn('Cloudinary deletion from client-side requires backend API');
        console.log('Photo metadata will be deleted from Firestore, but image remains in Cloudinary');
        console.log('Consider setting up auto-cleanup in Cloudinary dashboard or a backend API');

        // If you want to implement this, you need to:
        // 1. Create a backend endpoint (e.g., Firebase Cloud Function)
        // 2. Call that endpoint from here with the publicId
        // 3. The backend endpoint will use your Cloudinary API key and secret to delete

        return true; // Return true to continue with Firestore deletion
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
}

/* ================================
   CLOUDINARY IMAGE TRANSFORMATIONS
   ================================ */

/**
 * Generate optimized image URL with Cloudinary transformations
 * @param {string} publicId - The Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export function getOptimizedImageUrl(publicId, options = {}) {
    const {
        width = 'auto',
        quality = 'auto',
        format = 'auto',
        crop = 'fill'
    } = options;

    const transformations = `w_${width},q_${quality},f_${format},c_${crop}`;

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Generate thumbnail URL
 * @param {string} publicId - The Cloudinary public ID
 * @returns {string} - Thumbnail URL
 */
export function getThumbnailUrl(publicId) {
    return getOptimizedImageUrl(publicId, {
        width: 400,
        quality: 80,
        crop: 'thumb'
    });
}

export { CLOUDINARY_CONFIG };
