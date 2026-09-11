<div align="center">

# 🚀 TechFlow

### Modern Software House Website

A high-performance, visually stunning software house website built with **Next.js**, **Tailwind CSS**, and **MongoDB**.

📧 **Contact:** appric172@gmail.com  
🏢 **Developed by APPRIC Software House**

</div>

---

## 🌟 Project Overview

**TechFlow** is a modern, scalable, and SEO-friendly software house website designed for IT companies and digital agencies.  
It combines smooth animations, responsive layouts, and a clean architecture ready for backend integrations.

---

## ✨ Features

✔ Modern animated UI using **Framer Motion**  
✔ Fully responsive across all devices  
✔ SEO-optimized structure  
✔ Contact form with backend support  
✔ Blog with search & filtering  
✔ Portfolio & project showcase  
✔ Services pages  
✔ About page with team section  
✔ Staff & student attendance portal (Sign In / Sign Out, work logs, reports)

---

## 🧰 Tech Stack

### 🎨 Frontend

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide Icons**

### 🛠 Backend

- **Node.js**
- **MongoDB**
- **Mongoose**

---

## ⚙️ Getting Started

### 📌 Prerequisites

- Node.js **18+**
- MongoDB Atlas _(or local MongoDB)_

---

### 📥 Installation

1️⃣ Clone the repository:

```bash
git clone https://github.com/Tanseerhussain/software_house_website.git
```

2️⃣ Install and run:

```bash
cd software_house
cp .env.example .env
npm install
npm run dev
```

---

## Attendance portal

Open **Portal** on the website, or go to `/auth/login`.

| Role | What they can do |
| --- | --- |
| Admin / HR | Approve students, live board, designation board, staff salaries, all reports, CSV export |
| Manager | Live board, designation board, team reports |
| Employee / Student | Sign In / Sign Out, daily work log, own history, own reports, short leave |

Timezone is **Asia/Karachi** everywhere.

### First admin

Set these in `.env` (copied from `.env.example`):

```
AUTH_SECRET=a-long-random-string
ADMIN_EMAIL=admin@appric.com
ADMIN_PASSWORD=ChangeMe123!
```

The admin user is created automatically on first login if that email does not exist.

### Student flow

1. Student registers at `/auth/register`
2. Account stays **pending** until Admin/HR approves it
3. After approval, the student uses the same Sign In / Sign Out and work-log flow as staff

-
### MongoDB collections

- `portal_users`
- `portal_attendance`
- `portal_work_logs`
- `portal_leave_requests`

-
 