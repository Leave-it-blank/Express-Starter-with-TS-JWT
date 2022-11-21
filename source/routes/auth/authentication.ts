import express from 'express';
import controller from '../../controllers/auth/authcontroller';
const router = express.Router();
//authenticates user
router.post('/login', controller.login);
router.post('/register', controller.signup);
router.post('/token', controller.refreshToken);
router.post('/logout', controller.logout);
//@ts-ignore
export = router;