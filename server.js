import express from "express";
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://bhaskar-tours-and-travels.web.app"], // ✅ your Firebase frontend
  methods: ["GET", "POST"],
  credentials: true
}));

// MongoDB connection (⚠️ hardcoded)
mongoose.connect("mongodb+srv://pritambhaskar926:NVo1i5IbMYRAJWJi@cluster0.3qjhcfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Trip Schema
const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  persons: { type: Number, required: true },
  contact: { type: String, required: true },
});

// Trip Model
const Trip = mongoose.model("Trip", tripSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

app.post("/api/trips", async (req, res) => {
  try {
    const { name, destination, startDate, endDate, people, contact } = req.body;

    const newTrip = new Trip({
      name,
      destination,
      startDate,
      endDate,
      persons: people,
      contact,
    });

    await newTrip.save();
    res.status(201).json({ message: "✅ Trip saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
