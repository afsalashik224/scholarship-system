# Student Scholarship Management System — Backend

## Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **File uploads**: Multer

## Quick start

```bash
npm install
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm run dev               # starts with nodemon
```

## Folder structure

```
scholarship-backend/
├── server.js
├── .env.example
├── config/
│   └── db.js
├── models/
│   ├── User.js           role: student | admin
│   ├── Scholarship.js    title, description, eligibility, deadline, category
│   ├── Application.js    status: pending | under_review | approved | rejected
│   └── Document.js       label: id_proof | marksheet | income_certificate | other
├── controllers/
│   ├── authController.js
│   ├── scholarshipController.js
│   ├── applicationController.js
│   └── documentController.js
├── routes/
│   ├── authRoutes.js
│   ├── scholarshipRoutes.js
│   ├── applicationRoutes.js
│   └── documentRoutes.js
├── middleware/
│   └── authMiddleware.js   protect | adminOnly | studentOnly
└── uploads/
```

## API reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth  `/api/auth`

| Method | Endpoint    | Auth     | Body / Notes                        |
|--------|-------------|----------|-------------------------------------|
| POST   | /register   | Public   | name, email, password, role         |
| POST   | /login      | Public   | email, password                     |
| GET    | /me         | Any user | Returns logged-in user              |
| PUT    | /profile    | Any user | name, studentId, course, year       |

### Scholarships  `/api/scholarships`

| Method | Endpoint | Auth        | Notes                              |
|--------|----------|-------------|------------------------------------|
| GET    | /        | Any user    | Students see active only           |
| GET    | /:id     | Any user    |                                    |
| POST   | /        | Admin only  | title, description, eligibility, deadline, category |
| PUT    | /:id     | Admin only  | Any scholarship fields             |
| DELETE | /:id     | Admin only  |                                    |

### Applications  `/api/applications`

| Method | Endpoint       | Auth         | Notes                                       |
|--------|----------------|--------------|---------------------------------------------|
| POST   | /              | Student only | scholarshipId, statement                    |
| GET    | /mine          | Student only | Student's own applications                  |
| GET    | /              | Admin only   | All — filter: ?status=pending&scholarshipId=|
| GET    | /:id           | Student/Admin| Student can only see their own              |
| PUT    | /:id/status    | Admin only   | status, adminRemarks                        |

Application statuses: `pending` → `under_review` → `approved` or `rejected`

### Documents  `/api/documents`

| Method | Endpoint           | Auth     | Notes                                        |
|--------|--------------------|----------|----------------------------------------------|
| POST   | /upload            | Any user | form-data: document (file), applicationId, label |
| GET    | /:applicationId    | Any user | Student sees only their own                  |
| DELETE | /file/:id          | Any user | Student can only delete their own            |

Accepted file types: PDF, JPG, PNG — max 5 MB

Document labels: `id_proof`, `marksheet`, `income_certificate`, `recommendation_letter`, `other`

## Testing with Postman / Thunder Client

1. Register → POST `/api/auth/register`
2. Login → POST `/api/auth/login` → copy the `token`
3. Add header `Authorization: Bearer <token>` to all other requests
4. For file upload → set body to **form-data**, add a `document` file field

## Notes

- Never commit your `.env` file.
- The `uploads/` folder stores files locally — fine for a student project.
- For production, swap Multer local storage for Cloudinary or AWS S3.
