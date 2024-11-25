const mongoose = require("mongoose");

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/road_conditions", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define the schema and model
const RoadConditionSchema = new mongoose.Schema({
  roadName: String,
  location: { lat: Number, lng: Number },
  condition: String,
  severity: String,
  lastUpdated: { type: Date, default: Date.now },
});

const RoadCondition = mongoose.model("RoadCondition", RoadConditionSchema);

// Initial dummy data
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
  {
    roadName: "Barnawa Road",
    location: { lat: 10.5044, lng: 7.4192 },
    condition: "Slippery Road",
    severity: "Moderate",
  },
  {
    roadName: "Rigasa Train Station Road",
    location: { lat: 10.4772, lng: 7.4043 },
    condition: "Traffic Jam",
    severity: "High",
  },
  {
    roadName: "Kawo Bridge",
    location: { lat: 10.5438, lng: 7.4376 },
    condition: "Under Repair",
    severity: "Moderate",
  },
  {
    roadName: "Kaduna-Gidan Waya Road",
    location: { lat: 10.0937, lng: 7.7353 },
    condition: "Smooth Traffic",
    severity: "Low",
  },
  {
    roadName: "Airport Road, Abuja",
    location: { lat: 8.9942, lng: 7.4748 },
    condition: "Congestion",
    severity: "Severe",
  },
  {
    roadName: "Kubwa-Abuja Express",
    location: { lat: 9.1284, lng: 7.3474 },
    condition: "Potholes",
    severity: "Moderate",
  },
  {
    roadName: "Zaria-Kano Road",
    location: { lat: 11.0878, lng: 7.7228 },
    condition: "Smooth Traffic",
    severity: "Low",
  },
  {
    roadName: "Tafa-Kaduna Road",
    location: { lat: 9.3008, lng: 7.2863 },
    condition: "Accident",
    severity: "High",
  },
  {
    roadName: "Dutsen Alhaji Road",
    location: { lat: 9.1597, lng: 7.3659 },
    condition: "Road Construction Completed",
    severity: "Low",
  },
  {
    roadName: "Sabon Tasha Road",
    location: { lat: 10.4918, lng: 7.4144 },
    condition: "Slippery Road",
    severity: "Moderate",
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

// Function to insert initial data
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

// Insert initial data
insertInitialData().then(() => {
  // Schedule updates every 5 minutes (300000 milliseconds)
  setInterval(updateRoadConditions, 300000); // Adjust the interval as needed
});
