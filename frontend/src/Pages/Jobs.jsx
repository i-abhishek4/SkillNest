import React, { useEffect, useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  "Writing & Translation",
  "Programming & Development",
  "Administrative & Secretarial",
  "Design & Art",
  "Business & Finance",
  "Sales & Marketing",
  "Others"
];

export const Jobs = () => {
    const navigate = useNavigate();
    const [jobs,setJobs]=useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    useEffect(()=>{
        const fetchJobs=async()=>{
            try{
                const response=await axios.get('http://localhost:3000/projects');
                setJobs(response.data.filter(job => job.status === 'open'));
            }catch(err){
                console.log(err.message);
                toast.error("Loading jobs failed :"+ err.message)
            }
        }
        fetchJobs();
    },[]);

    // Filter jobs by search and category
    const filteredJobs = jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? job.category === category : true;
      return matchesSearch && matchesCategory;
    });

    if (jobs.length === 0) return <p>No jobs available at the moment.</p>;

  return (
    <div className='p-8 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Available Projects</h1>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredJobs.map((job) => (
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
