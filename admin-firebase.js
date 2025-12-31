/* ================================
   LUMINA ADMIN PANEL - FIREBASE
   ================================ */

import {
    uploadPhoto,
    getPhotos,
    updatePhoto,
    deletePhoto,
    deleteAllPhotos,
    getCategories,
    addCategory,
    deleteCategoryFromDB,
    initCategories,
    auth
} from './firebase-config.js';

import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// State
let photos = [];
let categories = [];
let pendingUploads = [];
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initLogin();
    initNavigation();
    initUpload();
    initModals();
    initSettings();
});

/* ================================
   AUTHENTICATION
   ================================ */
function initAuth() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            showDashboard();
        } else {
            currentUser = null;
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('admin-dashboard').classList.remove('active');
        }
    });
}

function initLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state listener will handle showing dashboard
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                loginError.textContent = 'Invalid email or password';
            } else if (error.code === 'auth/too-many-requests') {
                loginError.textContent = 'Too many attempts. Please try again later.';
            } else {
                loginError.textContent = 'Login failed. Please try again.';
            }
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            location.reload();
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Error logging out', 'error');
        }
    });
}

async function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('active');

    // Display user email in settings
    if (currentUser) {
        document.getElementById('user-email').textContent = currentUser.email;
    }

    showLoading(true);

    try {
        // Initialize categories in Firebase if needed
        await initCategories();

        // Load data from Firebase
        await loadPhotos();
        await loadCategories();
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error loading data. Please refresh.', 'error');
    }

    showLoading(false);
}

/* ================================
   LOADING STATE
   ================================ */
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

/* ================================
   NAVIGATION
   ================================ */
function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show section
            const sectionId = link.dataset.section;
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
}

/* ================================
   UPLOAD FUNCTIONALITY
   ================================ */
function initUpload() {
    const uploadBtn = document.getElementById('upload-btn');
    const emptyUploadBtn = document.getElementById('empty-upload-btn');
    const uploadArea = document.getElementById('upload-area');
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const uploadPreview = document.getElementById('upload-preview');
    const previewGrid = document.getElementById('preview-grid');
    const cancelUpload = document.getElementById('cancel-upload');
    const confirmUpload = document.getElementById('confirm-upload');
    const uploadProgress = document.getElementById('upload-progress');
    const uploadActions = document.getElementById('upload-actions');

    // Show upload area
    const showUploadArea = () => {
        uploadArea.classList.add('active');
    };

    uploadBtn.addEventListener('click', showUploadArea);
    emptyUploadBtn?.addEventListener('click', showUploadArea);

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // File input
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Handle files
    function handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                showToast(`${file.name} is not an image`, 'error');
                return false;
            }
            // Check file size (10MB max for Firebase)
            if (file.size > 10 * 1024 * 1024) {
                showToast(`${file.name} is too large (max 10MB)`, 'error');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Process files
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const id = Date.now() + Math.random().toString(36).substr(2, 9);
                pendingUploads.push({
                    id,
                    file,
                    preview: e.target.result,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    category: categories.length > 0 ? categories[0].id : 'portrait',
                    size: 'normal'
                });
                renderPreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Render preview
    function renderPreview() {
        if (pendingUploads.length === 0) {
            uploadPreview.classList.remove('active');
            return;
        }

        uploadPreview.classList.add('active');
        uploadProgress.style.display = 'none';
        uploadActions.style.display = 'flex';

        previewGrid.innerHTML = pendingUploads.map(upload => `
            <div class="preview-item" data-id="${upload.id}">
                <img src="${upload.preview}" alt="Preview">
                <button class="remove-preview" data-id="${upload.id}">&times;</button>
                <div class="preview-info">
                    <input type="text" value="${upload.title}" placeholder="Title" data-field="title" data-id="${upload.id}">
                    <select data-field="category" data-id="${upload.id}">
                        ${categories.map(cat => `
                            <option value="${cat.id}" ${upload.category === cat.id ? 'selected' : ''}>${cat.name}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `).join('');

        // Remove preview handlers
        previewGrid.querySelectorAll('.remove-preview').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                pendingUploads = pendingUploads.filter(u => u.id !== id);
                renderPreview();
            });
        });

        // Input handlers
        previewGrid.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', () => {
                const id = input.dataset.id;
                const field = input.dataset.field;
                const upload = pendingUploads.find(u => u.id === id);
                if (upload) {
                    upload[field] = input.value;
                }
            });
        });
    }

    // Cancel upload
    cancelUpload.addEventListener('click', () => {
        pendingUploads = [];
        uploadPreview.classList.remove('active');
        uploadArea.classList.remove('active');
        fileInput.value = '';
    });

    // Confirm upload - Upload to Firebase
    confirmUpload.addEventListener('click', async () => {
        if (pendingUploads.length === 0) return;

        // Show progress
        uploadActions.style.display = 'none';
        uploadProgress.style.display = 'block';

        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        let uploaded = 0;
        const total = pendingUploads.length;

        try {
            for (const upload of pendingUploads) {
                progressText.textContent = `Uploading ${uploaded + 1} of ${total}...`;

                await uploadPhoto(upload.file, upload.title, upload.category, upload.size);

                uploaded++;
                progressFill.style.width = `${(uploaded / total) * 100}%`;
            }

            // Success
            progressText.textContent = 'Upload complete!';
            showToast(`${total} photo${total > 1 ? 's' : ''} uploaded successfully!`, 'success');

            // Reset
            setTimeout(() => {
                pendingUploads = [];
                uploadPreview.classList.remove('active');
                uploadArea.classList.remove('active');
                fileInput.value = '';
                progressFill.style.width = '0%';
                loadPhotos();
            }, 1000);

        } catch (error) {
            console.error('Upload error:', error);
            showToast('Error uploading photos. Please try again.', 'error');
            uploadActions.style.display = 'flex';
            uploadProgress.style.display = 'none';
        }
    });
}

/* ================================
   PHOTO GRID
   ================================ */
async function loadPhotos() {
    const photoGrid = document.getElementById('photo-grid');
    const emptyState = document.getElementById('empty-state');

    try {
        photos = await getPhotos();

        // Update settings info
        document.getElementById('total-photos').textContent = photos.length;

        if (photos.length === 0) {
            photoGrid.style.display = 'none';
            emptyState.classList.add('active');
            return;
        }

        emptyState.classList.remove('active');
        photoGrid.style.display = 'grid';

        photoGrid.innerHTML = photos.map(photo => `
            <div class="photo-card" data-id="${photo.id}">
                <div class="photo-card-image">
                    <img src="${photo.imageUrl}" alt="${photo.title}" loading="lazy">
                    <div class="photo-card-overlay">
                        <button class="photo-card-btn edit-btn" data-id="${photo.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="photo-card-btn delete-btn" data-id="${photo.id}" data-public-id="${photo.publicId || ''}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="photo-card-info">
                    <div class="photo-card-title">${photo.title}</div>
                    <div class="photo-card-category">${photo.category}</div>
                </div>
            </div>
        `).join('');

        // Edit buttons
        photoGrid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });

        // Delete buttons
        photoGrid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this photo?')) {
                    showLoading(true);
                    try {
                        await deletePhoto(btn.dataset.id, btn.dataset.publicId);
                        showToast('Photo deleted', 'success');
                        await loadPhotos();
                    } catch (error) {
                        showToast('Error deleting photo', 'error');
                    }
                    showLoading(false);
                }
            });
        });

    } catch (error) {
        console.error('Error loading photos:', error);
        showToast('Error loading photos', 'error');
    }
}

/* ================================
   EDIT MODAL
   ================================ */
function initModals() {
    const editModal = document.getElementById('edit-modal');
    const modalClose = document.getElementById('modal-close');
    const savePhotoBtn = document.getElementById('save-photo-btn');
    const deletePhotoBtn = document.getElementById('delete-photo-btn');

    // Close modal
    modalClose.addEventListener('click', () => {
        editModal.classList.remove('active');
    });

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.classList.remove('active');
        }
    });

    // Save photo
    savePhotoBtn.addEventListener('click', async () => {
        const id = document.getElementById('edit-photo-id').value;
        const title = document.getElementById('edit-title').value;
        const category = document.getElementById('edit-category').value;
        const size = document.getElementById('edit-size').value;

        showLoading(true);

        try {
            await updatePhoto(id, { title, category, size });
            showToast('Photo updated', 'success');
            editModal.classList.remove('active');
            await loadPhotos();
        } catch (error) {
            showToast('Error updating photo', 'error');
        }

        showLoading(false);
    });

    // Delete from modal
    deletePhotoBtn.addEventListener('click', async () => {
        const id = document.getElementById('edit-photo-id').value;
        const publicId = document.getElementById('edit-public-id').value;

        if (confirm('Are you sure you want to delete this photo?')) {
            showLoading(true);
            try {
                await deletePhoto(id, publicId);
                showToast('Photo deleted', 'success');
                editModal.classList.remove('active');
                await loadPhotos();
            } catch (error) {
                showToast('Error deleting photo', 'error');
            }
            showLoading(false);
        }
    });

    // Category modal
    const categoryModal = document.getElementById('category-modal');
    const categoryModalClose = document.getElementById('category-modal-close');
    const cancelCategory = document.getElementById('cancel-category');
    const saveCategory = document.getElementById('save-category');
    const addCategoryBtn = document.getElementById('add-category-btn');

    addCategoryBtn.addEventListener('click', () => {
        categoryModal.classList.add('active');
    });

    categoryModalClose.addEventListener('click', () => {
        categoryModal.classList.remove('active');
    });

    cancelCategory.addEventListener('click', () => {
        categoryModal.classList.remove('active');
    });

    saveCategory.addEventListener('click', async () => {
        const name = document.getElementById('category-name').value.trim();
        if (name) {
            const id = name.toLowerCase().replace(/\s+/g, '-');

            // Check if exists
            if (categories.find(c => c.id === id)) {
                showToast('Category already exists', 'error');
                return;
            }

            showLoading(true);
            try {
                await addCategory(name);
                await loadCategories();
                categoryModal.classList.remove('active');
                document.getElementById('category-name').value = '';
                showToast('Category added', 'success');
            } catch (error) {
                showToast('Error adding category', 'error');
            }
            showLoading(false);
        }
    });
}

function openEditModal(id) {
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    document.getElementById('edit-photo-id').value = photo.id;
    document.getElementById('edit-public-id').value = photo.publicId || '';
    document.getElementById('edit-preview-img').src = photo.imageUrl;
    document.getElementById('edit-title').value = photo.title;
    document.getElementById('edit-size').value = photo.size || 'normal';

    // Update category options
    const categorySelect = document.getElementById('edit-category');
    categorySelect.innerHTML = categories.map(cat => `
        <option value="${cat.id}" ${photo.category === cat.id ? 'selected' : ''}>${cat.name}</option>
    `).join('');

    document.getElementById('edit-modal').classList.add('active');
}

/* ================================
   CATEGORIES
   ================================ */
async function loadCategories() {
    try {
        categories = await getCategories();

        const categoriesList = document.getElementById('categories-list');

        // Count photos per category
        const counts = {};
        photos.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });

        categoriesList.innerHTML = categories.map(cat => `
            <div class="category-card" data-id="${cat.id}">
                <div class="category-info">
                    <h3>${cat.name}</h3>
                    <span>${counts[cat.id] || 0} photo${(counts[cat.id] || 0) !== 1 ? 's' : ''}</span>
                </div>
                <div class="category-actions">
                    ${!['portrait', 'wedding', 'nature', 'lifestyle'].includes(cat.id) ? `
                        <button class="category-btn delete" data-id="${cat.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Delete category handlers
        categoriesList.querySelectorAll('.category-btn.delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const catId = btn.dataset.id;
                const count = counts[catId] || 0;

                if (count > 0) {
                    showToast('Cannot delete category with photos', 'error');
                    return;
                }

                const cat = categories.find(c => c.id === catId);
                if (confirm(`Delete category "${cat?.name}"?`)) {
                    showLoading(true);
                    try {
                        await deleteCategoryFromDB(catId);
                        await loadCategories();
                        showToast('Category deleted', 'success');
                    } catch (error) {
                        showToast('Error deleting category', 'error');
                    }
                    showLoading(false);
                }
            });
        });

    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

/* ================================
   SETTINGS
   ================================ */
function initSettings() {
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Send password reset email
    resetPasswordBtn.addEventListener('click', async () => {
        if (!currentUser) return;

        try {
            await sendPasswordResetEmail(auth, currentUser.email);
            showToast('Password reset email sent!', 'success');
        } catch (error) {
            console.error('Password reset error:', error);
            showToast('Error sending reset email', 'error');
        }
    });

    // Clear all photos
    clearAllBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete ALL photos? This cannot be undone.')) {
            if (confirm('This is your last chance. Delete all photos from cloud storage?')) {
                showLoading(true);
                try {
                    await deleteAllPhotos();
                    await loadPhotos();
                    showToast('All photos deleted', 'success');
                } catch (error) {
                    showToast('Error deleting photos', 'error');
                }
                showLoading(false);
            }
        }
    });
}

/* ================================
   TOAST NOTIFICATIONS
   ================================ */
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');

    toast.className = 'toast';
    if (type) toast.classList.add(type);

    toastMessage.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}
