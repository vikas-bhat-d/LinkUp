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

app.use(notFound);

app.use(errorHandler);

export default app;
