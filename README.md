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

---

## 📄 License

This project was developed as part of an academic project. All rights reserved.
