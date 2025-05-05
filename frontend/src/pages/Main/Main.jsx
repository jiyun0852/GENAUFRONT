import React, { useState, useEffect, useRef } from 'react';
import './Main.css';
import { LuBell } from 'react-icons/lu';
import { FiSettings } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import Popup from '../../components/Popup/Popup';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [teams,        setTeams]        = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);

  const scrollRef = useRef(null);   // 스크롤 컨테이너
  const bmRef     = useRef(null);   // bookmark DOM

  const nav = useNavigate();

  /* 1) 초기 팀 목록 로드 */
  useEffect(() => {
    setTeams(JSON.parse(localStorage.getItem('teams')) || []);
  }, []);

  /* 2) 프로필(행) 데이터 배열 */
  const userName = localStorage.getItem('username') || '유저';
  const rows = [
    { id: null, name: userName, color: '#8888ff', onClick: () => setActiveTeamId(null) },
    ...teams.map(t => ({
      id: t.teamId,
      name: t.teamName,
      color: '#ffffff',
      onClick: () => { setActiveTeamId(t.teamId); nav(`/team/${t.teamId}`); }
    }))
  ];

  /* 3) bookmark 위치 계산 (행 중앙 ↔ bookmark 중앙) */
  const syncBookmark = () => {
    if (!scrollRef.current || !bmRef.current) return;
    const idx = rows.findIndex(r => r.id === activeTeamId);
    const target = scrollRef.current.querySelectorAll('.profile-row')[idx];
    if (!target) return;

    const bookmarkTop =
      target.offsetTop +
      (target.offsetHeight - bmRef.current.offsetHeight) / 2; // 행 중앙
    bmRef.current.style.top = `${bookmarkTop}px`;              // 컨테이너 기준
  };
  useEffect(syncBookmark, [activeTeamId, teams]);
  const onScroll = () => syncBookmark();

  /* 4) 팀 생성 Pop‑up */
  const togglePopup = () => setIsPopupOpen(o => !o);
  const handleCreated = t => {
    const updated = [...teams, t];
    setTeams(updated);
    localStorage.setItem('teams', JSON.stringify(updated));
  };

  /* 5) 렌더 */
  return (
    <div className="main-background">
      <div className="left-icons">
        <div className="bookmark-user-group">
          {/* 스크롤 컨테이너: relative → bookmark 절대좌표 기준 */}
          <div
            className="profile-scroll"
            ref={scrollRef}
            onScroll={onScroll}
            style={{ position: 'relative' }}
          >
            {/* bookmark  ─ scroll 안에 두어 영역 밖으로 나가면 숨김 */}
            <div
              ref={bmRef}
              className="bookmark-shape"
              style={{ position: 'absolute', left: '-1.4vw' }}
            />

            <div className="profile-stack">
              {rows.map(r => (
                <div className="profile-row" key={r.id} onClick={r.onClick}>
                  <div className="user-icon-name">
                    <div
                      className="profile-circle"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-name">{r.name}</div>
                  </div>
                </div>
              ))}
              {/* 플러스 버튼 */}
              <div className="profile-row plus-row" onClick={togglePopup}>
                <div className="user-icon-name">
                  <div className="plus-icon">
                    <GoPlus />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 우측 하단 고정 아이콘 */}
      <div className="fixed-icons">
        <LuBell className="icon" />
        <FiSettings className="icon" />
      </div>

      <div className="fixed-box" />
      {isPopupOpen && (
        <Popup onClose={togglePopup} onTeamCreated={handleCreated} />
      )}
    </div>
  );
}

export default Main;
