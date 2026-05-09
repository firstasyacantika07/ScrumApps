import React, { useState, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  NavLink,
  useParams,
  Navigate
} from 'react-router-dom';

import {
  Briefcase,
  Eye,
  Target,
  RefreshCw,
  Code2,
  Calendar,
  Users,
  LayoutDashboard,
  Bell,
  ActivitySquare
} from 'lucide-react';

import api from '../api/axios';
import Layout from '../components/shared/Layout';

import VisionBoard from '../components/project/VisionBoard';
import Backlog from '../components/project/Backlog';
import Sprint from '../components/project/Sprint';
import TaskBoard from '../components/project/TaskBoard';
import Development from '../components/project/Development';
import Members from '../components/project/Members';
import CalendarPage from '../components/project/CalendarPage';
import Notifications from '../components/project/Notifications';
import ActivityLogs from '../components/project/ActivityLogs';

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(`/projects/${id}`);

      setProject(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Layout title={project?.name}>

      <div className="space-y-6">

        {/* HEADER */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <Briefcase size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {project?.name}
              </h1>

              <p className="text-gray-400 mt-1">
                {project?.description}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <InfoCard title="Status" value={project?.status} />
            <InfoCard title="Start Date" value={project?.start_date} />
            <InfoCard title="End Date" value={project?.end_date} />
            <InfoCard title="Members" value={project?.member_total || 0} />

          </div>

        </div>

        {/* TAB */}
        <div className="bg-white p-2 rounded-2xl border border-gray-100 flex flex-wrap gap-2">

          <TabLink to="vision-board" icon={<Eye size={16} />} label="Vision Board" />
          <TabLink to="backlog" icon={<Target size={16} />} label="Backlog" />
          <TabLink to="sprint" icon={<RefreshCw size={16} />} label="Sprint" />
          <TabLink to="task-board" icon={<Code2 size={16} />} label="Task Board" />
          <TabLink to="development" icon={<Code2 size={16} />} label="Development" />
          <TabLink to="calendar" icon={<Calendar size={16} />} label="Calendar" />
          <TabLink to="members" icon={<Users size={16} />} label="Members" />
          <TabLink to="notifications" icon={<Bell size={16} />} label="Notifications" />
          <TabLink to="logs" icon={<ActivitySquare size={16} />} label="Activity Logs" />

        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 min-h-[600px]">

          <Routes>


            <Route path="vision-board" element={<VisionBoard projectId={id} />} />

            <Route path="backlog" element={<Backlog projectId={id} />} />

            <Route path="sprint" element={<Sprint projectId={id} />} />

            <Route path="task-board" element={<TaskBoard projectId={id} />} />

            <Route path="development" element={<Development projectId={id} />} />

            <Route path="calendar" element={<CalendarPage projectId={id} />} />

            <Route path="members" element={<Members projectId={id} />} />

            <Route path="notifications" element={<Notifications projectId={id} />} />

            <Route path="logs" element={<ActivityLogs projectId={id} />} />

          </Routes>

        </div>

      </div>

    </Layout>
  );
};

const TabLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition
      ${
        isActive
          ? 'bg-red-500 text-white'
          : 'text-gray-500 hover:bg-gray-50'
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

const InfoCard = ({ title, value }) => (
  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

    <p className="text-sm text-gray-400">
      {title}
    </p>

    <h3 className="font-bold text-xl mt-2 text-gray-700">
      {value}
    </h3>

  </div>
);

export default ProjectDetail;