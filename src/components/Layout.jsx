import { BgIllustration, DotGrid, FadeIn, GlowLine, Ico } from "../components/UI";
import { useState, useEffect } from "react";
import { useIsMobile } from "./UI";

function Btn(props) {
  var isPrimary = !props.outline && !props.green;
  var bg = props.green ? "#059669" : props.outline ? "transparent" : "rgba(255,255,255,0.06)";
  var clr = props.outline ? "#e4e4e7" : "#fafafa";
  var brd = "1px solid rgba(255,255,255,0.12)";
  var w = props.full ? "100%" : "auto";
  var merged = Object.assign({}, { border:brd, borderRadius:12, fontSize:14, fontWeight:500, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"13px 28px", background:bg, color:clr, width:w, transition:"all 0.3s ease", letterSpacing:"-0.01em", backdropFilter:"blur(10px)" }, props.style || {});
  return <button onClick={props.onClick} style={merged}>{props.children}{isPrimary && <span style={{ fontSize:16, lineHeight:1, display:"inline-flex", alignItems:"center" }}>{"\u2197"}</span>}</button>;
}

function Logo(props) {
  return (
    <div onClick={props.onClick} style={{ display:"flex", alignItems:"center", gap:8, cursor:props.onClick?"pointer":"default" }}>
      <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:16, fontWeight:700, color:"#e4e4e7" }}>T</span>
      </div>
      <span style={{ fontSize:18, fontWeight:600, color:"#e4e4e7", letterSpacing:"-0.3px", fontStyle:"italic" }}>Tutorii</span>
    </div>
  );
}

function SLabel(props) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", verticalAlign:"middle", borderRadius:20, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:24 }}>
      <Ico name={props.icon || "sparkle"} size={14} color="rgb(200,180,140)" />
      <span style={{ fontSize:13, fontWeight:500, textTransform:"uppercase", letterSpacing:"1.2px", color:"#a1a1aa" }}>{props.children}</span>
    </div>
  );
}

function GCard(props) {
  var p = props.padding !== undefined ? props.padding : 32;
  return (
    <div style={Object.assign({}, { background:"linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)", borderRadius:20, padding:1, position:"relative", height:"100%", width:"100%", minWidth:0, boxSizing:"border-box" }, props.outerStyle || {})}>
      <div style={Object.assign({}, { background:"linear-gradient(180deg, #131315 0%, #111113 100%)", borderRadius:19, padding:p, height:"100%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }, props.style || {})}>
        <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", pointerEvents:"none" }} />
        {props.children}
      </div>
    </div>
  );
}

function SiteNav(props) {
  var go = props.go;
  var active = props.active || "";
  var mob = useIsMobile();
  var _open = useState(false); var menuOpen = _open[0]; var setMenuOpen = _open[1];
  var nl = function(id,label){ return (
    <span key={id} onClick={function(){go(id);setMenuOpen(false)}} style={{ fontSize:mob?16:14, fontWeight:400, color: active===id ? "#e4e4e7" : "#71717a", cursor:"pointer", transition:"color 0.2s", padding:mob?"12px 0":"6px 12px", display:mob?"block":"inline", borderBottom:mob?"1px solid rgba(255,255,255,0.04)":"none" }}>{label}</span>
  )};
  return (
    <div>
    <nav style={{ position:"fixed", top:mob?0:16, left:mob?"0":"50%", transform:mob?"none":"translateX(-50%)", display:"flex", justifyContent:"space-between", alignItems:"center", width:mob?"100%":"calc(100% - 48px)", maxWidth:1200, padding:mob?"10px 16px":"12px 8px 12px 24px", background:"rgba(17,17,19,0.85)", backdropFilter:"blur(24px) saturate(1.5)", WebkitBackdropFilter:"blur(24px) saturate(1.5)", zIndex:100, borderRadius:mob?0:16, border:mob?"none":"1px solid rgba(255,255,255,0.06)", borderBottom:mob?"1px solid rgba(255,255,255,0.06)":"none" }}>
      <Logo onClick={function(){go("landing")}} />
      {!mob && <div style={{ display:"flex", alignItems:"center", gap:0, padding:"4px 6px", borderRadius:12, background:"#0a0a0c", border:"1px solid rgba(255,255,255,0.06)" }}>
        {nl("landing","Home")}
        {nl("howItWorks","How It Works")}
        {nl("curriculum","Curriculum")}
        {nl("faq","FAQ")}
      </div>}
      {!mob && <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={function(){go("login")}} style={{ padding:"10px 20px", fontSize:13, fontWeight:500, color:"#d4d4d8", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Log In</button>
        <Btn onClick={function(){go("subscribe")}} style={{ padding:"10px 20px", fontSize:13 }}>Get Started</Btn>
      </div>}
      {mob && <button onClick={function(){setMenuOpen(!menuOpen)}} style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d={menuOpen?"M6 6l12 12M6 18L18 6":"M3 6h18M3 12h18M3 18h18"} stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round"/></svg></button>}
    </nav>
    {mob && menuOpen && <div style={{ position:"fixed", top:52, left:0, right:0, bottom:0, background:"rgba(10,10,12,0.97)", zIndex:99, padding:"24px 24px", display:"flex", flexDirection:"column", animation:"fadeIn 0.2s ease-out" }}>
      {nl("landing","Home")}
      {nl("howItWorks","How It Works")}
      {nl("curriculum","Curriculum")}
      {nl("faq","FAQ")}
      <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:10 }}>
        <button onClick={function(){go("login");setMenuOpen(false)}} style={{ padding:"14px", fontSize:15, fontWeight:600, color:"#d4d4d8", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Log In</button>
        <Btn onClick={function(){go("subscribe");setMenuOpen(false)}} full style={{ padding:"14px", fontSize:15, borderRadius:12 }}>Get Started</Btn>
      </div>
    </div>}
    </div>
  );
}

function SiteFooter(props) {
  var go = props.go;
  var mob = useIsMobile();
  return (
    <footer style={{ padding:mob?"48px 20px 32px":"80px 48px 40px", background:"#08080a", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"flex-start", maxWidth:1100, margin:"0 auto", paddingBottom:40, borderBottom:"1px solid rgba(255,255,255,0.04)", marginBottom:28, gap:mob?32:0 }}>
        <div>
          <Logo />
          <p style={{ fontSize:13, color:"#52525b", marginTop:14, maxWidth:260, lineHeight:1.7 }}>The education and income platform built for expatriates in the UAE and GCC.</p>
          <p style={{ fontSize:13, color:"#52525b", marginTop:8 }}>support@tutorii.com</p>
        </div>
        <div style={{ display:"flex", gap:mob?32:64 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px", marginBottom:16, textTransform:"uppercase" }}>Platform</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["howItWorks","How It Works"],["curriculum","Curriculum"],["faq","FAQ"]].map(function(l){return <span key={l[0]} onClick={function(){go(l[0])}} style={{ fontSize:14, color:"#71717a", cursor:"pointer" }}>{l[1]}</span>})}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px", marginBottom:16, textTransform:"uppercase" }}>Legal</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["terms","Terms of Service"],["privacy","Privacy Policy"],["contact","Contact Us"],["support","Support"]].map(function(l){return <span key={l[0]} onClick={function(){go(l[0])}} style={{ fontSize:14, color:"#71717a", cursor:"pointer" }}>{l[1]}</span>})}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:"#3f3f46", lineHeight:1 }}>© 2026 Tutorii.com</div>
        <span onClick={function(){go("adminLogin")}} style={{ fontSize:12, color:"#3f3f46", cursor:"pointer" }}>Admin</span>
      </div>
    </footer>
  );
}

function CtaBanner(props) {
  var go = props.go;
  var mob = useIsMobile();
  var t = props.title || "Ready to Start Learning & Earning?";
  var s = props.sub || "Subscribe today and unlock courses, referral tools, and weekly payouts";
  return (
    <section style={{ padding:mob?"80px 20px":"160px 48px", background:"#0a0a0c", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <BgIllustration name="skyline" position="right" y="55%" scale={1.2} opacity={0.04} />
      <BgIllustration name="palms" position="left" y="45%" scale={1} opacity={0.035} />
      <DotGrid opacity={0.04} />
      <GlowLine />
      <FadeIn><div style={{ position:"relative", zIndex:1, maxWidth:640, margin:"0 auto" }}>
        <p style={{ fontStyle:"italic", fontSize:14, color:"#71717a", marginBottom:16 }}>Reach out anytime</p>
        <h2 style={{ fontSize:mob?28:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 12px", lineHeight:1.15, letterSpacing:"-1px" }}>{t}</h2>
        <p style={{ fontSize:15, color:"#71717a", marginBottom:40, lineHeight:1.7 }}>{s}</p>
        <Btn onClick={function(){go("subscribe")}}>{"Subscribe · AED "+PRICE+"/month"}</Btn>
        <div style={{ marginTop:14, fontSize:13, color:"#52525b" }}>Cancel anytime · No hidden fees</div>
      </div></FadeIn>
    </section>
  );
}


export { Btn, Logo, SLabel, GCard, SiteNav, SiteFooter, CtaBanner };
