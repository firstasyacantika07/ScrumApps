import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Billing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/billing').then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Billing</h1>
      {data.map(b => (
        <div key={b.id}>Rp{b.amount} - {b.status}</div>
      ))}
    </div>
  );
}