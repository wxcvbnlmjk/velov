import { useState, useEffect } from 'react';

export interface Station {
  number: number;
  name: string;
  address: string;
  position: { latitude: number; longitude: number };
  mainStands: {
    availabilities: {
      bikes: number;
      stands: number;
      electricalInternalBatteryBikes: number;
    };
  };
  status: string;
}

const API_KEY = `3545a5f8f32561a9eb6f100c7838b47510e19c2a`; //process.env.REACT_APP_JCDECAUX_API_KEY || 
const API_URL = `https://api.jcdecaux.com/vls/v3/stations?contract=Lyon&apiKey=${API_KEY}`;

const useStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur lors de la récupération des stations');
      const data = await response.json();
      setStations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    const interval = setInterval(fetchStations, 30000); // 30 secondes pour des données d'activité plus réactives
    return () => clearInterval(interval);
  }, []);

  return { stations, loading, error };
};

export default useStations; 