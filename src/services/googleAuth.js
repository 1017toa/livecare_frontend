import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import axios from 'axios';
import { BASE_URL } from '../config';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID // Analytics를 위해 추가
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Analytics 초기화 (선택적)
let analytics;
if (process.env.NODE_ENV !== 'development') {
  analytics = getAnalytics(app);
}

const sendTokenToBackend = async (idToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-token`, { idToken });
    return response.data;
  } catch (error) {
    console.error('백엔드 통신 오류:', error);
    throw error;
  }
};

export const useGoogleAuth = () => {
  const provider = new GoogleAuthProvider();

  return async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // 백엔드에 토큰 전송
      const serverResponse = await sendTokenToBackend(idToken);
      
      console.log('사용자가 성공적으로 인증되었습니다.');
      return serverResponse;
    } catch (error) {
      console.error('구글 로그인 오류:', error);
    }
  };
};

export const handleGoogleLogout = async () => {
  try {
    await signOut(auth);
    console.log('구글 로그아웃 완료');
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
};