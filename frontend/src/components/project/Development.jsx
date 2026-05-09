import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Development = ({ projectId }) => {

  const [developments, setDevelopments] = useState([]);

  useEffect(() => {
    fetchDevelopment();
  }, []);

  const fetchDevelopment = async () => {

    try {

      const res = await api.get(
        `/projects/${projectId}/developments`
      );

      setDevelopments(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold mb-6">
        Development Progress
      </h2>

      <div className="space-y-5">

        {developments.map((dev) => (

          <div
            key={dev.id}
            className="border rounded-3xl p-5"
          >

            <div className="flex justify-between">

              <h3 className="font-bold">
                {dev.title}
              </h3>

              <span className="text-sm text-gray-400">
                {dev.progress}%
              </span>

            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full mt-4 overflow-hidden">

              <div
                style={{
                  width: `${dev.progress}%`
                }}
                className="bg-red-500 h-full rounded-full"
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Development;