const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const ExpressError = require('../utils/ErrorHandler');

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: 'ddrepuzxq',
    api_key: '975887318657333',
    api_secret: '6nEulps4pij6EsX0RwMNZESg5gc'
});

// Konfigurasi penyimpanan Cloudinary untuk multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});

// Konfigurasi objek multer
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new ExpressError('only images are allowed.', 405));
        }
    }
});

module.exports = upload;
