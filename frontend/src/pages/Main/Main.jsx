import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      <h1>환영합니다! 로그인 성공!</h1>
      <p>이곳은 더미 메인 페이지입니다.</p>
      <Link to="/login" className="logout-button">로그아웃</Link>
    </div>
  );
}

export default MainPage;
