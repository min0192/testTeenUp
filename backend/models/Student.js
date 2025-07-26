const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  current_grade: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema); 