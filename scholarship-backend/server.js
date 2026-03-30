const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically: GET /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ───────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/documents',    require('./routes/documentRoutes'));

// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Scholarship Management API is running', status: 'ok' });
});

// ── 404 handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
