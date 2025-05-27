import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto w-full">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        {/* About - Left */}
        <div className="flex-1 text-left md:text-left">
          <h2 className="text-xl font-semibold mb-3">SkillNest</h2>
          <p className="text-sm text-gray-300 max-w-xs">
            Empowering students and freshers to showcase their talent and build real-world projects through freelancing.
          </p>
        </div>

        {/* Quick Links - Center */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/signup" className="hover:underline">Signup</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
          </ul>
        </div>

        {/* Contact - Right */}
        <div className="flex-1 text-left">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <ul className="text-sm space-y-1 text-gray-300 max-w-xs">
            <li>Email: support@skillnest.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Hyderabad, India</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-sm text-gray-400 border-t border-gray-700 py-4">
        © {new Date().getFullYear()} SkillNest. All rights reserved.
      </div>
    </footer>
  );
};


