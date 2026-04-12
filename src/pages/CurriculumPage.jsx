import { useIsMobile, Ico, WaveDivider, BgIllustration, DotGrid, NoiseOverlay, FadeIn, SectionWatermark, ProgressRing, ShimmerText, SpotlightCard } from "../components/UI";
import { Btn, Logo, SiteNav, SiteFooter, CtaBanner, SLabel } from "../components/Layout";
import { INIT_COURSES, PRICE } from "../constants";

function CurriculumPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);
  var md = {"Life in the UAE":"Navigate daily life confidently. Customs, government services, healthcare, and housing.","Workers Rights & Legal":"Know your rights. Employment law, disputes, visa regulations, and legal resources.","Job Search & Career":"Stand out in the Gulf market. CV building, interviews, job portals, and networking.","Financial Literacy":"Control your money. Budgeting, remittance, debt avoidance, and building savings.","Entrepreneurship":"Create your own opportunity. Side hustles, freelancing, and scaling your referral business."};

  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} active="curriculum" />
      <section style={{ paddingTop:mob?120:160, padding:mob?"120px 20px 60px":"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="book_bg" position="right" y="45%" scale={1.2} opacity={0.04} /><DotGrid opacity={0.045} />
        <FadeIn><div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="book">The Curriculum</SLabel>
          <h1 style={{ fontSize:mob?32:48, fontWeight:600, color:"#d4d4d8", margin:"0 0 18px", lineHeight:1.1, letterSpacing:mob?"-1px":"-1.5px" }}>Education for <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:48, letterSpacing:"-1.5px" }}>Your Life Here</ShimmerText></h1>
          <p style={{ fontSize:16, color:"#71717a", maxWidth:560, margin:"0 auto 32px", lineHeight:1.7 }}>Practical skills for expatriates. Every lesson built for the Gulf.</p>
          <div style={{ display:"flex", gap:48, justifyContent:"center" }}>
            {[[INIT_COURSES.length+"","Modules"],[tl+"","Lessons"]].map(function(s){return <div key={s[1]}><div style={{ fontSize:32, fontWeight:600, color:"#d4d4d8", letterSpacing:"-1px" }}>{s[0]}</div><div style={{ fontSize:12, color:"#52525b", marginTop:2 }}>{s[1]}</div></div>})}
          </div>
        </div></FadeIn>
      </section>
      <section style={{ padding:mob?"0 16px 60px":"0 48px 100px" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          {INIT_COURSES.map(function(c,ci){return (
            <FadeIn key={c.id} delay={ci*0.1}><SpotlightCard padding={32} outerStyle={{ marginBottom:16 }}>
              <div style={{ display:mob?"flex":"flex", flexDirection:mob?"column":"row", alignItems:mob?"flex-start":"center", gap:mob?12:16, marginBottom:18 }}>
                {!mob && <ProgressRing percent={0} />}
                <div style={{ width:mob?44:52, height:mob?44:52, borderRadius:14, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", lineHeight:0 }}><Ico name={c.icon} size={22} color="rgb(200,180,140)" /></div>
                <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px" }}>{"MODULE "+(ci+1)}</div><h2 style={{ fontSize:mob?18:20, fontWeight:600, color:"#d4d4d8", margin:"2px 0 6px" }}>{c.module}</h2><p style={{ fontSize:13, color:"#52525b", margin:0 }}>{md[c.module]||""}</p></div>
                {!mob && <div style={{ fontSize:12, color:"#3f3f46" }}>{c.lessons.length+" lessons"}</div>}
              </div>
              {c.lessons.map(function(l,li){return (
                <div key={l.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderTop:"1px solid rgba(255,255,255,0.04)", minHeight:44 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:26, height:26, borderRadius:7, background:"rgba(255,255,255,0.03)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500, color:"#3f3f46", flexShrink:0, lineHeight:1 }}>{li+1}</div>
                    <span style={{ fontSize:14, color:"#a1a1aa" }}>{l.title}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:"#3f3f46" }}>{l.dur}</span>
                    
                  </div>
                </div>
              )})}
            </SpotlightCard></FadeIn>
          )})}
        </div>
      </section>
      <CtaBanner go={go} title={"Get Instant Access to All "+tl+" Lessons"} sub={"AED "+PRICE+"/month \u00B7 Every module \u00B7 Every update"} />
      <SiteFooter go={go} />
    </div>
  );
}


export default CurriculumPage;
