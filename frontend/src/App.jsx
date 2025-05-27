import { useState } from 'react'
import { Signup } from './Pages/Signup'
import { Login } from './Pages/Login';
import { FreelancerDashboard } from './Pages/FreelancerDashboard';
import { ClientDashboard } from './Pages/ClientDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Components/Header';



function App() {

  const FindJobs = () => <div className="p-4 text-xl">Find Jobs Page (Coming Soon)</div>;
  const FindFreelancers = () => <div className="p-4 text-xl">Find Freelancers Page (Coming Soon)</div>;
  const Home=()=> <div className='p-4 text-xl'>This is Home page(Coming Soom!)</div>
  const Profile=()=> <div className='p-4 text-xl'> This is profile page</div>

  return (
    <Router>
      <Header />
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/jobs" element={<FindJobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/freelancers" element={<FindFreelancers />} />
        <Route path='/freelancer/dashboard' element={<FreelancerDashboard />} />
        <Route path='/client/dashboard' element={<ClientDashboard />} />
      </Routes>
    </Router>
    // <div>
    //   <Login/>
    //   <ToastContainer position="top-right" autoClose={3000} />
    // </div>
  )
}

export default App
