const ClassRegistration = require('../models/ClassRegistration');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Subscription = require('../models/Subscription');

exports.getAllClassRegistrations = async (req, res) => {
  try {
    const { class_id } = req.query;
    let query = {};
    
    // Nếu có class_id, filter theo class_id
    if (class_id) {
      query.class_id = class_id;
    }
    
    const regs = await ClassRegistration.find(query)
      .populate('class_id')
      .populate('student_id');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassRegistrationById = async (req, res) => {
  try {
    const reg = await ClassRegistration.findById(req.params.id).populate('class_id').populate('student_id');
    if (!reg) return res.status(404).json({ error: 'Đăng ký lớp không tồn tại' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createClassRegistration = async (req, res) => {
  try {
    const reg = new ClassRegistration(req.body);
    await reg.save();
    res.status(201).json(reg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateClassRegistration = async (req, res) => {
  try {
    const reg = await ClassRegistration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reg) return res.status(404).json({ error: 'Đăng ký lớp không tồn tại' });
    res.json(reg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClassRegistration = async (req, res) => {
  try {
    const reg = await ClassRegistration.findByIdAndDelete(req.params.id);
    if (!reg) return res.status(404).json({ error: 'Đăng ký lớp không tồn tại' });
    res.json({ message: 'Đăng ký lớp đã xóa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeStudentFromClass = async (req, res) => {
  try {
    const { class_id, student_id } = req.params;

    // Kiểm tra lớp tồn tại
    const classObj = await Class.findById(class_id);
    if (!classObj) {
      return res.status(404).json({ error: 'Lớp học không tồn tại' });
    }

    // Kiểm tra học sinh tồn tại
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Học sinh không tồn tại' });
    }

    // Tìm và xóa đăng ký
    const registration = await ClassRegistration.findOneAndDelete({
      class_id,
      student_id
    });

    if (!registration) {
      return res.status(404).json({ 
        error: 'Học sinh chưa đăng ký lớp này' 
      });
    }

    res.json({
      message: 'Đã xóa học sinh khỏi lớp thành công',
      removedRegistration: registration
    });

  } catch (err) {
    console.error('Remove student error:', err);
    res.status(500).json({ 
      error: 'Lỗi khi xóa học sinh khỏi lớp: ' + err.message 
    });
  }
};

exports.registerStudentToClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { student_id } = req.body;

    // Kiểm tra học sinh tồn tại
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Học sinh không tồn tại' });
    }

    // Kiểm tra lớp tồn tại
    const classObj = await Class.findById(class_id);
    if (!classObj) {
      return res.status(404).json({ error: 'Lớp học không tồn tại' });
    }

    // Kiểm tra học sinh đã đăng ký lớp này chưa
    const existingRegistration = await ClassRegistration.findOne({ 
      class_id, 
      student_id 
    });
    
    if (existingRegistration) {
      return res.status(400).json({ 
        error: 'Học sinh đã đăng ký lớp này rồi' 
      });
    }

    // Kiểm tra gói học của học sinh - sửa logic để tránh lỗi Cast
    const activeSubscriptions = await Subscription.find({
      student_id,
      end_date: { $gte: new Date() }
    }).populate('student_id');

    // Tìm gói học có buổi còn lại
    let activeSubscription = null;
    for (const sub of activeSubscriptions) {
      if (sub.used_sessions < sub.total_sessions) {
        activeSubscription = sub;
        break;
      }
    }

    if (!activeSubscription) {
      return res.status(400).json({ 
        error: 'Học sinh không có gói học đang hoạt động hoặc gói học đã hết hạn' 
      });
    }

    // Kiểm tra còn buổi học không
    const remainingSessions = activeSubscription.total_sessions - activeSubscription.used_sessions;
    if (remainingSessions <= 0) {
      return res.status(400).json({ 
        error: `Học sinh đã hết buổi học trong gói "${activeSubscription.package_name}". Cần mua thêm gói học để đăng ký lớp.` 
      });
    }

    // Lấy tất cả các đăng ký của học sinh này
    const studentRegistrations = await ClassRegistration.find({ 
      student_id 
    }).populate('class_id');

    // Kiểm tra trùng lịch
    const conflictingClass = studentRegistrations.find(reg => {
      if (!reg.class_id) return false;
      
      return reg.class_id.day_of_week === classObj.day_of_week && 
             reg.class_id.time_slot === classObj.time_slot;
    });

    if (conflictingClass) {
      return res.status(400).json({ 
        error: `Học sinh đã có lớp khác vào ${conflictingClass.class_id.day_of_week} lúc ${conflictingClass.class_id.time_slot}. Không thể đăng ký lớp ${classObj.name} vào cùng thời gian.` 
      });
    }

    // Kiểm tra sĩ số lớp
    const currentRegistrations = await ClassRegistration.countDocuments({ class_id });
    if (currentRegistrations >= classObj.max_students) {
      return res.status(400).json({ 
        error: `Lớp ${classObj.name} đã đầy (${currentRegistrations}/${classObj.max_students} học sinh)` 
      });
    }

    // Đăng ký học sinh vào lớp
    const newRegistration = new ClassRegistration({ 
      class_id, 
      student_id 
    });
    await newRegistration.save();

    // Trả về thông tin đăng ký với populate
    const populatedRegistration = await ClassRegistration.findById(newRegistration._id)
      .populate('class_id')
      .populate('student_id');

    res.status(201).json({
      message: 'Đăng ký thành công',
      registration: populatedRegistration,
      subscriptionInfo: {
        package_name: activeSubscription.package_name,
        remaining_sessions: remainingSessions,
        total_sessions: activeSubscription.total_sessions,
        used_sessions: activeSubscription.used_sessions
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: 'Lỗi khi đăng ký học sinh vào lớp: ' + err.message 
    });
  }
}; 