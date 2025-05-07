import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyCode from './pages/VerifyCode/VerifyCode';
import Main from './pages/Main/Main';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import TeamSpace from './components/TeamSpace/TeamSpace';
import AcceptInvitation from './components/AcceptInvitation/AcceptInvitation'; // 경로는 실제 위치에 맞게 수정


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
        <Route path="/invitations/validate" element={<AcceptInvitation />} />

      </Routes>
    </Router>
  );
}

export default App;
