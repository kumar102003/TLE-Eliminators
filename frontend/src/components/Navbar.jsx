import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">TLE</Link>
        
        <button 
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/past" className="nav-link" onClick={() => setIsMenuOpen(false)}>Past Contests</Link>
          <Link to="/bookmarks" className="nav-link" onClick={() => setIsMenuOpen(false)}>Bookmarks</Link>
          <Link to="/add-solution" className="nav-link" onClick={() => setIsMenuOpen(false)}>Add Solution</Link>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 