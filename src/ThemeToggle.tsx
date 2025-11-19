import React from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isLight, toggleTheme }) => {
  return (
    <div className="theme-toggle-wrapper" onClick={toggleTheme} title="Toggle Theme">
      <div className={`theme-toggle ${isLight ? 'light' : 'dark'}`}>
        <div className="toggle-switch"></div>
      </div>
    </div>
  );
};

export default ThemeToggle;

