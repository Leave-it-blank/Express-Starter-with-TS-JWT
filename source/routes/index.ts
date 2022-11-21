import express from 'express';
import controller from '../controllers/killcounter';
const router = express.Router();
const authJWT = require('../middleware/authJWT');


router.get('/test1', authJWT, controller.update_kills);
//@ts-ignore
export = router;
