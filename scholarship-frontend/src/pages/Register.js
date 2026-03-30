import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    studentId: '', course: '', year: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create account</h2>
        <p>Register to apply for scholarships</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Your full name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="Min. 6 characters" required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.role === 'student' && (
            <>
              <div className="form-group">
                <label>Student ID (optional)</label>
                <input name="studentId" value={form.studentId}
                  onChange={handleChange} placeholder="e.g. STU2024001" />
              </div>
              <div className="form-group">
                <label>Course (optional)</label>
                <input name="course" value={form.course}
                  onChange={handleChange} placeholder="e.g. B.Tech CSE" />
              </div>
              <div className="form-group">
                <label>Year (optional)</label>
                <input name="year" type="number" value={form.year}
                  onChange={handleChange} placeholder="e.g. 2" min={1} max={6} />
              </div>
            </>
          )}

          <button className="btn btn-primary" style={{ width: '100%' }}
            type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
