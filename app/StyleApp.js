"use client";

import { useState, useCallback } from "react";

const getStyles = (dark) => `
  :root {
    --bg:        ${dark ? "#0e0d0b" : "#faf8f5"};
    --surface:   ${dark ? "#161410" : "#ffffff"};
    --surface2:  ${dark ? "#1e1b17" : "#f5f2ee"};
    --border:    ${dark ? "#2a2520" : "#ede8e1"};
    --border2:   ${dark ? "#352f28" : "#e2dbd2"};
    --text:      ${dark ? "#f0ebe3" : "#1a1714"};
    --text2:     ${dark ? "#9e8e7e" : "#7a6e65"};
    --text3:     ${dark ? "#5e5248" : "#b0a496"};
    --gold:      ${dark ? "#c9a96e" : "#c4a882"};
    --gold2:     ${dark ? "#e0c090" : "#d4b892"};
    --accent:    ${dark ? "rgba(201,169,110,0.10)" : "rgba(196,168,130,0.07)"};
    --shadow:    ${dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.07)"};
  }

  html, body { background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Jost', sans-serif;
    color: var(--text);
    transition: background 0.3s ease, color 0.3s ease;
  }

  .header {
    padding: 26px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 100;
    backdrop-filter: blur(12px);
  }

  .header-left { display: flex; align-items: baseline; gap: 12px; }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--text);
    line-height: 1;
  }

  .header-star { color: var(--gold); }

  .header-sub {
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text3);
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 7px 14px;
    border-radius: 100px;
    border: 1px solid var(--border2);
    background: var(--surface2);
    transition: all 0.2s;
    user-select: none;
  }

  .toggle:hover { border-color: var(--gold); }

  .toggle-label {
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text2);
  }

  .main { max-width: 1000px; margin: 0 auto; padding: 48px 36px 80px; }

  .tagline {
    text-align: center;
    margin-bottom: 36px;
  }

  .tagline-main {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 300;
    font-size: 1.8rem;
    color: var(--text);
    letter-spacing: 0.02em;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .tagline-sub {
    font-size: 0.74rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text3);
  }

  .drop-zone {
    border: 1px dashed var(--border2);
    border-radius: 6px;
    padding: 56px 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    background: var(--surface2);
    position: relative;
    overflow: hidden;
  }

  .drop-zone::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, var(--accent), transparent 70%);
    pointer-events: none;
  }

  .drop-zone.over,
  .drop-zone:hover {
    border-color: var(--gold);
    background: var(--surface);
  }

  .drop-zone input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .drop-ornament {
    font-size: 1.1rem;
    color: var(--gold);
    opacity: 0.7;
    margin-bottom: 14px;
    display: block;
    letter-spacing: 0.4em;
  }

  .drop-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.45rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text2);
    margin-bottom: 6px;
  }

  .drop-sub {
    font-size: 0.74rem;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text3);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 28px;
    margin-top: 44px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
  }

  .card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-3px);
    border-color: var(--border2);
  }

  .img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--surface2);
  }

  .img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .card:hover .img-wrap img { transform: scale(1.03); }

  .img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .card:hover .img-overlay { opacity: 1; }

  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    color: rgba(255,255,255,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s, background 0.2s;
  }

  .card:hover .remove-btn { opacity: 1; }
  .remove-btn:hover { background: rgba(0,0,0,0.75); }

  .img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: var(--gold);
    opacity: 0.25;
  }

  .card-foot { padding: 16px 18px; }

  .analyse-btn {
    width: 100%;
    padding: 11px;
    background: var(--text);
    color: var(--bg);
    border: none;
    border-radius: 3px;
    font-family: 'Jost', sans-serif;
    font-size: 0.74rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .analyse-btn:hover { background: var(--gold); color: #0e0d0b; }

  .loading-wrap {
    display: flex;
    gap: 7px;
    justify-content: center;
    align-items: center;
    padding: 22px;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--gold);
    animation: blink 1.3s ease-in-out infinite;
  }
  .dot2 { animation-delay: 0.22s; }
  .dot3 { animation-delay: 0.44s; }

  @keyframes blink {
    0%, 100% { opacity: 0.2; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  .results {
    border-top: 1px solid var(--border);
    animation: rise 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }

  .overall {
    text-align: center;
    padding: 22px 20px 18px;
    border-bottom: 1px solid var(--border);
    background: var(--accent);
    position: relative;
  }

  .overall::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%; transform: translateX(-50%);
    width: 40px; height: 1px;
    background: var(--gold);
  }

  .overall-num {
    font-family: 'Playfair Display', serif;
    font-size: 3.6rem;
    font-weight: 300;
    line-height: 1;
    color: var(--text);
  }

  .overall-denom {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--text3);
  }

  .overall-label {
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text3);
    margin-top: 5px;
  }

  .overall-vibe {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--gold);
    margin-top: 8px;
  }

  .cats { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 13px; }

  .cat-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;
  }

  .cat-name {
    font-size: 0.74rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text2);
  }

  .cat-score {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--text);
  }

  .bar-bg {
    height: 1.5px;
    background: var(--border);
    border-radius: 1px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    border-radius: 1px;
    transition: width 1.1s cubic-bezier(0.4,0,0.2,1);
  }

  .cat-note {
    font-size: 0.82rem;
    color: var(--text3);
    line-height: 1.6;
    font-weight: 300;
  }

  .err-wrap { padding: 16px 18px; text-align: center; }
  .err-text { font-size: 0.82rem; color: #c0614a; margin-bottom: 4px; }
  .err-detail {
    font-size: 0.72rem;
    color: var(--text3);
    margin-bottom: 12px;
    word-break: break-all;
    line-height: 1.5;
  }

  .footer {
    text-align: center;
    padding: 32px 40px 40px;
    border-top: 1px solid var(--border);
  }

  .footer-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.78rem;
    color: var(--text3);
    letter-spacing: 0.04em;
  }

  .footer-link {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid var(--gold);
    padding-bottom: 1px;
    transition: opacity 0.2s;
  }

  .footer-link:hover { opacity: 0.7; }

  .tip-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gold);
    font-family: 'Jost', sans-serif;
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    opacity: 0.85;
    padding: 0;
    transition: opacity 0.2s;
  }
  .tip-btn:hover { opacity: 1; }
`;

const SOL_ADDRESS = "ACuMAe2S6B8kfCM4o7R1nJWyMcPXYLEdqC4xYaC7tk1S";

function TipButton() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(SOL_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="tip-btn" onClick={copy} title={SOL_ADDRESS}>
      {copied ? "◎ copied!" : "◎ tip sol"}
    </button>
  );
}

function ScoreBar({ score }) {
  return (
    <div className="bar-bg">
      <div className="bar-fill" style={{ width: `${(score / 10) * 100}%` }} />
    </div>
  );
}

function PhotoCard({ photo, onRemove, onAnalyse }) {
  return (
    <div className="card">
      <div className="img-wrap">
        {photo.src ? (
          <>
            <img src={photo.src} alt="" />
            <div className="img-overlay" />
          </>
        ) : (
          <div className="img-placeholder">✦</div>
        )}
        <button className="remove-btn" onClick={() => onRemove(photo.id)}>×</button>
      </div>

      {photo.status === "idle" && (
        <div className="card-foot">
          <button className="analyse-btn" onClick={() => onAnalyse(photo.id)}>
            Analyse Look
          </button>
        </div>
      )}

      {photo.status === "loading" && (
        <div className="loading-wrap">
          <div className="dot" />
          <div className="dot dot2" />
          <div className="dot dot3" />
        </div>
      )}

      {photo.status === "error" && (
        <div className="err-wrap">
          <div className="err-text">Analysis failed</div>
          {photo.errorMsg && <div className="err-detail">{photo.errorMsg}</div>}
          <button className="analyse-btn" onClick={() => onAnalyse(photo.id)}>Retry</button>
        </div>
      )}

      {photo.status === "done" && photo.results && (
        <div className="results">
          <div className="overall">
            <div className="overall-num">
              {photo.results.overall}
              <span className="overall-denom">/10</span>
            </div>
            <div className="overall-label">Overall Score</div>
            <div className="overall-vibe">{photo.results.vibe}</div>
          </div>
          <div className="cats">
            {photo.results.categories.map((c) => (
              <div key={c.name}>
                <div className="cat-head">
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-score">{c.score}/10</span>
                </div>
                <ScoreBar score={c.score} />
                <div className="cat-note">{c.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StyleApp() {
  const [photos, setPhotos] = useState([]);
  const [over, setOver] = useState(false);
  const [dark, setDark] = useState(false);

  const compressImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX_BYTES = 4.5 * 1024 * 1024;
        const maxDim = 2048;
        let scale = 1;
        if (img.width > maxDim || img.height > maxDim) {
          scale = maxDim / Math.max(img.width, img.height);
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const tryCompress = (q) => {
          const dataUrl = canvas.toDataURL("image/jpeg", q);
          const bytes = Math.round(((dataUrl.length - 22) * 3) / 4);
          if (bytes <= MAX_BYTES || q <= 0.2) return dataUrl;
          return tryCompress(q - 0.1);
        };
        resolve(tryCompress(0.85));
      };
      img.src = src;
    });

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 30 * 1024 * 1024) {
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            src: null,
            mediaType: file.type,
            status: "error",
            results: null,
            errorMsg: `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB — max is 30MB`,
          },
        ]);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            src: e.target.result,
            mediaType: file.type,
            status: "idle",
            results: null,
            errorMsg: null,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removePhoto = (id) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const analysePhoto = async (id) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;

    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "loading", errorMsg: null } : p))
    );

    try {
      const compressed = await compressImage(photo.src);
      const base64 = compressed.split(",")[1];

      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: base64, mediaType: "image/jpeg" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "done", results: data } : p))
      );
    } catch (err) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "error", errorMsg: err.message } : p))
      );
    }
  };

  return (
    <>
      <style>{getStyles(dark)}</style>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <h1 className="header-title">
              Liv <span className="header-star">✦</span>
            </h1>
            <span className="header-sub">Style Analysis</span>
          </div>
          <button className="toggle" onClick={() => setDark((d) => !d)}>
            <span>{dark ? "☀️" : "🌙"}</span>
            <span className="toggle-label">{dark ? "Light" : "Night"}</span>
          </button>
        </header>

        <main className="main">
          <div className="tagline">
            <div className="tagline-main">
              Outfit ratings for elegance &amp; true baddies
            </div>
            <div className="tagline-sub">Upload a photo. Get your verdict. ✦</div>
          </div>

          <div
            className={`drop-zone${over ? " over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
            <span className="drop-ornament">✦ ✦ ✦</span>
            <div className="drop-title">Drop your photos here</div>
            <div className="drop-sub">or click to browse · png · jpg · webp · up to 30mb</div>
          </div>

          {photos.length > 0 && (
            <div className="grid">
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onRemove={removePhoto}
                  onAnalyse={analysePhoto}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="footer-text">
            made by{" "}
            <a
              href="https://x.com/LivWeb4"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              @LivWeb4
            </a>
            {" · "}
            <TipButton />
          </div>
        </footer>
      </div>
    </>
  );
}
