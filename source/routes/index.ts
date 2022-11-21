import express from 'express';
import controller from '../controllers/example';
const router = express.Router();
const authJWT = require('../middleware/authJWT');


router.get('/test1', authJWT, controller.test1);
//@ts-ignore
export = router;
