const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const motorSchema = new Schema ({
    title: String,
    licensePlate: String,
    model:String,
    description: String,
    dateTime:String,
    image: String

})

module.exports = mongoose.model ('Motor',motorSchema)