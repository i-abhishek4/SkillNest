import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancer = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/freelancer/${id}`);
        setFreelancer(res.data);
        // Fetch completed projects for this freelancer
        const projRes = await axios.get(`http://localhost:3000/projects?assignedTo=${id}&status=completed`);
        setProjects(projRes.data);
      } catch (err) {
        setError("Failed to load freelancer profile.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFreelancer();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!freelancer) return <div className="p-8 text-center">Freelancer not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      {/* Basic Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{freelancer.name}</h1>
          <p className="text-gray-700 mb-1">Email: {freelancer.email}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Send Message</button>
      </div>

      {/* Skills */}
      {freelancer.skills && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Bio & Career Goals */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700 mb-2">{freelancer.bio || "No bio provided."}</p>
        {freelancer.careerGoals && (
          <p className="text-gray-600 italic">Career Goals: {freelancer.careerGoals}</p>
        )}
      </div>

      {/* Portfolio / Past Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Portfolio / Completed Projects</h2>
        {projects.length === 0 ? (
          <div className="text-gray-500">No completed projects yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
                <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                <p className="text-gray-700 mb-2 line-clamp-3">{project.description}</p>
                {project.techStack && (
                  <div className="mb-2">
                    <span className="font-semibold">Tech Stack:</span> {Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}
                  </div>
                )}
                {project.screenshot && (
                  <img src={project.screenshot} alt="Project Screenshot" className="w-full h-32 object-cover rounded mb-2" />
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Project</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 