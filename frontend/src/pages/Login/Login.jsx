import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {

  return (
    <div className="login-background">
      <div className="login-box">
        <h2>GENAU로 똑똑하게 관리하세요!</h2>
        <form>
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" placeholder="이메일을 입력하세요" />

          <label htmlFor="password">비밀번호</label>
          <input id="password" type="password" placeholder="비밀번호를 입력하세요" />

          <div className="forgot-password-container">
            <Link to="/ResetPassword" className="forgot-password-button">
            비밀번호 재설정
            </Link>
          </div>

          <button type="submit">로그인</button>
        </form>
      
        <div className="signup-container">
          <span>계정이 필요한가요?</span>
          <Link to="/Signup" className="signup-button">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
