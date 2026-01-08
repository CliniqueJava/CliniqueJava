# 🏥 Clinique — Smart Clinic Management System

A full-stack clinic management platform built with **Spring Boot**, **React**, and an **AI-powered medical agent**. It enables patients to book appointments, doctors to manage their schedules, and admins to oversee the entire clinic — all in one secure, modern interface.

---

## ✨ Features

### 👤 Patient
- Browse and search doctors by specialty
- Book appointments with real-time slot availability
- Receive notifications when a doctor confirms or refuses an appointment
- Chat with an AI medical agent that analyzes symptoms and recommends the right specialist

### 🩺 Doctor
- Secure login with dedicated Doctor Space
- View and manage all assigned appointments
- Confirm or refuse appointments (with required cancellation reason)
- View patient profiles and consultation history

### 🛠️ Admin
- Full dashboard with live stats (patients, doctors, appointments)
- Manage doctors: create accounts with BCrypt-encrypted passwords, set availability
- Manage patients and view all appointments with status filters
- Update appointment statuses directly from the dashboard

### 🤖 AI Medical Agent
- FastAPI-based agent powered by **Groq LLM (LLaMA 3.3)**
- RAG engine using **FAISS** vector store and **HuggingFace** sentence embeddings
- Analyzes patient symptoms and returns possible conditions, risk level, and specialist recommendation
- Fetches matching doctors from the database and displays them as bookable cards

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion, Axios, React Router |
| Backend | Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL |
| AI Agent | FastAPI, LangChain, Groq LLM, FAISS, HuggingFace Embeddings |
| Auth | JWT with role-based access (PATIENT, DOCTOR, ADMIN) |
| Database | MySQL with Hibernate auto DDL |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+, Maven
- Node.js 18+
- Python 3.10+
- MySQL 8+

### Backend
```bash
cd backend
# Configure application.properties with your MySQL credentials
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### AI Agent
```bash
cd agent
pip install -r requirements.txt
# Add your GROQ_API_KEY to agent/.env
uvicorn main:app --reload --port 5000
```

---

## 👥 Team

| Contributor | Branch | Role |
|-------------|--------|------|
| **Chaima Bahi** | `chaima` | Frontend — UI/UX, Admin Dashboard, Auth pages, Notification system |
| **Islem** | `islem` | Backend — Auth, JWT Security, Models, Appointment booking, Admin API |
| **Iyadh Belfetni** | `iyadh` | AI Agent, Doctor Dashboard, Notification backend, Doctor Space frontend |

---

## 📄 License

This project was developed as part of an academic project. All rights reserved.
