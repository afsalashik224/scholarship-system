# Student Scholarship Management System — Frontend

## Stack
- React 18
- React Router v6
- Axios (API calls)
- Plain CSS (no external UI library)

## Setup

```bash
npm install
npm start       # runs on http://localhost:3000
```

The `"proxy": "http://localhost:5000"` in `package.json` forwards all
`/api/*` requests to the Express backend automatically during development.
Make sure the backend is running before starting the frontend.

## Folder structure

```
src/
├── App.js                         # Route definitions
├── index.js                       # React entry point
├── index.css                      # Global styles
├── context/
│   └── AuthContext.js             # Login state, token persistence
├── services/
│   └── api.js                     # All Axios API calls
├── components/
│   ├── Navbar.js                  # Role-aware navigation bar
│   ├── PrivateRoute.js            # Auth + role guards
│   └── StatusBadge.js            # Coloured status pill
└── pages/
    ├── Login.js
    ├── Register.js
    ├── StudentDashboard.js        # Stats + open scholarships + recent apps
    ├── ScholarshipList.js         # Searchable scholarship listing
    ├── ScholarshipDetail.js       # Detail view + apply form
    ├── MyApplications.js          # Student's application history
    ├── ApplicationDetail.js       # View status, upload/delete docs
    ├── AdminDashboard.js          # Admin stats + recent applications
    ├── AdminScholarships.js       # Create / edit / delete scholarships
    ├── AdminApplications.js       # All applications with status filter
    └── AdminApplicationReview.js  # Review, approve, reject application
```

## Routes

### Public
| Path        | Page       |
|-------------|------------|
| /login      | Login      |
| /register   | Register   |

### Student (role: student)
| Path                  | Page                  |
|-----------------------|-----------------------|
| /dashboard            | Student dashboard     |
| /scholarships         | Scholarship list      |
| /scholarships/:id     | Scholarship detail    |
| /my-applications      | My applications       |
| /applications/:id     | Application detail    |

### Admin (role: admin)
| Path                        | Page                        |
|-----------------------------|-----------------------------|
| /admin                      | Admin dashboard             |
| /admin/scholarships         | Manage scholarships         |
| /admin/applications         | All applications            |
| /admin/applications/:id     | Review application          |

## How auth works

1. On login/register the backend returns a `token`.
2. The token is stored in `localStorage` and attached to every Axios request via an interceptor.
3. On app load, `AuthContext` calls `/api/auth/me` to restore the session.
4. `PrivateRoute` redirects unauthenticated users to `/login`.
5. `RoleRoute` redirects users to their own dashboard if they try to access the wrong role's pages.
