const express = require('express');
const router = express.Router();
const classRegistrationController = require('../controllers/classRegistrationController');

// Đăng ký học sinh vào lớp
router.post('/classes/:class_id/register', classRegistrationController.registerStudentToClass);

// Xóa học sinh khỏi lớp
router.delete('/classes/:class_id/students/:student_id', classRegistrationController.removeStudentFromClass);

router.get('/', classRegistrationController.getAllClassRegistrations);
router.get('/:id', classRegistrationController.getClassRegistrationById);
router.post('/', classRegistrationController.createClassRegistration);
router.put('/:id', classRegistrationController.updateClassRegistration);
router.delete('/:id', classRegistrationController.deleteClassRegistration);

module.exports = router; 