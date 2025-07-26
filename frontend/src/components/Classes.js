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
  Col,
  Badge
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    day_of_week: '',
    time_slot: '',
    teacher_name: '',
    max_students: ''
  });

  // Predefined subject options
  const subjectOptions = [
    'Toán',
    'Ngữ văn', 
    'Tiếng Anh',
    'Vật lý',
    'Hóa học',
    'Sinh học',
    'Lịch sử',
    'Địa lý',
    'Giáo dục công dân'
  ];

  // Predefined time slot options
  const timeSlotOptions = [
    { name: 'Tiết 1: 08:00-10:00', value: '08:00-10:00' },
    { name: 'Tiết 2: 10:15-12:15', value: '10:15-12:15' },
    { name: 'Tiết 3: 14:00-16:00', value: '14:00-16:00' },
    { name: 'Tiết 4: 16:15-18:15', value: '16:15-18:15' }
  ];

  // Day mapping for normalization
  const dayMapping = {
    'Monday': 'Thứ 2',
    'Tuesday': 'Thứ 3', 
    'Wednesday': 'Thứ 4',
    'Thursday': 'Thứ 5',
    'Friday': 'Thứ 6',
    'Saturday': 'Thứ 7',
    'Sunday': 'Chủ nhật',
    'Thứ 2': 'Thứ 2',
    'Thứ 3': 'Thứ 3',
    'Thứ 4': 'Thứ 4',
    'Thứ 5': 'Thứ 5',
    'Thứ 6': 'Thứ 6',
    'Thứ 7': 'Thứ 7',
    'Chủ nhật': 'Chủ nhật'
  };

  // Helper function to normalize day values
  const normalizeDay = (day) => {
    return dayMapping[day] || day;
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/classes');
      
      // Normalize day_of_week values
      const normalizedClasses = response.data.map(cls => ({
        ...cls,
        day_of_week: normalizeDay(cls.day_of_week)
      }));
      
      console.log('Original classes:', response.data);
      console.log('Normalized classes:', normalizedClasses);
      
      setClasses(normalizedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        max_students: parseInt(formData.max_students)
      };

      if (editingClass) {
        await axios.put(`/api/classes/${editingClass._id}`, dataToSend);
        toast.success('Cập nhật lớp học thành công');
      } else {
        await axios.post('/api/classes', dataToSend);
        toast.success('Thêm lớp học thành công');
      }
      setShowModal(false);
      setEditingClass(null);
      setFormData({
        name: '',
        subject: '',
        day_of_week: '',
        time_slot: '',
        teacher_name: '',
        max_students: ''
      });
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Có lỗi xảy ra khi lưu lớp học');
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      subject: classItem.subject,
      day_of_week: classItem.day_of_week,
      time_slot: classItem.time_slot,
      teacher_name: classItem.teacher_name,
      max_students: classItem.max_students.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await axios.delete(`/api/classes/${id}`);
        toast.success('Xóa lớp học thành công');
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
        toast.error('Có lỗi xảy ra khi xóa lớp học');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({
      name: '',
      subject: '',
      day_of_week: '',
      time_slot: '',
      teacher_name: '',
      max_students: ''
    });
  };

  const getDayColor = (day) => {
    const colors = {
      'Thứ 2': 'primary',
      'Thứ 3': 'success',
      'Thứ 4': 'warning',
      'Thứ 5': 'info',
      'Thứ 6': 'danger',
      'Thứ 7': 'secondary',
      'Chủ nhật': 'dark'
    };
    return colors[day] || 'light';
  };

  const getDayTextColor = (day) => {
    const colors = {
      'Thứ 2': 'text-primary',
      'Thứ 3': 'text-success',
      'Thứ 4': 'text-warning',
      'Thứ 5': 'text-info',
      'Thứ 6': 'text-danger',
      'Thứ 7': 'text-secondary',
      'Chủ nhật': 'text-dark'
    };
    return colors[day] || 'text-muted';
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <FaChalkboardTeacher className="me-2" />
            Quản Lý Lớp Học
          </h2>
          <p className="text-muted">Quản lý thông tin các lớp học</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Thêm Lớp Học
        </Button>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Danh Sách Lớp Học</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : classes.length === 0 ? (
            <Alert variant="info">
              Chưa có lớp học nào được thêm vào hệ thống.
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Lớp</th>
                  <th>Môn Học</th>
                  <th>Thời Gian</th>
                  <th>Giáo Viên</th>
                  <th>Số Học Sinh Tối Đa</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem, index) => (
                  <tr key={classItem._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{classItem.name}</strong>
                    </td>
                    <td>{classItem.subject}</td>
                    <td>
                      <Badge bg={getDayColor(classItem.day_of_week)} className="me-2">
                        {classItem.day_of_week}
                      </Badge>
                      <span className="fw-bold">{classItem.time_slot}</span>
                    </td>
                    <td>{classItem.teacher_name}</td>
                    <td>
                      <span className="badge bg-info">
                        <FaUsers className="me-1" />
                        {classItem.max_students}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(classItem)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(classItem._id)}
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
            {editingClass ? 'Chỉnh Sửa Lớp Học' : 'Thêm Lớp Học Mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên Lớp</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Lớp Toán 10A1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Môn Học</Form.Label>
                  <Form.Select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  >
                    <option value="">Chọn môn học</option>
                    {subjectOptions.map(subject => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày Trong Tuần</Form.Label>
                  <Form.Select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                    required
                  >
                    <option value="">Chọn ngày</option>
                    <option value="Thứ 2">Thứ 2</option>
                    <option value="Thứ 3">Thứ 3</option>
                    <option value="Thứ 4">Thứ 4</option>
                    <option value="Thứ 5">Thứ 5</option>
                    <option value="Thứ 6">Thứ 6</option>
                    <option value="Thứ 7">Thứ 7</option>
                    <option value="Chủ nhật">Chủ nhật</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời Gian</Form.Label>
                  <Form.Select
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    required
                  >
                    <option value="">Chọn thời gian</option>
                    {timeSlotOptions.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giáo Viên</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                    placeholder="Tên giáo viên"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số Học Sinh Tối Đa</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                    min="1"
                    max="50"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingClass ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Classes; 