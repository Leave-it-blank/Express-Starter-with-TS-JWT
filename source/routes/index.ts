import express from 'express';
import controller from '../controllers/example';
const router = express.Router();
const authJWT = require('../middleware/authJWT');

router.get('/home', controller.test1);
router.get('/test1', authJWT, controller.test1);
router.get('/test2', authJWT, controller.test2);
router.get('/fail1', authJWT, controller.fail1);
router.get('/fail2', authJWT, controller.fail2);
//@ts-ignore
export = router;
