"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const OCCASIONS = ["Any", "Night Out", "Casual", "Formal", "Red Carpet", "Street Style"];

const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --bg:        ${dark ? "#08070a" : "#faf8f5"};
    --surface:   ${dark ? "#100e14" : "#ffffff"};
    --surface2:  ${dark ? "#16121d" : "#f5f2ee"};
    --border:    ${dark ? "#2a1f35" : "#ede8e1"};
    --border2:   ${dark ? "#3a2a4a" : "#e2dbd2"};
    --text:      ${dark ? "#f0e8f8" : "#1a1714"};
    --text2:     ${dark ? "#9e7ebe" : "#7a6e65"};
    --text3:     ${dark ? "#5e3e78" : "#b0a496"};
    --gold:      ${dark ? "#c9a96e" : "#c4a882"};
    --gold2:     ${dark ? "#e0c090" : "#d4b892"};
    --accent:    ${dark ? "rgba(180,100,220,0.08)" : "rgba(196,168,130,0.07)"};
    --pink:      ${dark ? "#ff3d9a" : "#d4006a"};
    --purple:    ${dark ? "#9b4dca" : "#8b6ba8"};
    --red:       #c0614a;
    --shadow:    ${dark ? "0 20px 60px rgba(0,0,0,0.7)" : "0 12px 40px rgba(0,0,0,0.07)"};
    --glow:      ${dark ? "0 0 40px rgba(180,100,220,0.15)" : "none"};
  }

  html, body { background: var(--bg); margin: 0; padding: 0; }

  /* BADDIE BACKGROUND */
  .app {
    min-height: 100vh;
    font-family: 'Jost', sans-serif;
    color: var(--text);
    transition: background 0.3s ease, color 0.3s ease;
    position: relative;
    background: ${dark
      ? `#08070a`
      : `#faf8f5`};
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: ${dark ? `
      radial-gradient(ellipse 80% 50% at 15% 20%, rgba(155,77,202,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 85% 10%, rgba(224,96,160,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 70% 85%, rgba(120,50,180,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 30% 75%, rgba(200,80,130,0.10) 0%, transparent 50%)
    ` : `
      radial-gradient(ellipse 70% 40% at 10% 10%, rgba(196,168,130,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 30% at 90% 80%, rgba(196,168,130,0.06) 0%, transparent 50%)
    `};
  }

  .app::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    ${dark ? `
      background-image:
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(155,77,202,0.015) 2px,
          rgba(155,77,202,0.015) 4px
        );
    ` : ''}
  }

  .app > * { position: relative; z-index: 1; }

  /* CLEAN HEADER */
  .header {
    padding: 18px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: ${dark ? "rgba(8,7,10,0.75)" : "rgba(250,248,245,0.85)"};
    border-bottom: 1px solid ${dark ? "rgba(155,77,202,0.2)" : "var(--border)"};
    gap: 12px;
  }

  .header-left { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: var(--text);
    line-height: 1;
    margin: 0;
  }
  .header-star {
    color: var(--gold);
    ${dark ? "filter: drop-shadow(0 0 8px rgba(201,169,110,0.6));" : ""}
  }
  .header-divider { width: 1px; height: 22px; background: var(--border2); opacity: 0.5; }
  .header-sub {
    font-size: 0.65rem;
    font-weight: 300;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text3);
  }
  .header-right { display: flex; align-items: center; gap: 8px; }

  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border2);
    background: var(--surface2);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    user-select: none;
    position: relative;
  }
  .icon-btn:hover { border-color: var(--gold); ${dark ? "box-shadow: 0 0 12px rgba(201,169,110,0.2);" : ""} }
  .icon-btn.active-roast { border-color: var(--red); background: rgba(192,97,74,0.12); }
  .icon-btn.active-history { border-color: var(--purple); background: rgba(155,77,202,0.12); ${dark ? "box-shadow: 0 0 12px rgba(155,77,202,0.2);" : ""} }

  .icon-btn-label {
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.55rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text3);
    white-space: nowrap;
    pointer-events: none;
  }

  .pill-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 16px;
    border-radius: 100px;
    border: 1px solid var(--border2);
    background: var(--surface2);
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text2);
    transition: all 0.2s;
    user-select: none;
    white-space: nowrap;
  }
  .pill-btn:hover { border-color: var(--gold); color: var(--gold); }
  .pill-btn.active { border-color: var(--red); background: rgba(192,97,74,0.12); color: var(--red); }

  /* HISTORY PANEL */
  .history-panel {
    border-bottom: 1px solid var(--border);
    background: ${dark ? "rgba(16,14,20,0.9)" : "rgba(245,242,238,0.95)"};
    backdrop-filter: blur(12px);
    animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }

  @keyframes slideDown {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 400px; }
  }

  .history-inner { max-width: 1000px; margin: 0 auto; padding: 20px 24px; }
  .history-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .history-title { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--text3); }
  .history-clear { font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--red); background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif; opacity: 0.7; transition: opacity 0.2s; padding: 0; }
  .history-clear:hover { opacity: 1; }

  .history-scroll { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 4px; }
  .history-scroll::-webkit-scrollbar { height: 2px; }
  .history-scroll::-webkit-scrollbar-track { background: var(--border); }
  .history-scroll::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 1px; }

  .history-item {
    flex-shrink: 0;
    width: 90px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .history-item:hover { transform: translateY(-2px); }
  .history-thumb {
    width: 90px; height: 120px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--border2);
    position: relative;
    transition: border-color 0.2s;
  }
  .history-item:hover .history-thumb { border-color: var(--gold); }
  .history-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .history-score {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 8px 6px 6px;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 300;
    color: #fff;
    text-align: center;
    line-height: 1;
  }
  .history-score span { font-size: 0.55rem; color: rgba(255,255,255,0.5); }
  .history-vibe { font-size: 0.58rem; letter-spacing: 0.08em; color: var(--text3); margin-top: 6px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-date { font-size: 0.55rem; letter-spacing: 0.05em; color: var(--text3); opacity: 0.6; text-align: center; margin-top: 2px; }

  .history-empty { font-size: 0.75rem; color: var(--text3); font-style: italic; text-align: center; padding: 20px; width: 100%; }

  /* MAIN */
  .main { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
  .tagline { text-align: center; margin-bottom: 32px; }
  .tagline-main {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 300;
    font-size: 1.8rem;
    color: var(--text);
    letter-spacing: 0.02em;
    margin-bottom: 8px;
    line-height: 1.4;
    ${dark ? "text-shadow: 0 0 40px rgba(155,77,202,0.3);" : ""}
  }
  .tagline-sub { font-size: 0.74rem; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text3); }

  .occasion-wrap { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 28px; }
  .occasion-btn { padding: 6px 16px; border-radius: 100px; border: 1px solid var(--border2); background: var(--surface2); font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text2); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .occasion-btn:hover { border-color: var(--gold); color: var(--gold); }
  .occasion-btn.active { border-color: var(--gold); background: var(--accent); color: var(--gold); ${dark ? "box-shadow: 0 0 16px rgba(201,169,110,0.15);" : ""} }

  .drop-zone {
    border: 1px dashed var(--border2);
    border-radius: 8px;
    padding: 52px 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    background: var(--surface2);
    position: relative;
    overflow: hidden;
  }
  .drop-zone::before {
    content: '';
    position: absolute; inset: 0;
    background: ${dark
      ? `radial-gradient(ellipse at 50% 0%, rgba(155,77,202,0.12), transparent 70%)`
      : `radial-gradient(ellipse at 50% 0%, var(--accent), transparent 70%)`};
    pointer-events: none;
  }
  .drop-zone.over, .drop-zone:hover {
    border-color: var(--gold);
    background: var(--surface);
    ${dark ? "box-shadow: 0 0 30px rgba(155,77,202,0.1);" : ""}
  }
  .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .drop-ornament { font-size: 1.1rem; color: var(--gold); opacity: 0.7; margin-bottom: 14px; display: block; letter-spacing: 0.4em; }
  .drop-title { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 300; font-style: italic; color: var(--text2); margin-bottom: 6px; }
  .drop-sub { font-size: 0.74rem; font-weight: 300; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text3); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
  }
  .card:hover {
    box-shadow: var(--shadow)${dark ? ", 0 0 30px rgba(155,77,202,0.12)" : ""};
    transform: translateY(-3px);
    border-color: var(--border2);
  }

  .img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; background: var(--surface2); }
  .img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .card:hover .img-wrap img { transform: scale(1.03); }
  .img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
  .card:hover .img-overlay { opacity: 1; }

  .remove-btn { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; cursor: pointer; font-size: 14px; color: rgba(255,255,255,0.85); display: flex; align-items: center; justify-content: center; z-index: 2; opacity: 0; transition: opacity 0.2s, background 0.2s; }
  .card:hover .remove-btn { opacity: 1; }
  .remove-btn:hover { background: rgba(0,0,0,0.75); }
  .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--gold); opacity: 0.25; }

  .card-foot { padding: 16px 18px; }
  .analyse-btn { width: 100%; padding: 11px; background: var(--text); color: var(--bg); border: none; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 0.74rem; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .analyse-btn:hover { background: var(--gold); color: #08070a; ${dark ? "box-shadow: 0 0 20px rgba(201,169,110,0.3);" : ""} }

  .loading-wrap { display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; padding: 24px; }
  .loading-label { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text3); }
  .dots { display: flex; gap: 7px; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); animation: blink 1.3s ease-in-out infinite; ${dark ? "box-shadow: 0 0 6px rgba(201,169,110,0.5);" : ""} }
  .dot2 { animation-delay: 0.22s; }
  .dot3 { animation-delay: 0.44s; }

  @keyframes blink {
    0%, 100% { opacity: 0.2; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  .results { border-top: 1px solid var(--border); animation: rise 0.5s cubic-bezier(0.4,0,0.2,1); }

  @keyframes rise {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }

  .overall { text-align: center; padding: 22px 20px 18px; border-bottom: 1px solid var(--border); background: var(--accent); position: relative; }
  .overall::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 1px; background: var(--gold); ${dark ? "box-shadow: 0 0 8px rgba(201,169,110,0.4);" : ""} }
  .overall-num { font-family: 'Playfair Display', serif; font-size: 3.6rem; font-weight: 300; line-height: 1; color: var(--text); }
  .overall-denom { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--text3); }
  .overall-label { font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text3); margin-top: 5px; }
  .overall-vibe { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.05rem; color: var(--gold); margin-top: 8px; ${dark ? "text-shadow: 0 0 20px rgba(201,169,110,0.4);" : ""} }
  .occasion-badge { display: inline-block; margin-top: 8px; padding: 3px 10px; border-radius: 100px; border: 1px solid var(--border2); font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text3); }

  .cats { padding: 16px 18px 4px; display: flex; flex-direction: column; gap: 13px; }
  .cat-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
  .cat-name { font-size: 0.74rem; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text2); }
  .cat-score { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 300; color: var(--text); }
  .bar-bg { height: 1.5px; background: var(--border); border-radius: 1px; overflow: hidden; margin-bottom: 5px; }
  .bar-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 1px; transition: width 1.1s cubic-bezier(0.4,0,0.2,1); }
  .cat-note { font-size: 0.82rem; color: var(--text3); line-height: 1.6; font-weight: 300; }

  .tips-section { margin: 4px 18px 16px; padding: 14px 16px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface2); }
  .tips-title { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
  .tip-item { font-size: 0.78rem; color: var(--text2); line-height: 1.6; font-weight: 300; padding: 5px 0; border-bottom: 1px solid var(--border); display: flex; gap: 8px; align-items: flex-start; }
  .tip-item:last-child { border-bottom: none; padding-bottom: 0; }
  .tip-dot { color: var(--gold); flex-shrink: 0; margin-top: 1px; }

  .err-wrap { padding: 16px 18px; text-align: center; }
  .err-text { font-size: 0.82rem; color: #c0614a; margin-bottom: 4px; }
  .err-detail { font-size: 0.72rem; color: var(--text3); margin-bottom: 12px; word-break: break-all; line-height: 1.5; }

  .share-row { padding: 12px 18px 16px; }
  .share-btn { width: 100%; padding: 10px; background: transparent; color: var(--gold); border: 1px solid var(--gold); border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .share-btn:hover { background: var(--gold); color: #08070a; ${dark ? "box-shadow: 0 0 20px rgba(201,169,110,0.25);" : ""} }
  .share-btn:disabled { opacity: 0.5; cursor: wait; }

  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal { background: var(--surface); border: 1px solid var(--border2); border-radius: 10px; max-width: 480px; width: 100%; overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1); }

  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }

  .modal-preview { width: 100%; display: block; border-bottom: 1px solid var(--border); }
  .modal-actions { padding: 16px 20px; display: flex; gap: 10px; align-items: center; }
  .modal-btn { flex: 1; padding: 11px; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .modal-btn-primary { background: var(--text); color: var(--bg); border: none; }
  .modal-btn-primary:hover { background: var(--gold); color: #08070a; }
  .modal-btn-primary:disabled { opacity: 0.5; cursor: wait; }
  .modal-btn-x { background: transparent; color: var(--gold); border: 1px solid var(--gold); }
  .modal-btn-x:hover { background: var(--gold); color: #08070a; }
  .modal-btn-x:disabled { opacity: 0.5; cursor: wait; }
  .modal-close { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 1.2rem; padding: 4px 8px; transition: color 0.2s; flex-shrink: 0; }
  .modal-close:hover { color: var(--text); }

  .share-card-wrap { position: fixed; left: -9999px; top: 0; width: 480px; pointer-events: none; }

  .confetti-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 999; overflow: hidden; }
  .confetti-piece { position: absolute; top: -10px; animation: confettiFall linear forwards; }

  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  .footer { text-align: center; padding: 32px 40px 40px; border-top: 1px solid var(--border); }
  .footer-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 0.78rem; color: var(--text3); letter-spacing: 0.04em; }
  .footer-link { color: var(--gold); text-decoration: none; border-bottom: 1px solid var(--gold); padding-bottom: 1px; transition: opacity 0.2s; }
  .footer-link:hover { opacity: 0.7; }
  .tip-btn { background: none; border: none; cursor: pointer; color: var(--gold); font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 300; letter-spacing: 0.08em; opacity: 0.85; padding: 0; transition: opacity 0.2s; }
  .tip-btn:hover { opacity: 1; }

  @media (max-width: 600px) {
    .header { padding: 14px 16px; }
    .header-title { font-size: 1.5rem; }
    .header-divider, .header-sub { display: none; }
    .header-right { gap: 6px; }
    .main { padding: 28px 16px 60px; }
    .tagline-main { font-size: 1.4rem; }
    .grid { grid-template-columns: 1fr; gap: 20px; }
    .drop-zone { padding: 36px 20px; }
    .drop-title { font-size: 1.2rem; }
    .modal { margin: 0 8px; }
    .history-inner { padding: 16px; }
  }
`;

const SOL_ADDRESS = "ACuMAe2S6B8kfCM4o7R1nJWyMcPXYLEdqC4xYaC7tk1S";
const GOLD_COLORS = ["#c9a96e", "#e0c090", "#d4b892", "#f0ebe3", "#c4a882", "#9b4dca", "#e060a0", "#ffffff"];
const HISTORY_KEY = "liv_style_history";
const MAX_HISTORY = 20;

function TipButton() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(SOL_ADDRESS); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return <button className="tip-btn" onClick={copy} title={SOL_ADDRESS}>{copied ? "◎ copied!" : "◎ tip sol"}</button>;
}

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
    size: 5 + Math.random() * 8,
    round: Math.random() > 0.5,
  }));
  return (
    <div className="confetti-wrap">
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.color, borderRadius: p.round ? "50%" : "1px", animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }} />
      ))}
    </div>
  );
}

function AnimatedScore({ target }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((ease * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{display}</>;
}

function ScoreBar({ score }) {
  return (
    <div className="bar-bg">
      <div className="bar-fill" style={{ width: `${(score / 10) * 100}%` }} />
    </div>
  );
}

function ShareCard({ photo, results }) {
  return (
    <div style={{ width: 480, background: "#08070a", fontFamily: "Jost, sans-serif", color: "#f0e8f8" }}>
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
        <img src={photo.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} crossOrigin="anonymous" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,7,10,0.95) 0%, rgba(8,7,10,0.2) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 18, left: 22 }}>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "3.8rem", fontWeight: 300, lineHeight: 1, color: "#f0e8f8" }}>
            {results.overall}<span style={{ fontSize: "1.3rem", color: "#5e3e78" }}>/10</span>
          </div>
          <div style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "0.95rem", color: "#c9a96e", marginTop: 4 }}>{results.vibe}</div>
        </div>
        <div style={{ position: "absolute", top: 14, right: 16, fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#c9a96e", letterSpacing: "0.05em" }}>Liv ✦</div>
      </div>
      <div style={{ padding: "18px 22px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 22px" }}>
          {results.categories.map((c) => (
            <div key={c.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                <span style={{ fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9e7ebe" }}>{c.name}</span>
                <span style={{ fontFamily: "Playfair Display, serif", fontSize: "0.9rem", fontWeight: 300, color: "#f0e8f8" }}>{c.score}</span>
              </div>
              <div style={{ height: 1.5, background: "#2a1f35", borderRadius: 1, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(c.score / 10) * 100}%`, background: "linear-gradient(90deg, #c9a96e, #e0c090)", borderRadius: 1 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #2a1f35", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5e3e78" }}>livwebstyles.vercel.app</span>
          <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "0.68rem", color: "#5e3e78" }}>rate your look ✦</span>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ photo, results, onClose }) {
  const cardRef = useRef(null);
  const [cardImg, setCardImg] = useState(null);
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!cardRef.current) return;
      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#08070a", logging: false });
        setCardImg(canvas.toDataURL("image/png"));
      } catch (e) { console.error(e); }
      finally { setGenerating(false); }
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const download = () => {
    if (!cardImg) return;
    const a = document.createElement("a");
    a.href = cardImg; a.download = "liv-style-rating.png"; a.click();
  };

  const shareImage = async () => {
    if (!cardImg) return;
    const text = `I got ${results.overall}/10 on Liv ✦ Style Analysis — "${results.vibe}" ✦\nRate your look 👉 livwebstyles.vercel.app`;
    const res = await fetch(cardImg);
    const blob = await res.blob();
    const file = new File([blob], "liv-style-rating.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    download();
    setTimeout(() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank"), 600);
  };

  return (
    <>
      <div className="share-card-wrap" ref={cardRef}><ShareCard photo={photo} results={results} /></div>
      <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          {generating ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text3)", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>generating card...</div>
          ) : cardImg ? (
            <img src={cardImg} alt="Share card" className="modal-preview" />
          ) : (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text3)", fontSize: "0.75rem" }}>Could not generate preview</div>
          )}
          <div className="modal-actions">
            <button className="modal-btn modal-btn-primary" onClick={shareImage} disabled={!cardImg}>✦ Share My Rating</button>
            <button className="modal-btn modal-btn-x" onClick={download} disabled={!cardImg}>↓ Save Image</button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── History helpers ──────────────────────────────────────────────────────────
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(items) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY))); } catch {}
}

function formatRelativeDate(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── History Panel ────────────────────────────────────────────────────────────
function HistoryPanel({ history, onSelect, onClear }) {
  return (
    <div className="history-panel">
      <div className="history-inner">
        <div className="history-header">
          <span className="history-title">✦ Past Ratings</span>
          {history.length > 0 && <button className="history-clear" onClick={onClear}>Clear all</button>}
        </div>
        <div className="history-scroll">
          {history.length === 0 ? (
            <div className="history-empty">No ratings yet — upload a photo to get started ✦</div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item" onClick={() => onSelect(item)}>
                <div className="history-thumb">
                  <img src={item.src} alt="" />
                  <div className="history-score">
                    {item.results.overall}<span>/10</span>
                  </div>
                </div>
                <div className="history-vibe">{item.results.vibe}</div>
                <div className="history-date">{formatRelativeDate(item.ts)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Photo Card ───────────────────────────────────────────────────────────────
function PhotoCard({ photo, onRemove, onAnalyse, roastMode }) {
  const [showShare, setShowShare] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiShown = useRef(false);

  useEffect(() => {
    if (photo.status === "done" && photo.results && !confettiShown.current && photo.results.overall >= 8) {
      confettiShown.current = true;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4500);
    }
  }, [photo.status, photo.results]);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="card">
        <div className="img-wrap">
          {photo.src ? (<><img src={photo.src} alt="" /><div className="img-overlay" /></>) : (<div className="img-placeholder">✦</div>)}
          <button className="remove-btn" onClick={() => onRemove(photo.id)}>×</button>
        </div>

        {photo.status === "idle" && (
          <div className="card-foot">
            <button className="analyse-btn" onClick={() => onAnalyse(photo.id)}>{roastMode ? "🔥 Roast My Look" : "Analyse Look"}</button>
          </div>
        )}

        {photo.status === "loading" && (
          <div className="loading-wrap">
            <div className="dots"><div className="dot" /><div className="dot dot2" /><div className="dot dot3" /></div>
            <div className="loading-label">{roastMode ? "preparing roast..." : "analysing look..."}</div>
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
          <>
            <div className="results">
              <div className="overall">
                <div className="overall-num"><AnimatedScore target={photo.results.overall} /><span className="overall-denom">/10</span></div>
                <div className="overall-label">Overall Score</div>
                <div className="overall-vibe">{photo.results.vibe}</div>
                {photo.results.occasion && photo.results.occasion !== "Any" && (
                  <div className="occasion-badge">{photo.results.occasion}</div>
                )}
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
              {photo.results.tips && photo.results.tips.length > 0 && (
                <div className="tips-section">
                  <div className="tips-title">✦ Style Tips</div>
                  {photo.results.tips.map((tip, i) => (
                    <div key={i} className="tip-item"><span className="tip-dot">→</span><span>{tip}</span></div>
                  ))}
                </div>
              )}
            </div>
            <div className="share-row">
              <button className="share-btn" onClick={() => setShowShare(true)}>✦ Share My Rating</button>
            </div>
          </>
        )}

        {showShare && photo.results && <ShareModal photo={photo} results={photo.results} onClose={() => setShowShare(false)} />}
      </div>
    </>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function StyleApp() {
  const [photos, setPhotos] = useState([]);
  const [over, setOver] = useState(false);
  const [dark, setDark] = useState(true); // default dark for baddie vibes
  const [roastMode, setRoastMode] = useState(false);
  const [occasion, setOccasion] = useState("Any");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Save to history when a photo finishes analysis
  useEffect(() => {
    const done = photos.filter(p => p.status === "done" && p.results && p.src);
    if (done.length === 0) return;
    setHistory(prev => {
      const existingIds = new Set(prev.map(h => h.historyId));
      const newItems = done
        .filter(p => !existingIds.has(p.id))
        .map(p => ({ id: p.id, historyId: p.id, src: p.src, results: p.results, ts: Date.now() }));
      if (newItems.length === 0) return prev;
      const updated = [...newItems, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, [photos]);

  const compressImage = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_BYTES = 4.5 * 1024 * 1024;
      const maxDim = 2048;
      let scale = 1;
      if (img.width > maxDim || img.height > maxDim) scale = maxDim / Math.max(img.width, img.height);
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
        setPhotos((prev) => [...prev, { id: Date.now() + Math.random(), src: null, mediaType: file.type, status: "error", results: null, errorMsg: `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB — max is 30MB` }]);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setPhotos((prev) => [...prev, { id: Date.now() + Math.random(), src: e.target.result, mediaType: file.type, status: "idle", results: null, errorMsg: null }]);
      reader.readAsDataURL(file);
    });
  }, []);

  const removePhoto = (id) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const analysePhoto = async (id) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, status: "loading", errorMsg: null } : p)));
    try {
      const compressed = await compressImage(photo.src);
      const base64 = compressed.split(",")[1];
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: base64, mediaType: "image/jpeg", roastMode, occasion }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, status: "done", results: data } : p)));
    } catch (err) {
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, status: "error", errorMsg: err.message } : p)));
    }
  };

  // Load a history item back into the main grid
  const handleSelectHistory = (item) => {
    const alreadyLoaded = photos.find(p => p.id === item.id);
    if (!alreadyLoaded) {
      setPhotos(prev => [{ id: item.id, src: item.src, mediaType: "image/jpeg", status: "done", results: item.results, errorMsg: null }, ...prev]);
    }
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <>
      <style>{getStyles(dark)}</style>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <h1 className="header-title">Liv <span className="header-star">✦</span></h1>
            <div className="header-divider" />
            <span className="header-sub">Style Analysis</span>
          </div>
          <div className="header-right">
            <button
              className={`icon-btn${roastMode ? " active-roast" : ""}`}
              onClick={() => setRoastMode(r => !r)}
              title="Roast Mode"
            >
              🔥
            </button>
            <button
              className={`icon-btn${showHistory ? " active-history" : ""}`}
              onClick={() => setShowHistory(h => !h)}
              title="History"
              style={{ position: "relative" }}
            >
              🕰
              {history.length > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "var(--purple)", color: "#fff",
                  fontSize: "0.55rem", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Jost, sans-serif", fontWeight: 500,
                }}>{Math.min(history.length, 9)}{history.length > 9 ? "+" : ""}</span>
              )}
            </button>
            <button className="icon-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {showHistory && (
          <HistoryPanel history={history} onSelect={handleSelectHistory} onClear={clearHistory} />
        )}

        <main className="main">
          <div className="tagline">
            <div className="tagline-main">{roastMode ? "Brutal honesty for true baddies 🔥" : "Outfit ratings for elegance & true baddies"}</div>
            <div className="tagline-sub">Upload a photo. Get your verdict. ✦</div>
          </div>

          <div className="occasion-wrap">
            {OCCASIONS.map((o) => (
              <button key={o} className={`occasion-btn${occasion === o ? " active" : ""}`} onClick={() => setOccasion(o)}>{o}</button>
            ))}
          </div>

          <div
            className={`drop-zone${over ? " over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}
          >
            <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} />
            <span className="drop-ornament">✦ ✦ ✦</span>
            <div className="drop-title">Drop your photos here</div>
            <div className="drop-sub">or click to browse · png · jpg · webp · up to 30mb</div>
          </div>

          {photos.length > 0 && (
            <div className="grid">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onRemove={removePhoto} onAnalyse={analysePhoto} roastMode={roastMode} occasion={occasion} />
              ))}
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="footer-text">
            made by{" "}
            <a href="https://x.com/LivWeb4" target="_blank" rel="noopener noreferrer" className="footer-link">@LivWeb4</a>
            {" · "}<TipButton />
          </div>
        </footer>
      </div>
    </>
  );
}
