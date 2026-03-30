import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getScholarships, createScholarship, updateScholarship, deleteScholarship,
} from '../services/api';

const EMPTY_FORM = { title: '', description: '', eligibility: '', deadline: '', category: 'other', isActive: true };

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editing,      setEditing]      = useState(null);   // scholarship being edited
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [error,        setError]        = useState('');
  const [saving,       setSaving]       = useState(false);

  const fetchAll = () =>
    getScholarships().then(res => setScholarships(res.data.scholarships));

  useEffect(() => { fetchAll().finally(() => setLoading(false)); }, []);

  const openNew = () => {
    setEditing(null); setForm(EMPTY_FORM); setError(''); setShowForm(true);
  };

  const openEdit = s => {
    setEditing(s._id);
    setForm({
      title:       s.title,
      description: s.description,
      eligibility: s.eligibility,
      deadline:    s.deadline?.slice(0, 10),
      category:    s.category,
      isActive:    s.isActive,
    });
    setError(''); setShowForm(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      if (editing) {
        await updateScholarship(editing, form);
      } else {
        await createScholarship(form);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this scholarship? This cannot be undone.')) return;
    try {
      await deleteScholarship(id);
      setScholarships(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Scholarships</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Scholarship</button>
      </div>

      {/* Form card */}
      {showForm && (
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', marginBottom: 18 }}>
            {editing ? 'Edit scholarship' : 'New scholarship'}
          </h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
            </div>
            <div className="form-group">
              <label>Eligibility criteria</label>
              <textarea name="eligibility" value={form.eligibility} onChange={handleChange} rows={2} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Deadline</label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="merit">Merit</option>
                  <option value="need-based">Need-based</option>
                  <option value="sports">Sports</option>
                  <option value="research">Research</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input name="isActive" type="checkbox" checked={form.isActive}
                onChange={handleChange} style={{ width: 'auto' }} />
              <label style={{ margin: 0 }}>Active (visible to students)</label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
              </button>
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card">
        {scholarships.length === 0 ? (
          <div className="empty">No scholarships yet. Create one above.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map(s => (
                  <tr key={s._id}>
                    <td><strong>{s.title}</strong></td>
                    <td>{s.category}</td>
                    <td>{new Date(s.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${s.isActive ? 'active' : 'inactive'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-warning btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
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

export default AdminScholarships;
