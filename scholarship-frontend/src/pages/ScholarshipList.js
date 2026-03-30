import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScholarships } from '../services/api';

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    getScholarships()
      .then(res => setScholarships(res.data.scholarships))
      .finally(() => setLoading(false));
  }, []);

  const filtered = scholarships.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Scholarships</h1>
        <input
          style={{ padding: '8px 14px', borderRadius: 6, border: '1.5px solid #ddd', width: 220 }}
          placeholder="Search by title or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No scholarships found.</div>
      ) : (
        <div className="grid-2">
          {filtered.map(s => {
            const expired = new Date(s.deadline) < new Date();
            return (
              <div className="card" key={s._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="card-title">{s.title}</div>
                  <span className={`badge badge-${expired ? 'inactive' : 'active'}`}>
                    {expired ? 'Closed' : 'Open'}
                  </span>
                </div>
                <div className="card-meta">
                  {s.category} · Deadline: {new Date(s.deadline).toLocaleDateString()}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: 14 }}>
                  {s.description.slice(0, 120)}…
                </p>
                <Link className="btn btn-primary btn-sm" to={`/scholarships/${s._id}`}>
                  View details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;
