const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/road_conditions", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Road condition schema
const RoadConditionSchema = new mongoose.Schema({
  roadName: String,
  location: { lat: Number, lng: Number },
  condition: String, // e.g., "Bad Road", "Traffic", "Construction"
  severity: String,  // e.g., "Low", "Moderate", "Severe"
  lastUpdated: { type: Date, default: Date.now },
});

const RoadCondition = mongoose.model("RoadCondition", RoadConditionSchema);

// Initial dummy data
const initialData = [
  {
    roadName: "Kaduna-Zaria Expressway",
    location: { lat: 10.5222, lng: 7.4381 },
    condition: "Smooth Traffic",
    severity: "Low",
  },
  {
    roadName: "Zaria Bypass",
    location: { lat: 11.0847, lng: 7.7195 },
    condition: "Potholes",
    severity: "Moderate",
  },
  {
    roadName: "Zaria-Abuja Expressway",
    location: { lat: 10.9693, lng: 7.5166 },
    condition: "Traffic Jam",
    severity: "High",
  },
  {
    roadName: "Jere Junction",
    location: { lat: 10.7128, lng: 7.7032 },
    condition: "Under Repair",
    severity: "Moderate",
  },
  {
    roadName: "Suleja-Madalla Road",
    location: { lat: 9.3376, lng: 7.2324 },
    condition: "Smooth Traffic",
    severity: "Low",
  },
  {
    roadName: "Madalla-Zuba Interchange",
    location: { lat: 9.1373, lng: 7.1963 },
    condition: "Congestion",
    severity: "Severe",
  },
  {
    roadName: "Zuba-Gwagwalada Express",
    location: { lat: 9.0665, lng: 7.2466 },
    condition: "Road Construction Completed",
    severity: "Low",
  },
  {
    roadName: "Gwagwalada-Airport Link Road",
    location: { lat: 8.9784, lng: 7.2106 },
    condition: "Accident",
    severity: "High",
  },
  {
    roadName: "Kaduna Eastern Bypass",
    location: { lat: 10.4764, lng: 7.4901 },
    condition: "Flooded Road",
    severity: "Severe",
  },
  {
    roadName: "Ungwan Rimi-GRA Junction",
    location: { lat: 10.5361, lng: 7.4255 },
    condition: "Smooth Traffic",
    severity: "Low",
  },
];

// Possible conditions for updates
const conditions = [
  { condition: "Smooth Traffic", severity: "Low" },
  { condition: "Traffic Jam", severity: "High" },
  { condition: "Potholes", severity: "Moderate" },
  { condition: "Flooded Road", severity: "Severe" },
  { condition: "Under Repair", severity: "Moderate" },
  { condition: "Accident", severity: "High" },
];

// Insert initial data
async function insertInitialData() {
  try {
    await RoadCondition.deleteMany(); // Clear existing data
    await RoadCondition.insertMany(initialData);
    console.log("Initial data inserted.");
  } catch (err) {
    console.error("Failed to insert initial data:", err);
  }
}

// Function to update data dynamically
async function updateRoadConditions() {
  try {
    const roads = await RoadCondition.find(); // Fetch all roads

    for (const road of roads) {
      // Randomly pick a new condition
      const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
      road.condition = newCondition.condition;
      road.severity = newCondition.severity;
      road.lastUpdated = new Date();
      await road.save(); // Save the updated road condition
    }

    console.log("Road conditions updated dynamically at", new Date());
  } catch (err) {
    console.error("Error updating road conditions:", err);
  }
}

// Fetch all road conditions
app.get("/api/conditions", async (req, res) => {
  try {
    const conditions = await RoadCondition.find();
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new road condition
app.post("/api/conditions", async (req, res) => {
  const { roadName, location, condition, severity } = req.body;

  try {
    const newCondition = new RoadCondition({
      roadName,
      location,
      condition,
      severity,
    });
    await newCondition.save();
    res.status(201).json(newCondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Schedule data updates
insertInitialData().then(() => {
  setInterval(updateRoadConditions, 300000); // Updates every 5 minutes
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
