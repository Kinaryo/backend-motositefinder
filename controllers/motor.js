const Motor = require('../models/motor')
const fs = require('fs')
const ExpressError = require('../utils/ErrorHandler')

module.exports.index = async (req, res) => {
    const {id} = req.params
    const motors = await Motor.find(id)
    const msg = req.flash('succes_msg','motor fetched successfully')
     res.json({msg, motors });
  }

// search function 
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
module.exports.search = async (req, res) => {
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
  //   Mengirim data sebagai JSON
    res.json({ motors });
  }

module.exports.detail = async (req, res) => {
    const { id } = req.params;
    const motor = await Motor.findById(id)
    .populate({
      path : 'comments',
      populate:{
        path:'author'
      }
    })
    .populate('author')
console.log(motor)
    res.json({ motor });
}
// menuju halaman input data 
module.exports.form = (req, res) => {
    res.json({ message: 'Halaman new post' });
};

module.exports.store = async (req, res) => {
  try {
    // Dapatkan semua URL gambar dari req.files jika ada
    const imageUrls = req.files.map((file) => file.path);

    // Buat objek Motor dengan data dari req.body.motor
    const motorData = { ...req.body.motor, imageURL: imageUrls };

    // Buat instance Motor
    const motor = new Motor(motorData);

    // Simpan motor ke MongoDB
    motor.author = req.user._id
    await motor.save();

    res.json({ motor });
  } catch (error) {
    console.error('Error storing motor:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// module.exports.store = async (req, res) => {
//   try {
//     const imageUrl = req.file.path;
//     const motor = new Motor(req.body.motor);
//     motor.imageURL = imageUrl;
//     await motor.save();
//     res.json({ motor });
//   } catch (error) {
//     console.error('Error storing motor:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// async (req, res) => {
//   const images = req.files.map(file =>({
//     url : file.path,
//     filename : file.filename,
// }))
//     const motor = new Motor(req.body.motor);
//     motor.author = req.user._id;
//     motor.images = images
//     await motor.save();
//     req.flash('success_msg','Selamat, anda berhasil menambahkan data')
//     res.json({ message: 'Motor added successfully', motor });
// }


// menuju halaman edit 
module.exports.edit = async (req, res) => {
    const motor = await Motor.findById(req.params.id);
    res.json({ message: 'Halaman edit', motor });
};

// module.exports.update = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let motor = await Motor.findById(id);

//     if (!motor) {
//       return res.status(404).json({ error: 'Motor not found' });
//     }

//     motor.set(req.body.motor); // Use set method to update the motor object

//     // Check if req.file is defined before accessing its properties
//     if (req.file && req.file.path) {
//       const imageUrl = req.file.path;
//       motor.imageURL = imageUrl;
//     }

//     await motor.save();

//     req.flash('success_msg', 'Anda berhasil meng-update data');
//     res.json({ message: 'Motor updated successfully', motor });
//   } catch (error) {
//     console.error('Error updating motor:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

module.exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    let motor = await Motor.findById(id);

    if (!motor) {
      return res.status(404).json({ error: 'Motor not found' });
    }

    // Update data motor menggunakan set method
    motor.set(req.body.motor);

    // Check if req.file is defined before accessing its properties
    if (req.file && req.file.path) {
      const newImageUrl = req.file.path;
      motor.imageURL = newImageUrl;
    }

    // Simpan perubahan ke MongoDB
    await motor.save();

    // Flash message dapat ditampilkan melalui antarmuka pengguna (frontend)
    req.flash('success_msg', 'Data motor berhasil di-update');

    // Respon JSON dengan informasi motor yang telah di-update
    res.json({ message: 'Motor updated successfully', motor });
  } catch (error) {
    console.error('Error updating motor:', error.message);

    // Tanggapan kesalahan dengan lebih rinci
    res.status(500).json({ error: 'Failed to update motor', details: error.message });
  }
};




  // if(req.files && req.files.length >0 ){
  //     motor.images.forEach(image =>{
  //    fs.unlink(image.url, err => new ExpressError(err))
  //  })
  //      const images = req.files.map(file =>({
  //      url : file.path,
  //      filename: file.filename
  //  }));

  module.exports.destroy = async (req, res) => {
    try {
      const { id } = req.params;
      const motor = await Motor.findById(id);
  
      if (!motor) {
        return res.status(404).json({ error: 'Motor tidak ditemukan' });
      }
  
      // Pastikan motor.imageURL adalah array sebelum mencoba mengiterasinya
      if (Array.isArray(motor.imageURL) && motor.imageURL.length > 0) {
        await Promise.all(
          motor.imageURL.map(async (image) => {
            try {
              await fs.unlink(image);
            } catch (unlinkError) {
              // Tangani error unlink, misalnya log error tersebut
              console.error(`Error unlinking image: ${unlinkError.message}`);
            }
          })
        );
      }
  
      await motor.deleteOne();
  
      req.flash('success_msg', 'Data berhasil dihapus');
      res.json({ message: 'Motor berhasil dihapus' });
    } catch (error) {
      console.error('Error menghapus motor:', error.message);
      res.status(500).json({ error: 'Error Server Internal' });
    }
  };