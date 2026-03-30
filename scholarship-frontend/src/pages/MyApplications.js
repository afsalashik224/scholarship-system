import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(res => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Applications</h1>
      </div>

      {applications.length === 0 ? (
        <div className="empty">
          You haven't applied to any scholarships yet.{' '}
          <Link to="/scholarships">Browse scholarships →</Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Scholarship</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Applied on</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td><strong>{app.scholarship?.title || '—'}</strong></td>
                    <td>{app.scholarship?.category || '—'}</td>
                    <td>{app.scholarship?.deadline ? new Date(app.scholarship.deadline).toLocaleDateString() : '—'}</td>
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
        </div>
      )}
    </div>
  );
};

export default MyApplications;
