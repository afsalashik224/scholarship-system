import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScholarships, getMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

/* ── Stat card helper ──────────────────────────────── */
const StatCard = ({ value, label, accent, icon }) => (
  <div className="stat-card" style={{ '--stat-accent': accent, '--stat-icon-bg': `${accent}18` }}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-label">{label}</div>
  </div>
);

/* ── Main component ────────────────────────────────── */
const StudentDashboard = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([getScholarships(), getMyApplications()])
      .then(([sRes, aRes]) => {
        setScholarships(sRes.data.scholarships);
        setApplications(aRes.data.applications);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="spinner-wrap"><div className="spinner" /><span>Loading your dashboard…</span></div>
      </div>
    );
  }

  const now       = new Date();
  const open      = scholarships.filter(s => new Date(s.deadline) > now);
  const pending   = applications.filter(a => a.status === 'pending').length;
  const approved  = applications.filter(a => a.status === 'approved').length;
  const inReview  = applications.filter(a => a.status === 'under_review').length;

  return (
    <div className="page">

      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Good to see you, {user.name.split(' ')[0]}</h1>
          <p>Here's a summary of your scholarship activity.</p>
        </div>
        <div className="page-header-actions">
          <Link className="btn btn-primary" to="/scholarships">
            Browse scholarships
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        <StatCard value={open.length}           label="Open scholarships" accent="#10b981" icon="🎓" />
        <StatCard value={applications.length}   label="Applications made" accent="#6366f1" icon="📄" />
        <StatCard value={pending}               label="Pending review"    accent="#f59e0b" icon="⏳" />
        <StatCard value={inReview}              label="Under review"      accent="#8b5cf6" icon="🔍" />
        <StatCard value={approved}              label="Approved"          accent="#059669" icon="✅" />
      </div>

      {/* ── Recent applications ── */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <div className="card-title">Recent applications</div>
              <div className="card-description">Your last {Math.min(applications.length, 5)} submissions</div>
            </div>
            <Link className="btn btn-secondary btn-sm" to="/my-applications">View all</Link>
          </div>

          {applications.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No applications yet"
              description="Find a scholarship and submit your first application to see it here."
              action={
                <Link className="btn btn-primary btn-sm" to="/scholarships">
                  Browse scholarships
                </Link>
              }
            />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Scholarship</th>
                    <th>Category</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map(app => (
                    <tr key={app._id}>
                      <td className="td-primary">{app.scholarship?.title ?? '—'}</td>
                      <td>
                        <span className="badge badge-category">
                          {app.scholarship?.category ?? '—'}
                        </span>
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>
                        <Link className="btn btn-ghost btn-sm" to={`/applications/${app._id}`}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Open scholarships ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <div className="card-title" style={{ fontSize: '1rem' }}>Open scholarships</div>
            <div className="card-description">{open.length} available right now</div>
          </div>
          <Link className="btn btn-secondary btn-sm" to="/scholarships">See all</Link>
        </div>

        {open.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="🔭"
              title="No open scholarships"
              description="Check back later — new scholarships are added regularly."
            />
          </div>
        ) : (
          <div className="scholarship-grid">
            {open.slice(0, 3).map(s => {
              const daysLeft = Math.ceil((new Date(s.deadline) - now) / 86400000);
              return (
                <div className="scholarship-card" key={s._id}>
                  <div className="scholarship-card-header">
                    <div className="scholarship-card-title">{s.title}</div>
                    <span className="badge badge-active">Open</span>
                  </div>
                  <div className="scholarship-card-meta">
                    <span className="badge badge-category">{s.category}</span>
                    <span>{daysLeft}d left</span>
                  </div>
                  <p className="scholarship-card-body">{s.description}</p>
                  <Link className="btn btn-primary btn-sm" to={`/scholarships/${s._id}`}>
                    View &amp; Apply
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
