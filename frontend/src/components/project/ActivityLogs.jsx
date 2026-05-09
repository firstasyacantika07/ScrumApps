import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ActivityLogs = ({ projectId }) => {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {

    try {

      const res = await api.get(
        `/projects/${projectId}/logs`
      );

      setLogs(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">

      {logs.map((log) => (

        <div
          key={log.id}
          className="border-l-4 border-red-500 bg-gray-50 p-5 rounded-r-2xl"
        >

          <h3 className="font-bold">
            {log.activity}
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            {log.created_at}
          </p>

        </div>

      ))}

    </div>
  );
};

export default ActivityLogs;