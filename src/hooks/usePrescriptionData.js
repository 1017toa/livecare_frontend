import { useState, useCallback } from 'react';
import { submitPrescriptionData } from '../api';

function usePrescriptionData() {
  const [patientData, setPatientData] = useState({
    Name: '',
    age: '',
    prescription_date: '',
    medications_dosage: [],
    prescription_days: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPatientData(prevData => {
      const newMedications = [...prevData.medications_dosage];
      newMedications[index] = {
        ...newMedications[index],
        [field]: value
      };
      return {
        ...prevData,
        medications_dosage: newMedications
      };
    });
  };

  const addMedication = () => {
    setPatientData(prevData => ({
      ...prevData,
      medications_dosage: [...prevData.medications_dosage, { name: '', dosage: '' }]
    }));
  };

  const removeMedication = (index) => {
    setPatientData(prevData => ({
      ...prevData,
      medications_dosage: prevData.medications_dosage.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const submissionData = {
        ...patientData,
        medication_name: patientData.medications_dosage.map(med => med.name),
        medication_dosage: patientData.medications_dosage.reduce((acc, med) => {
          acc[med.name] = med.dosage;
          return acc;
        }, {})
      };
      delete submissionData.medications_dosage;
      const result = await submitPrescriptionData(submissionData);
      console.log('데이터 제출 성공:', result);
      alert('환자 데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('데이터 제출 실패:', error);
      alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const updateFormWithExtractedData = useCallback((extractedData) => {
    if (extractedData) {
      const transformedMedications = extractedData.medication_name.map(name => ({
        name,
        dosage: extractedData.medication_dosage[name] || ''
      }));

      console.log('Transformed medications:', transformedMedications); // 디버깅용 로그

      setPatientData(prevData => {
        const newData = {
          ...prevData,
          id: extractedData.id || '',
          Name: extractedData.Name || '',
          age: extractedData.age || '',
          prescription_date: extractedData.prescription_date || '',
          prescription_days: extractedData.prescription_days || '',
          medications_dosage: transformedMedications.length > 0 ? transformedMedications : [{ name: '', dosage: '' }]
        };
        console.log('New patient data:', newData); // 디버깅용 로그
        return newData;
      });
    }
  }, []);

  return { 
    patientData, 
    handleInputChange, 
    handleMedicationChange,
    handleSubmit, 
    addMedication, 
    removeMedication,
    updateFormWithExtractedData 
  };
}

export default usePrescriptionData;