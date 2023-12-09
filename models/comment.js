const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    dateTime: {
        type: String, // Menggunakan tipe String
    default: () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

// Menambahkan metode untuk mendapatkan tanggal format singkat
commentSchema.methods.getShortFormattedDate = function() {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return this.dateTime.toLocaleDateString('en-US', options);
};

module.exports = mongoose.model('Comment', commentSchema);