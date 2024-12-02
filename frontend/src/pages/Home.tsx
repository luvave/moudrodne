import React, { useEffect, useState } from 'react';
import { fetchSayings } from '../api/sayings';
import { Saying } from '@shared/types'; // Shared type for consistency

export const Home = () => {
  const [sayings, setSayings] = useState<Saying[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSayings = async () => {
      try {
        setLoading(true);
        const data = await fetchSayings();
        console.log(data);
        setSayings(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch sayings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSayings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sayings</h1>
      {sayings?.length === 0 ? (
        <p className="text-gray-500">No sayings found. Be the first to create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sayings?.map((saying) => (
            <div key={saying.text}>
              {saying.text}
              {saying.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
