import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Parents from './components/Parents';
import Students from './components/Students';
import Classes from './components/Classes';
import Subscriptions from './components/Subscriptions';
import Schedule from './components/Schedule';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/students" element={<Students />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App; 