import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScholarships, getAllApplications } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [scholarships,  setScholarships]  = useState([]);
  const [applications,  setApplications]  = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getScholarships(), getAllApplications()])
      .then(([sRes, aRes]) => {
        setScholarships(sRes.data.scholarships);
        setApplications(aRes.data.applications);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const pending  = applications.filter(a => a.status === 'pending').length;
  const review   = applications.filter(a => a.status === 'under_review').length;
  const approved = applications.filter(a => a.status === 'approved').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <Link className="btn btn-primary" to="/admin/scholarships">+ New Scholarship</Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{scholarships.length}</div>
          <div className="stat-label">Total scholarships</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{applications.length}</div>
          <div className="stat-label">Total applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#856404' }}>{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#084298' }}>{review}</div>
          <div className="stat-label">Under review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#155724' }}>{approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#842029' }}>{rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Recent applications</h2>
          <Link className="btn btn-outline btn-sm" to="/admin/applications">View all</Link>
        </div>
        {applications.length === 0 ? (
          <div className="empty">No applications yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Scholarship</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 6).map(app => (
                  <tr key={app._id}>
                    <td>{app.student?.name}</td>
                    <td>{app.scholarship?.title}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <Link className="btn btn-outline btn-sm"
                        to={`/admin/applications/${app._id}`}>Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
