
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// You can later replace this with data from localStorage or an API
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // will contain user data
  const [role, setRole] = useState(null); // 'client' or 'freelancer'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Example of restoring from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    setIsLoggedIn(true);
    // console.log(isLoggedIn);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
