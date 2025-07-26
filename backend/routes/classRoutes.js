const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/', classController.getClassesByDay); // GET /api/classes?day={weekday}
router.get('/:id', classController.getClassById);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router; 