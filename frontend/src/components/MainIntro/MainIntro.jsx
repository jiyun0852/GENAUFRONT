// components/MainIntro.jsx
import React from 'react';
import './MainIntro.css';
import { GoPlus } from 'react-icons/go';

function MainIntro({ onClick }) {
  return (
    <div className="main-intro-box">
      <h1>
        좌측의
        <button className="circle-plus-button" onClick={onClick}>
          <GoPlus />
        </button>
        버튼을 이용하여 팀 스페이스를 생성하세요!
      </h1>
      <p>
        팀 스페이스에서 할 일을 공유하고 <br />
        성공적인 협업 경험을 쌓으세요!
      </p>
    </div>
  );
}

export default MainIntro;
