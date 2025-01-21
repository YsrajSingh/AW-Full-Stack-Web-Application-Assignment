const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Description: Upload image to Cloudinary
// Input: { buffer: Buffer } - Image buffer
// Output: { url: string } - URL of uploaded image
const uploadImage = async (file) => {
  try {
    // For development/testing, return a mock URL
    if (process.env.NODE_ENV === 'development') {
      return { url: `https://res.cloudinary.com/demo/image/upload/sample.jpg` };
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'posts' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = { uploadImage };