import React from 'react';
import { useDropzone } from 'react-dropzone';

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
};

function FileUpload({ onDrop, prescriptionImage }) {
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
              (약봉투 이미지: 최대 50MB, JPEG, PNG, BMP, PDF, TIFF, HEIC)
            </p>
        }
      </div>
      {prescriptionImage && (
        <div>
          <h3>업로드된 약봉투 이미지:</h3>
          <p>{prescriptionImage.name}</p>
        </div>
      )}
    </section>
  );
}

export default FileUpload;
