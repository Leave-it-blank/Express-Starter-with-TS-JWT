import express from 'express';
import controller from '../../controllers/killcounter';
const router = express.Router();

router.get('/L', controller.update_kills);
router.get('/test12', controller.update_kills);

//@ts-ignore
export = router;