import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApps = (status = '') => {
    setLoading(true);
    getAllApplications(status ? { status } : {})
      .then(res => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const handleFilter = e => {
    setStatusFilter(e.target.value);
    fetchApps(e.target.value);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>All Applications</h1>
        <select value={statusFilter} onChange={handleFilter}
          style={{ padding: '8px 14px', borderRadius: 6, border: '1.5px solid #ddd', fontSize: '0.875rem' }}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : applications.length === 0 ? (
          <div className="empty">No applications found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Scholarship</th>
                  <th>Applied on</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td><strong>{app.student?.name}</strong></td>
                    <td>{app.student?.email}</td>
                    <td>{app.scholarship?.title}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <Link className="btn btn-primary btn-sm"
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

export default AdminApplications;
