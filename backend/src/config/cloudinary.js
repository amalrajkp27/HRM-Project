const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} fileName - Original file name
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, fileName, folder = 'hrm-resumes') => {
  return new Promise((resolve, reject) => {
    // Remove file extension from fileName for public_id
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'raw', // For non-image files
        public_id: `${Date.now()}-${fileNameWithoutExt.replace(/\s+/g, '-')}`,
        // IMPORTANT: Don't use use_filename or unique_filename when setting custom public_id
        // Otherwise Cloudinary will ignore our public_id and generate its own!
        use_filename: false,
        unique_filename: false
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} - Cloudinary delete result
 */
const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
