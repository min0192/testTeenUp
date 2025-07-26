const Parent = require('../models/Parent');

exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find();
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ error: 'Phụ huynh không tồn tại' });
    res.json(parent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createParent = async (req, res) => {
  try {
    const parent = new Parent(req.body);
    await parent.save();
    res.status(201).json(parent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parent) return res.status(404).json({ error: 'Phụ huynh không tồn tại' });
    res.json(parent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) return res.status(404).json({ error: 'Phụ huynh không tồn tại' });
    res.json({ message: 'Phụ huynh đã xóa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 