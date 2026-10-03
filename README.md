# Medical College Library Management System

A full-stack Library Management System built for medical colleges with role-based access for **Students** and **Administrators**.

---

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Backend  | Java 17, Spring Boot 3, Spring Security, JPA  |
| Database | MySQL 8                                        |
| Frontend | React 18, Vite, Tailwind CSS v4, Axios         |

---

## Features

### Student
- Login / Logout
- Browse and search books by title, author, or medical category
- View availability of each book
- View currently borrowed books with due dates
- Track borrowing history with fine amounts
- Receive notifications for issues, returns, and overdue alerts

### Administrator
- Login / Logout
- Dashboard with live statistics (total books, students, active borrows, overdue, total fines)
- Add, edit, and delete books
- Issue books to students (14-day loan period)
- Record book returns with automatic fine calculation (₹5/day overdue)
- View all borrow records with search and status filters
- View overdue books with one-click return action
- Register new student accounts

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

---

### 1. Database Setup

```sql
CREATE DATABASE library_db;
```

---

### 2. Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Run the application:
```bash
mvn spring-boot:run
```

The API will start at `http://localhost:8080`.

**Create the first admin account** (via API, since no admin exists initially):
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@library.com","password":"admin123","role":"ADMIN"}'
```

> Note: After the first admin is created, subsequent registrations are protected and require an active admin session.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## Default Loan Rules

| Rule         | Value             |
|--------------|-------------------|
| Loan period  | 14 days           |
| Fine per day | ₹5 (after due)    |

These are configurable in `backend/src/main/resources/application.properties`:
```properties
library.loan.days=14
library.fine.per.day=5
```

---

## Project Structure

```
Library management system/
├── backend/                    Spring Boot Maven project
│   ├── pom.xml
│   └── src/main/java/com/library/
│       ├── controller/         REST controllers
│       ├── service/            Business logic
│       ├── model/              JPA entities
│       ├── repository/         Spring Data repositories
│       ├── dto/                Request/Response DTOs
│       ├── config/             Security & exception handling
│       └── scheduler/          Overdue detection cron job
│
└── frontend/                   React + Vite project
    └── src/
        ├── api/                Axios instance
        ├── context/            AuthContext (global auth state)
        ├── components/         Navbar, Layout, ProtectedRoute
        └── pages/
            ├── Login.jsx
            ├── student/        Dashboard, Browse, MyBooks, Notifications
            └── admin/          Dashboard, ManageBooks, IssueReturn, AllRecords, Overdue
```
