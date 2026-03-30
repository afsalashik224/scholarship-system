import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const registerUser   = (data)       => API.post('/auth/register', data);
export const loginUser      = (data)       => API.post('/auth/login', data);
export const getMe          = ()           => API.get('/auth/me');
export const updateProfile  = (data)       => API.put('/auth/profile', data);

// ── Scholarships ──────────────────────────────────────────
export const getScholarships      = ()     => API.get('/scholarships');
export const getScholarshipById   = (id)   => API.get(`/scholarships/${id}`);
export const createScholarship    = (data) => API.post('/scholarships', data);
export const updateScholarship    = (id, data) => API.put(`/scholarships/${id}`, data);
export const deleteScholarship    = (id)   => API.delete(`/scholarships/${id}`);

// ── Applications ──────────────────────────────────────────
export const applyForScholarship      = (data)         => API.post('/applications', data);
export const getMyApplications        = ()             => API.get('/applications/mine');
export const getAllApplications        = (params)       => API.get('/applications', { params });
export const getApplicationById       = (id)           => API.get(`/applications/${id}`);
export const updateApplicationStatus  = (id, data)     => API.put(`/applications/${id}/status`, data);

// ── Documents ─────────────────────────────────────────────
export const uploadDocument           = (formData)     => API.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getDocumentsByApplication = (applicationId) => API.get(`/documents/${applicationId}`);
export const deleteDocument            = (id)          => API.delete(`/documents/file/${id}`);
