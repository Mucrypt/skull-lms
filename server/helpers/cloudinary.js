const cloudinary = require('cloudinary').v2;

// Configuring Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        return result;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Error uploading file to Cloudinary');
    }
};

const deleteMediaFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        throw new Error('Error deleting file from Cloudinary');
    }
};

module.exports = {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary,
};
