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

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge)
![Dotenv](https://img.shields.io/badge/Dotenv-232F3E?style=for-the-badge)
![CORS](https://img.shields.io/badge/CORS-4B32C3?style=for-the-badge)
![Cookie Parser](https://img.shields.io/badge/Cookie--parser-ffc107?style=for-the-badge)


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

