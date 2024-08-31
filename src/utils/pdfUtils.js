import { jsPDF } from 'jspdf';

export const convertImagesToPDF = async (imageFiles) => {
  const pdf = new jsPDF();
  
  console.log('imageFiles:', imageFiles); // 디버깅을 위해 추가

  for (let i = 0; i < imageFiles.length; i++) {
    try {
      const imageFile = imageFiles[i];
      console.log(`이미지 ${i + 1} 타입:`, typeof imageFile, imageFile); // 디버깅을 위해 추가
      
      let imageData;
      
      if (imageFile instanceof Blob || imageFile instanceof File) {
        imageData = await readFileAsDataURL(imageFile);
      } else if (typeof imageFile === 'string') {
        if (imageFile.startsWith('data:image')) {
          imageData = imageFile; // 이미 Data URL인 경우
        } else {
          imageData = `data:image/jpeg;base64,${imageFile}`; // base64 문자열인 경우
        }
      } else if (imageFile && imageFile.url) {
        imageData = imageFile.url; // URL 객체인 경우
      } else {
        throw new Error('지원되지 않는 이미지 형식입니다.');
      }
      
      if (i > 0) {
        pdf.addPage();
      }
      
      const imgProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      let finalWidth, finalHeight;
      if (imgWidth / pdfWidth > imgHeight / pdfHeight) {
        finalWidth = pdfWidth;
        finalHeight = (imgHeight * pdfWidth) / imgWidth;
      } else {
        finalHeight = pdfHeight;
        finalWidth = (imgWidth * pdfHeight) / imgHeight;
      }
      
      pdf.addImage(imageData, 'JPEG', 0, 0, finalWidth, finalHeight);
    } catch (error) {
      console.error(`이미지 ${i + 1} 처리 중 오류 발생:`, error);
    }
  }
  
  return pdf.output('blob');
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};