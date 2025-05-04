import React, { useState } from 'react';
import './Popup.css';  // 팝업 스타일을 따로 작성

function Popup({ onClose }) {
  const [teamName, setTeamName] = useState('');  // 팀 이름 상태
  const [teamDescription, setTeamDescription] = useState('');  // 상세 설명 상태

  // 팀 이름 변경 핸들러
  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  // 상세 설명 변경 핸들러
  const handleTeamDescriptionChange = (event) => {
    setTeamDescription(event.target.value);
  };

  // 폼 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();
    // 팀 이름과 설명을 콘솔에 출력하거나 필요한 작업을 수행
    console.log('팀 이름:', teamName);
    console.log('상세 설명:', teamDescription);
    // 폼 제출 후 팝업 닫기
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>팀 스페이스 생성</h2>
          <button onClick={onClose} className="close-btn">X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="popup-content">
            <div className="input-group">
              <label htmlFor="teamName">팀 이름:</label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={handleTeamNameChange}
                required
                placeholder="팀 이름을 입력하세요"
              />
            </div>
            <div className="input-group">
              <label htmlFor="teamDescription">상세 설명:</label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={handleTeamDescriptionChange}
                required
                placeholder="팀에 대한 설명을 입력하세요"
              />
            </div>
            <button type="submit" className="submit-btn">팀 생성</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Popup;
