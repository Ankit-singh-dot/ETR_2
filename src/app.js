import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import subAdminRoutes from "./routes/subAdminRoutes.js";
import salesPersonRoutes from "./routes/salesPersonRoutes.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Security middleware
app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true
// }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('combined'));

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/subadmins", subAdminRoutes);
app.use("/api/salespersons", salesPersonRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
