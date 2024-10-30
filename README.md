
# 🛠 EventHub Backend

Welcome to **EventHub**’s backend repository! This project provides a RESTful API to support event booking, availability management, and service coordination. It’s designed as a foundation for the backend services of the EventHub platform, ready to integrate with a frontend application.

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [API Endpoints](#api-endpoints)
7. [Usage](#usage)
8. [Frontend Integration](#frontend-integration)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)
11. [License](#license)

---

## 📝 Overview <a name="overview"></a>

The EventHub backend enables efficient event management, handling all data operations related to events, user accounts, bookings, and availability. Once integrated with a frontend, it will allow users to browse and book events in real-time.

---

## 🚀 Features <a name="features"></a>

- **User Registration & Authentication**: Register and authenticate users with JWT.
- **Event & Availability Management**: CRUD operations for events and service schedules.
- **Booking API**: Allows clients to book available slots.
- **Secure Endpoints**: Authentication for sensitive routes.

---

## 🛠 Tech Stack <a name="tech-stack"></a>

- **Node.js**: JavaScript runtime
- **Express**: Backend framework for creating RESTful APIs
- **MongoDB**: NoSQL database for storing events, users, and bookings
- **JWT**: Secure user authentication

---

## 💾 Installation <a name="installation"></a>

### Prerequisites
Ensure you have:
- [Node.js](https://nodejs.org/) (v12+)
- [MongoDB](https://www.mongodb.com/)

### Clone the Repository
```bash
git clone https://github.com/MariferVL/eventhub-backend.git
cd eventhub-backend
```

### Install Dependencies
```bash
npm install
```

---

## 🔧 Configuration <a name="configuration"></a>

Create a `.env` file in the root directory and set up the following:

```plaintext
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

- **PORT**: Server port (default 5000)
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret for signing JWTs

---

## 📂 API Endpoints <a name="api-endpoints"></a>

### Auth Routes
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: User login, returns JWT

### User Routes
- **GET /api/users/:id**: Fetch user details (protected)

### Event Routes
- **GET /api/events**: Get all events
- **POST /api/events**: Create a new event (admin only)
- **PUT /api/events/:id**: Update an event (admin only)
- **DELETE /api/events/:id**: Delete an event (admin only)

<!-- ### Booking Routes
- **POST /api/bookings**: Create a new booking
- **GET /api/bookings/:id**: Get booking details -->

> **Note**: For complete endpoint details, refer to the [API documentation](docs/api-documentation.md) file.

---

## 📲 Usage <a name="usage"></a>

### Running the Development Server
Start the backend server:
```bash
npm start
```

Navigate to `http://localhost:5000/api` in your browser or testing tool (like Postman) to explore the API.

---

## 🌐 Frontend Integration <a name="frontend-integration"></a>

This backend is designed to be integrated with any frontend framework. Suggested steps for setting up:

1. **Configure CORS**: Update CORS settings in `app.js` to accept requests from your frontend domain.
2. **Frontend Auth**: Send JWT in headers for authenticated requests.
3. **API Consumption**: Make API calls to `http://localhost:5000/api` (or deployed domain) to fetch, create, and update data.

---

## 🐛 Troubleshooting <a name="troubleshooting"></a>

- **Database Connection Issues**: Ensure MongoDB is running and `MONGODB_URI` is correct.
- **JWT Issues**: Verify `JWT_SECRET` in `.env`.
- **CORS Errors**: Ensure your frontend domain is whitelisted in CORS settings.

---

## 🤝 Contributing <a name="contributing"></a>

Contributions are welcome! Please follow the standard GitHub flow: fork, make changes, and submit a pull request.

---

## 📜 License <a name="license"></a>

This project is licensed under the MIT License.

