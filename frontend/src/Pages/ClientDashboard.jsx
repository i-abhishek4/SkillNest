import React from 'react';

 export const ClientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
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


