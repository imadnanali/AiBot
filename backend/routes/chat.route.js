import express from "express";
import Thread from "../model/thread.model.js";
import getGeminiResponse from "../utils/gemini.util.js";
import isAuthenticate from "../middleware/Autorization.middleware.js";

const router = express.Router();

//          AUTHENTICATED ROUTES
router.get("/thread", isAuthenticate, async (req, res) => {
  try {
    // ✅ Only get threads for the authenticated user
    const threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 });
    console.log("User threads:", threads.length, "threads for user:", req.user._id);
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.get("/thread/:threadId", isAuthenticate, async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, user: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", isAuthenticate, async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, user: req.user._id });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

/* ---------- PUBLIC + AUTH CHAT ROUTE ---------- */
router.post("/chat", async (req, res) => {
  console.log("=== CHAT ROUTE STARTED ===");
  console.log("Request body:", req.body);
  console.log("Headers:", req.headers);
  
  const { threadId, content } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  let userId = null;

  console.log("Token from header:", token);
  console.log("Thread ID:", threadId);
  console.log("Content:", content);

  if (!content || !threadId) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify token and get user ID
    if (token) {
      try {
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, process.env.TOKEN_KEY);
        console.log("Decoded token:", decoded);
        
        // Try different possible fields for user ID
        userId = decoded._id || decoded.id || decoded.userId;
        console.log("Extracted User ID:", userId);
        
      } catch (err) {
        console.warn("❌ Invalid token:", err.message);
        userId = null;
      }
    } else {
      console.log("❌ No token provided");
    }

    console.log("Final User ID:", userId);

    // AI response
    console.log("Getting AI response...");
    const assistantReply = await getGeminiResponse(content);
    console.log("AI Response received:", assistantReply?.slice(0, 100) + "...");

    let thread;
    let saved = false;

    // If user is logged in, save the thread
    if (userId) {
      try {
        console.log("Looking for existing thread...");
        thread = await Thread.findOne({ threadId, user: userId });
        console.log("Found thread:", thread ? "Yes" : "No");

        if (!thread) {
          console.log("Creating NEW thread...");
          thread = new Thread({
            threadId,
            title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
            messages: [
              { role: "user", content },
              { role: "assistant", content: assistantReply },
            ],
            user: userId,
          });
        } else {
          console.log("UPDATING existing thread...");
          thread.messages.push({ role: "user", content });
          thread.messages.push({ role: "assistant", content: assistantReply });
          thread.updatedAt = new Date();
        }

        console.log("Saving thread to database...");
        await thread.save();
        saved = true;
        console.log("✅ Thread saved successfully!");
        console.log("Thread ID in DB:", thread._id);

      } catch (saveError) {
        console.error("❌ Error saving thread:", saveError);
        console.error("Save error details:", saveError.message);
      }
    } else {
      console.log("🚫 No user ID - thread not saved");
    }

    // Return response
    const response = {
      reply: assistantReply,
      threadId: threadId,
      saved: saved
    };
    
    console.log("Sending response:", response);
    res.json(response);

  } catch (err) {
    console.error("❌ Chat route error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Something went wrong" });
  }
});


export default router;
