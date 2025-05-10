import React, { useState, useEffect } from 'react';
import './Popup.css';
import { useNavigate } from 'react-router-dom';

function Popup({ onClose, onTeamCreated }) {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId && !isNaN(storedId)) {
      setUserId(Number(storedId));
    } else {
      alert('로그인이 필요합니다.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId || !teamName.trim()) {
      alert('팀 이름과 사용자 정보가 필요합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          teamName: teamName.trim(),
          teamDesc: teamDescription.trim(),
          teamProfileImg: ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onTeamCreated) onTeamCreated(data);
        onClose();
        navigate(`/team/${data.teamId}`); // 팀 스페이스로 이동
      } else {
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
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="teamDescription">상세 설명:</label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                required
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
