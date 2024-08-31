import React, { useEffect, useRef } from 'react';

function ImagePreview({ images = [], onDeleteImage }) {
  const imageRefs = useRef([]);

  useEffect(() => {
    const resizeImages = () => {
      imageRefs.current.forEach(img => {
        if (img) {
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const maxWidth = 200; // 최대 너비 설정
          const maxHeight = 200; // 최대 높이 설정

          if (aspectRatio > maxWidth / maxHeight) {
            img.style.width = `${maxWidth}px`;
            img.style.height = 'auto';
          } else {
            img.style.width = 'auto';
            img.style.height = `${maxHeight}px`;
          }
        }
      });
    };

    window.addEventListener('resize', resizeImages);
    resizeImages();

    return () => {
      window.removeEventListener('resize', resizeImages);
    };
  }, [images]);

  const handleDeleteImage = (index) => {
    if (onDeleteImage) {
      onDeleteImage(index);
    }
  };

  return (
    <section id="preview" className="preview-section">
      <h2>이미지 미리보기</h2>
      <div className="image-container">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={image.url} className="image-preview-item">
              <img 
                ref={el => imageRefs.current[index] = el}
                src={image.url} 
                alt={`업로드된 이미지 미리보기 ${index + 1}`} 
                className="responsive-image"
              />
              <button
                className="delete-image-btn"
                onClick={() => handleDeleteImage(index)}
                aria-label="이미지 삭제"
              >
                ×
              </button>
              <p className="image-filename">{image.file.name}</p>
            </div>
          ))
        ) : (
          <p>업로드된 이미지가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export default ImagePreview;
