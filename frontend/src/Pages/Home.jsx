import React from 'react';
import { useNavigate } from 'react-router-dom';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Freelancer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'SkillNest helped me find amazing projects and grow my freelance career!'
  },
  {
    name: 'Rahul Verma',
    role: 'Client',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'We found talented freelancers for our startup. The process was smooth and quick.'
  },
  {
    name: 'Aisha Khan',
    role: 'Freelancer',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote: 'The platform is user-friendly and the support is excellent!'
  }
];

 export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-16 md:py-24 gap-10 md:gap-0">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Are you a <span className="text-blue-600">Freelancer?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md">
            Discover projects that match your skills. Join SkillNest and unlock new opportunities.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 animate-bounceIn"
          >
            Find Jobs
          </button>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex items-center justify-center animate-fadeIn">
          {/* Minimal vector illustration (SVG) */}
          <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-44 md:w-80 md:h-56">
            <ellipse cx="160" cy="200" rx="120" ry="20" fill="#E0E7FF"/>
            <rect x="90" y="60" width="140" height="80" rx="18" fill="#3B82F6"/>
            <rect x="110" y="80" width="100" height="40" rx="10" fill="#fff"/>
            <circle cx="160" cy="100" r="12" fill="#3B82F6"/>
            <rect x="130" y="130" width="60" height="10" rx="5" fill="#60A5FA"/>
          </svg>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full bg-white py-14 px-6 md:px-0 flex flex-col items-center animate-fadeInUp" id="about">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What is SkillNest?</h2>
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl text-center mb-8">
          SkillNest connects skilled freelancers with clients looking for quality work. Whether you want to showcase your talent or need a project done, SkillNest is your trusted platform for seamless collaboration.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-3 rounded-lg text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Post a Project
        </button>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-14 px-6 md:px-0 bg-gradient-to-r from-blue-50 to-green-50 animate-fadeIn" id="testimonials">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">What People Say</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 md:justify-center scrollbar-hide">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="min-w-[280px] max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-4 border-blue-100 shadow" />
              <p className="text-gray-700 text-base italic mb-3 text-center">"{t.quote}"</p>
              <span className="font-semibold text-blue-700">{t.name}</span>
              <span className="text-sm text-gray-500">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Animations (TailwindCSS + keyframes) */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.9); }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .animate-fadeIn { animation: fadeIn 1.2s ease both; }
        .animate-bounceIn { animation: bounceIn 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55) both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
