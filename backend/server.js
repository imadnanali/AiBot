import express from "express";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Thread from "./model/thread.model.js";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.route.js"

let dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Database connected")
  } catch (err) {
    console.log(err)
  }
}
dbConnect();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", chatRoute)

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function main(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error in main():", error);
  }
}

app.post("/test", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    let data = await main(prompt);
    console.log(data, 'Ai response');
    let newThread = new Thread({ thread: data });
    await newThread.save();
    console.log(newThread);

    res.json({ response: data });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
