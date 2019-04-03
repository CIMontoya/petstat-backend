const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activitySchema = new Schema({
   pet_id: String,
   activity: String,
   interval: String,
   onSchedule: Boolean,
   times: [String],
   dueDate: String
})

module.exports = mongoose.model('Activity', activitySchema)
