import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// JioTV Channels Proxy
app.get("/api/live/channels", async (_req, res) => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/sonuug5/newtest/refs/heads/main/json/jstr4web.json",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      }
    );
    if (!response.ok) throw new Error("Fetch failed");
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Channels Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

// Cookies/Token Proxy
app.get("/api/live/cookies", async (_req, res) => {
  try {
    const response = await fetch(
      "https://allinonereborn.online/jstrweb2/cookies.json",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://allinonereborn.online/",
        },
      }
    );
    if (!response.ok) throw new Error("Fetch failed");
    const data = await response.json();

    let cookieValue = "";
    if (Array.isArray(data)) {
      const cookieObj = data.find((item: any) => item.cookie);
      if (cookieObj) cookieValue = cookieObj.cookie;
    } else if (data && data.cookie) {
      cookieValue = data.cookie;
    }

    res.status(200).json({ cookie: cookieValue });
  } catch (error) {
    console.error("Cookie Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

export default app;
