import { useState, useEffect } from 'react';
import { submitMedicalChartData } from '../api';

function useMedicalChartData(initialData) {
  const [medicalChartData, setMedicalChartData] = useState({
    id: initialData?.id || null,
    content: initialData?.content || ''
  });

  useEffect(() => {
    if (initialData) {
      setMedicalChartData({
        id: initialData.id || medicalChartData.id,
        content: initialData.content
      });
    }
  }, [initialData]);

  const handleMedicalChartChange = (event) => {
    const { value } = event.target;
    setMedicalChartData(prevData => ({
      ...prevData,
      content: value
    }));
  };

  const handleMedicalChartSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await submitMedicalChartData(medicalChartData);
      console.log('진료 차트 데이터 제출 성공:', result);
      alert('진료 차트가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('진료 차트 데이터 제출 실패:', error);
      alert('진료 차트 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return { medicalChartData, handleMedicalChartChange, handleMedicalChartSubmit };
}

export default useMedicalChartData;