import React, { useState } from 'react';
import './InvitePopup.css';

function InvitePopup({ teamId, teamName, onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,                    // ✅ 올바른 teamId 사용
          email: email.trim(),
        }),
      });
  
      // JSON 응답 본문을 먼저 추출
      const data = await response.json();
  
      if (!response.ok) {
        console.error('[서버 응답 오류]', data); // 🔍 로그 찍기
        throw new Error(data.message || '초대 전송 실패');
      }
  
      setMessage(`초대 링크가 전송되었습니다. 유효기간: ${new Date(data.expiresAt).toLocaleString()}`);
    } catch (err) {
      console.error('[초대 실패]', err); // 🔍 오류 내용 콘솔에 출력
      setMessage(err.message || '에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="invite-dim">
      <div className="invite-box">
        <button className="invite-close" onClick={onClose}>×</button>

        <h2 className="invite-title">
          이메일로&nbsp; <span className="tn">{teamName}</span> 에 초대하기
        </h2>

        <input
          type="email"
          placeholder="example@email.com"
          className="invite-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          className="invite-submit"
          onClick={sendInvite}
          disabled={loading}
        >
          {loading ? '전송 중...' : '전송'}
        </button>

        {message && <p className="invite-message">{message}</p>}
      </div>
    </div>
  );
}

export default InvitePopup;


