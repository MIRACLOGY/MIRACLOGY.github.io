import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './SideBar.css';

const SideBar = forwardRef(({ markers, setSelectedMarker }, ref) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedImages, setExpandedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (expandedItem) {
      const imageIndex = String(expandedItem.Index+1).padStart(2, '0');
      const images = [];
      for (let i = 1; i <= 3; i++) {
        const imageUrl = `/images/${imageIndex}_0${i}.png`;
        images.push(imageUrl);
      }
      setExpandedImages(images);
      setCurrentImageIndex(0);
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

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {expandedItem && (
          <div className="expanded-content">
            {expandedImages.length > 0 && (
              <div className="image-container">
                <img src={expandedImages[currentImageIndex]} alt="Product" className="expanded-image" />
              </div>
            )}
            <div className="expanded-info">
              <h2>{expandedItem['구분']}</h2>
              <p><span>주소:</span> {expandedItem['주소 / 거점위치']}</p>
              <p><span>기능:</span> {expandedItem['기능']}</p>
              <p><span>직영 / 위탁:</span> {expandedItem['직영/위탁']}</p>
            </div>
          </div>
        )}
      </div>
      <div className="sidebar-content">
        <div className="table-container">
          <table className="info-table">
            <thead>
              <tr>
                <th>권역</th>
                <th>구분</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody>
              {markers.map((marker, index) => (
                <tr key={index} onClick={() => handleRowClick({ ...marker.details, index, marker })}>
                  <td>{marker.details['권역']}</td>
                  <td>{marker.details['구분']}</td>
                  <td>{marker.details['주소 / 거점위치']}</td>
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
