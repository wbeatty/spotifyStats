import { useEffect, useState, useCallback } from 'react'
import { getAccessToken } from './auth';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css'

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const storedToken = localStorage.getItem('spotify_token');

    if (code) {
      getAccessToken(code).then((accessToken) => {
        if (accessToken) {
           setToken(accessToken);
           localStorage.setItem('spotify_token', accessToken);
           window.history.replaceState({}, document.title, "/"); // Clear URL
        }
      });
    } else if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('verifier');
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      {!token ? (
        <Login />
      ) : (
        <Dashboard 
          token={token} 
          onLogout={handleLogout} 
          isLight={theme === 'light'}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  )
}

export default App
