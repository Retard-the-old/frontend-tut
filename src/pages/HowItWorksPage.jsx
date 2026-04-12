import { useIsMobile, Ico, WaveDivider, BgIllustration, DotGrid, NoiseOverlay, FadeIn, SectionWatermark, GlowLine, GlowRow, ShimmerText, SpotlightCard, StepConnector } from "../components/UI";
import { Btn, Logo, SiteNav, SiteFooter, CtaBanner, GCard, SLabel } from "../components/Layout";
import { PRICE, L1_RATE, L2_RATE } from "../constants";

function HowItWorksPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _refs = useState(5);
  var refs = _refs[0]; var setRefs = _refs[1];
  var l1earn = refs * PRICE * L1_RATE;
  var estL2 = Math.round(refs * 1.5);
  var l2earn = estL2 * PRICE * L2_RATE;
  var net = l1earn + l2earn - PRICE;
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);

  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} active="howItWorks" />
      <section style={{ paddingTop:160, padding:"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="skyline" position="center" y="60%" scale={1.5} opacity={0.03} />
        <DotGrid opacity={0.045} />
        <FadeIn><div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="gear">How It Works</SLabel>
          <h1 style={{ fontSize:52, fontWeight:600, color:"#d4d4d8", margin:"0 0 18px", lineHeight:1.1, letterSpacing:"-1.5px" }}>A Simple Model That <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:52, letterSpacing:"-1.5px" }}>Rewards You</ShimmerText></h1>
          <p style={{ fontSize:16, color:"#71717a", maxWidth:560, margin:"0 auto", lineHeight:1.7 }}>Tutorii gives you access to expert-led courses and a built-in way to earn recurring income.</p>
        </div></FadeIn>
      </section>

      {/* STEPS WITH CONNECTOR */}
      <section style={{ padding:"40px 48px 120px" }}>
        <div style={{ maxWidth:760, margin:"0 auto", position:"relative" }}>
          <StepConnector />
          {[{n:"01",i:"phone",t:"Subscribe and get immediate access",d:"Pay AED "+PRICE+"/month via MamoPay (Visa, Mastercard, Apple Pay, Google Pay). Unlock every course, every lesson, and your referral dashboard instantly."},{n:"02",i:"book",t:"Learn skills that matter",d:INIT_COURSES.length+" modules, "+tl+" lessons covering UAE culture, legal rights, career development, financial literacy, and entrepreneurship."},{n:"03",i:"link",t:"Share your personal referral link",d:"Every subscriber gets a unique link. Share through WhatsApp, SMS, email, or social media. When someone subscribes, they are permanently connected to you."},{n:"04",i:"dollar",t:"Earn recurring commissions weekly",d:"40% (AED "+(PRICE*L1_RATE).toFixed(2)+") per direct referral per month. 5% (AED "+(PRICE*L2_RATE).toFixed(2)+") on their referrals. Paid every Tuesday to your bank."}].map(function(s,si){return (
            <FadeIn key={s.n} delay={si*0.15}><div style={{ display:"flex", gap:24, marginBottom:48, position:"relative", zIndex:1 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", lineHeight:0 }}><Ico name={s.i} size={24} color="rgb(200,180,140)" /></div>
              <div><div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px", marginBottom:6 }}>{"STEP "+s.n}</div><h3 style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", margin:"0 0 8px" }}>{s.t}</h3><p style={{ fontSize:14, color:"#71717a", lineHeight:1.8, margin:0 }}>{s.d}</p></div>
            </div></FadeIn>
          )})}
          <FadeIn delay={0.6}><div style={{ textAlign:"center" }}><Btn onClick={function(){go("subscribe")}}>{"Start Your Subscription"}</Btn></div></FadeIn>
        </div>
      </section>

      {/* COMMISSION CARDS */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="coins" position="left" y="35%" scale={1} opacity={0.035} /><SectionWatermark>40%</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:64 }}><SLabel icon="dollar">Earning Potential</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>Two Ways to Earn. Both <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Recurring.</span></h2><p style={{ fontSize:15, color:"#71717a", maxWidth:480, margin:"0 auto" }}>Tutorii pays you every month for as long as your referrals stay subscribed.</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:720, margin:"0 auto 40px", alignItems:"stretch" }}>
            <FadeIn delay={0.1}><SpotlightCard padding={40} style={{ textAlign:"center", justifyContent:"center", alignItems:"center" }} outerStyle={{ background:"linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)" }}><div style={{ fontSize:12, fontWeight:500, color:"#a1a1aa", letterSpacing:"1px", marginBottom:12, minHeight:32, display:"flex", alignItems:"center", justifyContent:"center" }}>LEVEL 1 · DIRECT</div><div style={{ fontSize:40, fontWeight:500, color:"#d4d4d8", letterSpacing:"-1.5px" }}>40%</div><div style={{ fontSize:16, fontWeight:400, color:"#a1a1aa", margin:"4px 0 16px" }}>{"AED "+(PRICE*L1_RATE).toFixed(2)+"/mo each"}</div><p style={{ fontSize:13, color:"#71717a", lineHeight:1.7, margin:0 }}>For every person who subscribes through your link.</p></SpotlightCard></FadeIn>
            <FadeIn delay={0.2}><SpotlightCard padding={40} style={{ textAlign:"center", justifyContent:"center", alignItems:"center" }}><div style={{ fontSize:12, fontWeight:500, color:"#71717a", letterSpacing:"1px", marginBottom:12, minHeight:32, display:"flex", alignItems:"center", justifyContent:"center" }}>LEVEL 2 · INDIRECT</div><div style={{ fontSize:40, fontWeight:500, color:"#a1a1aa", letterSpacing:"-1.5px" }}>5%</div><div style={{ fontSize:16, fontWeight:400, color:"#71717a", margin:"4px 0 16px" }}>{"AED "+(PRICE*L2_RATE).toFixed(2)+"/mo each"}</div><p style={{ fontSize:13, color:"#52525b", lineHeight:1.7, margin:0 }}>For subscribers brought in by your referrals.</p></SpotlightCard></FadeIn>
          </div>
          <FadeIn delay={0.3}><GCard padding={24} outerStyle={{ maxWidth:720, margin:"0 auto" }}><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>{["No cap on referrals","No recruitment requirement","Paid every Tuesday to your bank","Only 2 levels  - not MLM","No inventory or quotas","Earn from day one"].map(function(f){return <div key={f} style={{ fontSize:13, color:"#71717a", display:"flex", gap:8, alignItems:"center", lineHeight:1.5 }}><span style={{ color:"#a1a1aa" }}>{"\u2713"}</span>{f}</div>})}</div></GCard></FadeIn>
        </div>
      </section>

      {/* CALCULATOR */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="growth" position="right" y="40%" scale={0.9} opacity={0.04} />
        <div style={{ maxWidth:580, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <FadeIn><h2 style={{ fontSize:32, fontWeight:600, color:"#d4d4d8", margin:"0 0 8px", letterSpacing:"-0.5px" }}>Income <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Calculator</span></h2><p style={{ fontSize:14, color:"#71717a", marginBottom:40 }}>Drag the slider to see your potential monthly earnings</p></FadeIn>
          <FadeIn delay={0.15}><GCard padding={40}>
            <div style={{ marginBottom:28 }}>
              <input type="range" min={1} max={100} value={refs} onChange={function(e){setRefs(Number(e.target.value))}} style={{ width:"100%", accentColor:"#a1a1aa", height:2 }} />
              <div style={{ fontSize:40, fontWeight:600, color:"#d4d4d8", marginTop:12, letterSpacing:"-1px" }}>{refs+" referral"+(refs===1?"":"s")}</div>
              <div style={{ fontSize:12, color:"#52525b" }}>{"+ ~"+estL2+" indirect referrals"}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, maxWidth:420, margin:"0 auto" }}>
              {[["Direct 40%",l1earn],["Indirect 5%",l2earn],["Net Profit",net]].map(function(d){return (
                <div key={d[0]} style={{ background: d[0]==="Net Profit" && net>0 ? "rgba(200,180,140,0.06)" : "rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid "+(d[0]==="Net Profit" && net>0 ? "rgba(200,180,140,0.12)" : "rgba(255,255,255,0.04)"), textAlign:"center", transition:"background 0.3s, border-color 0.3s" }}>
                  <div style={{ fontSize:11, color:"#52525b", marginBottom:4 }}>{d[0]}</div>
                  <div style={{ fontSize:18, fontWeight:500, color:d[0]==="Net Profit"&&d[1]<0?"#ef4444":"#d4d4d8" }}>{"AED "+d[1].toFixed(2)}</div>
                </div>
              )})}
            </div>
            <div style={{ marginTop:16, fontSize:12, color:"#52525b" }}>{"AED "+(net*12).toFixed(2)+"/year"}</div>
          </GCard></FadeIn>
          <FadeIn delay={0.3}><div style={{ marginTop:40 }}><Btn onClick={function(){go("subscribe")}}>{"Start Earning Today"}</Btn></div></FadeIn>
        </div>
      </section>

      {/* INCOME TABLE WITH GLOW ROWS */}
      <section style={{ padding:"80px 48px 140px", position:"relative", overflow:"hidden" }}>
        <GlowLine />
        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:40 }}><h2 style={{ fontSize:28, fontWeight:600, color:"#d4d4d8", letterSpacing:"-0.5px" }}>Realistic Income <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Scenarios</span></h2></div></FadeIn>
          <FadeIn delay={0.15}><GCard padding={0}><div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.2fr 1.2fr", minWidth:580 }}>
            {["Situation","Direct","Indirect","Monthly","Annually"].map(function(h){return <div key={h} style={{ padding:"16px 14px", fontSize:12, fontWeight:500, color:"#52525b", borderBottom:"1px solid rgba(255,255,255,0.06)", textTransform:"uppercase", letterSpacing:"0.5px", display:"flex", alignItems:"center" }}>{h}</div>})}
            {[{s:"Just started",l1:3,l2:2},{s:"Building momentum",l1:10,l2:8},{s:"Strong network",l1:25,l2:30},{s:"Serious earner",l1:50,l2:80},{s:"Top 1%",l1:100,l2:200}].map(function(r,ri){var m=r.l1*PRICE*L1_RATE+r.l2*PRICE*L2_RATE-PRICE;var row=[r.s,r.l1,r.l2,"AED "+m.toFixed(2),"AED "+(m*12).toFixed(2)];return <GlowRow key={ri} style={{ display:"contents" }}>{row.map(function(cell,ci){return <div key={ri+"-"+ci} style={{ padding:"14px 14px", fontSize:14, fontWeight:ci>2?500:400, color:ci>2?"#d4d4d8":"#71717a", borderBottom:"1px solid rgba(255,255,255,0.03)", display:"flex", alignItems:"center" }}>{cell}</div>})}</GlowRow>})}
          </div></div></GCard></FadeIn>
        </div>
      </section>

      <CtaBanner go={go} title="The Sooner You Start, the Sooner You Earn" sub="Every week that passes is a week of commissions you could have been collecting" />
      <SiteFooter go={go} />
    </div>
  );
}


export default HowItWorksPage;
