# 🎓 CampusConnect

### University Club & Event Management System

<p align="center">
  <b>A simple, centralized platform for managing university clubs, events, registrations, participants, and attendance.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-Academic-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Batch-4B-purple?style=for-the-badge" />
</p>

---

## 📌 About the Project

**CampusConnect** is a web-based **University Club & Event Management System** developed as an academic project for the **Software Engineering & System Analysis Lab** at the **University of Information Technology & Sciences (UITS)**.

The goal of the project is to provide a simple centralized platform where students can discover university clubs and events, register for events, and view their registrations.

Club organizers can manage club information, create events, view participants, and record attendance, while administrators can manage users and clubs and approve events.

> 💡 **Project philosophy:** Keep the system simple, useful, and achievable as a working academic MVP rather than overcomplicating it with unnecessary features.

---

## ✨ Core Features

### 👨‍🎓 Student

- 🔐 Register and log in
- 🏛️ Browse university clubs
- 📅 Browse upcoming events
- 🔎 View event details
- 📝 Register for events
- 📋 View personal event registrations
- ✅ View registration status

### 👥 Club Organizer

- 🔐 Secure organizer login
- 🏛️ Manage club information
- 📅 Create events
- ✏️ Edit event information
- 🗑️ Manage/delete events where permitted
- 👥 View registered participants
- ✅ Record participant attendance

### 🛡️ Administrator

- 🔐 Admin authentication
- 👤 View and manage users
- 🏛️ Manage clubs
- 📅 Review events
- ✅ Approve or reject events
- 📊 View basic system information

---

## 🔄 System Workflow

```text
                         ┌─────────────┐
                         │    USER     │
                         └──────┬──────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
             🎓 Student    👥 Organizer    🛡️ Admin
                 │              │              │
                 │              │              │
                 ▼              ▼              ▼
             Browse         Manage Club    Manage System
             Events         & Events       & Approvals
                 │              │
                 ▼              ▼
             Register       Participants
                 │              │
                 └───────┬──────┘
                         ▼
                    📋 Registration
                         │
                         ▼
                    ✅ Attendance
