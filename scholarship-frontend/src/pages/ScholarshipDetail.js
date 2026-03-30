import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScholarshipById, applyForScholarship, getMyApplications } from '../services/api';

const ScholarshipDetail = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [statement,   setStatement]   = useState('');
  const [applied,     setApplied]     = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  useEffect(() => {
    Promise.all([getScholarshipById(id), getMyApplications()])
      .then(([sRes, aRes]) => {
        setScholarship(sRes.data.scholarship);
        const alreadyApplied = aRes.data.applications.some(
          a => a.scholarship?._id === id
        );
        setApplied(alreadyApplied);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await applyForScholarship({ scholarshipId: id, statement });
      setSuccess('Application submitted successfully!');
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!scholarship) return <div className="page"><div className="alert alert-error">Scholarship not found.</div></div>;

  const expired = new Date(scholarship.deadline) < new Date();

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}
        onClick={() => navigate(-1)}>← Back</button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <h1 style={{ fontSize: '1.4rem', color: '#1a1a2e' }}>{scholarship.title}</h1>
          <span className={`badge badge-${expired ? 'inactive' : 'active'}`}>
            {expired ? 'Closed' : 'Open'}
          </span>
        </div>
        <div className="card-meta" style={{ marginTop: 8 }}>
          Category: {scholarship.category} &nbsp;·&nbsp;
          Deadline: {new Date(scholarship.deadline).toLocaleDateString()} &nbsp;·&nbsp;
          Posted by: {scholarship.createdBy?.name}
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#eee' }} />

        <h3 style={{ marginBottom: 8, fontSize: '0.95rem', color: '#444' }}>Description</h3>
        <p style={{ color: '#555', marginBottom: 18, lineHeight: 1.7 }}>{scholarship.description}</p>

        <h3 style={{ marginBottom: 8, fontSize: '0.95rem', color: '#444' }}>Eligibility</h3>
        <p style={{ color: '#555', lineHeight: 1.7 }}>{scholarship.eligibility}</p>
      </div>

      {/* Apply form */}
      {!expired && (
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Apply for this scholarship</h2>

          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-error">{error}</div>}
          {applied && !success && (
            <div className="alert alert-info">You have already applied for this scholarship.</div>
          )}

          {!applied && (
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Personal statement</label>
                <textarea
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  placeholder="Explain why you deserve this scholarship (min. 20 characters)…"
                  rows={5}
                  required
                  minLength={20}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit application'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ScholarshipDetail;
