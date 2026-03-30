import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
        ScholarshipMS
      </Link>

      {user && (
        <ul className="navbar-links">
          {user.role === 'student' ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/scholarships">Scholarships</Link></li>
              <li><Link to="/my-applications">My Applications</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/admin">Dashboard</Link></li>
              <li><Link to="/admin/scholarships">Scholarships</Link></li>
              <li><Link to="/admin/applications">Applications</Link></li>
            </>
          )}
          <li><span className="navbar-role">{user.role}</span></li>
          <li><span style={{ color: '#aaa', fontSize: '0.85rem' }}>{user.name}</span></li>
          <li>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}
              style={{ color: '#fff', borderColor: '#555' }}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
