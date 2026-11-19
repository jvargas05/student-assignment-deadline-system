import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/assignments', label: 'Assignments', icon: '☰', end: true },
  { to: '/assignments/new', label: 'Add new', icon: '+', end: true },
];

export default function Navbar() {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="brand"
          aria-label="DUE or DOOM home"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <img
            src="/DOD_LOGO.png"
            alt="DUE or DOOM logo"
            style={{
              height: '42px',
              width: 'auto',
              objectFit: 'contain',
              transform: isLogoHovered ? 'scale(1.25)' : 'scale(1)',
              transition: 'transform 0.25s ease',
            }}
          />
          <span style={{ fontWeight: 800, letterSpacing: '0.5px' }}>
            <span style={{ color: '#FFB703' }}>DUE</span>{' '}
            <span style={{ color: '#E2E8F0', fontSize: '0.85em', fontWeight: 600 }}>or</span>{' '}
            <span style={{ color: '#FF4D4D' }}>DOOM</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              <span className="nav-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
