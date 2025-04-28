import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [emailValid, setEmailValid] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [passwordValid, setPwValid] = useState(false);
  const [pwMatchValid, setPwMatchValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleName = (e) => setName(e.target.value);

  const handleEmail = async (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(value);
    setEmailValid(isValid);
    setEmailAvailable(false);
    setCodeSent(false);
    setCodeVerified(false);
    setInfoMessage('');
    setErrorMessage('');

    if (isValid) {
      try {
        const response = await fetch(`/auth/check-email?email=${encodeURIComponent(value)}`);
        const data = await response.json();
        if (data.exists) {
          setErrorMessage('이미 사용 중인 이메일입니다.');
        } else {
          setEmailAvailable(true);
          setInfoMessage('사용 가능한 이메일입니다.');
        }
      } catch (error) {
        setErrorMessage('이메일 중복 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSendCode = async () => {
    try {
      const response = await fetch('/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.verified) {
        setCodeSent(true);
        setInfoMessage('인증 코드가 이메일로 전송되었습니다.');
      } else {
        setErrorMessage('인증 코드 전송에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('인증 코드 전송 중 오류가 발생했습니다.');
    }
  };

  const handleCode = (e) => setCode(e.target.value);

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (data.verified) {
        setCodeVerified(true);
        setInfoMessage('인증이 완료되었습니다.');
      } else {
        setErrorMessage('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      setErrorMessage('인증 코드 검증 중 오류가 발생했습니다.');
    }
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

  const onClickConfirmButton = async () => {
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          code,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        // 로그인 페이지로 이동 등의 추가 작업 가능
      } else {
        setErrorMessage(data.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      setErrorMessage('네트워크 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (emailValid && emailAvailable && codeVerified && passwordValid && pwMatchValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailValid, emailAvailable, codeVerified, passwordValid, pwMatchValid]);

  return (
    <div className="background">
      <div className="page">
        <div className="titleWrap">이메일과 비밀번호를 입력해주세요</div>

        <div className="contentWrap">
          {/* 이메일 주소 */}
          <div className="inputTitle">이메일 주소</div>
          <div className="inputWrap emailWithButton">
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmail}
            />
            <button
              className="authSendButton"
              onClick={handleSendCode}
              disabled={!emailValid || !emailAvailable}
            >
              인증번호 전송
            </button>
          </div>

          {/* 인증코드 입력란 및 버튼 */}
          {codeSent && (
            <>
              <div className="inputTitle">인증코드</div>
              <div className="inputWrap">
                <input
                  type="text"
                  placeholder="이메일로 받은 인증코드를 입력하세요."
                  value={code}
                  onChange={handleCode}
                />
                <button className="authButton" onClick={handleVerifyCode}>
                  확인
                </button>
              </div>
            </>
          )}

          {/* 사용자명 */}
          <div className="inputTitle">사용자명</div>
          <div className="inputWrap">
            <input
              type="text"
              placeholder="이름 또는 닉네임"
              value={name}
              onChange={handleName}
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

        {/* 정보 및 오류 메시지 표시 */}
        {infoMessage && <div className="infoMessageWrap">{infoMessage}</div>}
        {errorMessage && <div className="errorMessageWrap">{errorMessage}</div>}

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


