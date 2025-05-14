import React, { useState, useEffect } from 'react';
import './Popup.css';  // 팝업 스타일을 따로 작성

function Popup({ onClose, onTeamCreated }) {
  const [teamName, setTeamName] = useState('');  // 팀 이름 상태
  const [teamDescription, setTeamDescription] = useState('');  // 상세 설명 상태
  const [userId, setUserId] = useState(null);    // 사용자 ID 상태

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const numericId = Number(storedId);

    if (storedId && !isNaN(numericId) && numericId > 0) {
      setUserId(numericId);
    } else {
      alert('로그인이 필요합니다.');
      onClose(); // 팝업 닫기
    }
  }, []);

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleTeamDescriptionChange = (event) => {
    setTeamDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('폼 제출 시도됨');
    console.log('입력된 팀 이름:', teamName);
    console.log('입력된 설명:', teamDescription);
    console.log('userId:', userId);

    if (!userId || !teamName.trim()) {
      alert('팀 이름과 사용자 정보가 필요합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          teamName: teamName.trim(),
          teamDesc: teamDescription.trim(),
          teamProfileImg: ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('팀 생성 성공:', data);
        if (onTeamCreated) onTeamCreated(data);
        onClose();
      } else {
        console.error('팀 생성 실패 응답:', data);
        alert(data.message || data.error || '팀 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('팀 생성 중 예외 발생:', err);
      alert('서버 오류가 발생했습니다.');
    }
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


