import pdfParse from 'pdf-parse';
import multer from 'multer';

// Use memory storage for quick parsing without saving to disk
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided.' });
    }

    const data = await pdfParse(req.file.buffer);
    
    // We return the extracted text, so the frontend can display it and then call /analyze
    // Or we could call the analyze function directly here. Returning text is more flexible.
    res.json({ text: data.text });
  } catch (error) {
    console.error('PDF Parsing error:', error);
    res.status(500).json({ error: 'Failed to parse PDF.' });
  }
};
