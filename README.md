# 🚀 FormPilot

FormPilot is a full-stack, self-hosted alternative to Google Forms. It empowers users to create, share, and manage forms and responses via an intuitive and polished interface. Designed for scalability, simplicity, and independence, FormPilot is ideal for individuals and small teams seeking control over their form data without relying on third-party SaaS platforms.

---

## 📈 Live Demo

Explore the live demo here:
**[https://form-pilot.vercel.app](https://form-pilot.vercel.app)**

---

## 🚀 Key Features

### 🔑 Secure Authentication

- User registration and login with JWT-based authentication.
- Passwords are hashed securely with bcrypt.
- Session persistence using localStorage for a seamless user experience.

### 🌐 Serverless & Scalable Backend

- RESTful API powered by Express.js and PostgreSQL.
- Deployed to AWS Lambda with API Gateway for elastic scaling and cost efficiency.
- Environment variables and secrets managed via AWS SSM Parameter Store.

### 🧩 Powerful Form Builder

- Drag-and-drop UI built with React DnD for flexible form creation.
- Supports a wide range of input types:
  - Text Input
  - Number Input
  - Date Picker
  - Dropdown Select
  - Checkbox
  - Multiple Choice
- Fully customizable fields:
  - Edit labels in real-time.
  - Toggle required status.
  - Dynamically add/remove options.

### 🌍 Public Form Submissions

- Generate unique submission links for each form.
- Anyone can submit responses without authentication.
- Real-time validation of required fields for better data quality.

### 📊 Robust Response Management

- View all responses tied to a specific form.
- Sort responses by ID, date, or field values.
- Search through responses for quick data retrieval.
- **Note:** Data export (CSV/JSON) is planned and not available in the current version.

### 🎨 Sleek & Responsive UI

- Tailwind CSS ensures a clean and professional look.
- Thoughtful layout and visual hierarchy for easy navigation.
- Smooth interactions enhance the user experience.
- **Note:** Mobile optimization is in progress for better accessibility on smaller devices.

### 🚀 CI/CD and Deployment Workflow

- Frontend deployed via Vercel with Speed Insights enabled.
- Backend deployed using Serverless Framework to AWS Lambda.
- Frontend Dockerized for local development and portability.
- Automated CI/CD pipeline with GitHub Actions for Docker image builds and pushes.

---

## 👩‍💻 Tech Stack

| Frontend           | Backend                 | DevOps / Tools           |
| ------------------ | ----------------------- | ------------------------ |
| React + TypeScript | Node.js + Express.js    | AWS Lambda & API Gateway |
| Tailwind CSS       | PostgreSQL (Supabase)   | Docker, GitHub Actions   |
| React DnD          | JWT Auth (jsonwebtoken) | Serverless Framework     |
| Vercel (Frontend)  |                         | AWS SSM Parameter Store  |

---

## 🚀 Quick Start (Docker)

### Clone & Run Frontend Locally

```bash
git clone https://github.com/saidarsht/FormPilot.git
cd FormPilot
docker-compose up --build
```

Access the app at `http://localhost:3000`

> 🚨 Ensure `REACT_APP_API_URL` in `client/.env` points to your API Gateway endpoint.

### Deploy Backend (AWS Lambda)

```bash
cd server
serverless deploy
```

Make sure AWS SSM secrets `/formpilot/DATABASE_URL` and `/formpilot/JWT_SECRET` are configured.

---

## 📁 Project Structure

```
FormPilot/
├── client/               # React Frontend
│   ├── src/components/   # UI Components
│   ├── public/           # Static Assets (favicon, manifest)
│   └── Dockerfile        # Dockerfile for frontend
├── server/               # Backend API
│   ├── routes/           # Express Routes (auth, forms, responses)
│   ├── middleware/       # JWT Authentication Middleware
│   ├── serverless.yml    # AWS Lambda Deployment Config
│   └── .github/workflows # GitHub Actions Workflow
├── docker-compose.yml    # Docker Compose Setup for Frontend
└── README.md             # This file
```

---

## 📁 Environment Variables

### Client (`client/.env`)

```env
REACT_APP_API_URL=https://<your-api-gateway-url>/dev/api
```

### Server (`server/.env`)

```env
DATABASE_URL=postgresql://<your-db-url>
JWT_SECRET=your_jwt_secret
PORT=5000
```

> 🔐 In production, environment variables are pulled from AWS SSM.

---

## 🌧️ Deployment Notes

### Frontend (Vercel)

1. Deploy the `client/` directory via Vercel.
2. Set `REACT_APP_API_URL` as a Vercel environment variable.
3. Speed Insights integrated using `@vercel/speed-insights/react`.
4. Automatic deployment from the `main` branch.

### Backend (AWS Lambda)

- Deploy with Serverless Framework.
- Manage secrets with AWS SSM Parameter Store.
- Leverages API Gateway for secure and scalable HTTP access.

---

## 📈 Planned Enhancements

- ✅ **File Uploads** for users when submitting forms.
- ✅ **Rate Limiting** on API endpoints for enhanced security.
- ✅ **Unit Tests** with Jest for robust testing.
- ✅ **Export Responses** functionality for data portability.
- ✅ **Analytics Dashboard** for visualizing submission trends.
- ✅ **Dark Mode** toggle for improved UI accessibility.

---

## 📄 License

Licensed under the [MIT License](./LICENSE.md). Open for personal and commercial use.

---

## 🙌 Credits & Acknowledgments

- Developed by **Saidarsh Tukkadi**.
- Inspired by the simplicity and utility of Google Forms.
- Built with modern web technologies and a serverless-first architecture.
