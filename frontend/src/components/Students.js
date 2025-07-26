import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Row,
  Col
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    current_grade: '',
    parent_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, parentsRes] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/parents')
      ]);
      setStudents(studentsRes.data);
      setParents(parentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent._id}`, formData);
        toast.success('Cập nhật học sinh thành công');
      } else {
        await axios.post('/api/students', formData);
        toast.success('Thêm học sinh thành công');
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({
        name: '',
        dob: '',
        gender: '',
        current_grade: '',
        parent_id: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Có lỗi xảy ra khi lưu học sinh');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      dob: student.dob.split('T')[0],
      gender: student.gender,
      current_grade: student.current_grade,
      parent_id: student.parent_id
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        toast.success('Xóa học sinh thành công');
        fetchData();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Có lỗi xảy ra khi xóa học sinh');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: '',
      dob: '',
      gender: '',
      current_grade: '',
      parent_id: ''
    });
  };

  const getParentName = (parentId) => {
    if (parentId && typeof parentId === 'object' && parentId.name) {
      return parentId.name;
    }
    if (parentId && typeof parentId === 'string') {
      const parent = parents.find(p => p._id === parentId);
      return parent ? parent.name : 'N/A';
    }    
    return 'N/A';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <FaGraduationCap className="me-2" />
            Quản Lý Học Sinh
          </h2>
          <p className="text-muted">Quản lý thông tin học sinh</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Thêm Học Sinh
        </Button>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Danh Sách Học Sinh</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : students.length === 0 ? (
            <Alert variant="info">
              Chưa có học sinh nào được thêm vào hệ thống.
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ Tên</th>
                  <th>Ngày Sinh</th>
                  <th>Giới Tính</th>
                  <th>Lớp Hiện Tại</th>
                  <th>Phụ Huynh</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{formatDate(student.dob)}</td>
                    <td>
                      <span className={`badge bg-${student.gender === 'Nam' ? 'primary' : 'danger'}`}>
                        {student.gender}
                      </span>
                    </td>
                    <td>{student.current_grade}</td>
                    <td>{getParentName(student.parent_id)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(student)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(student._id)}
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
            {editingStudent ? 'Chỉnh Sửa Học Sinh' : 'Thêm Học Sinh Mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ Tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày Sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giới Tính</Form.Label>
                  <Form.Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lớp Hiện Tại</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.current_grade}
                    onChange={(e) => setFormData({ ...formData, current_grade: e.target.value })}
                    placeholder="VD: Lớp 10A1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phụ Huynh</Form.Label>
              <Form.Select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                required
              >
                <option value="">Chọn phụ huynh</option>
                {parents.map(parent => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name} - {parent.phone}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingStudent ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Students; 