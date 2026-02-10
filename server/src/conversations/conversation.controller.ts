import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as conversationService from "./conversation.service";

export async function createDirectConversation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await conversationService.getOrCreateDirectConversation(
      req.userId!,
      req.body.userId
    );

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function getMyConversations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations =
      await conversationService.listConversationsWithUnread(req.userId!);

    res.json(conversations);
  } catch (err) {
    next(err);
  }
}
