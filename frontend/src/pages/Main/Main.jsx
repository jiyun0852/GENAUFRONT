import React from 'react';
import './Main.css';
import { MdAccountCircle } from "react-icons/md";
import { LuBell } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { GoPlus } from "react-icons/go";

function MainPage() {
  return (
    <div className="main-background">

      {/* 왼쪽 세로 아이콘 그룹 */}
      <div className="left-icons">
        <div className="account-icon">
          <MdAccountCircle />
        </div>
        <div className="user-name">
          유저 이름
        </div>
        <div className="plus-icon">
          <GoPlus />
        </div>
      </div>

      {/* 좌측 하단 고정 아이콘들 */}
      <div className="fixed-icons">
        <LuBell className="icon" />
        <FiSettings className="icon" />
      </div>

      {/* 고정된 박스 */}
      <div className="fixed-box">
        <div className="main-content">
          <h1>
            좌측의 
            <button className="plus-button">
              <img src="/images/plus.png" alt="Plus Button" />
            </button>
            버튼을 이용하여 팀 스페이스를 생성하세요!
          </h1>
          <p>팀 스페이스에서 할 일을 공유하고 <br /> 성공적인 협업 경험을 쌓으세요!</p>
        </div>
      </div>

    </div>
  );
}

export default MainPage;


