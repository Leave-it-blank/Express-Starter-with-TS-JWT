import express from 'express';
import controller from '../controllers/auth/authcontroller';
const router = express.Router();


router.post('/login', controller.login);
router.post('/register', controller.signup);

//@ts-ignore
export = router;