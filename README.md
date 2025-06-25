# 🔗 Product Recommendation System - Backend

This is the **backend/server-side** of the full-stack Product Recommendation System. Built with **Node.js**, **Express.js**, and **MongoDB**, it handles all API requests, user authentication (JWT), and database operations for queries, recommendations, and comments.

---

## 📁 API Base URL

https://product-recommendation-server.vercel.app/

## ⚙️ Features

- 🔐 JWT-based authentication and authorization
- 📩 RESTful APIs for:
  - User registration & login
  - Creating, reading, updating, and deleting product queries
  - Posting and managing recommendations
  - Adding and moderating comments
  - Likes and unlikes
- ⚠️ Protected routes using middleware
- 🌐 CORS, environment variables, and security best practices
- 📦 MongoDB for persistent data storage

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT (jsonwebtoken)**
- **Dotenv**
- **Cors**
- **Cookie-parser**

---
- Step 1: Clone the repository
  --git clone https://github.com/Ratul8863/Product-Recommendations-server.git

- Step 2: Navigate into the project folder
  --cd Product-Recommendations-server

- Step 3: Install dependencies
npm install

- Step 4: Create a .env file 
Example :

PORT=5000
DB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

- Step 5: Start the server
-- node index.js
- Or, for development with auto-restart
npm install -g nodemon
nodemon index.js


## 📦 Installed Dependencies

```bash
npm install express cors dotenv jsonwebtoken mongoose cookie-parser

