import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/parents');
      setParents(response.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
      toast.error('Không thể tải danh sách phụ huynh');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingParent) {
        await axios.put(`/api/parents/${editingParent._id}`, formData);
        toast.success('Cập nhật phụ huynh thành công');
      } else {
        await axios.post('/api/parents', formData);
        toast.success('Thêm phụ huynh thành công');
      }
      setShowModal(false);
      setEditingParent(null);
      setFormData({ name: '', phone: '', email: '' });
      fetchParents();
    } catch (error) {
      console.error('Error saving parent:', error);
      toast.error('Có lỗi xảy ra khi lưu phụ huynh');
    }
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      name: parent.name,
      phone: parent.phone,
      email: parent.email
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ huynh này?')) {
      try {
        await axios.delete(`/api/parents/${id}`);
        toast.success('Xóa phụ huynh thành công');
        fetchParents();
      } catch (error) {
        console.error('Error deleting parent:', error);
        toast.error('Có lỗi xảy ra khi xóa phụ huynh');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingParent(null);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <FaUsers className="me-2" />
            Quản Lý Phụ Huynh
          </h2>
          <p className="text-muted">Quản lý thông tin phụ huynh học sinh</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Thêm Phụ Huynh
        </Button>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Danh Sách Phụ Huynh</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : parents.length === 0 ? (
            <Alert variant="info">
              Chưa có phụ huynh nào được thêm vào hệ thống.
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Email</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((parent, index) => (
                  <tr key={parent._id}>
                    <td>{index + 1}</td>
                    <td>{parent.name}</td>
                    <td>{parent.phone}</td>
                    <td>{parent.email}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(parent)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(parent._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingParent ? 'Chỉnh Sửa Phụ Huynh' : 'Thêm Phụ Huynh Mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Họ Tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingParent ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Parents; 