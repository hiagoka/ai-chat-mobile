import { Router } from "express";
import { sendMessageToAI } from "../controllers/chatController";

const router = Router()

router.post("/", sendMessageToAI)

export  default router