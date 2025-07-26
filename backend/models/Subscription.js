const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  package_name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  total_sessions: { type: Number, required: true },
  used_sessions: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema); 