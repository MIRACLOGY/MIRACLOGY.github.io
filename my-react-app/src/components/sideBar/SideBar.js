import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './SideBar.css';

import uparrow from '../../assets/up.png';

const SideBar = forwardRef(({ markers, setSelectedMarker }, ref) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    if (expandedItem) {
      const imageIndex = String(expandedItem.Index + 1).padStart(2, '0');
      const imageUrl = `/images/${imageIndex}.jpg`;
      setExpandedImage(imageUrl);
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

  const handleCollapseClick = () => {
    setExpandedItem(null);
    setExpandedImage(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {expandedItem && (
          <div className="expanded-content">
            {expandedImage && (
              <div className="image-container">
                <img src={expandedImage} alt="Product" className="expanded-image" />
              </div>
            )}
            <div className="expanded-info">
              <h2>{expandedItem['구분']}</h2>
              <p className="text"><span>주소:</span> {expandedItem['주소 / 거점위치']}</p>
              <p className="text"><span>기능:</span> {expandedItem['기능']}</p>
              <div className="collapse-container">
                <p className="text"><span>직영 / 위탁:</span> {expandedItem['직영/위탁']}</p>
                <button className="collapse-button" onClick={handleCollapseClick}>
                  <img src={uparrow} alt="Collapse" className="collapse-icon" />
                </button>
              </div>
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
