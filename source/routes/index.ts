import express from 'express';
import controller from '../controllers/killcounter';
const router = express.Router();


router.get('/test1', controller.update_kills);
export = router;