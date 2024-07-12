import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import './Map.css';

// 아이콘 경로 설정
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import randomIconRetinaUrl from '../../assets/blue-marker-icon-2x.png'; // 새로운 아이콘 경로
import randomIconUrl from '../../assets/blue-marker-icon.png'; // 새로운 아이콘 경로
import iconRetinaUrl from '../../assets/red-marker-icon-2x.png';
import iconUrl from '../../assets/red-marker-icon.png';

const RedIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const BlueIcon = L.icon({
  iconRetinaUrl: randomIconRetinaUrl,
  iconUrl: randomIconUrl,
  shadowUrl,
  iconSize: [15, 25], // 크기를 작게 조정
  iconAnchor: [7.5, 25], // 중심을 아이콘 크기에 맞게 조정
  popupAnchor: [1, -25],
  shadowSize: [25, 25]
});

L.Marker.prototype.options.icon = RedIcon;

const generateRandomPoints = (center, numPoints, radius, baseName) => {
  const points = [];
  const minLat = 33.0;
  const maxLat = 38.5;
  const minLng = 124.0;
  const maxLng = 131.0;

  for (let i = 0; i < numPoints; i++) {
    let newLat, newLng;
    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const xOffset = distance * Math.cos(angle) / 111.32; // Convert km to degrees
      const yOffset = distance * Math.sin(angle) / 111.32;
      newLat = center[0] + yOffset;
      newLng = center[1] + xOffset;
    } while (newLat < minLat || newLat > maxLat || newLng < minLng || newLng > maxLng);

    points.push({
      position: [newLat, newLng],
      name: `${baseName} sub ${i + 1}`
    });
  }
  return points;
};

const Map = ({ selectedMarker, setSelectedMarker, setMarkers, handleRowClick }) => {
  const [markers, setLocalMarkers] = useState([]);
  const [randomMarkers, setRandomMarkers] = useState([]);

  useEffect(() => {
    // Fetch data from JSON file in the public directory
    fetch('/data/data3.json') // 변경된 JSON 파일
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // 'X 좌표'와 'Y 좌표' 데이터를 포함한 markers 배열 설정
        const markersData = data.map((item, index) => ({
          position: [item['X 좌표'], item['Y 좌표']],
          name: item['구분'],
          details: item,
          index: index
        }));
        setMarkers(markersData); // 부모 컴포넌트의 상태 업데이트
        setLocalMarkers(markersData);

        // Generate random points around each marker
        const allRandomPoints = markersData.flatMap(marker => 
          generateRandomPoints(marker.position, 15, 30, marker.name)
        );

        // 추가로 지정된 좌표에서 50km 반경으로 랜덤한 50개의 점 생성
        const additionalPoints = [
          { position: [35.4211779119527, 127.1852936788470], name: "전주" },
          { position: [36.24105476443080, 127.62579377150200], name: "대전" },
          { position: [37.48809624253570, 128.49860723175000], name: "강원" }
        ].flatMap(point => 
          generateRandomPoints(point.position, 50, 50, point.name)
        );

        setRandomMarkers([...allRandomPoints, ...additionalPoints]);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [setMarkers]);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[35.9078, 127.7669]} // 대한민국 중심 좌표
        zoom={7} // 대한민국 전역이 보이는 줌 레벨
        className="map-container"
        zoomAnimation={true}
        zoomAnimationThreshold={4}
        scrollWheelZoom={true}
        wheelPxPerZoomLevel={60} // 휠 스크롤 감도 조정
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerBounds markers={markers} />
        {randomMarkers.map((marker, index) => (
          <CustomMarker
            key={`random-${index}`}
            position={marker.position}
            name={marker.name}
            icon={BlueIcon} // 랜덤 마커에 BlueIcon 사용
            zIndexOffset={-1000} // 랜덤 마커의 zIndexOffset을 낮게 설정
          />
        ))}
        {markers.map((marker, index) => (
          <CustomMarker
            key={index}
            position={marker.position}
            name={marker.name}
            icon={RedIcon} // 원본 마커에 RedIcon 사용
            zIndexOffset={1000} // 원본 마커의 zIndexOffset을 높게 설정
            onClick={() => {
              setSelectedMarker(marker);
              handleRowClick(marker.details, index);
            }}
          />
        ))}
        {selectedMarker && <FlyToMarker selectedMarker={selectedMarker} />}
      </MapContainer>
    </div>
  );
};

const CustomMarker = ({ position, name, icon, zIndexOffset, onClick }) => (
  <Marker position={position} icon={icon} zIndexOffset={zIndexOffset} eventHandlers={{ click: onClick }}>
    <Popup>{name}</Popup>
  </Marker>
);

const MarkerBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => marker.position));
      map.fitBounds(bounds, { animate: true });
    }
  }, [markers, map]);

  return null;
};

const FlyToMarker = ({ selectedMarker }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedMarker) {
      map.flyTo(selectedMarker.position, 15, { animate: true, duration: 2 });
    }
  }, [selectedMarker, map]);

  return null;
};

export default Map;
