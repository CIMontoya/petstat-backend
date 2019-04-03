const mongoose = require('mongoose')
const Schema = mongoose.Schema

const houseSchema = new Schema({
   name: String,
   location: String,
   timezone: String
})

module.exports = mongoose.model('House', houseSchema)
