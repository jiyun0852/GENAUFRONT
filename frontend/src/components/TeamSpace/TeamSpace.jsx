import React, { useState, useEffect, useRef } from 'react';
import '../../pages/Main/Main.css';
import './TeamSpace.css';
import { LuBell } from 'react-icons/lu';
import { FiSettings } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import Popup from '../Popup/Popup';
import { IoFileTrayFullOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function TeamSpace() {
  /* ==== 상태 ==== */
  const [teams, setTeams]             = useState([]);      // 서버 DB 기준 리스트
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /* ==== 튜토리얼 ==== */
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const { teamId } = useParams();
  const nav        = useNavigate();
  const GUIDE_KEY  = `genau:tutorialClosed:${teamId ?? 'global'}`;

  /* ==== refs ==== */
  const scrollRef   = useRef(null);
  const bookmarkRef = useRef(null);

  /* ==== 서버에서 팀 목록 동기화 ==== */
  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/teams`, { credentials:'include' });
      if(!res.ok) return;
      const data = await res.json();       // [{teamId,teamName,...}, ...]
      setTeams(data);
      localStorage.setItem('teams', JSON.stringify(data)); // 캐시용
    } catch(e){ console.error('팀 리스트 불러오기 실패', e); }
  };

  useEffect(() => {
    fetchTeams();                           // 최초 로드
    const timer = setInterval(fetchTeams, 5000); // 5초마다 폴링 – 삭제 즉시 반영
    return () => clearInterval(timer);
  }, []);

  /* ==== URL 변경 시 activeId 반영 ==== */
  useEffect(()=>{ setActiveTeamId(Number(teamId)); },[teamId]);

  /* ==== 튜토리얼 표시 여부 ==== */
  useEffect(()=>{ if(!localStorage.getItem(GUIDE_KEY)){setShowGuide(true);setGuideStep(0);} },[GUIDE_KEY]);
  const nextGuide = ()=> guideStep<2?setGuideStep(s=>s+1):closeGuide();
  const closeGuide=()=>{localStorage.setItem(GUIDE_KEY,'true');setShowGuide(false);} ;

  /* ==== 좌측 목록 & 북마크 ==== */
  const username = localStorage.getItem('username') || '유저';
  const rows = [ {id:null,name:username,color:'#8888ff',onClick:()=>{setActiveTeamId(null);nav('/Main');}},
                 ...teams.map(t=>({id:t.teamId,name:t.teamName,color:'#fff',onClick:()=>{setActiveTeamId(t.teamId);nav(`/team/${t.teamId}`);} })) ];

  const syncBookmark =()=>{
    if(!scrollRef.current||!bookmarkRef.current) return;
    const idx = rows.findIndex(r=>r.id===activeTeamId);
    const trg = scrollRef.current.querySelectorAll('.profile-row')[idx];
    if(trg) bookmarkRef.current.style.top = `${trg.offsetTop+(trg.offsetHeight-bookmarkRef.current.offsetHeight)/2}px`;
  };
  useEffect(syncBookmark,[activeTeamId,rows]);

  /* ==== 팀 생성 팝업 ==== */
  const togglePopup = ()=> setIsPopupOpen(o=>!o);
  const onCreated =()=> fetchTeams();   // 새 팀 생성 후 서버에서 다시 불러오기

  /* ==== 튜토리얼 클래스 ==== */
  const guideClass = ['bubble-manage','bubble-file','bubble-people'][guideStep];

  return (
    <div className="main-background team-background">
      {/* 좌측 팀 목록 */}
      <div className="left-icons">
        <div className="bookmark-user-group">
          <div className="profile-scroll" ref={scrollRef} onScroll={syncBookmark} style={{position:'relative'}}>
            <div ref={bookmarkRef} className="bookmark-shape"/>
            <div className="profile-stack">
              {rows.map(r=>(
                <div className="profile-row" key={r.id} onClick={r.onClick}>
                  <div className="user-icon-name">
                    <div className="profile-circle" style={{backgroundColor:r.color}}>{r.name[0].toUpperCase()}</div>
                    <div className="user-name">{r.name}</div>
                  </div>
                </div>))}
              <div className="profile-row plus-row" onClick={togglePopup}><div className="user-icon-name"><div className="plus-icon"><GoPlus/></div></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* 상단 바 */}
      <div className="team-overlay"><div className="overlay-icons"><IoFileTrayFullOutline className="ov-icon file-btn"/><GoPeople className="ov-icon people-btn"/></div></div>

      {/* 고정 아이콘 & 박스 */}
      <div className="fixed-icons"><LuBell className="icon"/><FiSettings className="icon"/></div>
      <div className="fixed-box"/>

      {/* 목록 관리 */}
      <button className="manage-btn list-btn">목록 관리하기&nbsp;+</button>

      {/* 튜토리얼 */}
      {showGuide && (
        <div className="guide-dim">
          <div className="guide-topbar"><span className="guide-label">도움말 끄기</span><button className="guide-closeX" onClick={closeGuide}>×</button></div>
          <div className={`guide-bubble ${guideClass}`}>
            {guideStep===0&&(<p>할 일을 카테고리화 할 수 있는 목록을<br/>생성하고, 이름 변경·삭제를 할 수 있습니다.<br/><strong>1 / 3</strong></p>)}
            {guideStep===1&&(<p>팀스페이스 내에서 업로드했던 모든 파일들을<br/>확인하고 다시 다운로드 받을 수 있습니다.<br/><strong>2 / 3</strong></p>)}
            {guideStep===2&&(<p>팀스페이스에 참여 중인 팀원들을 확인하고<br/>초대 링크를 보낼 수 있습니다.<br/><strong>3 / 3</strong></p>)}
            <button className="guide-next" onClick={nextGuide}>{guideStep<2?'다음 >>':'종료'}</button>
          </div>
        </div>)}

      {/* 팀 생성 팝업 */}
      {isPopupOpen && <Popup onClose={togglePopup} onTeamCreated={onCreated}/>}
    </div>
  );
}
export default TeamSpace;











