import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '오류 발생');

      navigate('/VerifyCode', { state: { email } });
    } catch (err) {
      setPopupMessage(err.message);
    }
  };

  return (
    <div className="reset-password-background">
      <div className="reset-password-box">
        <h1>비밀번호 재설정</h1>
        <p>이메일로 인증 번호를 보내드립니다.</p>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          className="reset-email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="reset-submit-button" onClick={handleSendCode}>
          인증 번호 보내기
        </button>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage('')}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
