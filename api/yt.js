export default async function handler(req, res) {
  const allowedOrigin = "https://ftgmtools.pages.dev";
  
  // Browser requests mein 'origin' header hota hai, 
  // Direct access ya script requests mein 'referer' hota hai.
  const requestOrigin = req.headers.origin || req.headers.referer || "";

  // CORS Setup
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. Origin Lock: Check if request is from your domain
  if (!requestOrigin.startsWith(allowedOrigin)) {
    return res.status(403).json({ 
      error: "Access Denied", 
      message: "This API is only for ftgmtools.pages.dev" 
    });
  }

  // 2. Query Se User Lena (?user=ftgmtech)
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "Please provide a 'user' parameter." });
  }

  try {
    const response = await fetch("https://api.siputzx.my.id/api/stalk/youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user }),
    });

    const data = await response.json();

    // 3. Pretty Preview & Credits
    const resultWithCredits = {
      developed_by: "Rana Faisal Ali",
      main_site: "https://ftgmtools.pages.dev",
      telegram: "https://t.me/FTGMHACKS",
      youtube: "https://youtube.com/@ftgmtech",
      status: "success",
      data: data
    };

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(resultWithCredits, null, 2));

  } catch (error) {
    return res.status(500).json({ error: "Internal Fetch Error" });
  }
        }
