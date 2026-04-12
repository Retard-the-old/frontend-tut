import { useState, useEffect, useRef } from "react";

function useIsMobile(breakpoint) {
  var bp = breakpoint || 768;
  var _w = useState(1024);
  var w = _w[0]; var setW = _w[1];
  useEffect(function(){
    setW(window.innerWidth);
    function onResize(){ setW(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return function(){ window.removeEventListener("resize", onResize); };
  }, []);
  return w < bp;
}

// ─── SHARED UI ───
function Badge(props) {
  var s = props.s;
  var colors = { active:["rgba(200,180,140,0.1)","rgb(200,180,140)"], completed:["rgba(200,180,140,0.1)","rgb(200,180,140)"], processing:["rgba(251,191,36,0.1)","#fbbf24"], pending:["rgba(251,191,36,0.1)","#fbbf24"], queued:["rgba(167,139,250,0.1)","#a78bfa"], cancelled:["rgba(248,113,113,0.1)","#f87171"], inactive:["rgba(255,255,255,0.04)","#71717a"], failed:["rgba(248,113,113,0.1)","#f87171"] };
  var v = colors[s] || colors.pending;
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:0.3, textTransform:"uppercase", background:v[0], color:v[1] }}>{s}</span>;
}

function StatCard(props) {
  var mob = useIsMobile();
  var icon = props.icon;
  var label = props.label;
  var value = props.value;
  var sub = props.sub;
  return (
    <div style={{ background:"linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)", borderRadius:14, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"flex-start", gap:14, height:"100%", minHeight:76, overflow:"hidden", minWidth:0 }}>
      <div style={{ width:38, height:38, borderRadius:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0, flexShrink:0, marginTop:2 }}><Ico name={icon} size={16} color="rgb(200,180,140)" /></div>
      <div style={{ display:"flex", flexDirection:"column", minHeight:44 }}>
        <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, color:"#52525b", lineHeight:1.2, height:12, overflow:"hidden" }}>{label}</div>
        <div style={{ fontSize:mob?16:20, fontWeight:500, color:"#d4d4d8", lineHeight:1.2, marginTop:4 }}>{value}</div>
        {sub ? <div style={{ fontSize:10, color:"#52525b", marginTop:2 }}>{sub}</div> : null}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// SVG ICON SYSTEM — SINGLE-COLOR ELEGANT ICONS
// ═══════════════════════════════════════════════
function Ico(props) {
  var s = props.size || 20;
  var c = props.color || "rgb(200,180,140)";
  var paths = {
    shield: "M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4zm0 2.18L6 7.09v4.91c0 4.18 2.72 8.08 6 9.73 3.28-1.65 6-5.55 6-9.73V7.09L12 4.18z",
    chart: "M3 3v18h18v-2H5V3H3zm14 4l-4 4-3-3-4 4v2.5l4-4 3 3 4-4V7z",
    rocket: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    book: "M21 4H3v16h18V4zm-2 14H5V6h14v12zM7 8h10v2H7V8zm0 4h7v2H7v-2z",
    link: "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 17h4v-2H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5zm1-6h8v2H8v-2z",
    dollar: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18h-2v1.93C7.06 19.43 4 16.07 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8c0 4.07-3.06 7.43-7 7.93zM13 9h-2v2h2V9zm0 4h-2v2h2v-2z",
    bank: "M4 10h3v7H4v-7zm6 0h3v7h-3v-7zm8-4L12 2 6 6H2v2h20V6h-4zm-6-1.5L16.55 6H7.45L12 4.5zM2 19v2h20v-2H2zm14-9h3v7h-3v-7z",
    chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z",
    phone: "M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h8a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0015.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z",
    refresh: "M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
    sparkle: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z",
    lightbulb: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
    gear: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z",
    target: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
    globe: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2 0V4.07c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93z",
    bot: "M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z",
    question: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
    wallet: "M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    lock: "M19 11H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm0 9H5v-7h14v7zm-7-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm3-10V5c0-1.66-1.34-3-3-3S9 3.34 9 5v2H7v-2c0-2.76 2.24-5 5-5s5 2.24 5 5v2h-2z",
    briefcase: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    mosque: "M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.83L18.17 11H5.83L12 4.83z",
    scale: "M12 2L4 7v4h16V7l-8-5zm0 2.53L17.74 8H6.26L12 4.53zM4 13v2h16v-2H4zm0 4v4h16v-4H4zm2 2h3v-2H6v2zm5 0h2v-2h-2v2zm5 0h2v-2h-2v2z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  };
  var d = paths[props.name] || paths.sparkle;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", filter:"drop-shadow(0 2px 4px rgba(255,255,255,0.06)) drop-shadow(0 0 8px rgba(200,180,140,0.18))" }}>
      <path d={d} fill={c} fillOpacity="0.85" />
    </svg>
  );
}

// ═══════════════════════════════════════════════
// AMBIENT VISUAL ELEMENTS
// ═══════════════════════════════════════════════

// Subtle SVG wave divider between sections
function WaveDivider(props) {
  var flip = props.flip;
  var opacity = props.opacity || 0.09;
  return (
    <div style={{ position:"absolute", left:0, right:0, height:120, overflow:"hidden", pointerEvents:"none", top:flip?"auto":0, bottom:flip?0:"auto", transform:flip?"scaleY(-1)":"none" }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width:"100%", height:"100%", display:"block" }}>
        <path d="M0,80 C320,100 560,60 720,70 C880,80 1120,55 1440,75 L1440,120 L0,120 Z" fill={"rgba(255,255,255,"+opacity+")"} />
        <path d="M0,90 C400,70 700,95 1000,75 C1200,65 1360,85 1440,90 L1440,120 L0,120 Z" fill={"rgba(255,255,255,"+(opacity*0.5)+")"} />
      </svg>
    </div>
  );
}

// Background vector illustrations — subtle architectural/thematic outlines
function BgIllustration(props) {
  var op = props.opacity || 0.04;
  var pos = props.position || "right";
  var xPos = pos === "left" ? "8%" : pos === "center" ? "50%" : "85%";
  var yPos = props.y || "50%";
  var sc = props.scale || 1;
  var illustrations = {
    skyline: "M120,380 L120,180 L125,180 L125,100 L128,60 L130,20 L132,60 L135,100 L135,180 L140,180 L140,380 M160,380 L160,240 L170,220 L180,240 L180,380 M200,380 L200,200 L205,195 L210,200 L215,195 L220,200 L220,380 M240,380 L240,260 L260,240 L280,260 L280,380 M300,380 L300,220 L305,210 L310,220 L310,380 M320,380 L320,280 L340,260 L360,280 L360,380 M80,380 L80,300 L90,290 L100,300 L100,380 M370,380 L370,250 L380,230 L385,210 L390,230 L400,250 L400,380 M410,380 L410,310 L420,300 L430,310 L430,380 M50,380 L50,320 Q70,300 90,320 L90,380",
    palms: "M80,380 L80,280 M55,255 Q80,230 80,280 M105,255 Q80,230 80,280 M45,275 Q80,245 80,280 M115,275 Q80,245 80,280 M68,245 Q80,225 92,245 M220,380 L220,300 M195,280 Q220,260 220,300 M245,280 Q220,260 220,300 M185,296 Q220,268 220,300 M255,296 Q220,268 220,300 M360,380 L360,320 M342,308 Q360,294 360,320 M378,308 Q360,294 360,320 M338,316 Q360,304 360,320 M382,316 Q360,304 360,320",
    geometric: "M100,100 L150,70 L200,100 L200,160 L150,190 L100,160 Z M200,100 L250,70 L300,100 L300,160 L250,190 L200,160 Z M150,190 L200,160 L250,190 L250,250 L200,280 L150,250 Z M50,190 L100,160 L150,190 L150,250 L100,280 L50,250 Z M250,190 L300,160 L350,190 L350,250 L300,280 L250,250 Z M100,280 L150,250 L200,280 L200,340 L150,370 L100,340 Z M200,280 L250,250 L300,280 L300,340 L250,370 L200,340 Z",
    book_bg: "M200,100 L200,320 M200,100 C160,90 100,95 60,110 L60,330 C100,315 160,310 200,320 M200,100 C240,90 300,95 340,110 L340,330 C300,315 240,310 200,320 M85,125 L180,108 M85,150 L180,133 M85,175 L180,158 M85,200 L180,183 M220,108 L315,125 M220,133 L315,150 M220,158 L315,175 M220,183 L315,200",
    growth: "M60,340 L60,60 M60,340 L380,340 M90,310 C130,290 160,275 200,230 C240,185 270,130 320,70 M90,310 L90,340 M140,278 L140,340 M200,230 L200,340 M260,155 L260,340 M320,70 L320,340",
    network: "M100,200 L200,120 M200,120 L320,150 M320,150 L280,280 M280,280 L150,300 M150,300 L100,200 M200,120 L280,280 M100,200 L320,150 M150,300 L200,120 M96,200 A8,8 0 1,0 104,200 A8,8 0 1,0 96,200 M196,120 A8,8 0 1,0 204,120 A8,8 0 1,0 196,120 M316,150 A8,8 0 1,0 324,150 A8,8 0 1,0 316,150 M276,280 A8,8 0 1,0 284,280 A8,8 0 1,0 276,280 M146,300 A8,8 0 1,0 154,300 A8,8 0 1,0 146,300 M207,207 A5,5 0 1,0 213,207 A5,5 0 1,0 207,207",
    mosque_bg: "M200,350 L200,200 Q200,130 250,130 Q300,130 300,200 L300,350 M140,350 L140,250 Q140,222 160,212 Q178,203 178,175 L178,148 L180,125 L182,148 L182,175 Q182,203 200,212 Q218,222 218,250 L218,350 M320,350 L320,280 Q340,262 360,280 L360,350 M100,350 L100,300 Q118,287 140,300 L140,350 M232,200 Q250,182 268,200 M233,214 Q250,198 267,214",
    coins: "M120,255 A80,25 0 1,1 280,255 A80,25 0 1,1 120,255 M120,235 A80,25 0 1,1 280,235 A80,25 0 1,1 120,235 M120,235 L120,255 M280,235 L280,255 M120,215 A80,25 0 1,1 280,215 A80,25 0 1,1 120,215 M120,215 L120,235 M280,215 L280,235 M145,195 A55,18 0 1,1 255,195 A55,18 0 1,1 145,195 M145,180 A55,18 0 1,1 255,180 A55,18 0 1,1 145,180 M145,180 L145,195 M255,180 L255,195",
    graduation: "M200,180 L60,230 L200,280 L340,230 Z M200,280 L200,330 M140,255 L140,315 Q168,345 200,345 Q232,345 260,315 L260,255 M312,230 L312,305 L306,316 L318,316 L312,305",
    waves_bg: "M0,200 Q60,170 120,200 Q180,230 240,200 Q300,170 360,200 Q420,230 480,200 M0,240 Q70,215 140,240 Q210,265 280,240 Q350,215 420,240 M0,160 Q50,140 100,160 Q150,180 200,160 Q250,140 300,160 Q350,180 400,160 Q450,140 480,160",
  };
  var d = illustrations[props.name] || illustrations.skyline;
  return (
    <div style={{ position:"absolute", left:xPos, top:yPos, transform:"translate(-50%,-50%) scale("+sc+")", pointerEvents:"none", zIndex:0 }}>
      <svg width="480" height="400" viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity:op }}>
        <path d={d} stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Decorative grid dot pattern overlay
function DotGrid(props) {
  var op = props.opacity || 0.045;
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:op, backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize:"32px 32px" }} />
  );
}

// Subtle noise texture overlay
function NoiseOverlay() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.06, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat:"repeat", backgroundSize:"200px 200px" }} />
  );
}

// Glowing line separator
function GlowLine(props) {
  var y = props.top || 0;
  return (
    <div style={{ position:"absolute", top:y, left:0, right:0, height:1, zIndex:5, pointerEvents:"none" }}>
      <div style={{ maxWidth:props.width || 1100, margin:"0 auto", position:"relative", height:1 }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", width:"60%", maxWidth:700, height:2, background:"linear-gradient(90deg, transparent 0%, rgba(200,180,140,0.15) 25%, rgba(200,180,140,0.4) 50%, rgba(200,180,140,0.15) 75%, transparent 100%)", borderRadius:1, top:0 }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 1: Scroll-triggered fade-up (IntersectionObserver)
// ═══════════════════════════════════════════════
function FadeIn(props) {
  var ref = useRef(null);
  var _v = useState(false); var visible = _v[0]; var setVisible = _v[1];
  var delay = props.delay || 0;
  useEffect(function() {
    var el = ref.current; if (!el) return;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-out " + delay + "s, transform 0.7s ease-out " + delay + "s", height: "100%", width: "100%", minWidth: 0 }}>
      {props.children}
    </div>
  );
}


// ═══════════════════════════════════════════════
// EFFECT 3: Cursor glow trail
// ═══════════════════════════════════════════════
function CursorGlow() {
  var mob = useIsMobile();
  var _pos = useState({ x: -200, y: -200 }); var pos = _pos[0]; var setPos = _pos[1];
  useEffect(function() {
    if (mob) return;
    var handler = function(e) { setPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", handler);
    return function() { window.removeEventListener("mousemove", handler); };
  }, [mob]);
  if (mob) return null;
  return (
    <div style={{ position: "fixed", left: pos.x - 150, top: pos.y - 150, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,180,140,0.04), transparent 70%)", pointerEvents: "none", zIndex: 9999, transition: "left 0.15s ease-out, top 0.15s ease-out" }} />
  );
}

// ═══════════════════════════════════════════════
// EFFECT 4: Floating particles
// ═══════════════════════════════════════════════
function FloatingParticles() {
  var mob = useIsMobile();
  if (mob) return null;
  var particles = Array.from({ length: 20 }, function(_, i) {
    return { id: i, left: Math.random() * 100, delay: Math.random() * 15, dur: 12 + Math.random() * 18, size: 1 + Math.random() * 2, op: 0.015 + Math.random() * 0.025 };
  });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {particles.map(function(p) {
        return <div key={p.id} style={{ position: "absolute", left: p.left + "%", bottom: "-10px", width: p.size, height: p.size, borderRadius: "50%", background: "rgba(255,255,255," + p.op + ")", animation: "floatParticle " + p.dur + "s linear " + p.delay + "s infinite" }} />;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 5: Card spotlight on hover
// ═══════════════════════════════════════════════
function SpotlightCard(props) {
  var ref = useRef(null);
  var _glow = useState({ x: 50, y: 50, active: false });
  var glow = _glow[0]; var setGlow = _glow[1];
  var handleMouse = function(e) {
    var rect = ref.current.getBoundingClientRect();
    setGlow({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100, active: true });
  };
  var handleLeave = function() { setGlow(function(g) { return Object.assign({}, g, { active: false }); }); };
  var p = props.padding !== undefined ? props.padding : 32;
  return (
    <div style={Object.assign({}, { background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)", borderRadius: 20, padding: 1, position: "relative", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box" }, props.outerStyle || {})}>
      <div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave} style={Object.assign({}, { background: "linear-gradient(180deg, #131315 0%, #111113 100%)", borderRadius: 19, padding: p, height: "100%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.3s ease", transform: glow.active ? "perspective(800px) rotateX(" + ((glow.y - 50) * -0.04) + "deg) rotateY(" + ((glow.x - 50) * 0.04) + "deg)" : "perspective(800px) rotateX(0) rotateY(0)" }, props.style || {})}>
        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", pointerEvents: "none" }} />
        {glow.active && <div style={{ position: "absolute", left: glow.x + "%", top: glow.y + "%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,180,140,0.06), transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none", transition: "left 0.1s, top 0.1s" }} />}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>{props.children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 6: Marquee trust bar
// ═══════════════════════════════════════════════
function TrustMarquee() {
  var items = ["MamoPay", "Visa", "Mastercard", "Apple Pay", "Google Pay", "MamoPay", "Visa", "Mastercard", "Apple Pay", "Google Pay"];
  return (
    <div style={{ overflow: "hidden", padding: "28px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, #0a0a0c, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(-90deg, #0a0a0c, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", gap: 48, animation: "marquee 30s linear infinite", width: "max-content" }}>
        {items.map(function(item, i) {
          return <span key={i} style={{ fontSize: 13, fontWeight: 500, color: "#3f3f46", letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3f3f46", display: "inline-block" }} />
            {item}
          </span>;
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 7: Section watermark numbers
// ═══════════════════════════════════════════════
function SectionWatermark(props) {
  var mob = useIsMobile();
  if (mob) return null;
  return (
    <div style={{ position: "absolute", top: props.top || "50%", right: props.right || "-2%", transform: "translateY(-50%)", fontSize: props.size || 280, fontWeight: 800, color: "rgba(255,255,255,0.015)", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1, pointerEvents: "none", zIndex: 0, userSelect: "none" }}>
      {props.children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 8: Step connector line with traveling dot
// ═══════════════════════════════════════════════
function StepConnector(props) {
  var h = props.height || 200;
  return (
    <div style={{ position: "absolute", left: 27, top: 56, bottom: 80, width: 2, zIndex: 0 }}>
      <div style={{ width: "100%", height: "100%", background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 6px, transparent 6px, transparent 12px)" }} />
      <div style={{ position: "absolute", top: 0, left: -2, width: 6, height: 6, borderRadius: "50%", background: "rgba(200,180,140,0.3)", animation: "travelDot 4s ease-in-out infinite" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 9: Shimmer text effect
// ═══════════════════════════════════════════════
function ShimmerText(props) {
  return (
    <span style={Object.assign({}, { backgroundImage: "linear-gradient(90deg, rgb(200,180,140), rgba(240,220,180,0.9), rgb(200,180,140))", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 4s linear infinite" }, props.style || {})}>
      {props.children}
    </span>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 10: Progress ring SVG
// ═══════════════════════════════════════════════
function ProgressRing(props) {
  var pct = props.percent || 0;
  var r = 14; var circ = 2 * Math.PI * r;
  var offset = circ - (pct / 100) * circ;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" fill="none" />
      <circle cx="18" cy="18" r={r} stroke="rgba(200,180,140,0.3)" strokeWidth="2.5" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 18 18)" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      <text x="18" y="20" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="sans-serif">{pct + "%"}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 11: Hover glow table row
// ═══════════════════════════════════════════════
function GlowRow(props) {
  var _h = useState(false); var hov = _h[0]; var setHov = _h[1];
  return (
    <div onMouseEnter={function(){setHov(true)}} onMouseLeave={function(){setHov(false)}} style={Object.assign({}, { position:"relative", transition:"background 0.3s", background: hov ? "rgba(200,180,140,0.03)" : "transparent" }, props.style || {})}>
      {props.children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// DEVICE MOCKUP SVGs — DASHBOARD PREVIEWS
// ═══════════════════════════════════════════════


export { useIsMobile, Badge, StatCard, Ico, WaveDivider, BgIllustration, DotGrid, NoiseOverlay, GlowLine, FadeIn, CursorGlow, FloatingParticles, SpotlightCard, TrustMarquee, SectionWatermark, StepConnector, ShimmerText, ProgressRing, GlowRow, DashboardDesktop, DashboardMobile, Skeleton, DashSkeleton };
