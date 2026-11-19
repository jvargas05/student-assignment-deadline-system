import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/assignments', label: 'Assignments', icon: '☰', end: true },
  { to: '/assignments/new', label: 'Add new', icon: '+', end: true },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="DueTrack home">
          <span className="brand-mark" aria-hidden="true">D</span>
          DueTrack
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
