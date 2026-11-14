export default async function handler(req, res) {
  const ALLOWED_ORIGIN = "https://ftgmdb.pages.dev";
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  // Domain lock: Only allow requests from ftgmdb.pages.dev
  const isAllowed =
    origin === ALLOWED_ORIGIN ||
    referer.startsWith(`${ALLOWED_ORIGIN}/`) ||
    referer === ALLOWED_ORIGIN;

  if (!isAllowed) {
    res.setHeader("Content-Type", "application/json");
    return res.status(403).send(
      JSON.stringify(
        {
          status: false,
          error: "Access Denied: This API is only allowed on ftgmdb.pages.dev",
        },
        null,
        2
      )
    );
  }

  // CORS headers exclusively for ftgmdb.pages.dev
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Accept ?number= or ?num=
  const number = req.query.number || req.query.num;

  if (!number) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).send(
      JSON.stringify(
        {
          status: false,
          error: "Missing 'number' query parameter",
        },
        null,
        2
      )
    );
  }

  try {
    const cleanNumber = number.replace(/[^0-9]/g, "");
    const targetUrl = `https://alnayeem.top/nahid.php?number=${encodeURIComponent(cleanNumber)}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://alnayeem.top/",
      },
    });

    const data = await response.json();

    // Extract name from raw_data first, fallback to caller_info.name
    const rawName = data?.result?.caller_info?.raw_data?.[0]?.name;
    const fallbackName = data?.result?.caller_info?.name;

    const extractedName =
      (rawName && rawName !== "Not Available" ? rawName : null) ||
      (fallbackName && fallbackName !== "Not Available" ? fallbackName : null) ||
      "Not Found";

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(
      JSON.stringify(
        {
          name: extractedName,
        },
        null,
        2
      )
    );
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).send(
      JSON.stringify(
        {
          name: null,
          error: "Failed to fetch data from upstream API",
        },
        null,
        2
      )
    );
  }
}
