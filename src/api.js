import { startLoading, stopLoading } from './loading';
import { BASE_URL } from './config';
import { convertImagesToPDF } from './utils/pdfUtils';

// 환자 데이터를 서버에 저장하는 함수
export const savePatientData = async (patientData) => {
  try {
    const response = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error('서버 응답이 올바르지 않습니다');
    }

    return await response.json();
  } catch (error) {
    console.error('환자 데이터 저장 중 오류 발생:', error);
    throw error;
  }
};

// 여러 처방전 이미지를 서버로 전송하고 데이터를 추출하는 함수
export async function extractPrescriptionData(imageFiles) {
  try {
    startLoading();
    
    // PDF 변환 시작 시간 기록
    const startTime = performance.now();
    
    // 모든 이미지를 하나의 PDF로 변환
    const pdfBlob = await convertImagesToPDF(imageFiles);
    
    // PDF 변환 종료 시간 기록 및 소요 시간 계산
    const endTime = performance.now();
    const conversionTime = endTime - startTime;
    console.log(`PDF 변환 소요 시간: ${conversionTime.toFixed(2)}ms`);

    const formData = new FormData();
    formData.append('file', pdfBlob, 'prescriptions.pdf');

    // API 엔드포인트 URL
    const apiUrl = `${BASE_URL}/extract_prescription`;

    // API 요청 보내기
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    // 응답이 성공적이지 않으면 에러 throw
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류: ${response.status} ${JSON.stringify(errorData)}`);
    }

    // 응답 데이터를 JSON으로 파싱
    const data = await response.json();

    stopLoading();
    // 추출된 데이터 반환
    return data;
  } catch (error) {
    console.error('처방전 데이터 추출 중 오류:', error);
    stopLoading();
    throw error;
  }
}

// 오디오 파일을 서버에 업로드하고 의료 차트를 텍스트로 변환하는 함수
export const uploadAudioAndCreateMedicalChart = async (audioFile) => {
  try {
    startLoading();
    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await fetch(`${BASE_URL}/transcribe_audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('오디오 파일 처리 중 오류 발생');
    }

    const data = await response.json();
    console.log('오디오 변환 성공:', data);
    stopLoading();
    return data; // { id: chart_id, content: result } 형식으로 반환
  } catch (error) {
    console.error('오디오 파일 처리 중 오류 발생:', error);
    stopLoading();
    throw error;
  }
};

// 처방전 데이터를 저장하는 함수
export const submitPrescriptionData = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/update_prescription/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('처방전 데이터 제출 중 오류 발생');
    }

    return await response.json();
  } catch (error) {
    console.error('처방전 데이터 제출 중 오류 발생:', error);
    throw error;
  }
};

// 의료 차트 데이터를 저장하는 함수
export const submitMedicalChartData = async (medicalChartData) => {
  try {
    const response = await fetch(`${BASE_URL}/update_medical_chart/${medicalChartData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicalChartData),
    });

    if (!response.ok) {
      throw new Error('의료 차트 데이터 제출 중 오류 발생');
    }

    return await response.json();
  } catch (error) {
    console.error('의료 차트 데이터 제출 중 오류 발생:', error);
    throw error;
  }
};