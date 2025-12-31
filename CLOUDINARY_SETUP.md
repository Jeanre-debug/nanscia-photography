# Cloudinary Setup Instructions

Your admin portal has been configured to use **Cloudinary** instead of Firebase Storage for photo uploads. This gives you 25GB of free storage and automatic image optimization!

## Step 1: Create a Free Cloudinary Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up for a free account
3. Verify your email address
4. Log in to your Cloudinary dashboard

## Step 2: Get Your Cloud Name

1. Once logged in, you'll see your **Dashboard**
2. Look for the **Account Details** section
3. Copy your **Cloud Name** (it will look something like: `dxxxxxxxx` or `your-company-name`)

## Step 3: Create an Upload Preset

An upload preset allows your website to upload photos without exposing your API secret.

1. In your Cloudinary dashboard, click **Settings** (gear icon in the top right)
2. Navigate to the **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `lumina_unsigned` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** ⚠️ (This is important!)
   - **Folder**: `lumina-photos` (optional, keeps photos organized)
   - **Upload Manipulations** (optional but recommended):
     - **Quality**: Auto
     - **Format**: Auto (for automatic format optimization)
   - Leave other settings as default
6. Click **Save**
7. Copy the **preset name** you created

## Step 4: Configure Your Website

Now you need to add your Cloudinary credentials to your website:

1. Open the file: `cloudinary-config.js`
2. Find these lines near the top:

```javascript
const CLOUDINARY_CONFIG = {
    cloudName: 'YOUR_CLOUD_NAME',      // Replace with your Cloudinary cloud name
    uploadPreset: 'YOUR_UPLOAD_PRESET' // Replace with your unsigned upload preset
};
```

3. Replace the values:
   - `YOUR_CLOUD_NAME` → Your Cloud Name from Step 2
   - `YOUR_UPLOAD_PRESET` → Your preset name from Step 3

### Example:

```javascript
const CLOUDINARY_CONFIG = {
    cloudName: 'nanscia-photography',
    uploadPreset: 'lumina_unsigned'
};
```

4. **Save the file**

## Step 5: Test Your Setup

1. Open your admin panel in a browser
2. Log in with your Firebase credentials
3. Try uploading a photo
4. If successful, the photo should appear in:
   - Your admin panel gallery
   - Your Cloudinary dashboard under **Media Library**

## What Changed?

- ✅ Photos are now uploaded to **Cloudinary** (free 25GB tier)
- ✅ Automatic image optimization and CDN delivery
- ✅ Photo metadata still stored in **Firebase Firestore**
- ✅ Authentication still uses **Firebase Auth**
- ✅ No more Firebase Storage costs!

## Important Notes

### About Photo Deletion

Currently, when you delete a photo from the admin panel:
- ✅ The photo is removed from your website gallery (Firestore)
- ⚠️ The photo remains in Cloudinary (doesn't count against bandwidth)

**Why?** Client-side deletion from Cloudinary requires API credentials that should not be exposed in the browser.

**Solutions:**
1. **Recommended**: Periodically clean up unused photos from your Cloudinary Media Library manually
2. **Advanced**: Set up Cloudinary auto-cleanup rules in your dashboard
3. **For Developers**: Create a Firebase Cloud Function to handle secure deletion

### Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

For a photography portfolio, this should be more than enough! If you exceed limits, you'll be notified.

## Troubleshooting

### Upload fails with "Invalid preset"
- Make sure your upload preset is set to **Unsigned** mode
- Double-check the preset name matches exactly (case-sensitive)

### Upload fails with "Invalid cloud name"
- Verify your cloud name is correct (no typos)
- Don't include spaces or special characters

### Photos don't appear
- Check the browser console for errors (F12)
- Verify your Firebase Firestore is working
- Check your Cloudinary Media Library to see if photos uploaded

### Need help?
- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Cloudinary Support: Available in your dashboard

## What's Next?

Your admin portal is now ready to use! You can:
- Upload photos through the admin panel
- Organize photos into categories
- Manage your portfolio
- All photos will be automatically optimized for web performance

Enjoy your free 25GB of storage! 🎉
