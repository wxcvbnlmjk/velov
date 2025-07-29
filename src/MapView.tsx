import React,{ useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useStations, { Station } from './useStations';
import StationMarker from './StationMarker';
import L from 'leaflet';

type DisplayMode = 'bikes' | 'stands' | 'electricalBikes' | 'activity';

const lyonPosition: [number, number] = [45.75, 4.85]; // Latitude, Longitude de Lyon

const MapView: React.FC = () => {
  const { stations, loading, error } = useStations();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('bikes');
  const initialStationsRef = useRef<Station[]>([]);
  const [activityData, setActivityData] = useState<{[key: string]: number}>({});
  const [hasInitialData, setHasInitialData] = useState(false);

  // Sauvegarder la première réponse et comparer avec les nouvelles données
  useEffect(() => {
    if (stations && stations.length > 0) {
      // Si c'est la première fois qu'on reçoit des données, on les sauvegarde
      if (!hasInitialData) {
        initialStationsRef.current = [...stations];
        setHasInitialData(true);
      } else {
        // Comparer avec les données initiales sauvegardées
        const activity: {[key: string]: number} = {};
        
        stations.forEach(station => {
          const initialStation = initialStationsRef.current.find(s => s.number === station.number);
          if (initialStation) {
            const currentBikes = station.mainStands.availabilities.bikes;
            const initialBikes = initialStation.mainStands.availabilities.bikes;
            activity[station.number] = currentBikes - initialBikes;
          }
        });
        
        setActivityData(activity);
      }
    }
  }, [stations, hasInitialData]);

  // Fonction pour calculer la couleur en fonction de l'activité
  const getActivityColor = (activity: number): string => {
    if (activity === 0) return '#ffffff'; // Blanc pour aucun changement
    
    // Récupérer toutes les valeurs d'activité pour calculer les seuils
    const activities = Object.values(activityData).filter(val => val !== 0);
    if (activities.length === 0) return '#ffffff';
    
    const maxActivity = Math.max(...activities);
    const minActivity = Math.min(...activities);
    const midPositive = maxActivity / 2;
    const midNegative = minActivity / 2;
    
    if (activity > 0) {
      // Plus de vélos - dégradé vert foncé vers bleu foncé
      if (activity >= midPositive) {
        // Dégradé vert foncé vers bleu foncé pour les plus hauts
        const intensity = (activity - midPositive) / (maxActivity - midPositive);
        const green = Math.round(128 - (128 * intensity)); // 128 (vert foncé) à 0
        const blue = Math.round(0 + (128 * intensity)); // 0 à 128 (bleu foncé)
        return `rgb(0, ${green}, ${blue})`;
      } else {
        // Dégradé vert foncé vers vert moyen pour les moyennes
        const intensity = activity / midPositive;
        const green = Math.round(128 + (127 * intensity)); // 128 (vert foncé) à 255 (vert)
        return `rgb(0, ${green}, 0)`;
      }
    } else {
      // Moins de vélos - dégradé orange foncé vers rouge foncé
      if (activity <= midNegative) {
        // Dégradé orange foncé vers rouge foncé pour les plus bas
        const intensity = (activity - midNegative) / (minActivity - midNegative);
        const red = Math.round(255); // 255 (orange foncé) à 255 (rouge foncé)
        const green = Math.round(128 - (128 * intensity)); // 128 (orange foncé) à 0 (rouge foncé)
        return `rgb(${red}, ${green}, 0)`;
      } else {
        // Dégradé orange foncé vers orange moyen pour les moyennes
        const intensity = activity / midNegative;
        const red = Math.round(255); // 255 (orange foncé) à 255 (orange)
        const green = Math.round(128 + (37 * intensity)); // 128 (orange foncé) à 165 (orange)
        return `rgb(${red}, ${green}, 0)`;
      }
    }
  };

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
          <option value="activity">Activité des stations</option>
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
            let count: number;
            let backgroundColor: string;
            let textColor: string = 'white';
            
            if (displayMode === 'activity') {
              const activity = activityData[station.number] || 0;
              count = activity;
              backgroundColor = getActivityColor(activity);
              // Utiliser du noir pour le texte sur fond blanc, blanc pour les autres
              textColor = activity === 0 ? 'black' : 'white';
            } else {
              count = displayMode === 'bikes' 
                ? station.mainStands.availabilities.bikes 
                : displayMode === 'stands'
                ? station.mainStands.availabilities.stands
                : station.mainStands.availabilities.electricalInternalBatteryBikes;
              backgroundColor = count > 0 ? '#4CAF50' : '#f44336';
            }
            
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                background-color: ${backgroundColor};
                color: ${textColor};
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

            const title = displayMode === 'activity'
              ? `${station.name} - ${count > 0 ? '+' : ''}${count} vélos (activité)`
              : displayMode === 'bikes' 
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
      <div style={{
        position: 'absolute',
        bottom: '0px',
        left: '50%',
        transform: 'translateX(-115%)',
        fontSize: '10px',
        color: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 6px',
        borderRadius: '3px',
        zIndex: 1000
      }}>
        <a 
          href="https://github.com/wxcvbnlmjk/velov" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#666', textDecoration: 'none' }}
        >
          https://github.com/wxcvbnlmjk/velov
        </a>
      </div>
    </div>
  );
};

export default MapView; 