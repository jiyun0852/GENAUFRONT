import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyCode from './pages/VerifyCode/VerifyCode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpassword" element={<ResetPassword />} /> 
        <Route path="/verifycode" element={<VerifyCode />} />
      </Routes>
    </Router>
  );
}

export default App;
