import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import "./config/passport.config";
import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middlerware";
import connctDatabase from "./config/database.config";
import authRoutes from "./routes/auth.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import reportRoutes from "./routes/report.route";
import analyticsRoutes from "./routes/analytics.route";

const app = express();
const BASE_PATH = Env.BASE_PATH;
const PORT = Number(process.env.PORT) || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN || "*",
    credentials: true,
  })
);

// Health Check
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Finora API is running",
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  })
);

// Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  try {
    await connctDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;