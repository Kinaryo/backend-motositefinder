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



router.get('/search', isAuth,wrapAsync(constrollersMotor.search));
//  mendapatkan semua data motor dalam bentuk JSON
router.get('/', isAuth,wrapAsync(constrollersMotor.index));
// mendapatkan detail motor berdasarkan ID dalam bentuk JSON
router.get('/detail/:id', isAuth, isValidObjectId('/motors'),wrapAsync(constrollersMotor.detail));
// menuju halaman new data motor 
// router.get('/create/', isAuth, constrollersMotor.form ) 
router.get('/create/', isAuth, constrollersMotor.form ) 
// Menambahkan data motor baru dalam bentuk JSON
// router.post('/create/upload',isAuth, upload.single('image'),validateMotor,wrapAsync( constrollersMotor.store));
router.post('/create/upload',isAuth, upload.array('image', 5),wrapAsync( constrollersMotor.store));
// masuk halaman edit
// router.get('/:id/edit',isAuth,isAuthorMotor, isValidObjectId('/motors'),wrapAsync(constrollersMotor.edit))
router.get('/:id/edit',isAuth,isAuthorMotor, isValidObjectId('/motors'),wrapAsync(constrollersMotor.edit))
// Mengupdate data motor berdasarkan ID dalam bentuk JSON
// router.put('/:id/edit/update',isAuth,upload.array('image',5),isAuthorMotor,isValidObjectId('/motors'), validateMotor, wrapAsync(constrollersMotor.update));
router.put('/:id/edit/update',isAuth,upload.array('image', 5),isValidObjectId('/motors'), validateMotor, wrapAsync(constrollersMotor.update));
// menghapus data motor berdasarkan ID dalam bentuk JSON
// router.delete('/:id',isAuth,isAuthorMotor,isValidObjectId('/motors'), wrapAsync(constrollersMotor.destroy));
// menghapus data motor berdasarkan ID dalam bentuk JSON
router.delete('/:id/deleted',isAuth,isAuthorMotor,isValidObjectId('/motors'), wrapAsync(constrollersMotor.destroy));

module.exports = router;