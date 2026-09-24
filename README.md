# EduManage Portal — Aether Academy

An AI-integrated, modern Education Workspace & Student-Faculty Portal built with Next.js 16, React 19, Tailwind CSS v4, Prisma ORM, and Google Gemini AI.

---

## 🚀 Key Features

### 🎓 Student Workspace
- **Academic Dashboard & AI Health Score:** Real-time academic risk analysis, attendance tracking, and actionable study recommendations.
- **Course Hub:** View enrolled courses, syllabus outlines, and lecture schedules.
- **Interactive Coding Lab:** In-browser coding playground with automated evaluation and feedback.
- **Grades & GPA Analytics:** Real-time tracking of semester GPA, performance breakdown by subject, and historical progress.
- **Financial & Tuition Portal:** Fee management, itemized breakdown, and receipt records.
- **Campus Life:** Book reservation and library tracker, grievances/support ticketing, and placement drive portal.

### 👩‍🏫 Faculty Workspace
- **Classroom Management:** Attendance tracking, syllabus tracking, and course schedules.
- **AI-Assisted Grading:** Intelligent essay/assignment evaluation and automated rubric feedback via Gemini.
- **Exam Management:** Online exam creation, publishing, and automated evaluation.
- **Mentorship Tracking:** Student advising log, risk alerts, and 1-on-1 meeting records.

### 🛡️ Administrator Hub
- **Institutional Oversight:** High-level metrics, system performance, student retention alerts, and user directory.
- **Security Checkpoints:** Multi-factor authentication (2FA) verification and role-based access control.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
- **UI & Styling:** React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Visualizations:** Recharts
- **Database & ORM:** SQLite with [Prisma ORM](https://www.prisma.io/)
- **AI Engine:** Google Gemini AI (`@google/genai`)
- **Authentication:** JWT & bcrypt password hashing

---

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sowmithran-balu/EDUMANAGE-PORTAL.git
cd EDUMANAGE-PORTAL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optionally add your `GEMINI_API_KEY` in `.env` to enable live AI grading and student insight generation).*

### 4. Setup the database
Run Prisma migrations and seed the database with demo accounts:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Launch the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | 2FA Code (if prompted) |
|---|---|---|---|
| **Student** | `sarah@school.com` | `student123` | — |
| **Student (Advanced)** | `alex@school.com` | `student123` | — |
| **Teacher** | `teacher@school.com` | `teacher123` | — |
| **Administrator** | `admin@school.com` | `admin123` | `123456` |
