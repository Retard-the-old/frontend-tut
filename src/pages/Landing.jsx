import { useState, useEffect, useRef } from "react";
import { useIsMobile, DashboardDesktop, DashboardMobile, FadeIn } from "../components/UI";
import { PRICE, L1_RATE, L2_RATE, INIT_COURSES } from "../constants";

// ─── Design tokens ───────────────────────────────────────────────────────────
var BG       = "#020617";
var SURFACE  = "#0b1326";
var CARD     = "rgba(255,255,255,0.03)";
var BORDER   = "rgba(255,255,255,0.1)";
var GOLD     = "#ffc174";
var GOLD2    = "#f59e0b";
var TEXT     = "#dae2fd";
var MUTED    = "#a09080";
var DIM      = "#475569";
var FONT     = "'Hanken Grotesk', sans-serif";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function GlassCard(props) {
  var s = props.style || {};
  var p = props.padding !== undefined ? props.padding : 32;
  var _hover = useState(false); var hov = _hover[0]; var setHov = _hover[1];
  return (
    <div
      onMouseEnter={function(){ setHov(true); }}
      onMouseLeave={function(){ setHov(false); }}
      style={Object.assign({
        background: CARD,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid " + (hov ? "rgba(255,193,116,0.3)" : BORDER),
        borderRadius: 20,
        padding: p,
        transition: "border-color 0.3s, transform 0.3s",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        fontFamily: FONT,
      }, s)}
    >{props.children}</div>
  );
}

function GoldBtn(props) {
  var _h = useState(false); var h = _h[0]; var setH = _h[1];
  return (
    <button
      onClick={props.onClick}
      onMouseEnter={function(){ setH(true); }}
      onMouseLeave={function(){ setH(false); }}
      style={{
        background: GOLD,
        color: "#2a1700",
        border: "none",
        padding: props.large ? "18px 48px" : "13px 32px",
        borderRadius: props.pill ? 9999 : 12,
        fontFamily: FONT,
        fontSize: props.large ? 18 : 15,
        fontWeight: 700,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: h ? "scale(1.04)" : "scale(1)",
        boxShadow: h ? "0 0 32px rgba(255,193,116,0.35)" : "0 0 0 rgba(0,0,0,0)",
      }}
    >{props.children}</button>
  );
}

function Label(props) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:9999, background:"rgba(255,193,116,0.1)", border:"1px solid rgba(255,193,116,0.2)", marginBottom:16 }}>
      <span style={{ fontSize:11, fontWeight:700, color:GOLD, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:FONT }}>{props.children}</span>
    </div>
  );
}

function GradientText(props) {
  return (
    <span style={{ background:"linear-gradient(135deg, "+GOLD+" 0%, "+GOLD2+" 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontStyle: props.italic ? "italic" : "normal" }}>{props.children}</span>
  );
}

// WebGL ambient shader — slow amber-on-navy glow
function ShaderBackground() {
  var canvasRef = useRef(null);
  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    function sync() {
      var w = canvas.clientWidth || 1280;
      var h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }
    if (typeof ResizeObserver !== "undefined") { new ResizeObserver(sync).observe(canvas); }
    sync();
    var vs = "attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*0.5+0.5;gl_Position=vec4(a_position,0,1);}";
    var fs = "precision highp float; varying vec2 v_uv; uniform float u_time;\nvoid main(){\n  vec2 p=v_uv*2.0;\n  float n=0.0;\n  for(float i=1.0;i<4.0;i++){\n    p.x+=0.2*sin(1.5*p.y+u_time*0.15);\n    p.y+=0.2*sin(1.5*p.x+u_time*0.1);\n    n+=0.5/i*abs(sin(p.x+p.y+u_time*0.1));\n  }\n  vec3 base=vec3(0.02,0.05,0.12);\n  vec3 accent=vec3(0.96,0.62,0.04);\n  gl_FragColor=vec4(mix(base,accent,n*0.07),1.0);\n}";
    function mkShader(type, src) { var s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(prog,"a_position");
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    var uTime = gl.getUniformLocation(prog,"u_time");
    var raf;
    function render(t) {
      sync();
      gl.viewport(0,0,canvas.width,canvas.height);
      if(uTime) gl.uniform1f(uTime,t*0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return function(){ cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.45, display:"block" }} />;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];
  var _scrolled = useState(false); var scrolled = _scrolled[0]; var setScrolled = _scrolled[1];
  useEffect(function() {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll);
    return function() { window.removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background: scrolled ? "rgba(11,19,38,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid "+BORDER : "1px solid transparent", transition:"all 0.3s", fontFamily:FONT }}>
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: mob ? "14px 20px" : "16px 48px", maxWidth:1280, margin:"0 auto" }}>
        <div onClick={function(){go("landing")}} style={{ fontSize:22, fontWeight:800, color:TEXT, cursor:"pointer", letterSpacing:"-0.5px" }}>Tutorii</div>
        {!mob && (
          <div style={{ display:"flex", alignItems:"center", gap:36 }}>
            {[["howItWorks","How It Works"],["curriculum","Curriculum"],["faq","FAQ"]].map(function(l){ return (
              <span key={l[0]} onClick={function(){go(l[0])}} style={{ fontSize:14, color:MUTED, cursor:"pointer", transition:"color 0.2s", fontWeight:500 }}
                onMouseEnter={function(e){e.target.style.color=TEXT}}
                onMouseLeave={function(e){e.target.style.color=MUTED}}
              >{l[1]}</span>
            );})}
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {!mob && <span onClick={function(){go("login")}} style={{ fontSize:14, color:MUTED, cursor:"pointer", fontWeight:500 }}
            onMouseEnter={function(e){e.target.style.color=TEXT}}
            onMouseLeave={function(e){e.target.style.color=MUTED}}
          >Login</span>}
          <GoldBtn onClick={function(){go("subscribe")}}>Get Started</GoldBtn>
          {mob && <button onClick={function(){setOpen(!open)}} style={{ background:"none", border:"none", color:TEXT, cursor:"pointer", fontSize:22, marginLeft:4 }}>{open ? "✕" : "☰"}</button>}
        </div>
      </nav>
      {mob && open && (
        <div style={{ background:SURFACE, borderTop:"1px solid "+BORDER, padding:"20px 24px", display:"flex", flexDirection:"column", gap:20 }}>
          {[["howItWorks","How It Works"],["curriculum","Curriculum"],["faq","FAQ"],["login","Login"]].map(function(l){ return (
            <span key={l[0]} onClick={function(){go(l[0]);setOpen(false)}} style={{ fontSize:16, color:TEXT, cursor:"pointer" }}>{l[1]}</span>
          );})}
          <GoldBtn onClick={function(){go("subscribe");setOpen(false)}} large>Get Started</GoldBtn>
        </div>
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer(props) {
  var go = props.go;
  var mob = useIsMobile();
  return (
    <footer style={{ background:BG, borderTop:"1px solid "+BORDER, fontFamily:FONT }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding: mob ? "60px 24px 32px" : "80px 48px 40px" }}>
        {/* Top grid */}
        <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "2fr 1fr 1fr 1fr", gap: mob ? 40 : 48, paddingBottom:48, borderBottom:"1px solid "+BORDER, marginBottom:32 }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize:24, fontWeight:800, color:TEXT, marginBottom:14, letterSpacing:"-0.5px" }}>Tutorii</div>
            <p style={{ fontSize:14, color:DIM, lineHeight:1.75, maxWidth:280, margin:"0 0 12px" }}>The education and income platform built for expatriates in the UAE and GCC.</p>
            <a href="mailto:support@tutorii.com" style={{ fontSize:14, color:MUTED, textDecoration:"none" }}>support@tutorii.com</a>
          </div>
          {/* Platform */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:DIM, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>Platform</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["howItWorks","How It Works"],["curriculum","Curriculum"],["faq","FAQ"],["howItWorks","Affiliate Program"]].map(function(l,i){ return (
                <span key={i} onClick={function(){go(l[0])}} style={{ fontSize:14, color:MUTED, cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={function(e){e.target.style.color=GOLD}}
                  onMouseLeave={function(e){e.target.style.color=MUTED}}
                >{l[1]}</span>
              );})}
            </div>
          </div>
          {/* Account */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:DIM, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>Account</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["login","Login"],["subscribe","Subscribe"],["userPortal","My Dashboard"],["adminLogin","Admin Portal"]].map(function(l,i){ return (
                <span key={i} onClick={function(){go(l[0])}} style={{ fontSize:14, color: l[0]==="adminLogin" ? DIM : MUTED, cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={function(e){e.target.style.color=GOLD}}
                  onMouseLeave={function(e){e.target.style.color= l[0]==="adminLogin" ? DIM : MUTED}}
                >{l[1]}</span>
              );})}
            </div>
          </div>
          {/* Legal */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:DIM, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>Legal</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["terms","Terms of Service"],["privacy","Privacy Policy"],["contact","Contact Us"],["support","Support"]].map(function(l,i){ return (
                <span key={i} onClick={function(){go(l[0])}} style={{ fontSize:14, color:MUTED, cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={function(e){e.target.style.color=GOLD}}
                  onMouseLeave={function(e){e.target.style.color=MUTED}}
                >{l[1]}</span>
              );})}
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ display:"flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "flex-start" : "center", justifyContent:"space-between", gap:12 }}>
          <div style={{ fontSize:13, color:DIM }}>© 2026 Tutorii.com · All rights reserved</div>
          <div style={{ display:"flex", alignItems:"center", gap:24 }}>
            <span onClick={function(){go("terms")}} style={{ fontSize:13, color:DIM, cursor:"pointer" }}>Privacy Policy</span>
            <span onClick={function(){go("privacy")}} style={{ fontSize:13, color:DIM, cursor:"pointer" }}>Terms</span>
            <span onClick={function(){go("adminLogin")}} style={{ fontSize:12, color:"rgba(255,255,255,0.15)", cursor:"pointer", letterSpacing:"0.05em" }}>Admin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Landing(props) {
  var go = props.go;
  var mob = useIsMobile();
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length;},0);

  var sectionPad = mob ? "80px 24px" : "140px 48px";
  var h2size = mob ? 28 : 46;
  var h2sm = mob ? 24 : 36;

  return (
    <div style={{ background:BG, color:TEXT, fontFamily:FONT, overflowX:"hidden", position:"relative" }}>
      <Nav go={go} />

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding: mob ? "120px 24px 80px" : "180px 48px 120px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <ShaderBackground />
        {/* radial vignette */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, "+BG+" 100%)", pointerEvents:"none", zIndex:1 }} />
        <div style={{ position:"relative", zIndex:2, maxWidth:860 }}>
          <FadeIn>
            <Label>Education &amp; Income Platform</Label>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{ fontSize: mob ? 38 : 72, fontWeight:800, color:TEXT, margin:"0 0 24px", lineHeight:1.05, letterSpacing: mob ? "-1.5px" : "-3px" }}>
              Learn Smarter. Earn More.<br/>
              <GradientText italic>With Tutorii.</GradientText>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: mob ? 16 : 19, color:MUTED, lineHeight:1.8, margin:"0 auto 48px", maxWidth:560 }}>
              Practical education for expatriates in the Gulf, plus a referral-based income that pays you every week. Invest in yourself and build your future.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <GoldBtn large pill onClick={function(){go("subscribe")}}>
              Start Your Subscription
              <span style={{ fontSize:20 }}>→</span>
            </GoldBtn>
            <div style={{ marginTop:16, fontSize:13, color:DIM, letterSpacing:"0.08em", textTransform:"uppercase" }}>{"AED "+PRICE+"/month · Cancel anytime"}</div>
          </FadeIn>
        </div>
      </section>

      {/* ── WHAT IS TUTORII ── */}
      <section style={{ padding:sectionPad, position:"relative" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <Label>What is Tutorii?</Label>
              <h2 style={{ fontSize:h2size, fontWeight:700, margin:"0 0 18px", letterSpacing:"-1.5px", lineHeight:1.1 }}>
                An Education Platform That <GradientText italic>Pays You Back</GradientText>
              </h2>
              <p style={{ fontSize: mob ? 15 : 17, color:MUTED, maxWidth:620, margin:"0 auto", lineHeight:1.8 }}>
                Tutorii is a subscription-based learning platform built for expatriates in the UAE and GCC. Practical courses designed for your life here — and a built-in referral system that turns your network into weekly income.
              </p>
            </div>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap:20, alignItems:"stretch" }}>
            {[
              { num:"01", icon:"📚", title:"You Learn", desc:"Access "+INIT_COURSES.length+" expert-led modules covering workers' rights, UAE life, career growth, financial literacy, and entrepreneurship. All included in your subscription." },
              { num:"02", icon:"🔗", title:"You Share", desc:"Get your own unique referral link the moment you subscribe. Share it on WhatsApp, social media, or with colleagues. When someone signs up, they're permanently connected to you." },
              { num:"03", icon:"💰", title:"You Earn", desc:"Earn recurring commissions every month for each person you refer. You also earn on the people they refer, building a growing income stream. Payouts go straight to your bank." },
            ].map(function(item, idx) { return (
              <FadeIn key={item.num} delay={idx * 0.12}>
                <GlassCard style={{ display:"flex", flexDirection:"column", height:"100%", boxSizing:"border-box" }}>
                  <div style={{ fontSize:36, marginBottom:20, lineHeight:1 }}>{item.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:DIM, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Step {item.num}</div>
                  <h3 style={{ fontSize:22, fontWeight:700, color:TEXT, margin:"0 0 14px" }}>{item.title}</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.8, margin:0, flex:1 }}>{item.desc}</p>
                </GlassCard>
              </FadeIn>
            );})}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ padding:sectionPad, position:"relative", background:"rgba(11,19,38,0.4)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <Label>Benefits</Label>
              <h2 style={{ fontSize:h2size, fontWeight:700, margin:"0 0 12px", letterSpacing:"-1.5px" }}>
                Why Choose <GradientText>Tutorii?</GradientText>
              </h2>
              <p style={{ fontSize:15, color:MUTED }}>Everything you need to learn, earn, and grow as an expatriate</p>
            </div>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap:20, alignItems:"stretch" }}>
            {[
              { icon:"🎓", title:"Learn", desc:"Access expert-led courses on UAE life, workers' rights, career growth, and financial literacy — built specifically for expatriates in the Gulf.", glow:false },
              { icon:"💵", title:"Earn", desc:"Share your referral link and earn "+Math.round(L1_RATE*100)+"% recurring commission on every subscriber you bring in. Paid weekly, directly to your bank.", glow:true },
              { icon:"📈", title:"Grow", desc:"Build real skills, real income, and real confidence. Whether you want a side hustle or a career change, Tutorii gives you the tools to level up.", glow:false },
            ].map(function(v, vi) { return (
              <FadeIn key={v.title} delay={vi * 0.12}>
                <GlassCard style={{ textAlign:"center", height:"100%", boxSizing:"border-box", boxShadow: v.glow ? "0 0 48px -12px rgba(245,158,11,0.25)" : "none" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(255,193,116,0.08)", border:"1px solid rgba(255,193,116,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28 }}>{v.icon}</div>
                  <h3 style={{ fontSize:22, fontWeight:700, color:TEXT, margin:"0 0 14px" }}>{v.title}</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.75, margin:0 }}>{v.desc}</p>
                </GlassCard>
              </FadeIn>
            );})}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding:sectionPad, position:"relative" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <Label>Interface</Label>
              <h2 style={{ fontSize:h2size, fontWeight:700, margin:"0 0 14px", letterSpacing:"-1.5px" }}>
                Designed for <GradientText italic>Clarity</GradientText>
              </h2>
              <p style={{ fontSize:15, color:MUTED, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
                Your earnings, referrals, courses, and payouts. All in one clean dashboard that works beautifully on any screen.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ display:"flex", gap:24, alignItems:"center", justifyContent:"center", flexWrap:"wrap" }}>
              <div style={{ flex:"1 1 0", maxWidth:640, background:CARD, border:"1px solid "+BORDER, borderRadius:20, padding:8, backdropFilter:"blur(12px)" }}>
                <DashboardDesktop />
              </div>
              {!mob && (
                <div style={{ flex:"0 0 auto", width:180, background:CARD, border:"1px solid "+BORDER, borderRadius:20, padding:6, backdropFilter:"blur(12px)" }}>
                  <DashboardMobile />
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── EARNING MODEL ── */}
      <section style={{ padding:sectionPad, background:"rgba(11,19,38,0.4)", position:"relative" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <Label>Earning Model</Label>
              <h2 style={{ fontSize:h2size, fontWeight:700, margin:"0 0 12px", letterSpacing:"-1.5px" }}>
                See What You Could <GradientText italic>Earn</GradientText>
              </h2>
              <p style={{ fontSize:15, color:MUTED }}>Refer just 3 people and your subscription pays for itself</p>
            </div>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap:16, alignItems:"stretch" }}>
            {[
              {r:3, lab:"Covers your subscription", net:(3*PRICE*L1_RATE-PRICE)},
              {r:10, lab:"Meaningful income", net:(10*PRICE*L1_RATE+5*PRICE*L2_RATE-PRICE)},
              {r:25, lab:"Exceeds part-time jobs", net:(25*PRICE*L1_RATE+20*PRICE*L2_RATE-PRICE)},
              {r:50, lab:"Real income stream", net:(50*PRICE*L1_RATE+50*PRICE*L2_RATE-PRICE)},
            ].map(function(e, ei) { return (
              <FadeIn key={e.r} delay={ei*0.1}>
                <GlassCard padding={24} style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ fontSize:13, color:DIM, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:700 }}>{e.r} referrals</div>
                  <div style={{ fontSize: mob ? 22 : 28, fontWeight:800, color:GOLD, letterSpacing:"-1px", marginBottom:4 }}>{"AED "+e.net.toFixed(0)}</div>
                  <div style={{ fontSize:11, color:DIM }}>net profit/month</div>
                  <div style={{ fontSize:12, color:MUTED, marginTop:12, fontStyle:"italic" }}>{e.lab}</div>
                </GlassCard>
              </FadeIn>
            );})}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section style={{ padding:sectionPad, position:"relative" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <Label>Curriculum</Label>
              <h2 style={{ fontSize:h2sm, fontWeight:700, margin:0, letterSpacing:"-1px" }}>
                {INIT_COURSES.length+" modules. "+tl+" lessons. "}<GradientText>Real skills.</GradientText>
              </h2>
            </div>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap:14, alignItems:"stretch" }}>
            {INIT_COURSES.map(function(c, ci) { return (
              <FadeIn key={c.id} delay={ci*0.08}>
                <GlassCard padding={24} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:12 }}>
                    {["🕌","⚖️","💼","💳","🚀"][ci]}
                  </div>
                  <h3 style={{ fontSize:13, fontWeight:700, color:TEXT, margin:"0 0 6px" }}>{c.module}</h3>
                  <div style={{ fontSize:12, color:DIM }}>{c.lessons.length+" lessons"}</div>
                </GlassCard>
              </FadeIn>
            );})}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ textAlign:"center", marginTop:24 }}>
              <span onClick={function(){go("curriculum")}} style={{ fontSize:14, color:MUTED, cursor:"pointer", transition:"color 0.2s" }}
                onMouseEnter={function(e){e.target.style.color=GOLD}}
                onMouseLeave={function(e){e.target.style.color=MUTED}}
              >View the full curriculum →</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ padding:sectionPad, background:"rgba(11,19,38,0.4)", position:"relative" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <FadeIn>
            <Label>Process</Label>
            <h2 style={{ fontSize:h2size, fontWeight:700, margin:"0 0 12px", letterSpacing:"-1.5px" }}>
              Our Simple &amp; <GradientText>Smart Process</GradientText>
            </h2>
            <p style={{ fontSize:15, color:MUTED, marginBottom:64 }}>Getting started takes less than 2 minutes</p>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap:16, alignItems:"stretch" }}>
            {[
              {n:"01", t:"Subscribe", d:"Pay securely via MamoPay"},
              {n:"02", t:"Learn", d:"Access all courses instantly"},
              {n:"03", t:"Share", d:"Get your unique referral link"},
              {n:"04", t:"Earn", d:"Weekly payouts to your bank"},
            ].map(function(s, si) { return (
              <FadeIn key={s.n} delay={si*0.1}>
                <GlassCard padding={28} style={{ textAlign:"center" }}>
                  <div style={{ fontSize: mob ? 40 : 56, fontWeight:800, color:GOLD, opacity:0.2, lineHeight:1, marginBottom:16, fontVariantNumeric:"tabular-nums" }}>{s.n}</div>
                  <h3 style={{ fontSize:18, fontWeight:700, color:GOLD, margin:"0 0 8px" }}>{s.t}</h3>
                  <p style={{ fontSize:13, color:MUTED, margin:0 }}>{s.d}</p>
                </GlassCard>
              </FadeIn>
            );})}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding:sectionPad, position:"relative" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <Label>Reviews</Label>
              <h2 style={{ fontSize:h2size, fontWeight:700, margin:"0 0 8px", letterSpacing:"-1.5px" }}>
                Trusted by <GradientText italic>Many</GradientText>
              </h2>
              <p style={{ fontSize:15, color:MUTED }}>Hear from real subscribers who are learning and earning</p>
            </div>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap:20, alignItems:"stretch" }}>
            {[
              {q:"I covered my subscription in the first week with just 3 referrals. The workers rights module helped me resolve an issue with my employer.", n:"Priya S.", r:"Healthcare Worker, Dubai", init:"PS"},
              {q:"I shared my link in two WhatsApp groups and within a month I was earning more than my weekend freelancing.", n:"David C.", r:"IT Professional, Abu Dhabi", init:"DC"},
              {q:"The course content is genuinely high quality. My colleagues have all found it valuable. I only recommend things I believe in.", n:"Maria L.", r:"Teacher, Sharjah", init:"ML"},
            ].map(function(t, ti) { return (
              <FadeIn key={t.n} delay={ti*0.12}>
                <GlassCard style={{ display:"flex", flexDirection:"column" }}>
                  <p style={{ fontSize:15, color:MUTED, lineHeight:1.8, margin:"0 0 24px", flex:1 }}>{"“"+t.q+"”"}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,193,116,0.12)", border:"1px solid rgba(255,193,116,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:GOLD, flexShrink:0 }}>{t.init}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>{t.n}</div>
                      <div style={{ fontSize:12, color:DIM }}>{t.r}</div>
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            );})}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: mob ? "80px 24px" : "160px 48px", textAlign:"center", position:"relative" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <FadeIn>
            <GlassCard padding={ mob ? 40 : 80} style={{ background:"rgba(255,193,116,0.04)", borderColor:"rgba(255,193,116,0.15)", boxShadow:"0 0 80px -20px rgba(245,158,11,0.2)", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <h2 style={{ fontSize: mob ? 28 : 52, fontWeight:800, margin:"0 0 16px", letterSpacing: mob ? "-1px" : "-2px", lineHeight:1.1 }}>
                  Ready to Start Learning &amp; <GradientText>Earning?</GradientText>
                </h2>
                <p style={{ fontSize: mob ? 15 : 17, color:MUTED, margin:"0 auto 40px", maxWidth:480, lineHeight:1.7 }}>
                  Subscribe today and unlock courses, referral tools, and weekly payouts. Join a community of achievers.
                </p>
                <GoldBtn large pill onClick={function(){go("subscribe")}}>
                  Subscribe · AED {PRICE}/month
                  <span style={{ fontSize:20 }}>→</span>
                </GoldBtn>
                <div style={{ marginTop:16, fontSize:13, color:DIM }}>Cancel anytime · No hidden fees</div>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

export default Landing;
