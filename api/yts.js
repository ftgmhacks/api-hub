export default async function handler(req, res) {
  // 1. Enable CORS - Allow requests from any origin
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle browser OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Get Query from URL
  const { query } = req.query;
  const searchQuery = query || 'sc bot';
  const apiUrl = `https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 3. Pretty Print & Response
    // We use null, 2 in stringify to ensure the raw JSON is indented if viewed in a browser
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({
      status: true,
      creator: "FTGM HACKS",
      timestamp: new Date().toISOString(),
      results: data.data || data // Adjust based on the actual nesting of the source API
    }, null, 2));

  } catch (error) {
    // 4. Graceful Error Handling (Still returns JSON, not a crash)
    return res.status(500).json({ 
      status: false, 
      error: "Failed to fetch YouTube data",
      message: error.message 
    });
  }
}
