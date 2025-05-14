import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyCode from './pages/VerifyCode/VerifyCode';
import Main from './pages/Main/Main';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import { ToastContainer } from 'react-toastify'; 
import TeamSpace from './components/TeamSpace/TeamSpace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpassword" element={<ResetPassword />} /> 
        <Route path="/verifycode" element={<VerifyCode />} />
        <Route path="/main" element={<Main />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/team/:teamId" element={<TeamSpace />} />
      </Routes>
    </Router>
  );
}

export default App;
