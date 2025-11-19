import React from 'react';
import { login } from './auth';
import './Login.css';

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <h1>Spotify Stats</h1>
      <p>View your top artists and tracks.</p>
      <button onClick={login} className="login-btn">
        Log in with Spotify
      </button>
    </div>
  );
};

export default Login;

