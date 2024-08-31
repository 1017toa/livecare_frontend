import React, { useEffect } from 'react';
import useMedicalChartData from '../hooks/useMedicalChartData';

function MedicalChartForm({ initialData }) {
  const { medicalChartData, handleMedicalChartChange, handleMedicalChartSubmit } = useMedicalChartData(initialData);

  useEffect(() => {
    console.log('초기 데이터:', initialData);
    console.log('현재 차트 데이터:', medicalChartData);
  }, [initialData, medicalChartData]);

  return (
    <section id="medical-chart" className="edit-section">
      <h2>진료 차트 정보</h2>
      <form id="medicalChartForm" onSubmit={handleMedicalChartSubmit}>
        <div className="form-group">
          <label htmlFor="medicalChart">진료 차트</label>
          <textarea
            id="medicalChart"
            name="medicalChart"
            value={medicalChartData.content}
            onChange={handleMedicalChartChange}
            style={{
              width: '100%',
              minHeight: '150px',
              resize: 'vertical',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}
          />
        </div>
        <button type="submit" className="submit-button">진료 차트 저장</button>
      </form>
    </section>
  );
}

export default MedicalChartForm;