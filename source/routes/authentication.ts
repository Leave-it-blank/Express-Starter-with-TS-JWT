import express from 'express';
import controller from '../controllers/auth/authcontroller';
const authJWT = require('../middleware/authJWT');
const router = express.Router();


router.post('/login', controller.login);
router.post('/register', controller.signup);
router.post('/token', controller.refreshToken);
router.post('/logout', controller.logout);
//@ts-ignore
export = router;