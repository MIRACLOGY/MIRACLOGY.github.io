import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import './Map.css';

import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import randomIconRetinaUrl from '../../assets/marker-icon-2x-bluedot.png';
import randomIconUrl from '../../assets/marker-icon-bluedot.png';
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
  // shadowUrl,
  iconSize: [15, 15],
  iconAnchor: [7.5, 25],
  popupAnchor: [1, -25],
  // shadowSize: [25, 25]
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
    fetch('/data/data3.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const markersData = data.map((item, index) => ({
          position: [item['X 좌표'], item['Y 좌표']],
          name: item['구분'],
          details: item,
          index: index
        }));
        setMarkers(markersData);
        setLocalMarkers(markersData);

        // // Generate random points around each marker
        // const allRandomPoints = markersData.flatMap(marker =>
        //   generateRandomPoints(marker.position, 15, 30, marker.name)
        // );

        // // 추가로 지정된 좌표에서 50km 반경으로 랜덤한 50개의 점 생성
        // const additionalPoints = data.map(item =>
        //   generateRandomPoints(
        //     [item['Y'], item['X']],
        //     item['Individual'],
        //     item['Radius (km)'],
        //     item['주소']
        //   )
        // ).flat();

        // setRandomMarkers([...allRandomPoints, ...additionalPoints]);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [setMarkers]);

  useEffect(() => {
    fetch('/data/data4.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const randomPoints = data.flatMap(item =>
          generateRandomPoints(
            [item['X'], item['Y']],
            item['Individual'],
            item['Radius (km)'],
            item['주소']
          )
        );

        setRandomMarkers(randomPoints);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[35.9078, 127.7669]}
        zoom={7}
        className="map-container"
        zoomAnimation={true}
        zoomAnimationThreshold={4}
        scrollWheelZoom={true}
        wheelPxPerZoomLevel={60}
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
            icon={BlueIcon}
            zIndexOffset={-1000}
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
