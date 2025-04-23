import React, { useEffect, useState } from 'react';
import './VerifyCode.css';

function VerifyCode() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    console.log('입력한 코드:', code);
  };

  // 카운트다운 시작
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="verify-code-background">
      <div className="verify-code-box">
        <h1>인증 코드 입력</h1>
        <p>이메일로 받은 인증 코드를 입력하세요.</p>
        <input
          type="text"
          placeholder="6자리 인증 코드"
          maxLength={6}
          value={code}
          onChange={handleInputChange}
          className="verify-code-input"
        />

        {/* 타이머 추가 */}
        <div className="countdown-timer">남은 시간: {formatTime(timeLeft)}</div>

        <button className="verify-submit-button" onClick={handleSubmit}>
          인증 코드 확인
        </button>
      </div>
    </div>
  );
}

export default VerifyCode;
