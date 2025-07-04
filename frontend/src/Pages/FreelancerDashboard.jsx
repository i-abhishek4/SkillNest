import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const FreelancerDashboard = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:3000/projects');
        setProjects(res.data);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id || user?.id) fetchProjects();
  }, [user]);

  if (!isLoggedIn) {
    return <p className="p-8 text-center">Please login first.</p>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  // Filter projects for this freelancer
  const appliedProjects = projects.filter(p => p.applications?.includes(user.id || user._id));
  const assignedProjects = projects.filter(p => (p.assignedTo === (user.id || user._id)) && p.status !== 'completed');
  const completedProjects = projects.filter(p => (p.assignedTo === (user.id || user._id)) && p.status === 'completed');

  const handleMarkCompleted = async (projectId) => {
    try {
      await axios.put(`http://localhost:3000/freelancer/complete/${projectId}`, {}, { withCredentials: true });
      toast.success('Project marked as completed!');
      // Refresh projects
      const res = await axios.get('http://localhost:3000/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to mark as completed.');
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Freelancer Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {user.name}!</h1>
          <p className="text-gray-700">Email: {user.email}</p>
          {user.skills && (
            <p className="text-gray-700">Skills: {user.skills.join(', ')}</p>
          )}
          {user.bio && (
            <p className="text-gray-700">Bio: {user.bio}</p>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <SummaryCard label="Applied Projects" value={appliedProjects.length} color="bg-blue-100 text-blue-700" />
        <SummaryCard label="Assigned Projects" value={assignedProjects.length} color="bg-green-100 text-green-700" />
        <SummaryCard label="Completed Projects" value={completedProjects.length} color="bg-gray-200 text-gray-700" />
      </div>

      {/* Project Lists */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Assigned Projects (In Progress)</h2>
        {assignedProjects.length === 0 ? (
          <div className="text-gray-500">No assigned projects yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} onComplete={handleMarkCompleted} />
            ))}
          </div>
        )}
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Applied Projects</h2>
        {appliedProjects.length === 0 ? (
          <div className="text-gray-500">No applied projects yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
        {completedProjects.length === 0 ? (
          <div className="text-gray-500">No completed projects yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ label, value, color }) => (
  <div className={`rounded-lg p-5 shadow ${color} flex flex-col items-center`}>
    <span className="text-lg font-medium mb-1">{label}</span>
    <span className="text-3xl font-bold">{value}</span>
  </div>
);

// Project Card Component
const ProjectCard = ({ project, onComplete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full">
      <h3 className="text-xl font-bold text-blue-700 mb-2">{project.title}</h3>
      <p className="text-gray-700 mb-2 line-clamp-3">{project.description}</p>
      <div className="mb-2">
        <span className="font-semibold">Skills:</span> {project.requiredSkills?.join(', ') || 'N/A'}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Budget:</span> ₹{project.budget}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Status:</span> {project.status}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Posted By:</span> {project.postedBy?.companyName || 'Unknown'}
      </div>
      {onComplete && project.status !== 'completed' && (
        <button
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => onComplete(project._id)}
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
};


