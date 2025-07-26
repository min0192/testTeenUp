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
  Badge,
  ProgressBar
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaBox, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    package_name: '',
    start_date: '',
    end_date: '',
    total_sessions: '',
    used_sessions: '0'
  });

  // Predefined package options
  const packageOptions = [
    { name: 'Gói 10 buổi', sessions: 10 },
    { name: 'Gói 20 buổi', sessions: 20 },
    { name: 'Gói 30 buổi', sessions: 30 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionsRes, studentsRes] = await Promise.all([
        axios.get('/api/subscriptions'),
        axios.get('/api/students')
      ]);
      setSubscriptions(subscriptionsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageChange = (packageName) => {
    const selectedPackage = packageOptions.find(pkg => pkg.name === packageName);
    setFormData({
      ...formData,
      package_name: packageName,
      total_sessions: selectedPackage ? selectedPackage.sessions.toString() : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        total_sessions: parseInt(formData.total_sessions),
        used_sessions: parseInt(formData.used_sessions)
      };

      if (editingSubscription) {
        await axios.put(`/api/subscriptions/${editingSubscription._id}`, dataToSend);
        toast.success('Cập nhật gói học thành công');
      } else {
        await axios.post('/api/subscriptions', dataToSend);
        toast.success('Thêm gói học thành công');
      }
      setShowModal(false);
      setEditingSubscription(null);
      setFormData({
        student_id: '',
        package_name: '',
        start_date: '',
        end_date: '',
        total_sessions: '',
        used_sessions: '0'
      });
      fetchData();
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast.error('Có lỗi xảy ra khi lưu gói học');
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    
    setFormData({
      student_id: subscription.student_id,
      package_name: subscription.package_name,
      start_date: subscription.start_date.split('T')[0],
      end_date: subscription.end_date.split('T')[0],
      total_sessions: subscription.total_sessions.toString(),
      used_sessions: subscription.used_sessions.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói học này?')) {
      try {
        await axios.delete(`/api/subscriptions/${id}`);
        toast.success('Xóa gói học thành công');
        fetchData();
      } catch (error) {
        console.error('Error deleting subscription:', error);
        toast.error('Có lỗi xảy ra khi xóa gói học');
      }
    }
  };

  const handleUseSession = async (id) => {
    try {
      await axios.patch(`/api/subscriptions/${id}/use`);
      toast.success('Đã sử dụng 1 buổi học');
      fetchData();
    } catch (error) {
      console.error('Error using session:', error);
      toast.error('Có lỗi xảy ra khi sử dụng buổi học');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSubscription(null);
    setFormData({
      student_id: '',
      package_name: '',
      start_date: '',
      end_date: '',
      total_sessions: '',
      used_sessions: '0'
    });
  };

  const getStudentName = (studentId) => {
    if (studentId && typeof studentId === 'object' && studentId.name) {
      return studentId.name;
    }
    if (studentId && typeof studentId === 'string') {
      const student = students.find(s => s._id === studentId);
      return student ? student.name : 'N/A';
    }
    return 'N/A';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getProgressPercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  const getStatusColor = (used, total) => {
    const percentage = getProgressPercentage(used, total);
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <FaBox className="me-2" />
            Quản Lý Gói Học
          </h2>
          <p className="text-muted">Quản lý các gói học tập của học sinh</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Thêm Gói Học
        </Button>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Danh Sách Gói Học</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : subscriptions.length === 0 ? (
            <Alert variant="info">
              Chưa có gói học nào được thêm vào hệ thống.
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Học Sinh</th>
                  <th>Gói Học</th>
                  <th>Thời Hạn</th>
                  <th>Buổi Học</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription, index) => (
                  <tr key={subscription._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{getStudentName(subscription.student_id)}</strong>
                    </td>
                    <td>{subscription.package_name}</td>
                    <td>
                      <div>
                        <small className="text-muted">Từ: {formatDate(subscription.start_date)}</small>
                        <br />
                        <small className="text-muted">Đến: {formatDate(subscription.end_date)}</small>
                        {isExpired(subscription.end_date) && (
                          <Badge bg="danger" className="ms-2">Hết hạn</Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="mb-2">
                        <small className="text-muted">
                          {subscription.used_sessions}/{subscription.total_sessions} buổi
                        </small>
                      </div>
                      <ProgressBar
                        variant={getStatusColor(subscription.used_sessions, subscription.total_sessions)}
                        now={getProgressPercentage(subscription.used_sessions, subscription.total_sessions)}
                        className="mb-1"
                      />
                    </td>
                    <td>
                      <Badge bg={getStatusColor(subscription.used_sessions, subscription.total_sessions)}>
                        {getProgressPercentage(subscription.used_sessions, subscription.total_sessions)}%
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleUseSession(subscription._id)}
                        disabled={subscription.used_sessions >= subscription.total_sessions}
                        title="Sử dụng buổi học"
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(subscription)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(subscription._id)}
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
            {editingSubscription ? 'Chỉnh Sửa Gói Học' : 'Thêm Gói Học Mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Học Sinh</Form.Label>
                  {editingSubscription ? (
                    <div>
                      <Form.Control
                        type="text"
                        value={getStudentName(editingSubscription.student_id)}
                        readOnly
                        className="mb-2"
                      />
                      <small className="text-muted">Không thể thay đổi học sinh khi chỉnh sửa</small>
                    </div>
                  ) : (
                    <Form.Select
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      required
                    >
                      <option value="">Chọn học sinh</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} - {student.current_grade}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gói Học</Form.Label>
                  <Form.Select
                    value={formData.package_name}
                    onChange={(e) => handlePackageChange(e.target.value)}
                    required
                  >
                    <option value="">Chọn gói học</option>
                    {packageOptions.map(pkg => (
                      <option key={pkg.name} value={pkg.name}>
                        {pkg.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày Bắt Đầu</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày Kết Thúc</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tổng Số Buổi Học</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.total_sessions}
                    onChange={(e) => setFormData({ ...formData, total_sessions: e.target.value })}
                    min="1"
                    max="100"
                    required
                    readOnly={formData.package_name !== ''}
                  />
                  {formData.package_name && (
                    <small className="text-muted">Tự động điền dựa trên gói học đã chọn</small>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Buổi Đã Sử Dụng</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.used_sessions}
                    onChange={(e) => setFormData({ ...formData, used_sessions: e.target.value })}
                    min="0"
                    max={formData.total_sessions || 100}
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
              {editingSubscription ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Subscriptions; 