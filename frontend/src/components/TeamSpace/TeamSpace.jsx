import React, { useState, useEffect, useRef } from 'react';
import '../../pages/Main/Main.css';
import './TeamSpace.css';
import InvitePopup from '../../components/Popup/InvitePopup';
import TeamInfoPopup from '../../components/Popup/TeamProfilePopup';
import { LuBell, LuUserPlus } from 'react-icons/lu';
import { FiSettings } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { IoFileTrayFullOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { FaCrown } from 'react-icons/fa';
import Popup from '../Popup/Popup';
import { useParams, useNavigate } from 'react-router-dom';

const COLORS = ['#7A86D8', '#D88A7A', '#7AD8A3', '#D7D87A', '#B47AD8', '#7AD8D5', '#D87AB3'];
const getColorForName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

function TeamSpace() {
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const userId = Number(localStorage.getItem('userId') || 0);
  const userName = localStorage.getItem('username') || '유저';
  const { teamId } = useParams();
  const nav = useNavigate();

  const scrollRef = useRef(null);
  const bookmarkRef = useRef(null);
  const GUIDE_KEY = `genau:tutorialClosed:${teamId ?? 'global'}`;

  const fetchTeamsByUserId = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/users/${userId}/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error('팀 목록 로드 실패:', err);
    }
  };

  useEffect(() => {
    fetchTeamsByUserId();
  }, []);

  useEffect(() => {
    setActiveTeamId(Number(teamId));
  }, [teamId]);

  useEffect(() => {
    if (!localStorage.getItem(GUIDE_KEY)) {
      setShowGuide(true);
      setGuideStep(0);
    }
  }, [GUIDE_KEY]);

  useEffect(() => {
    if (showMembers && activeTeamId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${activeTeamId}/members`)
        .then(res => res.json())
        .then(data => {
          const sorted = data.sort((a, b) => (b.manager === true) - (a.manager === true));
          setMembers(sorted);
        });
    }
  }, [showMembers, activeTeamId]);

  const rows = [
    {
      id: null,
      name: userName,
      color: getColorForName(userName),
      onClick: () => {
        setActiveTeamId(null);
        nav('/Main');
      },
    },
    ...teams.map(team => ({
      id: team.teamId,
      name: team.teamName,
      color: getColorForName(team.teamName),
      onClick: () => {
        setActiveTeamId(team.teamId);
        nav(`/team/${team.teamId}`);
      },
      onContextMenu: (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${team.teamId}`)
          .then(res => res.json())
          .then(data => {
            setTeamInfo(data);
            setShowTeamInfo(true);
          });
      }
    }))
  ];

  const syncBookmark = () => {
    if (!scrollRef.current || !bookmarkRef.current) return;
    const idx = rows.findIndex(r => r.id === activeTeamId);
    const cell = scrollRef.current.querySelectorAll('.profile-row')[idx];
    if (!cell) return;
    bookmarkRef.current.style.top = `${cell.offsetTop + (cell.offsetHeight - bookmarkRef.current.offsetHeight) / 2}px`;
  };
  useEffect(syncBookmark, [activeTeamId, rows]);

  const onCreated = (team) => {
    fetchTeamsByUserId();
    nav(`/team/${team.teamId}`);
  };

  const handleUpdateOrDelete = () => {
    fetchTeamsByUserId();
    nav('/Main');
    setShowTeamInfo(false);
  };

  const nextGuide = () => (guideStep < 2 ? setGuideStep(s => s + 1) : closeGuide());
  const closeGuide = () => {
    localStorage.setItem(GUIDE_KEY, 'true');
    setShowGuide(false);
  };

  const guideClass = ['bubble-manage', 'bubble-file', 'bubble-people'][guideStep];

  return (
    <div className="main-background team-background">
      <div className="left-icons">
        <div className="bookmark-user-group">
          <div className="profile-scroll" ref={scrollRef}>
            <div ref={bookmarkRef} className="bookmark-shape" />
            <div className="profile-stack">
              {rows.map(r => (
                <div className="profile-row" key={r.id} onClick={r.onClick} onContextMenu={r.onContextMenu}>
                  <div className="user-icon-name">
                    <div className="profile-circle" style={{ backgroundColor: r.color }}>{r.name.charAt(0)}</div>
                    <div className="user-name">{r.name}</div>
                  </div>
                </div>
              ))}
              <div className="profile-row plus-row" onClick={() => setIsPopupOpen(true)}>
                <div className="user-icon-name"><div className="plus-icon"><GoPlus /></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="team-overlay">
        <div className="overlay-icons">
          <IoFileTrayFullOutline className="ov-icon" />
          <GoPeople className="ov-icon" onClick={() => setShowMembers(v => !v)} />
        </div>
      </div>

      {showMembers && (
        <>
          <div className="member-panel">
            {members.map((m, i) => (
              <div key={i} className="member-item">
                <div className="member-profile-circle" style={{ backgroundColor: getColorForName(m.userName) }}>
                  {m.userName[0]}
                </div>
                <div className="member-name">{m.userName} {m.manager && <FaCrown className="crown" />}</div>
              </div>
            ))}
          </div>
          <LuUserPlus className="invite-icon" onClick={() => setShowInvite(true)} />
        </>
      )}

      {isPopupOpen && <Popup onClose={() => setIsPopupOpen(false)} onTeamCreated={onCreated} />}
      {showInvite && <InvitePopup teamId={activeTeamId} teamName={rows.find(r => r.id === activeTeamId)?.name || ''} onClose={() => setShowInvite(false)} />}
      {showTeamInfo && teamInfo && <TeamInfoPopup teamInfo={teamInfo} currentUserId={userId} onClose={() => setShowTeamInfo(false)} onUpdatedOrDeleted={handleUpdateOrDelete} />}

      <div className="fixed-icons">
        <LuBell className="icon" /><FiSettings className="icon" />
      </div>
      <div className="fixed-box" />

      {showGuide && (
        <div className="guide-dim">
          <div className={`guide-bubble ${guideClass}`}>
            {guideStep === 0 && (<p>할 일을 카테고리화 할 수 있는 목록을<br />생성하고, 이름 변경·삭제를 할 수 있습니다.<br /><strong>1 / 3</strong></p>)}
            {guideStep === 1 && (<p>팀스페이스 내에서 업로드했던 모든 파일들을<br />확인하고 다시 다운로드 받을 수 있습니다.<br /><strong>2 / 3</strong></p>)}
            {guideStep === 2 && (<p>팀스페이스에 참여 중인 팀원들을 확인하고<br />초대 링크를 보낼 수 있습니다.<br /><strong>3 / 3</strong></p>)}
            <button className="guide-next" onClick={nextGuide}>
              {guideStep < 2 ? '다음 >>' : '종료'}
            </button>
          </div>
          <button className="guide-closeX" onClick={closeGuide}>×</button>
        </div>
      )}
    </div>
  );
}

export default TeamSpace;
