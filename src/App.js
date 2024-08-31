import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { marked } from 'marked';
import './App.css';
import FileUpload from './components/FileUpload';
import ImagePreview from './components/ImagePreview';
import PrescriptionForm from './components/PrescriptionForm';
import useFileUpload from './hooks/useFileUpload';
import usePrescriptionData from './hooks/usePrescriptionData';
import { initializeLoading } from './loading';
import { extractPrescriptionData } from './api';

// 한글 폰트 파일을 import 합니다. 폰트 파일은 public 폴더에 위치해야 합니다.
import NanumGothic from './fonts/NanumGothic-Regular.ttf';

function App() {
  const loadingRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [prescriptionImages, setPrescriptionImages] = useState([]);
  const [extractedReport, setExtractedReport] = useState(null);
  const reportRef = useRef(null);

  const { 
    handleDrop, 
    extractedPrescriptionData, 
    // handlePrescriptionExtraction 제거
  } = useFileUpload(setPrescriptionImages);

  const { 
    patientData, 
    handleInputChange, 
    handleMedicationChange,
    handleSubmit, 
    addMedication, 
    removeMedication,
    updateFormWithExtractedData 
  } = usePrescriptionData();

  useEffect(() => {
    if (loadingRef.current) {
      initializeLoading(loadingRef.current);
    }
  }, []);

  useEffect(() => {
    if (extractedPrescriptionData) {
      updateFormWithExtractedData(extractedPrescriptionData);
    }
  }, [extractedPrescriptionData, updateFormWithExtractedData]);

  const handleStartProcessing = async () => {
    setIsUploading(true);
    try {
      const result = await extractPrescriptionData(prescriptionImages);
      console.log('추출된 처방전 데이터:', result);
      setExtractedReport(result.result);
      // 추출된 보고서가 나오면 이미지 관련 데이터 제거
      setPrescriptionImages([]);
    } catch (error) {
      console.error('처방전 데이터 추출 중 오류 발생:', error);
      // 여기에 사용자에게 오류를 표시하는 로직을 추가할 수 있습니다.
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = prescriptionImages.filter((_, i) => i !== index);
    setPrescriptionImages(updatedImages);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // 한글 폰트 추가
    doc.addFont(NanumGothic, 'NanumGothic', 'normal');
    doc.setFont('NanumGothic');

    const content = marked.parse(extractedReport);
    const lines = content.split('\n');

    let currentY = 10;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const lineHeight = 7;

    lines.forEach((line) => {
      if (line.startsWith('<h1>')) {
        if (currentY > margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.setFontSize(18);
        doc.setFont('NanumGothic', 'bold');
        doc.text(line.replace(/<\/?h1>/g, ''), margin, currentY);
        currentY += lineHeight * 2;
      } else if (line.startsWith('<h2>')) {
        if (currentY > pageHeight - margin * 3) {
          doc.addPage();
          currentY = margin;
        }
        doc.setFontSize(16);
        doc.setFont('NanumGothic', 'bold');
        doc.text(line.replace(/<\/?h2>/g, ''), margin, currentY);
        currentY += lineHeight * 1.5;
      } else if (line.startsWith('<h3>')) {
        if (currentY > pageHeight - margin * 2) {
          doc.addPage();
          currentY = margin;
        }
        doc.setFontSize(14);
        doc.setFont('NanumGothic', 'bold');
        doc.text(line.replace(/<\/?h3>/g, ''), margin, currentY);
        currentY += lineHeight * 1.2;
      } else if (line.startsWith('<p>')) {
        doc.setFontSize(12);
        doc.setFont('NanumGothic', 'normal');
        const text = line.replace(/<\/?p>/g, '');
        const textLines = doc.splitTextToSize(text, doc.internal.pageSize.width - margin * 2);
        textLines.forEach((textLine) => {
          if (currentY > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
          }
          doc.text(textLine, margin, currentY);
          currentY += lineHeight;
        });
      } else if (line.startsWith('<ul>') || line.startsWith('<ol>')) {
        doc.setFontSize(12);
        doc.setFont('NanumGothic', 'normal');
        const listItems = line.match(/<li>(.*?)<\/li>/g);
        if (listItems) {
          listItems.forEach((item) => {
            const text = item.replace(/<\/?li>/g, '');
            if (currentY > pageHeight - margin) {
              doc.addPage();
              currentY = margin;
            }
            doc.text(`• ${text}`, margin + 5, currentY);
            currentY += lineHeight;
          });
        }
      }
    });

    doc.save('extracted_report.pdf');
  };

  const downloadTEXT = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedReport], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "extracted_report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <header>
          <h1>LiveCare - 환자 관리</h1>
        </header>

        <main>
          {!extractedReport && (
            <>
              <FileUpload onDrop={handleDrop} prescriptionImages={prescriptionImages} />
              
              {prescriptionImages.length > 0 && !isUploading && (
                <button onClick={handleStartProcessing} className="start-processing-btn">
                  분석 시작
                </button>
              )}

              {prescriptionImages.length > 0 && (
                <ImagePreview 
                  images={prescriptionImages} 
                  onDeleteImage={handleDeleteImage}
                />
              )}
            </>
          )}

          <div ref={loadingRef} id="loading-message" className="loading-container"></div>

          {extractedReport && (
            <div className="extracted-report">
              <div className="report-header">
                <h2>추출된 보고서</h2>
                <div className="download-buttons">
                  <button onClick={downloadPDF} className="download-btn">PDF 다운로드</button>
                  <button onClick={downloadTEXT} className="download-btn">TEXT 다운로드</button>
                </div>
              </div>
              <div className="markdown-content" ref={reportRef}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{extractedReport}</ReactMarkdown>
              </div>
            </div>
          )}

          {extractedPrescriptionData && !extractedReport && (
            <PrescriptionForm 
              patientData={patientData}
              handleInputChange={handleInputChange}
              handleMedicationChange={handleMedicationChange}
              handleSubmit={handleSubmit}
              addMedication={addMedication}
              removeMedication={removeMedication}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;