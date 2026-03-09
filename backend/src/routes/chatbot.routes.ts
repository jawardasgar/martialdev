import { Router } from "express";
import { sendMessage, getChatHistory } from "../controllers/chatbot.controller";

const router = Router();

// Chatbot routes
router.post("/message", sendMessage);
router.get("/history/:sessionId", getChatHistory);

export default router;
