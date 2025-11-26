<p align="center">
    <img src="assets/header.png" alt="Header">
</p>
Team Nudge-it Repository for CS473 Introduction to Social Computing

Link to Prototype: @TODO

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Code Organization](#code-organization)

## Overview
Nudge-it is a collaboration tool designed to help student teams maintain accountability and build healthier working relationships. It supports fair contribution through a peer-verification task system, an escalating nudge feature to address delays, and a confrontation-coaching chatbot that encourages constructive communication. By increasing transparency and easing conflict, Nudge-it aims to foster healthy teamwork and reduces free-riding in group projects.

## Getting Started
1. **Clone the code**
    ```
    git clone https://github.com/nadiarvi/nudge-it.git
    cd nudge-it
    ```
2. **Install dependencies**
    - Backend:
      ```
      cd backend
      yarn install
      ```
    - Frontend:
      ```
      cd ../frontend
      npm install
      ```
3. **Environment Setup**
    - Backend: Create a `.env` file in `backend/` (see [`backend/README.md`](backend/README.md) for details)
    - Frontend: Create a `.env` file in `frontend/` (see [`frontend/README.md`](frontend/README.md) for details)

## Running the Project
- **Backend:**
  ```
  cd backend
  yarn start
  ```
- **Frontend:**
  ```
  cd frontend
  npx expo start
  ```
  > **Note:** To run the app on your phone, download the [Expo Go](https://expo.dev/client) app from the App Store or Google Play. Scan the QR code shown in your terminal after running the frontend to open the app on your device.

## Documentation
- **Backend API:** See [`backend/README.md`](backend/README.md) for endpoints, request/response examples, and setup instructions.
- **@TODO: FRONTEND**

## Tech Stack
- **Backend**
  - Framework: Node.js with Express.js
  - Database: MongoDB
  - Input Validation: express-validator
  - AI Services: OpenAI API
  - Email Services: nodemailer
  - Push Notifications: expo-server-sdk
  - Environment Config: dotenv
- **Frontend**
  - Framework: React Native
  - **@TODO: FRONTEND**

## Code Organization
```
nudge-it/
├── backend/
│   ├── controllers/   # Route logic for API endpoints
│   ├── models/        # Mongoose schemas (e.g., User)
│   ├── routes/        # Express route definitions
│   ├── services/      # OpenAI and nudge logic
│   ├── utils/         # Utility functions
│   ├── middleware/    # Auth middleware
│   ├── config/        # DB config
│   ├── server.js      # Express app entry point
│   └── README.md      # Backend API documentation
├── frontend/
│   ├── app/           # Main app screens and navigation
│   ├── components/    # UI and icon components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom hooks
│   ├── api/           # API client logic
│   ├── assets/        # Images and static files for frontend
│   ├── constants/     # Theme and data constants
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── README.md      # Frontend usage documentation
│   └── ...
├── assets/            # Images and static files for README
└── README.md          # Project documentation
```