import { useState, useCallback } from 'react';
import { extractPrescriptionData } from '../api';

// const imageExtensions = ['.jpeg', '.jpg', '.png', '.bmp', '.pdf', '.tiff', '.heic'];

function useFileUpload(setPrescriptionImages) {
  const [extractedPrescriptionData, setExtractedPrescriptionData] = useState(null);

  const handleDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPrescriptionImages(prevImages => [...prevImages, ...newImages]);
  }, [setPrescriptionImages]);

  const handlePrescriptionExtraction = useCallback(async (images) => {
    try {
      const extractedDataArray = await extractPrescriptionData(images.map(image => image.file));
      console.log('추출된 처방전 데이터:', extractedDataArray);
      setExtractedPrescriptionData(extractedDataArray);
      return extractedDataArray;
    } catch (error) {
      console.error('처방전 데이터 추출 중 오류가 발생했습니다:', error);
      throw error;
    }
  }, []);

  return { 
    handleDrop, 
    extractedPrescriptionData,
    handlePrescriptionExtraction
  };
}

export default useFileUpload;