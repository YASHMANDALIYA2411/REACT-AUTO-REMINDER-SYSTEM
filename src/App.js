import { useState, useEffect } from 'react';
import './App.css';
import Loginform from './Loginform';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const sessionAge = Date.now() - userData.sessionStart;
      if (sessionAge > 15 * 60 * 1000) {
        localStorage.removeItem('currentUser');
        alert('Session expired for security');
      } else {
        setUser(userData);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Loginform onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
