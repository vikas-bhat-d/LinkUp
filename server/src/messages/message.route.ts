import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getConversationMessages } from "./message.controller";

const router = Router();

router.get(
  "/conversations/:id/messages",
  authenticate,
  getConversationMessages
);

export default router;
