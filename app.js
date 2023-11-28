const ejsMate = require('ejs-mate')
const express = require('express');
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



// middleware untuk menangani suatu error
app.use((err,req,res,next)=>{
    res.status(500).send('Something broke')
})
app.listen(5000,()=>{
    console.log(`server is running on http://127.0.0.1:5000`)
})

