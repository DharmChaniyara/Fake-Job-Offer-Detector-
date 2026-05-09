import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scanRoutes from './routes/scanRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import linkRoutes from './routes/linkRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', scanRoutes);
app.use('/api', pdfRoutes);
app.use('/api', linkRoutes);

app.get('/', (req, res) => {
  res.send('JobGuard AI Backend is Running!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Catch-all route for debugging
app.use((req, res) => {
  res.status(404).send(`Route ${req.url} not found on JobGuard Backend`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
