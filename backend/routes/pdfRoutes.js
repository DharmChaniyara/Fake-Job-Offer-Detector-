import express from 'express';
import { uploadPdf, upload } from '../controllers/pdfController.js';

const router = express.Router();

router.post('/upload-pdf', upload.single('file'), uploadPdf);

export default router;
