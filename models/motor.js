const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const motorSchema = new Schema ({
    title: String,
    licensePlate: String,
    model:String,
    description: String,
    dateTime: {
        type: Date, // Pastikan tipe datanya adalah Date
        default: Date.now,
      },
    image: String

})

module.exports = mongoose.model ('Motor',motorSchema)