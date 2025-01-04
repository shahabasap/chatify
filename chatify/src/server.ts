// server.ts
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import connectToDatabase from "./config/dbConnection";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import individualChatRoutes from "./routes/individualChatRoutes";
import handleIndividualChatSocket from "./socket/socket";
import { errorHandler } from "./middlewares/ErrorHandler";
import envConfig from "./config/envConfig";
// import groupChatRoutes from "./routes/groupChatRoutes";

dotenv.config();

// Constants
const PORT = process.env.PORT || 3000;


// Express app and HTTP server
const app = express();
const server = http.createServer(app);
// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: envConfig.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// CORS Configuration
const corsOptions = {
  origin: envConfig.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json());

// Database connection
connectToDatabase();

// Initialize Socket.IO
handleIndividualChatSocket(io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes );

app.use("/api/individual-chat", individualChatRoutes);
// app.use("/api/group-chat", groupChatRoutes);



// Error handler middleware
app.use(errorHandler);


// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
