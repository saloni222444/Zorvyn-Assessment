import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN || "*",
    credentials: true,
  })
);

// Health check endpoint (important for Vercel)
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

// API routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error handler (should be last)
app.use(errorHandler);

// Connect to database (important: don't use app.listen for Vercel)
connctDatabase();
if (process.env.NODE_ENV !== "production") {
  app.listen(8000, () => {
    console.log("Server running on port 8000");
  });
}

// Export for Vercel
export default app;