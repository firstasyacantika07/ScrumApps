import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const columns = ['todo', 'progress', 'review', 'done'];

const TaskBoard = ({ projectId }) => {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {

      const res = await api.get(
        `/projects/${projectId}/tasks`
      );

      setTasks(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-5">

      {columns.map((col) => (

        <div
          key={col}
          className="bg-gray-50 rounded-3xl p-4"
        >

          <h2 className="font-bold capitalize mb-4">
            {col}
          </h2>

          <div className="space-y-3">

            {tasks
              .filter((task) => task.status === col)
              .map((task) => (

                <div
                  key={task.id}
                  className="bg-white rounded-2xl border p-4"
                >

                  <h3 className="font-bold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2">
                    {task.description}
                  </p>

                </div>

            ))}

          </div>

        </div>

      ))}

    </div>
  );
};

export default TaskBoard;