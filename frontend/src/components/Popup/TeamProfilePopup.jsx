import React, { useState } from 'react';
import './TeamProfilePopup.css';
import { getColorForName } from '../../utils/colorUtils';

function TeamProfilePopup({ teamInfo, currentUserId, onClose, onUpdatedOrDeleted }) {
  const isManager = currentUserId === teamInfo.userId;
  const [name, setName] = useState(teamInfo.teamName);
  const [desc, setDesc] = useState(teamInfo.teamDesc);
  const [img, setImg] = useState(teamInfo.teamProfileImg);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${teamInfo.teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, teamName: name, teamDesc: desc, teamProfileImg: img }),
      });

      if (res.ok) {
        const updated = await res.json();
        alert('팀 정보가 수정되었습니다.');
        onUpdatedOrDeleted('update', updated);
        onClose();
      } else {
        const text = await res.text();
        alert('수정 실패: ' + text);
      }
    } catch (err) {
      console.error('수정 중 오류:', err);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('정말 이 팀에서 나가시겠습니까?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${teamInfo.teamId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (res.ok) {
        alert('팀에서 나갔습니다.');
        onUpdatedOrDeleted('leave', teamInfo.teamId);
        onClose();
      } else {
        const text = await res.text();
        alert('실패: ' + text);
      }
    } catch (err) {
      console.error('나가기 오류:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 팀을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${teamInfo.teamId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (res.ok) {
        alert('팀이 삭제되었습니다.');
        onUpdatedOrDeleted('delete', teamInfo.teamId);
        onClose();
      } else {
        const text = await res.text();
        alert('삭제 실패: ' + text);
      }
    } catch (err) {
      console.error('삭제 오류:', err);
    }
  };

  const renderProfileImage = () => {
    if (img?.trim()) {
      return <img src={img} alt="profile" className="team-profile-img" />;
    } else {
      const bgColor = getColorForName(name);
      const initial = name.charAt(0).toUpperCase();
      return <div className="team-default-avatar" style={{ backgroundColor: bgColor }}>{initial}</div>;
    }
  };

  return (
    <div className="team-popup-dim">
      <div className="team-popup-box">
        <button className="popup-close" onClick={onClose}>×</button>
        {renderProfileImage()}
        {isManager ? (
          <input className="team-name-input" value={name} onChange={e => setName(e.target.value)} />
        ) : (
          <div className="team-name-read">{name}</div>
        )}
        {isManager ? (
          <textarea className="team-desc-input" value={desc} onChange={e => setDesc(e.target.value)} />
        ) : (
          <div className="team-desc-read">{desc}</div>
        )}
        {isManager ? (
          <>
            <button className="team-save-btn" onClick={handleUpdate}>수정하기</button>
            <button className="team-delete-btn" onClick={handleDelete}>팀 스페이스 삭제</button>
          </>
        ) : (
          <button className="team-leave-btn" onClick={handleLeave}>팀 스페이스 나가기</button>
        )}
      </div>
    </div>
  );
}

export default TeamProfilePopup;