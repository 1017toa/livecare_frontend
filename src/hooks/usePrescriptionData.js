import { useState } from 'react';
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


  return { 
    patientData, 
    handleInputChange, 
    handleMedicationChange,
    handleSubmit, 
    addMedication, 
    removeMedication,
  };
}

export default usePrescriptionData;