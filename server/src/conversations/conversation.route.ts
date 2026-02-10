import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createDirectConversation,
  getMyConversations
} from "./conversation.controller";

const router = Router();

router.post("/direct", authenticate, createDirectConversation);
router.get("/", authenticate, getMyConversations);

export default router;
