const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'blog_images',
  });
  fs.unlinkSync(filePath);
  return result.secure_url;
};


const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return { success: true, result };
    } else {
      return { success: false, result };
    }
  } catch (err) {
    throw err;
  }
};


module.exports = { uploadToCloudinary, deleteFromCloudinary };
