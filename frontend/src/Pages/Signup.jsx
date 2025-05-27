import React, { useState,useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    skills: [],
    bio: ""
  });

  const {login}=useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload={
      role,
      email:formData.email,
      password:formData.password,
    }
    if(role==="client"){
      payload.companyName=formData.companyName;
    }else if(role==="freelancer"){
      payload.name=formData.name;
      payload.skills=formData.skills;
      payload.bio=formData.bio;
    }

    try {
      const endpoint=
        role==="client"
          ? "http://localhost:3000/client/register"
          : "http://localhost:3000/freelancer/register"
      const response = await axios.post(endpoint, payload);
      if (response.data.success) {
        const user=response.data.user;
                login(user,role);
                toast.success(response.data.message,{
                    onClose: () => navigate(`/${role}/dashboard`),
                    autoClose: 1500});
      } else {
        toast.error("Signup failed: " + response.data.message);
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      toast.error("Signup failed: " + (error.response?.data?.message || error.message));
    }

    console.log("Signup data", formData);
  }
  const handleSkillKeyDown = (e) => {
    if (e.key === " " && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }))
      }
      setSkillInput("");
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Sign Up
        </h2>
        <div className='flex justify-center mb-6'>
          <button type='button' onClick={() => setRole("client")} className={`w-1/2 px-4 py-4 rounded-l border border-blue-500 ${role === "client" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}>
            Client
          </button>
          <button type='button' onClick={() => setRole("freelancer")} className={`w-1/2 px-4 py-4 rounded-r border border-blue-500 ${role === "freelancer" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}>
            Freelancer
          </button>
        </div>
        {role === "client" && (
          <>
            <label className='block mb-2 font-semibold'>Company Name</label>
            <input type="text" name='companyName' value={formData.companyName} onChange={handleChange} placeholder='sample Company Inc.'
              className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />
          </>
        )}
        {role === "freelancer" && (
          <>
            <label className='block mb-2 font-semibold'>Name</label>
            <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Your name'
              className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />
            <label className='block mb-2 font-semibold'>Skills</label>
            <div className="w-full mb-4 p-3 border border-gray-300 rounded flex flex-wrap gap-2 bg-white">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 hover:text-red-700 font-bold ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type and press space"
                className="flex-grow outline-none"
              />
            </div>
            <label className='block mb-2 font-semibold'>Bio</label>
            <input type="text" name='bio' value={formData.bio} onChange={handleChange} placeholder='Your name'
              className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />
          </>

        )}


        <label className='block mb-2 font-semibold'>Email</label>
        <input type="text" name='email' value={formData.email} onChange={handleChange} placeholder='freelancer@gmail.com'
          className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />

        <label className='block mb-2 font-semibold'>Password</label>
        <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder='********'
          className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />

        <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition'>Create Account</button>
      </form>



    </div>
  );
};

