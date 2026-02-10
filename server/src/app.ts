import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRouter from "./routes/health.route"
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRouter);

import authRouter from "./auth/auth.route";
import userRouter from "./users/user.route";

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

import conversationRouter from "./conversations/conversation.route"
import messageRouter from "./messages/message.route"
app.use("/api/conversations", conversationRouter);
app.use("/api", messageRouter);

app.use(notFound);

app.use(errorHandler);

export default app;
