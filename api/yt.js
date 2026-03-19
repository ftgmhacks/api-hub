export default async function handler(req, res) {
  // 1. Domain Configuration
  const allowedDomain = "ftgmtools.pages.dev";
  const referer = req.headers.referer || "";
  const origin = req.headers.origin || "";

  // 2. Simple CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Frontend lock hum logic se handle karenge
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 3. Domain Lock Check (Flexible)
  // Yeh check karega ke kya request aapki site se aa rahi hai
  const isAuthorized = referer.includes(allowedDomain) || origin.includes(allowedDomain);

  if (!isAuthorized) {
    return res.status(403).json({ 
      error: "Access Denied", 
      message: `This API only works on ${allowedDomain}/yt-stalker` 
    });
  }

  // 4. API Logic (New GET URL)
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: "Username is required (?user=name)" });

  try {
    // New GET URL implementation
    const apiUrl = `https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(user)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // 5. Pretty Response with Credits
    const finalData = {
      developed_by: "Rana Faisal Ali",
      source: "FTGM HACKS",
      status: "success",
      result: data
    };

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(finalData, null, 2));

  } catch (error) {
    return res.status(500).json({ error: "API Fetch Error", msg: error.message });
  }
      }
