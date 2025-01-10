import { useEffect, useState } from 'react';

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('/api/token', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch accessToken');

        const data = await response.json();
        setAccessToken(data.accessToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccessToken();
  }, []);

  return accessToken;
};

export default useAccessToken;
