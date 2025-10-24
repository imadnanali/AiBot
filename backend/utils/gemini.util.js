import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function main(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error in main():", error);
    throw error;
  }
}

const getGeminiResponse = async (message) => {
  try {
    console.log("User message:", message);

    let data = await main(message);
    console.log(data, 'Ai response BY DATA');

   return data || "Sorry, I couldn't generate a response.";
  } catch (err) {
     console.error("Error in getGeminiResponse():", err);
    return "Sorry, something went wrong.";
  }
}

export default getGeminiResponse;