import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';  // 아이콘 추가
import './AcceptInvitation.css';

function AcceptInvitation() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setError('유효하지 않은 접근입니다.');
      setLoading(false);
      return;
    }

    const fetchValidation = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/invitations/validate?token=${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });

        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

        const data = await res.json();
        if (data.valid) {
          setTeamId(data.teamId);
          setUserName(data.userName || data.email);
        } else {
          throw new Error('초대 링크가 만료되었거나 이미 사용되었습니다.');
        }

        const teamRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${data.teamId}`);
        if (!teamRes.ok) throw new Error('팀 정보를 불러오는 데 실패했습니다.');

        const teamData = await teamRes.json();
        setTeamName(teamData.teamName);
        setTeamDesc(teamData.teamDesc);
      } catch (err) {
        console.error('[VALIDATE ERROR]', err);
        setError(err.message || '유효성 확인 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchValidation();
  }, [params]);

  const handleAccept = async () => {
    const token = params.get('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || '수락에 실패했습니다.');
      }

      const result = await res.json();
      setTeamName(result.teamName);
      setTeamDesc(result.teamDesc);
      setTeamId(result.teamId);

      setAccepted(true);
      setShowWelcome(true);
    } catch (err) {
      console.error('[ACCEPT ERROR]', err);
      setError(err.message || '초대 수락 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="accept-wrapper">
      <div className="accept-box">
        {loading ? (
          <p className="accept-message">유효성 확인 중...</p>
        ) : error ? (
          <p className="accept-error">❌ {error}</p>
        ) : accepted && showWelcome ? (
          <div className="welcome-popup">
            <button
              className="welcome-close"
              onClick={() => {
                setShowWelcome(false);
                navigate(`/team/${teamId}`);
              }}
              aria-label="환영 팝업 닫기"
            >
              <IoClose />
            </button>
            <h3># <strong>{teamName}</strong>에 오신 걸 환영합니다!</h3>
            <p>{teamName}의 팀스페이스입니다.</p>
            <div className="welcome-desc">{teamDesc}</div>
          </div>
        ) : (
          <>
            <h2 className="accept-title">GENAU 팀 초대</h2>
            <p className="accept-message">
              <strong>{userName}</strong>님, <strong>{teamName}</strong>에 초대되었습니다.
            </p>
            <button className="accept-btn" onClick={handleAccept}>
              초대 수락하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AcceptInvitation;
