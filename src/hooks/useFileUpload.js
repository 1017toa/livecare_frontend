import { useState, useCallback } from 'react';
import { extractPrescriptionData, uploadAudioAndCreateMedicalChart } from '../api';

const audioExtensions = ['.avi', '.mp4', '.mov', '.wmv', '.flv', '.mkv', '.mp3', '.aac', '.ac3', '.flac', '.wav', '.m4a', '.ogg'];

function useFileUpload(setPrescriptionImages, setMedicalChartData) {
  const [extractedPrescriptionData, setExtractedPrescriptionData] = useState(null);
  const [extractedMedicalChartData, setExtractedMedicalChartData] = useState(null);

  const handleImageDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file) // 수정된 부분
    }));
    setPrescriptionImages(prevImages => [...prevImages, ...newImages]);
  }, [setPrescriptionImages]);

  const handleAudioDrop = useCallback(async (acceptedFiles, loadingElement) => {
    const newFiles = acceptedFiles.map(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!audioExtensions.includes(`.${fileExtension}`)) {
        alert('지원되지 않는 파일 형식입니다.');
        return null;
      }
      return {
        file,
        url: URL.createObjectURL(file)
      };
    }).filter(Boolean);

    setPrescriptionImages(prevFiles => [...prevFiles, ...newFiles]);

    // Handle audio upload and extraction
    try {
      const audioFile = newFiles[0]?.file;
      if (audioFile) {
        const extractedData = await uploadAudioAndCreateMedicalChart(audioFile, loadingElement);
        console.log('추출된 진료 차트 데이터:', extractedData);
        setExtractedMedicalChartData(extractedData);
        setMedicalChartData(extractedData); // App 컴포넌트에 데이터 설정

        // 파일 정보 초기화
        setPrescriptionImages([]);
        return extractedData;
      }
    } catch (error) {
      console.error('진료 차트 데이터 추출 중 오류가 발생했습니다:', error);
      throw error;
    }
  }, [setPrescriptionImages, setMedicalChartData]);

  const handlePrescriptionExtraction = useCallback(async (images, loadingElement) => {
    try {
      const extractedDataArray = await extractPrescriptionData(images.map(image => image.file), loadingElement);
      console.log('추출된 처방전 데이터:', extractedDataArray);
      setExtractedPrescriptionData(extractedDataArray);
      return extractedDataArray;
    } catch (error) {
      console.error('처방전 데이터 추출 중 오류가 발생했습니다:', error);
      throw error;
    }
  }, []);

  const resetExtractedPrescriptionData = () => {
    setExtractedPrescriptionData(null);
  };

  return { 
    handleImageDrop, 
    handleAudioDrop,
    extractedPrescriptionData,
    handlePrescriptionExtraction,
    extractedMedicalChartData,
    handleMedicalChartExtraction: handleAudioDrop, // handleAudioDrop 함수가 진료 차트 추출도 처리합니다.
    resetExtractedPrescriptionData
  };
}

export default useFileUpload;