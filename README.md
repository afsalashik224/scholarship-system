# Student Scholarship Management System

A full-stack web application built with React + Node.js/Express + MongoDB.
Designed as a simple, clean student project.

## Project structure

```
scholarship-system/
├── scholarship-backend/     Node.js + Express + MongoDB
└── scholarship-frontend/    React 18
```

## Quick start

### 1. Backend

```bash
cd scholarship-backend
npm install
cp .env.example .env
# Edit .env: add your MONGO_URI and a JWT_SECRET
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend (new terminal)

```bash
cd scholarship-frontend
npm install
npm start
# Runs on http://localhost:3000
```

The React dev server proxies all `/api/*` requests to `localhost:5000` automatically.

---

## Features

### Student
- Register and log in
- Browse active scholarships (search by title/category)
- Apply with a personal statement
- Track application status (pending → under review → approved/rejected)
- Upload supporting documents (PDF, JPG, PNG) per application
- Delete own documents

### Admin
- Create, edit, and deactivate scholarships
- View all applications with status filter
- Review individual applications (student profile + documents)
- Approve, reject, or mark applications as under review
- Add remarks to decisions

---

## Tech stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcryptjs                    |
| Uploads    | Multer (local disk)               |

---

## Environment variables (backend)

| Variable    | Description                                |
|-------------|--------------------------------------------|
| PORT        | Server port (default 5000)                 |
| MONGO_URI   | MongoDB connection string (Atlas or local) |
| JWT_SECRET  | Secret key for signing JWTs               |
| NODE_ENV    | development or production                  |

---

## API summary

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile

GET    /api/scholarships
GET    /api/scholarships/:id
POST   /api/scholarships          (admin)
PUT    /api/scholarships/:id      (admin)
DELETE /api/scholarships/:id      (admin)

POST   /api/applications          (student)
GET    /api/applications/mine     (student)
GET    /api/applications          (admin)
GET    /api/applications/:id
PUT    /api/applications/:id/status  (admin)

POST   /api/documents/upload
GET    /api/documents/:applicationId
DELETE /api/documents/file/:id
```

---

## Notes

- Keep `.env` out of version control — it contains secrets.
- The `uploads/` folder stores files locally. For production, use Cloudinary or S3.
- Passwords are hashed with bcrypt before storage — never stored in plain text.
- JWT tokens expire after 7 days.
