const config = {
  development: {
    apiUrl: 'http://localhost:8000', // 개발 서버 URL
  },
  test: {
    apiUrl: 'http://test-server.com/api', // 테스트 서버 URL
  },
  production: {
    apiUrl: 'https://livecare-backend.azurewebsites.net', // 실제 배포 서버 URL
  },
};

const environment = process.env.REACT_APP_ENV || 'development';

export const BASE_URL = config[environment].apiUrl;
