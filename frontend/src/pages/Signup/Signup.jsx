import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPwValid] = useState(false);
  const [pwMatchValid, setPwMatchValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  const handleUsername = (e) => setUsername(e.target.value);

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(value));
  };

  const handleAuthCode = (e) => {
    setAuthCode(e.target.value);
  };

  const handlePw = (e) => {
    const value = e.target.value;
    setPassword(value);
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{8,20}$/;
    setPwValid(regex.test(value));
  };

  const handleConfirmPw = (e) => {
    const value = e.target.value;
    setConfirmPw(value);
    setPwMatchValid(password === value);
  };

  const onClickConfirmButton = () => {
    alert('회원가입이 완료되었습니다.');
  };

  useEffect(() => {
    if (emailValid && passwordValid && pwMatchValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailValid, passwordValid, pwMatchValid]);

  return (
    <div className="background">
      <div className="page">
        <div className="titleWrap">이메일과 비밀번호를 입력해주세요</div>

        <div className="contentWrap">

          {/* 이메일 주소 */}
          <div className="inputTitle">이메일 주소</div>
          <div className="inputWrap">
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmail}
            />
          </div>
          {!emailValid && email.length > 0 && (
            <div className="errorMessageWrap">올바른 이메일을 입력해주세요.</div>
          )}

          {/* 인증코드 입력란 및 버튼 */}
          {emailValid && (
            <>
              <div className="inputTitle">인증코드</div>
              <div className="inputWrap">
                <input
                  type="text"
                  placeholder="이메일로 받은 인증코드를 입력하세요."
                  value={authCode}
                  onChange={handleAuthCode}
                />
                <button className="authButton">확인</button>
              </div>
            </>
          )}

          {/* 사용자명 */}
          <div className="inputTitle">사용자명</div>
          <div className="inputWrap">
            <input
              type="text"
              placeholder="이름 또는 닉네임"
              value={username}
              onChange={handleUsername}
            />
          </div>

          {/* 비밀번호 */}
          <div className="inputTitle">비밀번호</div>
          <div className="inputWrap">
            <input
              type="password"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              value={password}
              onChange={handlePw}
            />
          </div>
          {!passwordValid && password.length > 0 && (
            <div className="errorMessageWrap">
              영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.
            </div>
          )}

          {/* 비밀번호 확인 */}
          <div className="inputTitle">비밀번호 확인</div>
          <div className="inputWrap">
            <input
              type="password"
              placeholder="위에서 설정한 비밀번호를 입력하세요."
              value={confirmPw}
              onChange={handleConfirmPw}
            />
          </div>
          {!pwMatchValid && confirmPw.length > 0 && (
            <div className="errorMessageWrap">비밀번호가 일치하지 않습니다.</div>
          )}
        </div>

        {/* 가입 버튼 */}
        <div className="buttonWrap">
          <button
            onClick={onClickConfirmButton}
            disabled={notAllow}
            className="bottomButton"
          >
            가입
          </button>
        </div>

        {/* 로그인 링크 */}
        <div className="registerWrap">
          <div className="registerTitle">
            계정이 있으신가요? <Link to="/Login">로그인하기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
