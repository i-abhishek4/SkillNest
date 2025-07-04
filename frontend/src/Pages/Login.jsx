import React, { useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate,useLocation } from 'react-router-dom';
import {Link} from "react-router-dom"
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


export const Login = () => {
    const navigate = useNavigate();
    const location=useLocation();
    const [role, setRole] = useState("freelancer");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const {login} =useContext(AuthContext);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            role,
            email: formData.email,
            password: formData.password
        }

        try {
            const endpoint = (role === 'client')
                ? "http://localhost:3000/client/login"
                : "http://localhost:3000/freelancer/login"

            const response = await axios.post(endpoint, payload,{withCredentials:true});
            if (response.data.success) {
                const user=response.data.user;
                login(user,role);
                toast.success(response.data.message);
                const redirectTo = location.state?.from ||`/${role}/dashboard`;
                navigate(redirectTo);
                
            } else {
                toast.error("Login failed: ", response.data.message);
            }

        } catch (err) {
            console.log("Error occcured", err.response?.data || err.message);
            toast.error("Login failed: " + (err.response?.data?.message || err.message));
        }
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
            <form onSubmit={handleSubmit} className='bg-white rounded p-8 shadow-md'>
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                    Login
                </h2>

                <div className='flex justify-center mb-6'>
                    <button type='button' onClick={() => setRole("client")} className={`w-1/2 px-4 py-4 rounded-l border border-blue-500 ${role === "client" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}>
                        Client
                    </button>
                    <button type='button' onClick={() => setRole("freelancer")} className={`w-1/2 px-4 py-4 rounded-r border border-blue-500 ${role === "freelancer" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}>
                        Freelancer
                    </button>
                </div>

                <label className='block mb-2 font-semibold'>Email</label>
                <input type="text" name='email' value={formData.email} onChange={handleChange} placeholder='sample@gmail.com'
                    className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />

                <label className='block mb-2 font-semibold'>Password</label>
                <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder='********'
                    className='w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400' required />

                <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition'>Create Account</button>
                <Link to="/signup" className='block text-center text-blue-700 hover:underline'>
                    Don't have an account? Signup
                </Link>
            </form>
        </div>
    )
}
