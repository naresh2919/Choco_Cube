const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGODB_URI);

let ordersCollection;

async function connectToAtlas() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");
    const db = client.db("choco"); // choose your DB name
    ordersCollection = db.collection("orders"); // collection name
  } catch (e) {
    console.error("❌ Connection to MongoDB Atlas failed!", e);
  }
}

connectToAtlas();

// ✅ API Route
app.post("/order", async (req, res) => {
  try {
    const newOrder = {
      ...req.body,
      date: new Date() // add default date
    };
    await ordersCollection.insertOne(newOrder);
    res.status(200).json({ message: "Order Saved ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed ❌" });
  }
});

//Get method
app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed ❌" });
  }
});


// ✅ Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
