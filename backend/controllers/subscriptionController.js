const Subscription = require('../models/Subscription');

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find().populate('student_id');
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id).populate('student_id');
    if (!sub) return res.status(404).json({ error: 'Gói học không tồn tại' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const sub = new Subscription(req.body);
    await sub.save();
    
    // Trả về subscription với populated student_id
    const populatedSub = await Subscription.findById(sub._id).populate('student_id');
    res.status(201).json(populatedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('student_id');
    if (!sub) return res.status(404).json({ error: 'Gói học không tồn tại' });
    res.json(sub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Gói học không tồn tại' });
    res.json({ message: 'Gói học đã xóa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.useSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await Subscription.findById(id);
    
    if (!sub) {
      return res.status(404).json({ error: 'Gói học không tồn tại' });
    }
    
    if (sub.used_sessions >= sub.total_sessions) {
      return res.status(400).json({ 
        error: 'Gói học đã hết buổi học. Không thể ghi nhận thêm buổi học.' 
      });
    }
    
    sub.used_sessions += 1;
    await sub.save();
    
    // Trả về subscription với populated student_id
    const populatedSub = await Subscription.findById(sub._id).populate('student_id');
    
    res.json({
      message: 'Ghi nhận buổi học thành công',
      subscription: populatedSub
    });
  } catch (err) {
    console.error('Use session error:', err);
    res.status(500).json({ 
      error: 'Lỗi khi ghi nhận buổi học: ' + err.message 
    });
  }
}; 