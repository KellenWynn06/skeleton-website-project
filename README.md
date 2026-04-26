# Skeleton Website Project



\# Skeleton Website Project



\## Live App

Frontend: https://skeleton-website-project-ebsz2m1aw-kellenwynn06s-projects.vercel.app

Backend: https://skeleton-backend-e2nx.onrender.com



\---



\## Overview

This is a full-stack web application that allows users to register, log in, and manage personal projects. Each user has isolated data and can create, edit, and delete their own projects.



\---



\## Features

\- User registration and login (JWT authentication)

\- Persistent sessions

\- User-specific project dashboard

\- Create, edit, and delete projects

\- User profile viewing and editing

\- Fully deployed frontend and backend

\- Accessible from any device



\---



\## Tech Stack



\### Frontend

\- React (Vite)

\- JavaScript / CSS

\- Hosted on Vercel



\### Backend

\- FastAPI (Python)

\- SQLAlchemy ORM

\- JWT Authentication

\- Hosted on Render



\### Database

\- PostgreSQL (Supabase)



\---



\## Architecture



Frontend (Vercel)

&#x20;       ↓

FastAPI Backend (Render)

&#x20;       ↓

PostgreSQL Database (Supabase)



\- The frontend communicates with the backend using REST APIs.

\- The backend handles authentication, business logic, and database operations.

\- JWT tokens are used to secure routes and identify users.

\- Each user can only access their own data.



\---



\## API Endpoints (Core)



\### Auth

\- POST /auth/register

\- POST /auth/login



\### Profile

\- GET /profile/me

\- PUT /profile/me



\### Projects

\- GET /projects

\- POST /projects

\- PUT /projects/{id}

\- DELETE /projects/{id}



\---



\## Running Locally



\### Backend

cd backend

uvicorn app.main:app --reload



\### Frontend

cd frontend

npm install

npm run dev



\### Environment Variables



Create a `.env` file in `backend`:



DATABASE\_URL=your\_database\_url

JWT\_SECRET\_KEY=your\_secret\_key



Create a `.env` file in `frontend`:



VITE\_API\_BASE\_URL=http://127.0.0.1:8000



\---



\## Deployment

\- Backend deployed using Render

\- Frontend deployed using Vercel

\- Database hosted on Supabase

\- CORS configured for cross-origin communication



\---



\## Notes

\- Passwords are hashed using bcrypt

\- Authentication uses JWT tokens

\- Database connections use pooled connections in production

\- CORS is configured for both local and production environments



\---



\## Author

Kellen Wynn

