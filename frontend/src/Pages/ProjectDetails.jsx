import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {toast} from "react-toastify"

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Failed to load project:", err.message);
      }
    };
    fetchProject();
  }, [id]);

  const handleApply=async ()=>{
    try{
        const res=await axios.post(`http://localhost:3000/freelancer/apply/${id}`,{},{ withCredentials: true });
        toast.success(res.data.message)
    }catch(err){
        toast.error(err.response?.data?.message || "Failed to apply");
    }
  }

  if (!project) return <p className="p-4">Loading project...</p>;

  return (
    <div className="flex max-w-5xl mx-auto mt-5 p-8 bg-white min-h-[70vh]">
      {/* Left side - image */}
      <div className="w-1/2 pr-8">
        <img
          src={project.image || "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt={project.title}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Right side - details */}
      <div className="w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-700 mb-6">{project.description}</p>

          <p className="mb-2"><strong>Budget:</strong> ₹{project.budget}</p>
          <p className="mb-2">
            <strong>Skills Required:</strong> {project.requiredSkills?.join(', ') || 'N/A'}
          </p>
          <p className="mb-2"><strong>Posted By:</strong> {project.postedBy.companyName || 'Unknown'}</p>
          <p className="mb-2"><strong>Category:</strong> {project.category || 'Unknown'}</p>
          <p className="mb-4">
            <strong>Status:</strong> {project.status==="open" ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}
          </p>
        </div>

        {/* Apply button at bottom right */}
        <div className="flex justify-end">
          {project.status==="open" && (
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              onClick={handleApply}
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
