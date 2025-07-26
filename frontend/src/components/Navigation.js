import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaGraduationCap, FaChalkboardTeacher, FaBox, FaCalendarAlt } from 'react-icons/fa';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <FaGraduationCap className="me-2" />
          TeenUp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              <FaHome className="me-1" />
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/schedule" 
              className={isActive('/schedule') ? 'active' : ''}
            >
              <FaCalendarAlt className="me-1" />
              Lịch Học
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/parents" 
              className={isActive('/parents') ? 'active' : ''}
            >
              <FaUsers className="me-1" />
              Phụ Huynh
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/students" 
              className={isActive('/students') ? 'active' : ''}
            >
              <FaGraduationCap className="me-1" />
              Học Sinh
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/classes" 
              className={isActive('/classes') ? 'active' : ''}
            >
              <FaChalkboardTeacher className="me-1" />
              Lớp Học
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/subscriptions" 
              className={isActive('/subscriptions') ? 'active' : ''}
            >
              <FaBox className="me-1" />
              Gói Học
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 