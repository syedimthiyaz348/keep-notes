const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    jwtToken : String,
})

module.exports = mongoose.model('users', userSchema)