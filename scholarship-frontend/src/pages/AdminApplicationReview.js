import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getApplicationById, updateApplicationStatus,
  getDocumentsByApplication,
} from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AdminApplicationReview = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [documents,   setDocuments]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [remarks,     setRemarks]     = useState('');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  useEffect(() => {
    Promise.all([getApplicationById(id), getDocumentsByApplication(id)])
      .then(([aRes, dRes]) => {
        setApplication(aRes.data.application);
        setRemarks(aRes.data.application.adminRemarks || '');
        setDocuments(dRes.data.documents);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecision = async (status) => {
    setError(''); setSuccess(''); setSaving(true);
    try {
      const res = await updateApplicationStatus(id, { status, adminRemarks: remarks });
      setApplication(res.data.application);
      setSuccess(`Application marked as ${status}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!application) return <div className="page"><div className="alert alert-error">Application not found.</div></div>;

  const { student, scholarship, status, statement, createdAt, reviewedBy, reviewedAt } = application;

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}
        onClick={() => navigate('/admin/applications')}>← Back to applications</button>

      {/* Student + scholarship info */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', color: '#1a1a2e', marginBottom: 4 }}>
              {scholarship?.title}
            </h1>
            <div className="card-meta">
              Applied {new Date(createdAt).toLocaleDateString()} &nbsp;·&nbsp;
              Category: {scholarship?.category}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#eee' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>STUDENT</p>
            <p style={{ fontWeight: 600 }}>{student?.name}</p>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>{student?.email}</p>
            {student?.studentId && <p style={{ fontSize: '0.85rem', color: '#555' }}>ID: {student.studentId}</p>}
            {student?.course    && <p style={{ fontSize: '0.85rem', color: '#555' }}>{student.course} · Year {student.year}</p>}
          </div>
          {reviewedBy && (
            <div>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>REVIEWED BY</p>
              <p style={{ fontWeight: 600 }}>{reviewedBy?.name}</p>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>{new Date(reviewedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>Personal statement</h3>
        <p style={{ color: '#555', lineHeight: 1.75 }}>{statement}</p>
      </div>

      {/* Documents */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', marginBottom: 14 }}>
          Supporting documents ({documents.length})
        </h2>
        {documents.length === 0 ? (
          <div className="empty" style={{ padding: '16px 0' }}>No documents uploaded.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>File</th><th>Label</th><th>Size</th><th>Uploaded</th></tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc._id}>
                    <td>
                      <a href={`/uploads/${doc.filename}`} target="_blank" rel="noreferrer"
                        style={{ color: '#1a1a2e', fontWeight: 500 }}>
                        {doc.originalName}
                      </a>
                    </td>
                    <td>{doc.label?.replace('_', ' ')}</td>
                    <td>{(doc.size / 1024).toFixed(1)} KB</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decision panel */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', marginBottom: 16 }}>Decision</h2>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label>Admin remarks (optional)</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
            placeholder="Add feedback or reason for your decision…" rows={3} />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" disabled={saving || status === 'under_review'}
            onClick={() => handleDecision('under_review')}>
            Mark as Under Review
          </button>
          <button className="btn btn-success" disabled={saving || status === 'approved'}
            onClick={() => handleDecision('approved')}>
            {saving ? 'Saving…' : 'Approve'}
          </button>
          <button className="btn btn-danger" disabled={saving || status === 'rejected'}
            onClick={() => handleDecision('rejected')}>
            {saving ? 'Saving…' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationReview;
