import { useState } from 'react';
import { Button } from '@moudrodne/ui';

export const App = () => {
  const [message, setMessage] = useState<string>('');

  const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}`;

  const handleClick = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hello`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage(`Failed to fetch: ${error}`);
    }
  };

  return (
    <div>
      <Button onClick={handleClick}>Test</Button>
      <div>{message}</div>
    </div>
  );
};
