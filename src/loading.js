let loadingInterval;
let loadingElement;

export const initializeLoading = (element) => {
  loadingElement = element;
};

export const startLoading = () => {
  if (!loadingElement) {
    console.error('로딩 요소가 초기화되지 않았습니다. initializeLoading을 먼저 호출하세요.');
    return;
  }

  const loadingTexts = [
    "데이터를 처리 중입니다...",
    "잠시만 기다려주세요...",
    "열심히 작업 중입니다...",
    "거의 다 됐어요!",
    "조금만 더 기다려주세요..."
  ];
  let index = 0;

  const timeInfo = "업로드한 사진 수에 따라 30초에서 1분 정도 소요될 수 있습니다.";

  loadingElement.classList.add('loading-overlay');
  loadingElement.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">${loadingTexts[0]}</div>
    <div class="time-info">${timeInfo}</div>
  `;

  loadingInterval = setInterval(() => {
    index = (index + 1) % loadingTexts.length;
    loadingElement.querySelector('.loading-text').textContent = loadingTexts[index];
  }, 2000);
};

export const stopLoading = () => {
  if (!loadingElement) {
    console.error('로딩 요소가 초기화되지 않았습니다.');
    return;
  }

  clearInterval(loadingInterval);
  loadingElement.classList.remove('loading-overlay');
  loadingElement.innerHTML = '';
};