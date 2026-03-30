import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScholarships, getMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [scholarships,  setScholarships]  = useState([]);
  const [applications,  setApplications]  = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getScholarships(), getMyApplications()])
      .then(([sRes, aRes]) => {
        setScholarships(sRes.data.scholarships);
        setApplications(aRes.data.applications);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const pending  = applications.filter(a => a.status === 'pending').length;
  const approved = applications.filter(a => a.status === 'approved').length;
  const active   = scholarships.filter(s => new Date(s.deadline) > new Date()).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome, {user.name}</h1>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{active}</div>
          <div className="stat-label">Open scholarships</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{applications.length}</div>
          <div className="stat-label">My applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{approved}</div>
          <div className="stat-label">Approved</div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Recent applications</h2>
          <Link className="btn btn-outline btn-sm" to="/my-applications">View all</Link>
        </div>

        {applications.length === 0 ? (
          <div className="empty">
            No applications yet.{' '}
            <Link to="/scholarships">Browse scholarships</Link> to get started.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Scholarship</th>
                  <th>Applied on</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map(app => (
                  <tr key={app._id}>
                    <td>{app.scholarship?.title || '—'}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <Link className="btn btn-outline btn-sm" to={`/applications/${app._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Open scholarships */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Open scholarships</h2>
          <Link className="btn btn-outline btn-sm" to="/scholarships">View all</Link>
        </div>
        <div className="grid-2">
          {scholarships.filter(s => new Date(s.deadline) > new Date()).slice(0, 4).map(s => (
            <div className="card" key={s._id} style={{ margin: 0 }}>
              <div className="card-title">{s.title}</div>
              <div className="card-meta">
                {s.category} · Deadline: {new Date(s.deadline).toLocaleDateString()}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: 12 }}>
                {s.description.slice(0, 100)}…
              </p>
              <Link className="btn btn-primary btn-sm" to={`/scholarships/${s._id}`}>
                Details &amp; Apply
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
