import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './SideBar.css';

const SideBar = forwardRef(({ markers, setSelectedMarker }, ref) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedImages, setExpandedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (expandedItem) {
      const imageIndex = String(expandedItem.Index).padStart(2, '0');
      const images = [];
      for (let i = 1; i <= 3; i++) {
        const imageUrl = `/images/${imageIndex}_0${i}.png`;
        images.push(imageUrl);
      }
      setExpandedImages(images);
      setCurrentImageIndex(0); // Reset to the first image
    }
  }, [expandedItem]);

  useImperativeHandle(ref, () => ({
    handleRowClick(item, index) {
      setExpandedItem({ ...item, index });
      setSelectedMarker(item.marker);
    }
  }));

  const handleRowClick = (item, index) => {
    setExpandedItem({ ...item, index });
    setSelectedMarker(item.marker);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % expandedImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + expandedImages.length) % expandedImages.length);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {expandedItem && (
          <div className="expanded-content">
            {expandedImages.length > 0 && (
              <div className="image-container">
                <button onClick={handlePrevImage} disabled={expandedImages.length <= 1}>
                  <i className="fas fa-arrow-left"></i>
                </button>
                <img src={expandedImages[currentImageIndex]} alt="Product" className="expanded-image" />
                <button onClick={handleNextImage} disabled={expandedImages.length <= 1}>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}
            <div className="expanded-info">
              <h2>{expandedItem['생산자']}</h2>
              <p><span>생산자:</span> {expandedItem['생산자']}</p>
              <p><span>인증번호:</span> {expandedItem['인증번호']}</p>
              <p><span>대표품목:</span> {expandedItem['대표품목']}</p>
              <p><span>인증분류:</span> {expandedItem['인증분류']}</p>
              <p><span>상세주소:</span> {expandedItem['상세주소 (도로명)']}</p>
            </div>
          </div>
        )}
      </div>
      <div className="sidebar-content">
        <div className="table-container">
          <table className="info-table">
            <thead>
              <tr>
                <th>지역</th>
                <th>농가명</th>
                <th>생산품목</th>
              </tr>
            </thead>
            <tbody>
              {markers.map((marker, index) => (
                <tr key={index} onClick={() => handleRowClick({ ...marker.details, index, marker })}>
                  <td>{marker.details['상세주소 (도로명)']}</td>
                  <td>{marker.details['생산자']}</td>
                  <td>{marker.details['대표품목']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default SideBar;
