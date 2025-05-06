import React, { useState } from 'react';
import './InvitePopup.css';

function InvitePopup({ teamName, onClose }) {
  const [email, setEmail] = useState('');

  const sendInvite = () => {
    if (!email.trim()) return;
    // TODO: fetch‑POST(`/teams/${teamName}/invite`, {email})
    console.log(`invite ${email} to ${teamName}`);
    onClose();
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

        <button className="invite-submit" onClick={sendInvite}>전송</button>
      </div>
    </div>
  );
}

export default InvitePopup;
