module.exports = function envCheckHandler(req, res) {
  const geminiKey = process.env.GEMINI_API_KEY || "";
  const googleKey = process.env.GOOGLE_API_KEY || "";

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(
    JSON.stringify({
      hasGeminiApiKey: Boolean(geminiKey),
      geminiApiKeyLength: geminiKey.length,
      hasGoogleApiKey: Boolean(googleKey),
      googleApiKeyLength: googleKey.length,
      vercelEnv: process.env.VERCEL_ENV || null,
      nodeEnv: process.env.NODE_ENV || null,
    })
  );
};
