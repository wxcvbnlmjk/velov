import React,{ useState  } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useStations, { Station } from './useStations';
import StationMarker from './StationMarker';
import L from 'leaflet';

type DisplayMode = 'bikes' | 'stands';

const lyonPosition: [number, number] = [45.75, 4.85]; // Latitude, Longitude de Lyon

const MapView: React.FC = () => {
  const { stations, loading, error } = useStations();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('bikes');

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        zIndex: 1000, 
        background: 'white', 
        padding: '10px', 
        borderRadius: '5px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
      }}>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name="displayMode"
            value="bikes"
            checked={displayMode === 'bikes'}
            onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            style={{ marginRight: '5px' }}
          />
          Vélos disponibles
        </label>
        <label>
          <input
            type="radio"
            name="displayMode"
            value="stands"
            checked={displayMode === 'stands'}
            onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            style={{ marginRight: '5px' }}
          />
          Places disponibles
        </label>
      </div>
 
    <MapContainer center={lyonPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!loading && !error && stations
          .filter(station => station.position?.latitude && station.position?.longitude)
          .map((station: Station) => {
            const count = displayMode === 'bikes' 
              ? station.mainStands.availabilities.bikes 
              : station.mainStands.availabilities.stands;
            
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                background-color: ${count > 0 ? '#4CAF50' : '#f44336'};
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">${count}</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });

            const title = displayMode === 'bikes' 
              ? `${station.name} - ${count} vélos disponibles`
              : `${station.name} - ${count} places disponibles`;

            return (
              <Marker 
                key={station.number} 
                position={[station.position.latitude, station.position.longitude]}
                icon={icon}
                title={title}
              >
                <Popup>
                  <StationMarker station={station} />
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
      {loading && <p>Chargement des stations...</p>}
      {error && <p style={{color: 'red'}}>Erreur : {error}</p>}
    </div>
  );
};

export default MapView; 