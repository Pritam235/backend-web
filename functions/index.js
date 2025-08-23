const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// --- CORS ---
const allowedOrigins = [
  "https://bhaskar-tours-and-travels.web.app", // your Firebase Hosting frontend
  "http://localhost:5173", // dev only (optional)
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// --- MongoDB connection ---
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI; // we’ll set this secret later
  if (!uri) throw new Error("MongoDB URI missing");
  await mongoose.connect(uri, { dbName: "bhaskar" });
  isConnected = true;
  logger.info("MongoDB connected");
}

// --- Schema ---
const TripSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  destination: String,
  persons: Number,
  startDate: String,
  endDate: String,
  notes: String,
}, { timestamps: true });

const Trip = mongoose.models.Trip || mongoose.model("Trip", TripSchema);

// --- Routes ---
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/trips", async (req, res) => {
  try {
    await connectDB();
    const trip = await Trip.create(req.body);
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/api/trips", async (req, res) => {
  try {
    await connectDB();
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Export function ---
exports.api = onRequest(
  { cors: allowedOrigins, region: "us-central1", secrets: ["MONGODB_URI"] },
  app
);
