import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrescriptionBottle, faFileAlt, faSignOutAlt, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useGoogleAuth, handleGoogleLogout } from '../services/googleAuth';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const login = useGoogleAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = async () => {
    try {
      await login();
      console.log('로그인 성공');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await handleGoogleLogout();
      onLogout(); // 부모 컴포넌트에 로그아웃 알림
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? '◀' : '▶'}
      </div>
      <div className="sidebar-content">
        <div className="logo">
          <FontAwesomeIcon icon={faHeartbeat} className="logo-icon" />
          <h2>Live<span className="danger">Care</span></h2>
        </div>
        <nav>
          <ul>
            {!user ? (
              <li onClick={handleLogin}>
                <FontAwesomeIcon icon={faGoogle} />
                <span>로그인</span>
              </li>
            ) : (
              <li onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>로그아웃</span>
              </li>
            )}
            <li>
              <FontAwesomeIcon icon={faPrescriptionBottle} />
              <span>약봉투 데이터</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faFileAlt} />
              <span>진료 차트 데이터</span>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;