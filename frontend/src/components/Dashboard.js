import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { FaUsers, FaGraduationCap, FaChalkboardTeacher, FaBox } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    parents: 0,
    students: 0,
    classes: 0,
    subscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [parentsRes, studentsRes, classesRes, subscriptionsRes] = await Promise.all([
        axios.get('/api/parents'),
        axios.get('/api/students'),
        axios.get('/api/classes'),
        axios.get('/api/subscriptions')
      ]);

      setStats({
        parents: parentsRes.data.length,
        students: studentsRes.data.length,
        classes: classesRes.data.length,
        subscriptions: subscriptionsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Col md={3} className="mb-4">
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body className="text-center">
          <div className={`text-${color} mb-3`}>
            {icon}
          </div>
          <h3 className="fw-bold mb-1">
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              value
            )}
          </h3>
          <p className="text-muted mb-0">{title}</p>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container>
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">Tổng quan hệ thống quản lý lớp học</p>
      </div>

      <Row>
        <StatCard
          title="Phụ Huynh"
          value={stats.parents}
          icon={<FaUsers size={40} />}
          color="primary"
        />
        <StatCard
          title="Học Sinh"
          value={stats.students}
          icon={<FaGraduationCap size={40} />}
          color="success"
        />
        <StatCard
          title="Lớp Học"
          value={stats.classes}
          icon={<FaChalkboardTeacher size={40} />}
          color="warning"
        />
        <StatCard
          title="Gói Học"
          value={stats.subscriptions}
          icon={<FaBox size={40} />}
          color="info"
        />
      </Row>
    </Container>
  );
};

export default Dashboard; 