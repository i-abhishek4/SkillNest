import React,{ useContext} from 'react';
import { AuthContext } from '../contexts/AuthContext';

 export const FreelancerDashboard = () => {
    const {user,role,isLoggedIn} = useContext(AuthContext);
    console.log("User",user)

  if (!isLoggedIn) {
    return <p>Please login first.</p>;
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Add more user info or dashboard content */}
    </div>
  );
};


