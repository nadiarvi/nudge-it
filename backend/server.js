const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const groupRoutes = require("./routes/group_routes");
const taskRoutes = require("./routes/task_routes");
const userRoutes = require("./routes/user_routes");

const { connectDB } = require("./config/db");
const HttpError = require("./models/http-error");

dotenv.config();
const app = express();

// const corsOptions = {
//   origin: 'http://localhost:3000/',
//   optionsSuccessStatus: 200
// }

app.use(cors());
app.use(express.json());

// routes
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Route not found", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        message: error.message || "An unknown error occured",
        code: error.code,
        data: error.data
    });
});

const PORT = process.env.PORT || 8000;
connectDB(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@nudge-it.zj0vdce.mongodb.net/?appName=Nudge-it`)
    .then(() => {
        app.listen(PORT, () =>  {
            console.log(`⚙️ Server running on ${PORT}`)
        })
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
    });