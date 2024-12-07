import { Router } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { getSaying } from './controllers/helloController';

const router = Router();

router.use(errorHandler);
router.get('/hello', getSaying);

export default router;
