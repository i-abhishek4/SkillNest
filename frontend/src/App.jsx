import { useState } from 'react'
import { Signup } from './Pages/Signup'
import { Login } from './Pages/Login';
import {FreelancerDashboard} from './Pages/FreelancerDashboard';
import {ClientDashboard} from './Pages/ClientDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {


  return (
    <Router>
       <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/freelancer/dashboard' element={<FreelancerDashboard/>}/>
        <Route path='/client/dashboard' element={<ClientDashboard/>}/>
      </Routes>
    </Router>
    // <div>
    //   <Login/>
    //   <ToastContainer position="top-right" autoClose={3000} />
    // </div>
  )
}

export default App
