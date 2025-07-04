import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa"
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import {toast} from "react-toastify";

export const Header = () => {
    const { user, role, isLoggedIn, logout } = useContext(AuthContext);
    console.log(isLoggedIn);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const user = localStorage.getItem("user");
    //     setLoggedIn(!!user);
    // }, []);

    const handleLogin =()=> navigate("/login");
    const handleLogout=async()=>{
        await logout();
        toast.success("Logged out successfully");
    }
    return (
        <header className='bg-white shadow-md py-4 px-6'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                <Link to="/" className='text-2xl font-bold text-blue-600'>
                    <img src="/logo.png" alt="logo" className="h-8 inline mr-2" />
                    SkillNext
                </Link>


                <nav className='space-x-6 text-gray-700 hidden md:flex'>
                    <Link to="/" className='hover:text-blue-600'>Home</Link>
                    {(!isLoggedIn || role !== "client") && (
                      <Link to="/jobs" className="hover:text-blue-600">Find Jobs</Link>
                    )}
                    <Link to="/freelancers" className="hover:text-blue-600">Find Freelancers</Link>
                    {isLoggedIn && (
                      <Link to={`/${role}/dashboard`} className="hover:text-blue-600">Profile</Link>
                    )}
                </nav>
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Logout
                    </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Login
                        </button>

                    )}
                </div>
            </div>
        </header>
    )
}
