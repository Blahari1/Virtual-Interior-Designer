# 🏡 Virtual Interior Designer

A full-stack web application that allows users to design and customize virtual rooms through an interactive browser-based interface. Users can securely register, log in, create personalized room layouts, and export their designs as high-quality PNG images.

---

## ✨ Features

* 🔐 Secure User Authentication (JWT)
* 📧 Email Verification
* 🛏️ Multiple Room Templates (Bedroom, Living Room, Office)
* 🪑 Add Furniture to Rooms
* ✋ Drag & Move Furniture
* 📏 Resize Furniture
* 🔄 Rotate Furniture
* 📑 Duplicate Furniture
* 🗑️ Delete Furniture
* 🌙 Dark / Light Theme
* 📸 Export Room Design as PNG
* 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* html2canvas

### Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer

### Database

* MongoDB Atlas
* Mongoose

---

## 📂 Project Structure

```text
VirtualInteriorDesigner/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── designer.html
│   ├── login.html
│   ├── register.html
│   ├── verifyOTP.html
│   ├── forgotPassword.html
│   ├── resetPassword.html
│   └── index.html
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Blahari1/Virtual-Interior-Designer.git
cd Virtual-Interior-Designer
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

### 4. Start Backend Server

```bash
npm start
```

or

```bash
npm run dev
```

---

### 5. Open the Frontend

Open `frontend/index.html` using Live Server or any local web server.

---

## 📸 Application Workflow

1. Register a new account.
2. Verify your email using the OTP.
3. Log in securely.
4. Select a room template.
5. Add and customize furniture.
6. Resize, rotate, duplicate, or delete items.
7. Switch between Dark and Light themes.
8. Export the final design as a PNG image.

---

## 🎯 Future Enhancements

* AI-powered furniture recommendations
* Save multiple room designs
* Undo / Redo functionality
* Cloud storage for user projects
* Furniture categories and search
* Real-time collaboration
* 3D room visualization

---

## 👩‍💻 Developer

**B Lahari**

* GitHub: https://github.com/Blahari1
* LinkedIn: https://linkedin.com/in/lahari191005

---

## 📄 License

This project is developed for educational and portfolio purposes.
