import React from 'react';
import './ResetPassword.css'; 
import { Link } from 'react-router-dom';


function ResetPassword() {

  return (
    <div className="reset-password-background">
      <div className="reset-password-box">
        <h1>비밀번호 재설정</h1>
        <p>이메일로 인증 번호를 보내드립니다.</p>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          className="reset-email-input"
        />
        <Link to="/VerifyCode" className="reset-submit-button">
          인증 메일 보내기
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;

