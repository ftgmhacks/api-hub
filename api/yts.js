export default async function handler(req, res) {
  // Get the query from the request, default to 'sc bot' if not provided
  const { query } = req.query;
  const searchQuery = query || 'sc bot';

  const apiUrl = `https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from source API' });
    }

    const data = await response.json();

    // Set Cache-Control headers (optional, caches for 1 hour)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // Return the data to the user
    return res.status(200).json({
      success: true,
      credits: "FTGM HACKS",
      source: "https://ftgmtools.pages.dev",
      results: data
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
