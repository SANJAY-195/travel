import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import flightRoutes from "./routes/flights";
import hotelRoutes from "./routes/hotels";
import tripRoutes from "./routes/trips";
import bookingRoutes from "./routes/bookings";
import transactionRoutes from "./routes/transactions";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/travel-app";
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Travel App API is running" });
  });

  app.use("/api/flights", flightRoutes);
  app.use("/api/hotels", hotelRoutes);
  app.use("/api/trips", tripRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/transactions", transactionRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
