import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';
import FileUpload from './components/FileUpload';
import ImagePreview from './components/ImagePreview';
import useFileUpload from './hooks/useFileUpload';
import MedicalChartForm from './components/MedicalChartForm';
import useMedicalChartData from './hooks/useMedicalChartData';

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [prescriptionImages, setPrescriptionImages] = useState([]);
  const [extractedReport, setExtractedReport] = useState(null);
  const reportRef = useRef(null);
  const [activeTab, setActiveTab] = useState('report');
  const [medicalChartData, setMedicalChartData] = useState(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const textareaRef = useRef(null);
  const loadingElementRef = useRef(null); // 로딩 요소 참조
  const voiceLoadingElementRef = useRef(null); // 음성 탭 로딩 요소 참조

  const { 
    handleImageDrop, 
    handleAudioDrop,
    extractedPrescriptionData, 
    handlePrescriptionExtraction,
    extractedMedicalChartData,
    resetExtractedPrescriptionData 
  } = useFileUpload(setPrescriptionImages, setMedicalChartData);


  const { handleMedicalChartChange, handleMedicalChartSubmit } = useMedicalChartData();

  useEffect(() => {
    if (extractedPrescriptionData) {
      setExtractedReport(extractedPrescriptionData.result, null, 2); // 수정된 부분
    }
  }, [extractedPrescriptionData]);

  useEffect(() => {
    if (textareaRef.current) {
      const updateTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
          setTextareaHeight(`${textarea.scrollHeight}px`);
        }
      };

      updateTextareaHeight();
      window.addEventListener('resize', updateTextareaHeight);

      return () => {
        window.removeEventListener('resize', updateTextareaHeight);
      };
    }
  }, [medicalChartData]);

  const handleSampleTest = async () => {
    const sampleImageUrls = [
      process.env.PUBLIC_URL + '/sample/sample_medicine_bag1.jpg',
      process.env.PUBLIC_URL + '/sample/sample_medicine_bag2.jpg',
      process.env.PUBLIC_URL + '/sample/sample_medicine_bag3.jpg',
      process.env.PUBLIC_URL + '/sample/sample_medicine_bag4.jpg',
    ];

    const sampleImages = await Promise.all(
      sampleImageUrls.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return {
          file: new File([blob], url.split('/').pop(), { type: blob.type }),
          url: URL.createObjectURL(blob) // 수정된 부분
        };
      })
    );

    setPrescriptionImages(sampleImages);
    await handleStartProcessing(sampleImages);
  };

  const handleStartProcessing = async (images = prescriptionImages) => {
    setIsUploading(true);
    try {
      const result = await handlePrescriptionExtraction(images || [], loadingElementRef.current); // 수정된 부분
      console.log('추출된 처방전 데이터:', result);
      setExtractedReport(result.result, null, 2); // 수정된 부분
      setPrescriptionImages([]);
    } catch (error) {
      console.error('처방전 데이터 추출 중 오류 발생:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = prescriptionImages.filter((_, i) => i !== index);
    setPrescriptionImages(updatedImages);
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

  const resetReportState = () => {
    setExtractedReport(null);
    setPrescriptionImages([]);
    resetExtractedPrescriptionData();
  };

  const handleSampleAudioTest = async () => {
    const sampleAudioUrl = process.env.PUBLIC_URL + '/sample/sample_audio.aac';
    const response = await fetch(sampleAudioUrl);
    const blob = await response.blob();
    const sampleAudio = new File([blob], 'sample_audio.aac', { type: blob.type });

    await handleAudioDrop([sampleAudio], voiceLoadingElementRef.current); // 로딩 요소 전달
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <header>
          <h1>LiveCare로 환자 정보를 스마트하게 관리하세요</h1>
          <p>인공지능 기술로 약봉투 정보와 진료 녹음을 빠르고 정확하게 디지털화합니다.</p>
        </header>

        <main>
          <div ref={loadingElementRef} className="loading-container"></div> {/* 로딩 요소 추가 */}
          <div ref={voiceLoadingElementRef} className="loading-container"></div> {/* 음성 탭 로딩 요소 추가 */}

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'report' ? 'active' : ''}`} 
              onClick={() => setActiveTab('report')}
            >
              약봉투 사진으로 진료 보고서 생성
            </button>
            <button 
              className={`tab ${activeTab === 'voice' ? 'active' : ''}`} 
              onClick={() => setActiveTab('voice')}
            >
              진료 녹음 파일로 진료 차트 생성
            </button>
          </div>

          {activeTab === 'report' && (
            <>
              {!extractedReport && (
                <>
                  <FileUpload onDrop={handleImageDrop} prescriptionImages={prescriptionImages} tab="report" />
                  
                  <div className="button-container">
                    {prescriptionImages.length > 0 && !isUploading && (
                      <button onClick={() => handleStartProcessing(prescriptionImages)} className="start-processing-btn">
                        분석 시작
                      </button>
                    )}
                    {prescriptionImages.length === 0 && (
                      <button onClick={handleSampleTest} className="sample-test-btn">
                        샘플 이미지로 테스트하기
                      </button>
                    )}
                  </div>

                  {prescriptionImages.length > 0 && (
                    <ImagePreview 
                      images={prescriptionImages} 
                      onDeleteImage={handleDeleteImage}
                    />
                  )}
                  <section id="features" className="features-section">
                    <h2>주요 기능</h2>
                    <div className="feature-grid">
                      <div className="feature-item">
                        <i className="fas fa-camera"></i>
                        <h3>이미지 인식</h3>
                        <p>업스테이지 Document OCR 기술로 약봉지의 텍스트를 추출합니다.</p>
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-file-medical-alt"></i>
                        <h3>진료 보고서 생성</h3>
                        <p>공공데이터 API로 약품명을 검증하고 LLM을 활용해 진료 보고서를 생성합니다.</p>
                      </div>
                      <div className="feature-item">
                        <i className="fas fa-chart-line"></i>
                        <h3>데이터 관리</h3>
                        <p>처방 정보를 분석하여 저장하고 환자별 맞춤 정보로 사용합니다.</p>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {extractedReport && (
                <>
                  <button onClick={resetReportState} className="reset-report-btn">
                    다른 보고서 생성하기
                  </button>
                  <div className="extracted-report">
                    <div className="report-header">
                      <h2>추출된 보고서</h2>
                      <div className="download-buttons">
                        <button onClick={downloadTEXT} className="download-btn">TEXT 다운로드</button>
                      </div>
                    </div>
                    <div className="markdown-content" ref={reportRef}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{extractedReport}</ReactMarkdown>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'voice' && (
            <>
              <FileUpload onDrop={(files) => handleAudioDrop(files, voiceLoadingElementRef.current)} tab="voice" />
              
              <div className="button-container">
                <button onClick={handleSampleAudioTest} className="sample-test-btn">
                  샘플 녹음본으로 테스트하기
                </button>
              </div>

              {medicalChartData && (
                <MedicalChartForm 
                  initialData={extractedMedicalChartData}
                  medicalChartData={medicalChartData}
                  handleMedicalChartChange={handleMedicalChartChange}
                  handleMedicalChartSubmit={handleMedicalChartSubmit}
                  textareaRef={textareaRef}
                  textareaHeight={textareaHeight}
                />
              )}
              <section id="features" className="features-section">
                <h2>주요 기능</h2>
                <div className="feature-grid">
                  <div className="feature-item">
                    <i className="fas fa-microphone"></i>
                    <h3>음성 인식</h3>
                    <p>CLOVA Speech 기술로 진료 녹음을 정확하게 텍스트로 변환합니다.</p>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-file-medical"></i>
                    <h3>차트 자동 생성</h3>
                    <p>변환된 텍스트를 분석하여 진료 차트를 생성합니다.</p>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-user-md"></i>
                    <h3>방문 진료 효율성 증대</h3>
                    <p>생성된 차트를 저장하고 환자별로 관리하여 방문 진료 효율성을 높입니다.</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;