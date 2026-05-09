import { openai } from '../lib/openai.js';
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

Return JSON:
{
  "score": number (0-100, where 100 is highly likely to be a scam),
  "reasons": string[],
  "verdict": string ("Safe" | "Suspicious" | "Scam")
}

Job Offer Text:
"""
${text}
"""
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const aiResult = JSON.parse(response.choices[0].message.content);

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
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze text.' });
  }
};
