const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  day_of_week: { type: String, required: true },
  time_slot: { type: String, required: true },
  teacher_name: { type: String, required: true },
  max_students: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema); 