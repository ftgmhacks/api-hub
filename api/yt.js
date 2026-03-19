export default async function handler(req, res) {
  // 1. Allowed Domain
  const allowedHost = "ftgmtools.pages.dev";
  
  // 2. Request ke headers check karein
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  // 3. CORS Headers (Security)
  res.setHeader('Access-Control-Allow-Origin', '*'); // Development ke liye hum headers handle kar rahe hain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 4. IMPROVED ORIGIN CHECK
  // Yeh check karega ke kya domain mein 'ftgmtools.pages.dev' shamil hai
  const isAllowed = origin.includes(allowedHost) || referer.includes(allowedHost);

  if (!isAllowed) {
    return res.status(403).json({ 
      error: "Access Denied", 
      message: "Please use the official domain: " + allowedHost 
    });
  }

  // --- Baqi aapka fetch wala code niche same rahega ---
  const { user } = req.query;
  // ... rest of the code
}
