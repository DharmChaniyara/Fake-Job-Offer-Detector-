import express from 'express';
import { checkLinks } from '../controllers/linkController.js';

const router = express.Router();

router.post('/check-links', checkLinks);

export default router;
