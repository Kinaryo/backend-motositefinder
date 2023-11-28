const ejsMate = require('ejs-mate')
const express = require('express');
const ErrorHandler = require('./utils/ErrorHandler')
const Joi = require('joi')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require ('path')
const app = express();
const wrapAsync = require('./utils/wrapAsync')


// models
const Motor = require('./models/motor')

// connect to mngodb
mongoose.connect('mongodb://127.0.0.1/motositefinder')
.then((result)=>{
    console.log('connected to mongodb')
}).catch((err)=>{
    console.log(err)
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

// middleware untuk mendapatkan data dari body 
app.use(express.urlencoded({extended:true}));
// mengubahmethod post menjadi method yang akan di pakai melalui query 
app.use(methodOverride('_method'))

app.get('/',(req,res)=>{
    res.render('home')
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  
  app.get('/pages', wrapAsync(async (req, res) => {
      let motors;
  
      // Handling search
      if (req.query.search) {
        const searchRegex = new RegExp(escapeRegex(req.query.search), 'gi');
        motors = await Motor.find({ title: searchRegex });
      } else {
        // Handling filter
        if (req.query.sortBy === 'terbaru') {
          motors = await Motor.find().sort({ dateTime: -1 });
        } else if (req.query.sortBy === 'terlama') {
          motors = await Motor.find().sort({ dateTime: 1 });
        } else {
          motors = await Motor.find();
        }
      }
  
      res.render('pages/index', { motors });
    })
  );




app.get('/pages', wrapAsync(async(req,res)=>{
    const motors = await Motor.find()
    res.render('pages/index', {motors})
}))

// create/form 
app.get('/pages/post', (req,res)=>{
    res.render('pages/post')
})

// submit post
app.post('/pages', wrapAsync(async(req,res,next)=>{
    const motorSchema = Joi.object({
        motor: Joi.object({
            title: Joi.string().required,
            licensePlate: Joi.string().required,
            model: Joi.string().required,
            description: Joi.string().required,
            dateTime: Joi.string().required,
            image: Joi.string().required,

        }).required()
    })

    const {error} = motorSchema.validate(req.body)
    if(error){
        console.log(error)
        return next(new ErrorHandler(error.details[0].message,400))
    }
    const motor = new Motor(req.body.motor)
    await motor.save()
    res.redirect('/pages')
    
}))

// details
app.get('/pages/:id', wrapAsync(async (req,res)=>{
    const {id} = req.params
    const motor = await Motor.findById(id)
    res.render('pages/detail',{motor})

}))

// menuju ke halaman edit 
app.get('/pages/:id/editForm',wrapAsync(async(req,res)=>{
    const motor = await Motor.findById(req.params.id);
    res.render('pages/editForm', {motor})
}))
// mengirim dari halaman edit
app.put('/pages/:id',wrapAsync(async(req,res)=>{
    const {id} = req.params
    const motor = await Motor.findByIdAndUpdate(id,{...req.body.motor})
    res.redirect('/pages')

}))

// delete motor 
app.delete('/pages/:id',wrapAsync(async(req,res)=>{
    await Motor.findByIdAndDelete(req.params.id)
    res.redirect('/pages')
}))


//melihat eror sementara 
app.all('*',(req,res,next)=>{
    next(new ErrorHandler('Page not Faund',404))
})

// middleware untuk menangani suatu error
app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = "oh no, Something went wrong"
    res.status(statusCode).render('error',{err})

})
app.listen(5000,()=>{
    console.log(`server is running on http://127.0.0.1:5000`)
})

