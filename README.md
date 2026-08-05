# SkillSphere

SkillSphere is a full-stack project-management and skill-sharing web application.

The platform allows users to manage their profiles, discover and manage projects, upload project files, track activities, view analytics, and receive notifications through a centralized dashboard.

The project consists of a React frontend and a Django REST API backend.

---

## Features

- User registration and login
- JWT-based authentication
- Access-token refresh
- Protected and guest-only routes
- Google login support
- User profile management
- Dashboard with metrics and activity charts
- Recent activity tracking
- Project listing and project discovery
- Project detail pages
- Project creation and management
- Project file and media upload
- Project filtering and tag-based search
- Project likes
- User activity logs
- Notifications system
- Global search
- Responsive layout
- Sidebar, top bar, and mobile menu
- Theme management
- Background task processing with Celery and Redis

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts
- Lucide React
- PostCSS
- Autoprefixer

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- Celery
- Redis

---

## Project Structure
```text
SkillSphere/
│
├── front-end/
│   ├── src/
│   │   ├── api/                 # API communication modules
│   │   ├── components/          # Reusable React components
│   │   ├── contexts/            # Global application contexts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Application pages
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Utility functions
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── back-end/
│   ├── api/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── middleware.py
│   │   ├── models.py
│   │   ├── notifications.py
│   │   ├── serializers.py
│   │   ├── tasks.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── skillsphere/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   │
│   └── manage.py
│
├── README.md
└── .gitignore
