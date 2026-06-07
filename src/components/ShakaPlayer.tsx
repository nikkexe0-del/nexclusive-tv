import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "shaka-player/dist/controls.css";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ShakaPlayerProps {
  url: string;
  clearKeyId?: string;
  clearKey?: string;
  licenseUrl?: string;
  token?: string;
  title?: string;
  category?: string;
  logo?: string;
}

export default function ShakaPlayer({
  url,
  clearKeyId,
  clearKey,
  licenseUrl,
  token,
  title,
  category,
  logo,
}: ShakaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let player: any = null;
    let ui: any = null;
    let isMounted = true;

    const initPlayer = async () => {
      if (!isMounted) return;
      if (!videoRef.current || !containerRef.current) return;

      shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        setError("Browser not supported.");
        return;
      }

      player = new shaka.Player();
      await player.attach(videoRef.current);
      if (!isMounted) return;

      // @ts-ignore
      ui = new shaka.ui.Overlay(player, containerRef.current, videoRef.current);

      player.configure({
        streaming: {
          bufferingGoal: 30,
          bufferBehind: 15,
          retryParameters: {
            maxAttempts: 5,
            baseDelay: 1000,
            backoffFactor: 2,
          },
        },
        manifest: {
          retryParameters: {
            maxAttempts: 5,
            baseDelay: 1000,
            backoffFactor: 2,
          },
        },
      });

      if (clearKeyId && clearKey) {
        player.configure({
          drm: {
            clearKeys: { [clearKeyId]: clearKey },
            preferredKeySystems: ["org.w3.clearkey"],
          },
        });
      } else if (licenseUrl) {
        player.configure({
          drm: {
            servers: {
              "org.w3.clearkey": licenseUrl,
              "com.widevine.alpha": licenseUrl,
            },
          },
        });
      }

      if (token) {
        player.getNetworkingEngine()?.registerRequestFilter((type: any, request: any) => {
          if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) return;
          if (
            request.uris &&
            request.uris[0] &&
            !request.uris[0].startsWith("data:")
          ) {
            const urlCookie = token.startsWith("__hdnea__=")
              ? token.substring(10)
              : token;
            if (!request.uris[0].includes("__hdnea__")) {
              const sep = request.uris[0].includes("?") ? "&" : "?";
              request.uris[0] += `${sep}__hdnea__=${urlCookie}`;
            }
          }
        });
      }

      player.addEventListener("error", (e: any) => {
        if (!isMounted) return;
        if (e.detail && e.detail.code === 7000) return;
        console.error("Shaka Error:", e.detail);
        setError(`Playback error (code ${e.detail?.code ?? "unknown"})`);
      });

      try {
        setError(null);
        await player.load(url);
        if (isMounted && videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      } catch (e: any) {
        if (!isMounted || (e && e.code === 7000)) return;
        console.error("Shaka Load Error:", e);
        setError(`Failed to load stream: ${e.message || "Unknown error"}`);
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (ui) { try { ui.destroy(); } catch (_) {} }
      if (player) { try { player.destroy(); } catch (_) {} }
    };
  }, [url, clearKeyId, clearKey, licenseUrl, token, retryKey]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
      <div ref={containerRef} className="w-full h-full relative z-10">
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ width: "100%", height: "100%", display: "block" }}
          autoPlay
          playsInline
        />
      </div>

      {/* Hover top bar */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-3">
            {logo && (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={logo}
                  alt=""
                  className="w-full h-full object-contain p-1"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500 text-[9px] font-bold tracking-widest text-white uppercase">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                Live
              </div>
              <span className="text-sm font-semibold text-white drop-shadow">{title}</span>
              {category && (
                <span className="text-[10px] text-white/50 font-medium">{category}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center gap-5 text-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <h3 className="font-semibold text-white text-sm tracking-tight">Stream Unavailable</h3>
            <p className="text-xs text-zinc-500 font-mono bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl">
              {error}
            </p>
          </div>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
