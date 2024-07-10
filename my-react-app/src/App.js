import React, { useRef, useState } from 'react';
import './App.css';
import Map from './components/map/Map';
import SideBar from './components/sideBar/SideBar';

function App() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const sideBarRef = useRef(null);

  const handleRowClick = (item, index) => {
    if (sideBarRef.current) {
      sideBarRef.current.handleRowClick(item, index);
    }
    setSelectedMarker(item.marker);
  };

  return (
    <div className="App">
      <div className="left-content">
        <SideBar ref={sideBarRef} markers={markers} setSelectedMarker={setSelectedMarker} />
      </div>
      <div className="right-content">
        <Map selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} setMarkers={setMarkers} handleRowClick={handleRowClick} />
      </div>
    </div>
  );
}

export default App;
