const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
   password: String,
   userName: String,
   phoneNumber: String,
   fullName: String,
   location: String,
   status: Boolean,
   household_id: [String],
   name: String
})

module.exports = mongoose.model('User', userSchema)
