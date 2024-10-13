import { useState, useEffect } from 'react';
import ROIChart from '../components/ROIChart';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/analyze')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        setData(data);
      })
      .catch(e => {
        console.error('Error fetching data:', e);
        setError(e.message);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ROI Analysis Dashboard</h1>
      <ROIChart data={data} />
    </div>
  );
}
