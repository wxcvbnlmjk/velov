import React  from 'react';
import { Station } from './useStations';

interface StationMarkerProps {
  station: Station;
}

const StationMarker: React.FC<StationMarkerProps> = ({ station }) => {
  return (
    <div>
      <h3>{station.name}</h3>
      <p><strong>Adresse :</strong> {station.address}</p>
      <p><strong>Vélos disponibles :</strong> {station.mainStands.availabilities.bikes}</p>
      <p><strong>Vélos électriques :</strong> {station.mainStands.availabilities.electricalInternalBatteryBikes}</p>
      <p><strong>Bornes libres :</strong> {station.mainStands.availabilities.stands}</p>
      <p><strong>Statut :</strong> {station.status === 'OPEN' ? 'Ouverte' : 'Fermée'}</p>
    </div>
  );
};

export default StationMarker; 