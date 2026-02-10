import { Request, Response, NextFunction } from "express";
import * as messageService from "./message.service";

export async function getConversationMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const conversationId = req.params.id;

    if (!conversationId || typeof conversationId !== "string") {
      return res.status(400).json({ message: "Invalid conversation id" });
    }

    const cursor =
      typeof req.query.cursor === "string"
        ? req.query.cursor
        : undefined;

    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit, 10)
        : 20;

    const messages = await messageService.getMessages({
      conversationId,
      limit,
      cursor,
    });

    res.json(messages.reverse());
  } catch (err) {
    next(err);
  }
}
