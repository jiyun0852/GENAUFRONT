import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClickLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || '로그인 실패');  // 실패 시 토스트 메시지만 표시
        return;
      }

      toast.success('로그인 성공!');  // 성공 시 토스트 메시지만 표시
      navigate('/Main');
    } catch (err) {
      toast.error('서버 오류가 발생했어요.');  // 에러 시 토스트 메시지만 표시
    }
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <h2>GENAU로 똑똑하게 관리하세요!</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password-container">
            <Link to="/ResetPassword" className="forgot-password-button">
              비밀번호 재설정
            </Link>
          </div>

          <button type="button" onClick={onClickLogin}>
            로그인
          </button>
        </form>

        <div className="signup-container">
          <span>계정이 필요한가요?</span>
          <Link to="/Signup" className="signup-button">
            회원가입하기
          </Link>
        </div>
      </div>

      <ToastContainer
        className="toast-container"
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

export default Login;
