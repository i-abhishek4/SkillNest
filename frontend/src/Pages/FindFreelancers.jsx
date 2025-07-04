import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SKILL_OPTIONS = [
  "JavaScript", "Python", "Java", "React", "Node.js", "MERN", "UI/UX", "Copywriting", "Data Entry", "Photoshop", "Accounting", "SEO", "Marketing"
];

export const FindFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const navigate = useNavigate();

  const fetchFreelancers = async (query = "", skillFilter = "") => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/freelancer?`;
      if (query) url += `name=${query}&`;
      if (skillFilter) url += `skill=${skillFilter}`;
      const res = await axios.get(url);
      setFreelancers(res.data);
    } catch (err) {
      console.error("Failed to fetch freelancers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers(search.trim(), skill);
  }, [search, skill]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-4 text-center">Find Freelancers</h2>

      <div className="max-w-xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={skill}
          onChange={e => setSkill(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Skills</option>
          {SKILL_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : freelancers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div
              key={freelancer._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 p-6 cursor-pointer"
              onClick={() => navigate(`/freelancer/${freelancer._id}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{freelancer.name}</h3>
              <p className="text-gray-600 mb-4">{freelancer.bio}</p>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No freelancers found.</p>
      )}
    </div>
  );
};


