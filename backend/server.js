// ------------------------
// Load environment variables
// ------------------------
import dotenv from "dotenv";
dotenv.config();

// ------------------------
// Core dependencies
// ------------------------
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cloudinary from "cloudinary";

// ------------------------
// Local modules
// ------------------------
import connectDB from "./config/db.js";
import jobListingRoutes from "./routes/jobListingRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import slideRoutes from "./routes/slideRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";

// ------------------------
// Fix __dirname for ES Modules
// ------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------------------
// Initialize Express
// ------------------------
const app = express();

// ------------------------
// Configure Cloudinary
// ------------------------
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------------
// Start Server Function
// ------------------------
const startServer = async () => {
  try {
    // --- Connect to MongoDB ---
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // ------------------------
    // Allowed Origins for CORS
    // ------------------------
    const allowedOrigins = [
      "https://ssinfotech-omega.vercel.app",
      "https://ssinfotech-xsq6.vercel.app",
      "https://ss-infotech-v2-2.onrender.com", // backend self URL
      "https://ss-infotech-v2-y2i2.vercel.app", // ✅ newly added frontend
      "https://ssinfotech.co.in",
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ].filter(Boolean);

    // ------------------------
    // CORS Middleware
    // ------------------------
    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests without origin (e.g., Postman, server-to-server)
          if (!origin) return callback(null, true);

          // Allow if in allowed list or backend itself
          if (
            origin === "https://ss-infotech-v2-2.onrender.com" ||
            allowedOrigins.includes(origin)
          ) {
            return callback(null, true);
          }

          console.warn(`🚫 Blocked by CORS: ${origin}`);
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      })
    );

    // ------------------------
    // Middleware
    // ------------------------
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // ------------------------
    // Static Folders
    // ------------------------
    app.use("/Uploads", express.static(join(__dirname, "Uploads")));
    app.use("/public", express.static(join(__dirname, "public")));
    app.use("/resumes", express.static(join(__dirname, "public")));

    // ------------------------
    // API Routes
    // ------------------------
    app.use("/api/admin", adminRoutes);
    app.use("/api/joblistings", jobListingRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/applications", applicationRoutes);
    app.use("/api/slides", slideRoutes);
    app.use("/api/candidate", candidateRoutes);
    app.use("/api/albums", albumRoutes);

    // ------------------------
    // Health Check Route
    // ------------------------
    app.get("/api/health", (req, res) => {
      res.status(200).json({ status: "OK", time: new Date().toISOString() });
    });

    // ------------------------
    // Serve Frontend in Production
    // ------------------------
    if (process.env.NODE_ENV === "production") {
      const frontendPath = join(__dirname, "../frontend/dist");
      app.use(express.static(frontendPath));

      app.get("*", (req, res) => {
        res.sendFile(join(frontendPath, "index.html"));
      });

      console.log(`🌐 Serving frontend from: ${frontendPath}`);
    }

    // ------------------------
    // Global Error Handler
    // ------------------------
    app.use((err, req, res, next) => {
      console.error("❌ Error Stack:", err.stack);
      res
        .status(err.status || 500)
        .json({ message: err.message || "Something went wrong!" });
    });

    // ------------------------
    // Start Server
    // ------------------------
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `🚀 Backend API running on port ${PORT} - ${new Date().toLocaleString(
          "en-IN",
          { timeZone: "Asia/Kolkata" }
        )}`
      );
      console.log("🌐 Allowed CORS Origins:");
      allowedOrigins.forEach((url) => console.log(`   → ${url}`));
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

// ------------------------
// Start the Server
// ------------------------
startServer();
