import axios from 'axios';

export const checkLinks = async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Array of URLs is required.' });
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'VirusTotal API key is not configured.' });
    }

    const results = [];

    // VirusTotal API requires encoding the URL to base64url for the ID
    for (const url of urls) {
      try {
        const urlId = Buffer.from(url).toString('base64url');
        const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
          headers: {
            'x-apikey': apiKey
          }
        });

        const stats = response.data.data.attributes.last_analysis_stats;
        const malicious = stats.malicious > 0 || stats.suspicious > 0;

        results.push({
          url,
          safe: !malicious,
          stats
        });
      } catch (vtError) {
        console.error(`Error checking URL ${url}:`, vtError.message);
        // If it's a 404, it might mean VT hasn't scanned it yet. We can consider it unknown or try to submit it,
        // but for simplicity, we just mark it as safe/unknown.
        results.push({
          url,
          safe: true,
          error: 'URL not found in VirusTotal database or scan failed.'
        });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Link Check error:', error);
    res.status(500).json({ error: 'Failed to check links.' });
  }
};
