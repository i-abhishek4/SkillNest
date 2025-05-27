import React, { useEffect, useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Jobs = () => {
    const navigate = useNavigate();
    const [jobs,setJobs]=useState([]);
    useEffect(()=>{
        const fetchJobs=async()=>{
            try{
                const response=await axios.get('http://localhost:3000/projects');
                setJobs(response.data);
            }catch(err){
                console.log(err.message);
                toast.error("Loading jobs failed :"+ err.message)
            }
        }
        fetchJobs();
    },[]);

    if (jobs.length === 0) return <p>No jobs available at the moment.</p>;

  return (
    <div className='p-8 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Available Projects</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => navigate(`/projects/${job._id}`)}
            className='cursor-pointer bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition-shadow'
          >
            <img
              src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Project"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className='text-lg font-semibold text-blue-600'>{job.title}</h2>
            <p className='text-gray-700 mt-1'>{job.description?.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  )
}
