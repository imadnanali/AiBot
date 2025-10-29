import express from "express";
import Thread from "../model/thread.model.js";
import getGeminiResponse from "../utils/gemini.util.js";
import isAuthenticate from "../middleware/Autorization.middleware.js";

const router = express.Router();

//          AUTHENTICATED ROUTES
router.get("/thread", isAuthenticate, async (req, res) => {
  try {
    const threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 });
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
  const { threadId, content } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  let userId = null;

  if (!content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (token) {
      try {
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, process.env.TOKEN_KEY);
        userId = decoded._id;
      } catch (err) {
        console.warn("Invalid token, continuing as guest...");
      }
    }

    // AI response
    const assistantReply = await getGeminiResponse(content);

    let thread;

    // If user is logged in, save the thread
    if (userId) {
      thread = await Thread.findOne({ threadId, user: userId });
      if (!thread) {
        thread = new Thread({
          threadId,
          title: content.slice(0, 30),
          messages: [
            { role: "user", content },
            { role: "assistant", content: assistantReply },
          ],
          user: userId,
        });
      } else {
        thread.messages.push({ role: "user", content });
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
      }

      await thread.save();
    }

    // ✅ Return both reply and thread (if saved)
    res.json({
      reply: assistantReply,
      ...(thread && { thread }), // send thread info if it exists
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


export default router;
