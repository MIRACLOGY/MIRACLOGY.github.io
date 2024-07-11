import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import './Map.css';

// 아이콘 경로 설정
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
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

L.Marker.prototype.options.icon = RedIcon;

const Map = ({ selectedMarker, setSelectedMarker, setMarkers, handleRowClick }) => {
  const [markers, setLocalMarkers] = useState([]);

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
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [setMarkers]);

  return (
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
      {markers.map((marker, index) => (
        <CustomMarker
          key={index}
          position={marker.position}
          name={marker.name}
          onClick={() => {
            setSelectedMarker(marker);
            handleRowClick(marker.details, index);
          }}
        />
      ))}
      {selectedMarker && <FlyToMarker selectedMarker={selectedMarker} />}
    </MapContainer>
  );
};

const CustomMarker = ({ position, name, onClick }) => (
  <Marker position={position} eventHandlers={{ click: onClick }}>
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
