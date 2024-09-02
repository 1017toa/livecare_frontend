let reportLoadingInterval;
let voiceLoadingInterval;

const loadingTexts = [
  "데이터를 처리 중입니다...",
  "잠시만 기다려주세요...",
  "열심히 작업 중입니다...",
  "거의 다 됐어요!",
  "조금만 더 기다려주세요..."
];

const timeInfo = "업로드한 파일에 따라 30초에서 1분 정도 소요될 수 있습니다.";

export const initializeLoading = (element) => {
  element.classList.add('loading-overlay');
  element.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">${loadingTexts[0]}</div>
    <div class="time-info">${timeInfo}</div>
  `;
};

const updateLoadingText = (loadingElement, index) => {
  loadingElement.querySelector('.loading-text').textContent = loadingTexts[index];
};

export const startLoading = (loadingElement, type) => {
  if (!loadingElement) {
    console.error('로딩 요소가 초기화되지 않았습니다. initializeLoading을 먼저 호출하세요.');
    return;
  }

  let index = 0;
  const intervalFunction = () => {
    index = (index + 1) % loadingTexts.length;
    updateLoadingText(loadingElement, index);
  };

  if (type === 'report') {
    reportLoadingInterval = setInterval(intervalFunction, 2000);
  } else if (type === 'voice') {
    voiceLoadingInterval = setInterval(intervalFunction, 2000);
  }
};

export const stopLoading = (loadingElement, type) => {
  if (!loadingElement) {
    console.error('로딩 요소가 초기화되지 않았습니다.');
    return;
  }

  if (type === 'report') {
    clearInterval(reportLoadingInterval);
  } else if (type === 'voice') {
    clearInterval(voiceLoadingInterval);
  }

  loadingElement.classList.remove('loading-overlay');
  loadingElement.innerHTML = '';
};