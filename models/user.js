const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose)
    // { usernameField: 'email' })
// userSchema.methods.verifyPassword = async function(candidatePassword) {
//     return this.authenticate(candidatePassword);
// };
module.exports = mongoose.model('User', userSchema);
