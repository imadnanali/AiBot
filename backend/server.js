import express from "express";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.route.js"
import userRoute from "./routes/user.route.js"

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
app.use("/api/auth", userRoute)

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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
