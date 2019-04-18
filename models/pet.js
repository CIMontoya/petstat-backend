const mongoose = require('mongoose')
const Schema = mongoose.Schema

const petSchema = new Schema({
   household_id: String,
   name: String,
   photoURI: String
})

module.exports = mongoose.model('Pet', petSchema)
