import express from 'express';
import { analyzeText } from '../controllers/scanController.js';

const router = express.Router();

router.post('/analyze', analyzeText);

export default router;
