import express from "express"
import Thread from "../model/thread.model.js";
import getGeminiResponse from "../utils/gemini.util.js";

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "newId",
            title: "Testing new Thread2",
        })

        const response = await thread.save()
        res.send(response)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to save in DB" })
    }
})

router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //decending prder of updated threads... most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch thread" });
    }
})

router.get("/thread/:threadid", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId })
        if (!threadId) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch chat" });
    }
})


router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    console.log("DELETE route hit:", req.params.threadId);
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to delete thread" });
    }
})

router.post("/chat", async (req, res) => {
    const { threadId, content } = req.body;

    console.log(content, "This is CHAT")
    if (!threadId || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            //creating a new thread
            thread = new Thread({
                threadId,
                title: content,
                messages: [{ role: "user", content: content }]
            })
        } else {
            thread.messages.push({ role: "user", content: content });
        }
        const assistantReply = await getGeminiResponse(content);
        console.log("Assistant reply:", assistantReply);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.error("Database save error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
})

export default router;


