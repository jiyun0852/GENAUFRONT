import React from 'react';
import './Main.css';
import { MdAccountCircle } from "react-icons/md";
import { LuBell } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { GoPlus } from "react-icons/go";

function MainPage() {
  return (
    <div className="main-background">

      {/* Account 아이콘 */}
      <div className="account-icon">
        <MdAccountCircle size={110} />
      </div>
      <div className= "user-name">
        <p1>유저 이름</p1>
      </div>
      <div className="plus-icon">
        <GoPlus size={45} />
      </div>

      {/* 고정된 아이콘들 */}
      <div className="fixed-icons">
        <LuBell className="icon" size={40} />
        <FiSettings className="icon" size={40} />
      </div>

      {/* 고정된 우측 하단 박스 */}
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
