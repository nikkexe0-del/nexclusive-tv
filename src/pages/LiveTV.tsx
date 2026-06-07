import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Play,
  ArrowLeft,
  Tv2,
  Signal,
  Loader2,
  X,
  ChevronRight,
  Radio,
} from "lucide-react";
import { fetchChannels, fetchToken, Channel } from "../lib/livechannels";
import ShakaPlayer from "../components/ShakaPlayer";

// ─── Gradient Mesh Backdrop (Stripe signature) ────────────────────────────────
function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {/* Large blurred blobs — approximates Stripe's organic SVG mesh */}
      <div
        className="absolute animate-mesh-drift"
        style={{
          top: "-30%", left: "-15%",
          width: "65%", height: "120%",
          background: "radial-gradient(ellipse at 40% 50%, #f5e9d4 0%, transparent 55%)",
          filter: "blur(48px)",
          opacity: 0.9,
        }}
      />
      <div
        className="absolute"
        style={{
          top: "10%", left: "10%",
          width: "40%", height: "80%",
          background: "radial-gradient(ellipse at 50% 40%, #9b6829 0%, transparent 60%)",
          filter: "blur(72px)",
          opacity: 0.35,
        }}
      />
      <div
        className="absolute"
        style={{
          top: "-10%", left: "30%",
          width: "45%", height: "90%",
          background: "radial-gradient(ellipse at 50% 50%, #b9b9f9 0%, #533afd 40%, transparent 70%)",
          filter: "blur(64px)",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute"
        style={{
          top: "5%", right: "-10%",
          width: "40%", height: "80%",
          background: "radial-gradient(ellipse at 60% 50%, #ea2261 0%, #f96bee 40%, transparent 70%)",
          filter: "blur(72px)",
          opacity: 0.38,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 60%, #f6f9fc 100%)",
        }}
      />
    </div>
  );
}

// ─── Category pill (Stripe pill-tag-soft style) ───────────────────────────────
function CategoryPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={active ? {
        background: "#533afd",
        color: "#fff",
        border: "1px solid #533afd",
      } : {
        background: "#fff",
        color: "#64748d",
        border: "1px solid #e3e8ee",
      }}
      className="whitespace-nowrap px-4 py-1.5 rounded-pill text-[11px] font-normal
        tracking-[0.1px] transition-all duration-200 cursor-pointer shrink-0
        hover:border-[#533afd] hover:text-[#533afd]"
    >
      {label}
    </button>
  );
}

// ─── Channel card (card-feature-light style) ──────────────────────────────────
function ChannelCard({ channel, onClick }: { channel: Channel; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col gap-3 p-3 cursor-pointer
        transition-all duration-300 card-light hover:shadow-[rgba(0,55,112,0.10)_0_8px_24px,rgba(0,55,112,0.05)_0_2px_6px]
        hover:-translate-y-0.5"
      style={{ borderRadius: 12 }}
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video overflow-hidden flex items-center justify-center"
        style={{ background: "#f6f9fc", borderRadius: 8, border: "1px solid #e3e8ee" }}
      >
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-[62%] h-[62%] object-contain transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <Tv2 className="w-8 h-8" style={{ color: "#a8c3de" }} />
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: "rgba(13,37,61,0.45)" }}>
          <div className="w-10 h-10 rounded-pill flex items-center justify-center
            scale-75 group-hover:scale-100 transition-transform duration-300"
            style={{ background: "#533afd" }}>
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Live badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-pill
          opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(234,34,97,0.12)", border: "1px solid rgba(234,34,97,0.3)" }}>
          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: "#ea2261" }} />
          <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "#ea2261" }}>Live</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="text-[13px] font-normal truncate transition-colors"
          style={{ color: "#0d253d", letterSpacing: 0 }}>
          {channel.name}
        </p>
        <p className="text-[10px] mt-0.5 font-normal truncate tnum"
          style={{ color: "#64748d" }}>
          {channel.category}
        </p>
      </div>
    </div>
  );
}

// ─── Header / Nav-bar (nav-bar-on-mesh) ───────────────────────────────────────
function Header({
  search, onSearch, channelCount,
}: { search: string; onSearch: (v: string) => void; channelCount: number }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-3"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #e3e8ee",
      }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center"
          style={{ background: "#533afd", boxShadow: "0 0 16px rgba(83,58,253,0.35)" }}>
          <Tv2 className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[15px] font-normal tracking-[-0.3px]"
          style={{ color: "#0d253d", fontWeight: 300 }}>
          Exclusive<span style={{ color: "#533afd", fontWeight: 400 }}>TV</span>
        </span>
      </div>

      {/* Search — text-input style */}
      <div className="flex items-center gap-2 w-full max-w-xs rounded-[6px] px-3 py-2 transition-all group"
        style={{
          background: "#fff",
          border: "1px solid #a8c3de",
          outline: "none",
        }}
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#533afd")}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#a8c3de")}
      >
        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "#64748d" }} />
        <input
          type="text"
          placeholder="Search channels…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="bg-transparent border-none text-[15px] focus:outline-none w-full font-light"
          style={{ color: "#0d253d" }}
        />
        {search && (
          <button onClick={() => onSearch("")} className="transition-colors cursor-pointer"
            style={{ color: "#64748d" }}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Channel count — pill-tag-soft */}
      <div className="shrink-0 flex items-center gap-1.5 pill-tag">
        <Radio className="w-2.5 h-2.5" />
        <span className="tnum">{channelCount}</span>
      </div>
    </header>
  );
}

// ─── Player view ──────────────────────────────────────────────────────────────
function PlayerView({
  channel, token, relatedChannels, onBack, onSelectChannel,
}: {
  channel: Channel; token: string; relatedChannels: Channel[];
  onBack: () => void; onSelectChannel: (ch: Channel) => void;
}) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors group cursor-pointer"
          style={{ color: "#64748d" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#0d253d")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748d")}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[13px] font-normal">All Channels</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-pill"
          style={{ background: "rgba(234,34,97,0.08)", border: "1px solid rgba(234,34,97,0.25)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ea2261" }} />
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "#ea2261" }}>Live</span>
        </div>
      </div>

      {/* Main player + sidebar */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Player — card-dashboard-mockup style */}
        <div className="flex-1 min-w-0">
          <div className="card-light overflow-hidden"
            style={{ borderRadius: 16, boxShadow: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px" }}>
            <ShakaPlayer
              key={`${channel.id}-${channel.url}`}
              url={channel.url}
              clearKeyId={channel.keyId}
              clearKey={channel.key || channel.keyStr}
              licenseUrl={channel.licenseUrl}
              token={token}
              title={channel.name}
              category={channel.category}
              logo={channel.logo}
            />
          </div>

          {/* Channel info strip */}
          <div className="mt-4 flex items-center gap-4 px-1">
            <div className="w-12 h-12 rounded-[8px] flex items-center justify-center overflow-hidden p-2 shrink-0"
              style={{ background: "#f6f9fc", border: "1px solid #e3e8ee" }}>
              <img
                src={channel.logo}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </div>
            <div>
              <h2 className="display-md" style={{ color: "#0d253d" }}>{channel.name}</h2>
              <span className="text-[11px] font-normal tnum" style={{ color: "#64748d" }}>{channel.category}</span>
            </div>
          </div>
        </div>

        {/* Related channels sidebar — card-dark style */}
        {relatedChannels.length > 0 && (
          <div className="xl:w-72 flex flex-col gap-3">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.1px]"
              style={{ color: "#64748d" }}>
              More in {channel.category}
            </h3>
            <div className="card-dark flex flex-col gap-0.5 p-2 max-h-[480px] overflow-y-auto no-scrollbar">
              {relatedChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => onSelectChannel(ch)}
                  className="flex items-center gap-3 p-3 rounded-[8px] text-left cursor-pointer transition-all duration-200 group"
                  style={ch.id === channel.id ? {
                    background: "rgba(83,58,253,0.18)",
                  } : {
                    background: "transparent",
                  }}
                  onMouseEnter={e => { if (ch.id !== channel.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (ch.id !== channel.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div className="w-9 h-9 rounded-[6px] flex items-center justify-center overflow-hidden p-1 shrink-0"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <img src={ch.logo} alt="" className="w-full h-full object-contain"
                      onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-light truncate transition-colors"
                      style={{ color: "rgba(255,255,255,0.75)" }}>
                      {ch.name}
                    </p>
                    {ch.id === channel.id && (
                      <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "#b9b9f9" }}>
                        Now Playing
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 transition-colors"
                    style={{ color: "rgba(255,255,255,0.2)" }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LiveTV() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    Promise.all([
      fetchChannels().catch(() => [] as Channel[]),
      fetchToken().catch(() => ""),
    ]).then(([chs, tok]) => {
      setChannels(chs);
      setToken(tok);
    }).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(channels.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(cats).sort()];
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === "All" || c.category === selectedCategory)
    );
  }, [channels, search, selectedCategory]);

  const relatedChannels = useMemo(() => {
    if (!activeChannel) return [];
    return channels.filter((c) => c.category === activeChannel.category).slice(0, 20);
  }, [channels, activeChannel]);

  const handleSelectChannel = useCallback((ch: Channel) => {
    setActiveChannel(ch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setActiveChannel(null);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "#f6f9fc", color: "#0d253d" }}>

      <Header search={search} onSearch={setSearch} channelCount={filteredChannels.length} />

      <main className="relative">
        {loading ? (
          /* ── Loading state ── */
          <div className="flex flex-col items-center justify-center gap-5 py-48">
            <div className="relative">
              <div className="w-14 h-14 rounded-[12px] flex items-center justify-center card-light">
                <Tv2 className="w-6 h-6" style={{ color: "#a8c3de" }} />
              </div>
              <Loader2 className="absolute -top-2 -right-2 w-5 h-5 animate-spin" style={{ color: "#533afd" }} />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[15px] font-light" style={{ color: "#0d253d" }}>Loading channels</p>
              <p className="text-[13px] font-light tnum" style={{ color: "#64748d" }}>Fetching live streams…</p>
            </div>
          </div>
        ) : activeChannel ? (
          /* ── Player view ── */
          <div className="px-4 sm:px-6 py-6 max-w-[1600px] mx-auto w-full">
            <PlayerView
              channel={activeChannel}
              token={token}
              relatedChannels={relatedChannels}
              onBack={handleBack}
              onSelectChannel={handleSelectChannel}
            />
          </div>
        ) : (
          /* ── Channel grid ── */
          <>
            {/* Gradient mesh hero — Stripe signature band */}
            <div className="relative w-full overflow-hidden" style={{ height: 280, minHeight: 220 }}>
              <GradientMesh className="absolute inset-0 w-full h-full" />
              {/* Hero text floats above mesh */}
              <div className="relative z-10 px-6 sm:px-10 pt-14 pb-10 max-w-[1600px] mx-auto animate-fade-in">
                <div className="pill-tag mb-5" style={{ display: "inline-flex" }}>
                  <Radio className="w-2.5 h-2.5" />
                  Live Streaming
                </div>
                <h1 className="display-xxl" style={{ color: "#0d253d" }}>Live TV</h1>
                <p className="text-[15px] font-light mt-2 tnum" style={{ color: "#273951" }}>
                  {channels.length} channels · streaming now
                </p>
              </div>
            </div>

            {/* Content below mesh — canvas-soft */}
            <div className="px-4 sm:px-6 py-6 max-w-[1600px] mx-auto w-full animate-slide-up">
              {/* Category pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-6">
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat}
                    label={cat}
                    active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </div>

              {/* Grid */}
              {filteredChannels.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-40 text-center">
                  <Signal className="w-10 h-10" style={{ color: "#a8c3de" }} />
                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-light" style={{ color: "#64748d" }}>No channels found</p>
                    <p className="text-[13px] font-light" style={{ color: "#a8c3de" }}>
                      Try a different search or category
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                  {filteredChannels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      onClick={() => handleSelectChannel(channel)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer — footer-light */}
      <footer className="border-t px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ background: "#fff", borderColor: "#e3e8ee" }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] flex items-center justify-center"
            style={{ background: "#533afd" }}>
            <Tv2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-[13px] font-light tnum" style={{ color: "#64748d" }}>ExclusiveTV</span>
        </div>
        <span className="text-[13px] font-light" style={{ color: "#a8c3de", letterSpacing: "-0.39px" }}>
          Built by Nikshep Doggalli · @nikkk.exe
        </span>
      </footer>
    </div>
  );
}
