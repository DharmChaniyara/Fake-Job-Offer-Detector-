import { model } from '../lib/gemini.js';
import { supabase } from '../lib/supabase.js';

export const analyzeText = async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for analysis.' });
    }

    const prompt = `
You are a cybersecurity expert. Analyze this job offer for scam indicators like:
- Unrealistic salary
- Payment requests
- Fake company signals
- Urgency language

Return ONLY a JSON object in this format:
{
  "score": number (0-100),
  "reasons": string[],
  "verdict": "Safe" | "Suspicious" | "Scam"
}

Job Offer Text:
${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResult = JSON.parse(response.text());

    // Save to Supabase if userId is provided
    if (userId) {
      const { error } = await supabase
        .from('scans')
        .insert([
          {
            user_id: userId,
            scanned_text: text,
            scam_score: aiResult.score,
            reasons: aiResult.reasons,
            verdict: aiResult.verdict,
          },
        ]);

      if (error) {
        console.error('Supabase insertion error:', error);
      }
    }

    res.json(aiResult);
  } catch (error) {
    console.error('Gemini Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze text using Gemini.' });
  }
};
