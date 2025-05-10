import React, { useEffect, useRef, useState } from 'react';
import './Main.css';
import { LuBell } from 'react-icons/lu';
import { FiSettings } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import Popup from '../../components/Popup/Popup';
import MainIntro from '../../components/MainIntro/MainIntro';
import { useNavigate, useLocation } from 'react-router-dom';

const COLORS = ['#7A86D8', '#D88A7A', '#7AD8A3', '#D7D87A', '#B47AD8', '#7AD8D5', '#D87AB3'];

function getColorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function Main() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const scrollRef = useRef(null);
  const bmRef = useRef(null);
  const nav = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem('username') || '유저';
  const userId = Number(localStorage.getItem('userId') || 0);

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/users/${userId}/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error('팀 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const rows = [
    {
      id: null,
      name: userName,
      color: getColorForName(userName),
      onClick: () => nav('/Main'),
    },
    ...teams.map((t) => ({
      id: t.teamId,
      name: t.teamName,
      color: getColorForName(t.teamName),
      onClick: () => nav(`/team/${t.teamId}`),
    })),
  ];

  const syncBookmark = () => {
    if (!scrollRef.current || !bmRef.current) return;
    const idx = rows.findIndex((r) => {
      if (r.id === null) return location.pathname === '/Main';
      return location.pathname.includes(`/team/${r.id}`);
    });
    if (idx === -1) return;
    const target = scrollRef.current.querySelectorAll('.profile-row')[idx];
    if (!target) return;
    const bookmarkTop =
      target.offsetTop + (target.offsetHeight - bmRef.current.offsetHeight) / 2;
    bmRef.current.style.top = `${bookmarkTop}px`;
  };

  useEffect(syncBookmark, [location.pathname, teams]);
  const onScroll = () => syncBookmark();

  const togglePopup = () => setIsPopupOpen((o) => !o);
  const handleCreated = () => {
    fetchTeams(); // 팀 생성 후 목록 다시 로드
  };

  return (
    <div className="main-background">
      <div className="left-icons">
        <div className="bookmark-user-group">
          <div
            className="profile-scroll"
            ref={scrollRef}
            onScroll={onScroll}
            style={{ position: 'relative' }}
          >
            <div ref={bmRef} className="bookmark-shape" style={{ position: 'absolute', left: '-1.4vw' }} />
            <div className="profile-stack">
              {rows.map((r) => (
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
              <div className="profile-row plus-row" onClick={togglePopup}>
                <div className="user-icon-name">
                  <div className="plus-icon"><GoPlus /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-icons">
        <LuBell className="icon" />
        <FiSettings className="icon" />
      </div>

      <div className="fixed-box">
        <MainIntro onClick={togglePopup} />
      </div>

      {isPopupOpen && (
        <Popup onClose={togglePopup} onTeamCreated={handleCreated} />
      )}
    </div>
  );
}

export default Main;



