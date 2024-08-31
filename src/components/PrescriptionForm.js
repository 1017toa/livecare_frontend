import React from 'react';

function PrescriptionForm({ patientData, handleInputChange, handleMedicationChange, handleSubmit, addMedication, removeMedication }) {
  return (
    <section id="edit" className="edit-section">
      <h2>처방 정보 편집</h2>
      <form id="prescriptionForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">이름</label>
          <input 
            type="text" 
            id="Name" 
            name="Name"
            value={patientData.Name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">나이</label>
          <input 
            type="text" 
            id="age" 
            name="age"
            value={patientData.age}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="prescription_date">처방일</label>
          <input 
            type="date" 
            id="prescription_date" 
            name="prescription_date"
            value={patientData.prescription_date}
            onChange={handleInputChange}
          />
        </div>

        <div id="medicationList">
          {patientData.medications_dosage && patientData.medications_dosage.length > 0 ? (
            patientData.medications_dosage.map((med, index) => (
              <div key={`med-${index}`} className="form-group">
                <div className="medication-input-group">
                  <span className="input-label">약물명:</span>
                  <input 
                    type="text" 
                    id={`medication_${index}`} 
                    name={`medication_${index}`}
                    value={med.name || ''}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    placeholder="약물명"
                  />
                  <span className="input-label">용량:</span>
                  <input 
                    type="text" 
                    id={`dosage_${index}`} 
                    name={`dosage_${index}`}
                    value={med.dosage || ''}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    placeholder="용량"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeMedication(index)}
                    className="remove-medication-btn"
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>약물 정보가 없습니다. 약물을 추가해주세요.</div>
          )}
        </div>
        <div className="form-group">
          <button 
            type="button" 
            onClick={addMedication}
            className="add-medication-btn"
          >
            +
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="prescription_days">처방일수</label>
          <input 
            type="number" 
            id="prescription_days" 
            name="prescription_days"
            value={patientData.prescription_days}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">저장</button>
      </form>
    </section>
  );
}

export default PrescriptionForm;