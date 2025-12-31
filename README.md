# Lumina by Nanscia - Photography Portfolio

A beautiful, minimalist photography portfolio website with an admin panel for managing your photos.

## Tech Stack

- ✅ **Cloudinary** - Image hosting and optimization (25GB free)
- ✅ **Firebase Auth** - Secure login for admin panel
- ✅ **LocalStorage** - Photo metadata storage (browser-based)
- ✅ **Vanilla JavaScript** - No framework dependencies

## Architecture

### Photo Storage
- **Images**: Stored in Cloudinary (automatically optimized, CDN-delivered)
- **Metadata**: Stored in browser's localStorage (title, category, size, etc.)
- **Authentication**: Firebase Auth for admin login

### Why This Setup?

1. **No Firestore costs** - All metadata stored locally
2. **Free image hosting** - Cloudinary's generous free tier
3. **Fast performance** - CDN delivery + auto optimization
4. **Simple setup** - No database configuration needed

## Setup Instructions

### 1. Cloudinary Setup

Your Cloudinary is already configured:
- Cloud Name: `djwbwfyal`
- Upload Preset: `lumina_unsigned`

### 2. Firebase Auth Setup

Your Firebase Auth is already configured. Make sure you have:
- Created a user in Firebase Console → Authentication
- Email/password authentication enabled

### 3. Deploy

Upload all files to your web server or hosting platform.

## Files Structure

```
├── index.html              # Public website
├── admin.html              # Admin panel
├── admin.css              # Admin panel styles
├── admin-firebase.js      # Admin panel logic
├── firebase-config.js     # Firebase + storage configuration
├── cloudinary-config.js   # Cloudinary upload functions
├── local-storage.js       # LocalStorage data management
├── style.css              # Public website styles
├── script.js              # Public website logic
└── README.md              # This file
```

## Usage

### Admin Panel

1. Open `admin.html` in your browser
2. Log in with your Firebase credentials
3. Upload photos, organize into categories
4. Photos appear on your public website automatically

### Important Notes

#### Data Storage
- All photo metadata is stored in **localStorage** (in your browser)
- If you clear browser data, you'll lose the metadata (but images remain in Cloudinary)
- For multi-device management, use the same browser or export/import data

#### Photo Deletion
- Deleting from admin removes from website
- Images remain in Cloudinary (doesn't affect bandwidth)
- Manually clean up Cloudinary Media Library periodically if needed

#### Browser Compatibility
- Works in all modern browsers
- Requires localStorage support (all browsers since 2010)
- Best used from one primary browser/device

## Cloudinary Free Tier

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month

This is plenty for most photography portfolios!

## Troubleshooting

### Can't log in
- Check Firebase Console → Authentication
- Verify you created a user with email/password
- Check browser console for errors

### Photos don't upload
- Check Cloudinary dashboard
- Verify upload preset is "unsigned"
- Check browser console for errors

### Photos disappear
- Check if browser data was cleared
- LocalStorage data is browser-specific
- Consider exporting data periodically

## Advanced: Multi-Device Sync

Since data is stored in localStorage, it's tied to one browser. For multi-device access:

**Option 1**: Always use the same browser/device
**Option 2**: Manually export/import localStorage data
**Option 3**: Add Firestore later for cloud sync (requires Firebase setup)

## Support

- Cloudinary Docs: https://cloudinary.com/documentation
- Firebase Docs: https://firebase.google.com/docs

---

Built with ❤️ for photographers
