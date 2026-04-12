import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="navbar-brand">
        <span className="navbar-brand-dot" />
        ScholarshipMS
      </Link>

      {user && (
        <ul className="navbar-nav">
          {user.role === 'student' ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/scholarships">Scholarships</NavLink></li>
              <li><NavLink to="/my-applications">My Applications</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink to="/admin">Dashboard</NavLink></li>
              <li><NavLink to="/admin/scholarships">Scholarships</NavLink></li>
              <li><NavLink to="/admin/applications">Applications</NavLink></li>
            </>
          )}
        </ul>
      )}

      <div className="navbar-end">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>

        {user && (
          <>
            <span className={`navbar-role-badge ${user.role}`}>{user.role}</span>
            <div className="navbar-avatar" title={user.name}>{initials}</div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
