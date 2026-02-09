import { Router } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    // Simple DB check
    const result=await prisma.user.findMany();

    res.status(200).json({
      status: 'ok',
      message: 'Server & database are healthy',
      result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
