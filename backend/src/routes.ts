import { Router } from 'express';
import { postLogin, postRegister } from './controllers/authController';
import { getSaying, postSaying } from './controllers/sayingController';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';

const router = Router();

router.post('/auth/register', postRegister);
router.post('/auth/login', postLogin);

router.use(errorHandler);
router.get('/saying', getSaying);
router.post('/saying', authMiddleware, postSaying);

export default router;
