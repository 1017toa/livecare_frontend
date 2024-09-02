import React from 'react';
import { useDropzone } from 'react-dropzone';

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
};

function FileUpload({ onDrop, prescriptionImages, tab }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section id="file-upload">
      <h2>파일 업로드</h2>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {
          isDragActive ? 
            <p>파일을 여기에 놓으세요...</p> :
            <p>
              파일을 드래그 앤 드롭하거나 클릭하여 선택하세요<br />
              {tab === 'voice' ? 
                "['.avi', '.mp4', '.mov', '.wmv', '.flv', '.mkv', '.mp3', '.aac', '.ac3', '.flac', '.wav', '.m4a', '.ogg'] 확장자만 가능합니다" :
                "(약봉투 이미지: 최대 50MB, JPEG, PNG, BMP, PDF, TIFF, HEIC)"
              }
            </p>
        }
      </div>
      {prescriptionImages && prescriptionImages.length > 0 && (
        <div>
          <h3>업로드된 약봉투 이미지:</h3>
          {prescriptionImages.map((image, index) => (
            <p key={index}>{image.name}</p>
          ))}
        </div>
      )}
    </section>
  );
}

export default FileUpload;
