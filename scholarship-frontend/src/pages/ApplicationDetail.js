import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getApplicationById,
  getDocumentsByApplication,
  uploadDocument,
  deleteDocument,
} from '../services/api';
import StatusBadge from '../components/StatusBadge';

const ApplicationDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const fileRef   = useRef();

  const [application, setApplication] = useState(null);
  const [documents,   setDocuments]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [uploading,   setUploading]   = useState(false);
  const [label,       setLabel]       = useState('other');
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  const fetchAll = () => Promise.all([
    getApplicationById(id),
    getDocumentsByApplication(id),
  ]).then(([aRes, dRes]) => {
    setApplication(aRes.data.application);
    setDocuments(dRes.data.documents);
  });

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, [id]);

  const handleUpload = async e => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return setError('Please select a file');

    setError(''); setSuccess(''); setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('applicationId', id);
    formData.append('label', label);

    try {
      await uploadDocument(formData);
      setSuccess('Document uploaded successfully');
      fileRef.current.value = '';
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDocument(docId);
      setDocuments(prev => prev.filter(d => d._id !== docId));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!application) return <div className="page"><div className="alert alert-error">Application not found.</div></div>;

  const { scholarship, student, status, statement, adminRemarks, createdAt } = application;

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}
        onClick={() => navigate(-1)}>← Back</button>

      {/* Application info */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <h1 style={{ fontSize: '1.3rem', color: '#1a1a2e' }}>{scholarship?.title}</h1>
          <StatusBadge status={status} />
        </div>
        <div className="card-meta" style={{ marginTop: 8 }}>
          Applied on {new Date(createdAt).toLocaleDateString()} &nbsp;·&nbsp;
          Student: {student?.name} ({student?.email})
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#eee' }} />

        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>Personal statement</h3>
        <p style={{ color: '#555', lineHeight: 1.7 }}>{statement}</p>

        {adminRemarks && (
          <>
            <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>Admin remarks</h3>
            <p style={{ color: '#555' }}>{adminRemarks}</p>
          </>
        )}
      </div>

      {/* Documents */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', marginBottom: 16 }}>Supporting documents</h2>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {documents.length === 0 ? (
          <div className="empty" style={{ padding: '20px 0' }}>No documents uploaded yet.</div>
        ) : (
          <div className="table-wrap" style={{ marginBottom: 20 }}>
            <table>
              <thead>
                <tr><th>File name</th><th>Label</th><th>Size</th><th>Uploaded</th><th></th></tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc._id}>
                    <td>
                      <a
                        href={`http://localhost:5000/uploads/${doc.filename}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          console.log("CLICKED FILE LINK");
                        }}
                      >
                        {doc.originalName}
                      </a>
                    </td>
                    <td>{doc.label?.replace('_', ' ')}</td>
                    <td>{(doc.size / 1024).toFixed(1)} KB</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(doc._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload form */}
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
            <label>Upload document (PDF / JPG / PNG, max 5 MB)</label>
            <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png"
              style={{ padding: '7px', border: '1.5px solid #ddd', borderRadius: 6, width: '100%' }} />
          </div>
          <div className="form-group" style={{ margin: 0, flex: '0 0 180px' }}>
            <label>Label</label>
            <select value={label} onChange={e => setLabel(e.target.value)}>
              <option value="id_proof">ID proof</option>
              <option value="marksheet">Marksheet</option>
              <option value="income_certificate">Income certificate</option>
              <option value="recommendation_letter">Recommendation letter</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={uploading}
            style={{ marginBottom: 18 }}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationDetail;
