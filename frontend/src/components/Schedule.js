import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaUserPlus, FaUserMinus, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classRegistrations, setClassRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClassForDetails, setSelectedClassForDetails] = useState(null);

  const weekDays = [
    { key: 'Monday', label: 'Thứ 2', color: 'primary', shortLabel: 'T2', aliases: ['Thứ 2', 'Monday', 'Thứ Hai', 'T2'] },
    { key: 'Tuesday', label: 'Thứ 3', color: 'success', shortLabel: 'T3', aliases: ['Thứ 3', 'Tuesday', 'Thứ Ba', 'T3'] },
    { key: 'Wednesday', label: 'Thứ 4', color: 'warning', shortLabel: 'T4', aliases: ['Thứ 4', 'Wednesday', 'Thứ Tư', 'T4'] },
    { key: 'Thursday', label: 'Thứ 5', color: 'info', shortLabel: 'T5', aliases: ['Thứ 5', 'Thursday', 'Thứ Năm', 'T5'] },
    { key: 'Friday', label: 'Thứ 6', color: 'danger', shortLabel: 'T6', aliases: ['Thứ 6', 'Friday', 'Thứ Sáu', 'T6'] },
    { key: 'Saturday', label: 'Thứ 7', color: 'secondary', shortLabel: 'T7', aliases: ['Thứ 7', 'Saturday', 'Thứ Bảy', 'T7'] },
    { key: 'Sunday', label: 'Chủ nhật', color: 'dark', shortLabel: 'CN', aliases: ['Chủ nhật', 'Sunday', 'Chủ Nhật', 'CN'] }
  ];

  const normalizeDayValue = (dayValue) => {
    if (!dayValue) return null;
    
    const normalized = dayValue.trim();
    
    // Find matching day
    for (const day of weekDays) {
      if (day.aliases.includes(normalized)) {
        return day.key;
      }
    }
    
    console.warn(`Unknown day value: "${dayValue}"`);
    return null;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching schedule data...');
      
      const [classesRes, studentsRes, registrationsRes] = await Promise.all([
        axios.get('/api/classes'),
        axios.get('/api/students'),
        axios.get('/api/classregistrations') // This will use getAllClassRegistrations
      ]);
      
      console.log('Classes data:', classesRes.data);
      console.log('Students data:', studentsRes.data);
      console.log('Registrations data:', registrationsRes.data);
      
      if (registrationsRes.data.length > 0) {
        console.log('Sample registration:', registrationsRes.data[0]);
        console.log('Registration student_id type:', typeof registrationsRes.data[0].student_id);
        console.log('Registration class_id type:', typeof registrationsRes.data[0].class_id);
      }
      
      const normalizedClasses = classesRes.data.map(cls => ({
        ...cls,
        day_of_week: normalizeDayValue(cls.day_of_week) || cls.day_of_week
      }));
      
      console.log('Normalized classes:', normalizedClasses);
      
      setClasses(normalizedClasses);
      setStudents(studentsRes.data);
      setClassRegistrations(registrationsRes.data);
      
      console.log('=== DAY MAPPING DEBUG ===');
      weekDays.forEach(day => {
        const dayClasses = normalizedClasses.filter(cls => cls.day_of_week === day.key);
        console.log(`${day.label} (${day.key}): ${dayClasses.length} classes`, dayClasses);
      });
      
      const allDayValues = [...new Set(normalizedClasses.map(cls => cls.day_of_week))];
      const mappedDays = weekDays.map(day => day.key);
      const unmappedDays = allDayValues.filter(day => day && !mappedDays.includes(day));
      if (unmappedDays.length > 0) {
        console.warn('⚠️ Unmapped day values found:', unmappedDays);
        console.warn('These classes will not display in the schedule');
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu lịch học');
    } finally {
      setLoading(false);
    }
  };

  const getClassesByDay = (day) => {
    console.log('getClassesByDay called with day:', day);
    console.log('All classes:', classes);
    
    const dayClasses = classes.filter(cls => {
      console.log('Checking class:', cls.name, 'day_of_week:', cls.day_of_week, 'against day:', day);
      return cls.day_of_week === day;
    });
    
    console.log(`Classes for ${day}:`, dayClasses);
    return dayClasses;
  };

  const getStudentsInClass = (classId) => {
    console.log('getStudentsInClass called with classId:', classId);
    console.log('All classRegistrations:', classRegistrations);
    
    const registrations = classRegistrations.filter(reg => {
      console.log('Checking registration:', reg);
      console.log('Registration class_id:', reg.class_id);
      console.log('Comparing with classId:', classId);
      
      if (typeof reg.class_id === 'string') {
        return reg.class_id === classId;
      } else if (reg.class_id && typeof reg.class_id === 'object') {
        return reg.class_id._id === classId;
      }
      return false;
    });
    
    console.log('Filtered registrations for class:', registrations);
    
    const studentNames = registrations.map(reg => {
      if (reg.student_id && typeof reg.student_id === 'object' && reg.student_id.name) {
        console.log('Found populated student:', reg.student_id);
        return reg.student_id.name;
      }
      const student = students.find(s => s._id === reg.student_id);
      console.log('Found student by ID:', student);
      return student ? student.name : 'N/A';
    });
    
    console.log(`Students in class ${classId}:`, studentNames);
    return studentNames;
  };

  const handleAddStudent = async () => {
    if (!selectedStudent || !selectedClass) return;

    try {
      const response = await axios.post(`/api/classregistrations/classes/${selectedClass._id}/register`, {
        student_id: selectedStudent
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.message) {
        toast.success(response.data.message);
      }
      
      setShowModal(false);
      setSelectedClass(null);
      setSelectedStudent('');
      fetchData();
    } catch (error) {
      console.error('Error adding student to class:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Có lỗi xảy ra khi thêm học sinh vào lớp');
      }
    }
  };

  const handleRemoveStudent = async (classId, studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) {
      try {
        await axios.delete(`/api/classregistrations/classes/${classId}/students/${studentId}`);
        toast.success('Xóa học sinh khỏi lớp thành công');
        fetchData();
      } catch (error) {
        console.error('Error removing student from class:', error);
        toast.error('Có lỗi xảy ra khi xóa học sinh khỏi lớp');
      }
    }
  };

  const getStudentIdByName = (studentName) => {
    const student = students.find(s => s.name === studentName);
    return student ? student._id : null;
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedClass(null);
    setSelectedStudent('');
  };

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedClassForDetails(null);
  };

  const openAddStudentModal = (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
  };

  const openDetailsModal = (classItem) => {
    setSelectedClassForDetails(classItem);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (!loading) {
      console.log('Current classes state:', classes);
      console.log('Total classes loaded:', classes.length);
    }
  }, [classes, loading]);

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="fw-bold">
          <FaCalendarAlt className="me-2" />
          Lịch Học Tuần
        </h2>
        <p className="text-muted">Quản lý lịch học theo tuần và danh sách học sinh trong lớp</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 text-muted">Đang tải dữ liệu lịch học...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-5">
          <Alert variant="warning">
            <h5>Chưa có lớp học nào</h5>
            <p className="mb-0">Vui lòng thêm lớp học trong trang "Lớp Học" để hiển thị lịch học.</p>
          </Alert>
        </div>
      ) : (
        <div className="schedule-container">
          <Row className="schedule-header mb-3">
            {weekDays.map((day) => (
              <Col key={day.key} className="schedule-column">
                <div className={`schedule-day-header bg-${day.color} text-white text-center py-2 rounded-top`}>
                  <div className="day-label fw-bold">{day.shortLabel}</div>
                  <div className="day-full-label small">{day.label}</div>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="schedule-content">
            {weekDays.map((day) => {
              const dayClasses = getClassesByDay(day.key);
              return (
                <Col key={day.key} className="schedule-column">
                  <div className={`schedule-day-content bg-${day.color} bg-opacity-10 border border-${day.color} border-opacity-25 rounded-bottom`}>
                    {dayClasses.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted mb-0 small">Không có lớp học</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {dayClasses.map((classItem) => {
                          const studentsInClass = getStudentsInClass(classItem._id);
                          return (
                            <div key={classItem._id} className="class-card mb-3 p-3 bg-white rounded shadow-sm">
                              <div className="class-header mb-2">
                                <h6 className="fw-bold text-primary mb-1">{classItem.name}</h6>
                                <div className="class-info small text-muted">
                                  <div>📚 {classItem.subject}</div>
                                  <div>⏰ {classItem.time_slot}</div>
                                  <div>👨‍🏫 {classItem.teacher_name}</div>
                                </div>
                              </div>

                              <div className="class-actions mb-2">
                                <div className="d-flex gap-1">
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => openAddStudentModal(classItem)}
                                    title="Thêm học sinh"
                                    className="btn-sm"
                                  >
                                    <FaUserPlus size={12} />
                                  </Button>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => openDetailsModal(classItem)}
                                    title="Xem chi tiết"
                                    className="btn-sm"
                                  >
                                    <FaEye size={12} />
                                  </Button>
                                </div>
                              </div>

                              <div className="students-section">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <h6 className="mb-0 small fw-bold">
                                    <FaUsers className="me-1" />
                                    Học sinh
                                  </h6>
                                  <Badge bg={studentsInClass.length >= classItem.max_students ? 'danger' : 'success'} className="small">
                                    {studentsInClass.length}/{classItem.max_students}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Học Sinh Vào Lớp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClass && (
            <div className="mb-3">
              <h6>Lớp: {selectedClass.name}</h6>
              <p className="text-muted mb-0">
                Môn: {selectedClass.subject} | Giáo viên: {selectedClass.teacher_name}
              </p>
            </div>
          )}
          <Form.Group>
            <Form.Label>Chọn Học Sinh</Form.Label>
            <Form.Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Chọn học sinh...</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.current_grade}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddStudent}
            disabled={!selectedStudent}
          >
            Thêm Học Sinh
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleDetailsModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi Tiết Lớp Học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClassForDetails && (
            <div>
              <div className="mb-4">
                <h5 className="text-primary">{selectedClassForDetails.name}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Môn học:</strong> {selectedClassForDetails.subject}</p>
                    <p><strong>Giáo viên:</strong> {selectedClassForDetails.teacher_name}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Thời gian:</strong> {selectedClassForDetails.time_slot}</p>
                    <p><strong>Ngày:</strong> {selectedClassForDetails.day_of_week}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h6>Danh Sách Học Sinh ({getStudentsInClass(selectedClassForDetails._id).length}/{selectedClassForDetails.max_students})</h6>
                {getStudentsInClass(selectedClassForDetails._id).length === 0 ? (
                  <Alert variant="info">
                    Chưa có học sinh nào trong lớp này.
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Họ Tên</th>
                          <th>Lớp Hiện Tại</th>
                          <th>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getStudentsInClass(selectedClassForDetails._id).map((studentName, index) => {
                          const studentId = getStudentIdByName(studentName);
                          const student = students.find(s => s._id === studentId);
                          
                          const registration = classRegistrations.find(reg => {
                            if (reg.class_id === selectedClassForDetails._id) {
                              if (reg.student_id && typeof reg.student_id === 'object' && reg.student_id.name === studentName) {
                                return true;
                              }
                              if (reg.student_id === studentId) {
                                return true;
                              }
                            }
                            return false;
                          });
                          
                          const studentDetails = registration && registration.student_id && typeof registration.student_id === 'object' 
                            ? registration.student_id 
                            : student;
                          
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{studentName}</td>
                              <td>{studentDetails ? studentDetails.current_grade : 'N/A'}</td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveStudent(selectedClassForDetails._id, studentId)}
                                  disabled={!studentId}
                                  title="Xóa học sinh khỏi lớp"
                                >
                                  <FaUserMinus size={12} />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailsModalClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Schedule; 