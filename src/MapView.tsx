import React,{ useState  } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useStations, { Station } from './useStations';
import StationMarker from './StationMarker';
import L from 'leaflet';

type DisplayMode = 'bikes' | 'stands' | 'electricalBikes';

const lyonPosition: [number, number] = [45.75, 4.85]; // Latitude, Longitude de Lyon

const MapView: React.FC = () => {
  const { stations, loading, error } = useStations();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('bikes');

  return (
    <div style={{ height: '90vh', width: '98%', margin: '5px', borderRadius: '8px', overflow: 'hidden' }}>
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
        <select 
          value={displayMode} 
          onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
          style={{ 
            padding: '5px', 
            borderRadius: '3px', 
            border: '1px solid #ccc',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="bikes">Vélos disponibles</option>
          <option value="stands">Places disponibles</option>
          <option value="electricalBikes">Vélos électriques</option>
        </select>
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
              : displayMode === 'stands'
              ? station.mainStands.availabilities.stands
              : station.mainStands.availabilities.electricalInternalBatteryBikes;
            
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                background-color: ${count > 0 ? '#4CAF50' : '#f44336'};
                color: white;
                border-radius: 50%;
                width: 15px;
                height: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 8px;
                border: 1px solid white;
                box-shadow: 0 1px 2px rgba(0,0,0,0.3);
              ">${count}</div>`,
              iconSize: [15, 15],
              iconAnchor: [7.5, 7.5]
            });

            const title = displayMode === 'bikes' 
              ? `${station.name} - ${count} vélos disponibles`
              : displayMode === 'stands'
              ? `${station.name} - ${count} places disponibles`
              : `${station.name} - ${count} vélos électriques disponibles`;

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