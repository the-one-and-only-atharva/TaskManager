import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.js';

export function useStarsApi() {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiFetch('/api/stars');
      setStars(resp?.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStars();
  }, [fetchStars]);

  return { stars, loading, error, refetch: fetchStars };
}


