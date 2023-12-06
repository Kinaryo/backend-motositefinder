const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const constrollersMotor = require('../controllers/motor')
const ErrorHandler = require('../utils/ErrorHandler');
const isValidObjectId = require('../middlewares/isValidObjectId')
const isAuth = require('../middlewares/isAuth')
const isAuthor = require('../middlewares/isAuthor')
const upload = require('../config/multer')
const Motor = require('../models/motor')
const {isAuthorMotor}  = require('../middlewares/isAuthor')
const {validateMotor} = require('../middlewares/validator')
// model
const router = express.Router();
// schema


router.post('/upload',isAuth, upload.single('image'),validateMotor,wrapAsync( async (req, res) => {
    // Handle logic setelah gambar diunggah ke Cloudinary
    const imageUrl = await req.file.path; // path gambar di Cloudinary
    const motor = new Motor(req.body.motor);
    motor.author = req.user._id;
    motor.imageURL = imageUrl;
    await motor.save();
    res.json({motor});
}));
router.get('/Searchpages', wrapAsync(constrollersMotor.search));
//  mendapatkan semua data motor dalam bentuk JSON
router.get('/', wrapAsync(constrollersMotor.index));
// mendapatkan detail motor berdasarkan ID dalam bentuk JSON
router.get('/detail/:id',isValidObjectId('/motors'),wrapAsync(constrollersMotor.detail));
// menuju halaman new data motor 
router.get('/create/form', isAuth, constrollersMotor.form ) 
// Menambahkan data motor baru dalam bentuk JSON
router.post('/create/form/motor',isAuth,upload.array('image',5), validateMotor, wrapAsync(constrollersMotor.store));
// masuk halaman edit
router.get('/:id/edit',isAuth,isAuthorMotor, isValidObjectId('/motors'),wrapAsync(constrollersMotor.edit))
// Mengupdate data motor berdasarkan ID dalam bentuk JSON
router.put('/:id/edit/update',isAuth,upload.array('image',5),isAuthorMotor,isValidObjectId('/motors'), validateMotor, wrapAsync(constrollersMotor.update));
// menghapus data motor berdasarkan ID dalam bentuk JSON
router.delete('/:id',isAuth,isAuthorMotor,isValidObjectId('/motors'), wrapAsync(constrollersMotor.destroy));

module.exports = router;