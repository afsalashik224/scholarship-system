import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getApplicationById,
  updateApplicationStatus,
  getDocumentsByApplication,
} from '../services/api';
import StatusBadge from '../components/StatusBadge';

/* ── Info row helper ───────────────────────────────── */
const InfoRow = ({ label, value }) => (
  <div style={{ marginBottom: 'var(--space-4)' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
      {label}
    </div>
    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
      {value || '—'}
    </div>
  </div>
);

/* ── Decision button helper ────────────────────────── */
const DecisionBtn = ({ onClick, disabled, className, children }) => (
  <button className={`btn ${className}`} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

/* ── Main component ────────────────────────────────── */
const AdminApplicationReview = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [app,      setApp]      = useState(null);
  const [docs,     setDocs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [remarks,  setRemarks]  = useState('');
  const [saving,   setSaving]   = useState(null);  // 'approved' | 'rejected' | 'under_review' | null
  const [alert,    setAlert]    = useState(null);  // { type, message }

  useEffect(() => {
    Promise.all([getApplicationById(id), getDocumentsByApplication(id)])
      .then(([aRes, dRes]) => {
        setApp(aRes.data.application);
        setRemarks(aRes.data.application.adminRemarks ?? '');
        setDocs(dRes.data.documents);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecision = async (status) => {
    setAlert(null);
    setSaving(status);
    try {
      const res = await updateApplicationStatus(id, { status, adminRemarks: remarks });
      setApp(res.data.application);
      setAlert({ type: 'success', message: `Application marked as ${status.replace('_', ' ')}.` });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message ?? 'Update failed.' });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="spinner-wrap"><div className="spinner" /><span>Loading application…</span></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="page">
        <div className="alert alert-error">Application not found.</div>
      </div>
    );
  }

  const { student, scholarship, status, statement, createdAt, reviewedBy, reviewedAt } = app;

  return (
    <div className="page">

      {/* ── Breadcrumb ── */}
      <div className="breadcrumb">
        <a href="/admin">Dashboard</a>
        <span className="breadcrumb-sep">/</span>
        <a href="/admin/applications">Applications</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Review</span>
      </div>

      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>{scholarship?.title}</h1>
          <p>Submitted {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="page-header-actions">
          <StatusBadge status={status} />
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-5)', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div>

          {/* Student profile */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="card-header">
              <div>
                <div className="card-title">Student profile</div>
                <div className="card-description">Applicant details</div>
              </div>
              {reviewedBy && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Reviewed by</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{reviewedBy.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(reviewedAt).toLocaleDateString()}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--space-8)' }}>
              <InfoRow label="Full name"   value={student?.name} />
              <InfoRow label="Email"       value={student?.email} />
              <InfoRow label="Student ID"  value={student?.studentId} />
              <InfoRow label="Course"      value={student?.course} />
              <InfoRow label="Year"        value={student?.year ? `Year ${student.year}` : null} />
              <InfoRow label="Scholarship" value={`${scholarship?.category} · ${scholarship?.title}`} />
            </div>
          </div>

          {/* Personal statement */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="card-header">
              <div className="card-title">Personal statement</div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {statement}
            </p>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Supporting documents</div>
                <div className="card-description">{docs.length} file{docs.length !== 1 ? 's' : ''} uploaded</div>
              </div>
            </div>

            {docs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No documents uploaded for this application.
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Label</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map(doc => (
                      <tr key={doc._id}>
                        <td>
                          <a
                            href={`/uploads/${doc.filename}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--brand-600)', fontWeight: 500 }}
                          >
                            {doc.originalName}
                          </a>
                        </td>
                        <td>
                          <span className="badge badge-category">
                            {doc.label?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          {(doc.size / 1024).toFixed(1)} KB
                        </td>
                        <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Decision panel ── */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-6))' }}>
            <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
              <div>
                <div className="card-title">Decision</div>
                <div className="card-description">Current status: <StatusBadge status={status} /></div>
              </div>
            </div>

            {alert && (
              <div className={`alert alert-${alert.type}`} style={{ marginBottom: 'var(--space-4)' }}>
                {alert.message}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="remarks">
                Remarks to student
                <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> (optional)</span>
              </label>
              <textarea
                id="remarks"
                className="form-textarea"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Explain your decision or provide feedback…"
                rows={4}
              />
              <div className="form-hint">Visible to the student after a decision is made.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <DecisionBtn
                className="btn-success"
                disabled={!!saving || status === 'approved'}
                onClick={() => handleDecision('approved')}
              >
                {saving === 'approved'
                  ? <><span className="btn-spinner" /> Approving…</>
                  : '✓ Approve application'}
              </DecisionBtn>

              <DecisionBtn
                className="btn-secondary"
                disabled={!!saving || status === 'under_review'}
                onClick={() => handleDecision('under_review')}
              >
                {saving === 'under_review'
                  ? <><span className="btn-spinner" /> Updating…</>
                  : '🔍 Mark as under review'}
              </DecisionBtn>

              <DecisionBtn
                className="btn-danger"
                disabled={!!saving || status === 'rejected'}
                onClick={() => handleDecision('rejected')}
              >
                {saving === 'rejected'
                  ? <><span className="btn-spinner" /> Rejecting…</>
                  : '✕ Reject application'}
              </DecisionBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationReview;
