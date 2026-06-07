export interface Channel {
  id: string;
  name: string;
  category: string;
  url: string;
  keyId?: string;
  key?: string;
  keyStr?: string;
  licenseUrl?: string;
  cookie?: string;
  logo: string;
}

export async function fetchChannels(): Promise<Channel[]> {
  try {
    const res = await fetch("/api/live/channels");
    if (!res.ok) throw new Error("Proxy failed");
    return await res.json();
  } catch (err) {
    console.warn("Proxy fetch failed, trying direct GitHub fetch...", err);
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/sonuug5/newtest/refs/heads/main/json/jstr4web.json"
      );
      if (!res.ok) throw new Error("Direct fetch failed");
      return await res.json();
    } catch (directErr) {
      console.error("All fetch attempts failed for channels:", directErr);
      return [];
    }
  }
}

export async function fetchToken(): Promise<string> {
  try {
    const res = await fetch("/api/live/cookies");
    if (!res.ok) throw new Error("Failed to fetch token via proxy");
    const data = await res.json();
    return data.cookie || "";
  } catch (err) {
    console.warn("Error fetching token via proxy, trying direct fallback...", err);
    try {
      const direct = await fetch(
        "https://allinonereborn.online/jstrweb2/cookies.json"
      );
      if (!direct.ok) throw new Error("Direct fetch failed");
      const data = await direct.json();
      const cookieObj = data.find((item: any) => item.cookie);
      return cookieObj ? cookieObj.cookie : "";
    } catch (directErr) {
      console.error("All fetch attempts failed for token:", directErr);
      return "";
    }
  }
}
