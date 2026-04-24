import { useState } from "react";
import { useIsMobile, Ico, WaveDivider, BgIllustration, DotGrid, NoiseOverlay, GlowLine, FadeIn, CursorGlow, FloatingParticles, SpotlightCard, TrustMarquee, SectionWatermark, StepConnector, ShimmerText, ProgressRing, DashboardDesktop, DashboardMobile } from "../components/UI";
import { Btn, Logo, SiteNav, SiteFooter, CtaBanner, GCard, SLabel } from "../components/Layout";
import { PRICE, L1_RATE, L2_RATE, MAMOPAY_LINK, INIT_COURSES } from "../constants";

function Landing(props) {
  var go = props.go;
  var mob = useIsMobile();
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);
  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative", width:"100%", overflowX:"hidden" }}>
      <NoiseOverlay />
      <SiteNav go={go} />

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mob?"120px 20px 60px":"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="skyline" position="center" y="65%" scale={1.8} opacity={0.03} />
        <BgIllustration name="mosque_bg" position="left" y="55%" scale={0.9} opacity={0.025} />
        <DotGrid opacity={0.05} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:300, background:"linear-gradient(0deg, #0a0a0c, transparent)", pointerEvents:"none", zIndex:2 }} />
        <WaveDivider flip opacity={0.09} />
        <div style={{ position:"relative", zIndex:3, maxWidth:800 }}>
          <FadeIn><div style={{ width:60, height:60, borderRadius:18, background:"linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 32px", lineHeight:1, boxShadow:"0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(200,180,140,0.14), inset 0 1px 0 rgba(255,255,255,0.12)" }}><span style={{ fontSize:24, fontWeight:700, color:"#d4d4d8" }}>T</span></div></FadeIn>
          <FadeIn delay={0.1}><SLabel icon="sparkle">Education & Income Platform</SLabel></FadeIn>
          <FadeIn delay={0.2}><h1 style={{ fontSize:mob?36:68, fontWeight:600, color:"#c8c8cc", margin:"0 0 24px", lineHeight:1.08, letterSpacing:mob?"-1px":"-2.5px" }}>Learn Smarter. Earn More. <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:mob?36:68, letterSpacing:mob?"-1px":"-2.5px" }}>With Tutorii.</ShimmerText></h1></FadeIn>
          <FadeIn delay={0.3}><p style={{ fontSize:mob?15:17, color:"#71717a", lineHeight:1.8, margin:"0 auto 44px", maxWidth:520 }}>Practical education for expatriates in the Gulf, plus a referral-based income that pays you every week.</p></FadeIn>
          <FadeIn delay={0.4}><Btn onClick={function(){go("subscribe")}}>{"Start Your Subscription"}</Btn></FadeIn>
        </div>
      </section>

      <TrustMarquee />

      <GlowLine />

      {/* WHAT IS TUTORII */}
      <section style={{ padding:mob?"60px 20px":"120px 48px", position:"relative", overflow:"hidden" }}>
        <DotGrid opacity={0.04} />
        <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:56 }}>
            <SLabel icon="sparkle">What is Tutorii?</SLabel>
            <h2 style={{ fontSize:mob?28:46, fontWeight:600, color:"#d4d4d8", margin:"0 0 18px", letterSpacing:"-1px", lineHeight:1.1 }}>An Education Platform That <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:mob?28:46, letterSpacing:"-1px" }}>Pays You Back</ShimmerText></h2>
            <p style={{ fontSize:mob?15:17, color:"#a1a1aa", maxWidth:620, margin:"0 auto", lineHeight:1.8 }}>Tutorii is a subscription-based learning platform built for expatriates in the UAE and GCC. You get practical courses designed for your life here  - and a built-in referral system that turns your network into weekly income.</p>
          </div></FadeIn>

          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:20, marginBottom:48, alignItems:"stretch" }}>
            {[
              {icon:"book", num:"01", title:"You Learn", desc:"Access "+INIT_COURSES.length+" expert-led modules covering workers' rights, UAE life, career growth, financial literacy, and entrepreneurship. New content added regularly  - all included in your subscription.", accent:"rgb(200,180,140)"},
              {icon:"link", num:"02", title:"You Share", desc:"Get your own unique referral link the moment you subscribe. Share it on WhatsApp, social media, or with colleagues. When someone signs up through your link, they're permanently connected to you.", accent:"rgb(200,180,140)"},
              {icon:"dollar", num:"03", title:"You Earn", desc:"Earn recurring commissions every month for each person you refer. You also earn on the people they refer, building a growing income stream. Payouts go straight to your bank, every week.", accent:"rgb(200,180,140)"}
            ].map(function(item, idx){return (
              <FadeIn key={item.num} delay={idx*0.12}><SpotlightCard padding={32} style={{ display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.03))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}><Ico name={item.icon} size={22} color={item.accent} /></div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#52525b", letterSpacing:"0.8px", textTransform:"uppercase", lineHeight:1 }}>{"STEP "+item.num}</div>
                    <div style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", marginTop:3 }}>{item.title}</div>
                  </div>
                </div>
                <p style={{ fontSize:14, color:"#71717a", lineHeight:1.8, margin:0, flex:1 }}>{item.desc}</p>
              </SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* QUOTE STRIP */}
      <section style={{ padding:mob?"48px 20px 60px":"80px 48px 100px", textAlign:"center", position:"relative" }}>
        <BgIllustration name="waves_bg" position="right" y="50%" scale={1.2} opacity={0.04} />
        <FadeIn><div style={{ maxWidth:800, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="star">What Our Subscribers Say</SLabel>
          <p style={{ fontSize:mob?20:28, color:"#a1a1aa", lineHeight:1.6, fontWeight:400 }}>{"We find what to "}<span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>learn</span>{", how to earn, and how Tutorii can change your financial future. The best part is we give you the tools to "}<span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>make it happen.</span>{"\u201D"}</p>
        </div></FadeIn>
      </section>

      {/* BENEFITS */}
      <section style={{ padding:mob?"60px 20px":"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine top={120} /><WaveDivider opacity={0.08} /><BgIllustration name="geometric" position="left" y="40%" scale={1.1} opacity={0.035} /><SectionWatermark>01</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="lightbulb">Benefits</SLabel><h2 style={{ fontSize:mob?28:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>Why Choose <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Tutorii?</span></h2><p style={{ fontSize:15, color:"#71717a", maxWidth:460, margin:"0 auto" }}>Everything you need to learn, earn, and grow as an expatriate</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3, 1fr)", gap:16, alignItems:"stretch" }}>
            {[{i:"book",t:"Learn",d:"Access expert-led courses on UAE life, workers' rights, career growth, and financial literacy — built specifically for expatriates in the Gulf."},{i:"dollar",t:"Earn",d:"Share your referral link and earn 40% recurring commission on every subscriber you bring in. Paid weekly, directly to your bank."},{i:"rocket",t:"Grow",d:"Build real skills, real income, and real confidence. Whether you want a side hustle or a career change, Tutorii gives you the tools to level up."}].map(function(v,vi){return (
              <FadeIn key={v.t} delay={vi*0.12}><SpotlightCard padding={36} style={{ alignItems:"center" }}><div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, margin:"0 auto 20px", lineHeight:0, flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}><Ico name={v.i} size={28} color="rgb(200,180,140)" /></div><h3 style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", margin:"0 0 16px", flexShrink:0, width:"100%", textAlign:"center", minHeight:22 }}>{v.t}</h3><p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, margin:0, width:"100%", textAlign:"left" }}>{v.d}</p></SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:mob?"60px 20px":"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="network" position="right" y="35%" scale={1} opacity={0.04} /><DotGrid opacity={0.045} /><SectionWatermark right="2%">02</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="gear">Features</SLabel><h2 style={{ fontSize:mob?28:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>All features in <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>one place</span></h2><p style={{ fontSize:15, color:"#71717a" }}>{"AED "+PRICE+"/month. Everything included from day one."}</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3, 1fr)", gap:16, alignItems:"stretch" }}>
            {[{ia:"book",ib:"target",t:"Course Library",d:INIT_COURSES.length+" modules, "+tl+" lessons covering practical skills for expats."},{ia:"link",ib:"chart",t:"Referral Dashboard",d:"Your unique link, real-time tracking, and commission analytics."},{ia:"dollar",ib:"bank",t:"Weekly Payouts",d:"40% commission paid every Tuesday directly to your bank."},{ia:"chat",ib:"bot",t:"AI Support",d:"24/7 chat that knows your account, earnings, and progress."},{ia:"phone",ib:"globe",t:"Access Anywhere",d:"Works on any device. No app download required."},{ia:"refresh",ib:"sparkle",t:"Growing Content",d:"New lessons added regularly at no extra cost."}].map(function(v,vi){return (
              <FadeIn key={v.t} delay={(vi%3)*0.1}><SpotlightCard padding={28}><div style={{ display:"flex", gap:8, marginBottom:18, flexShrink:0 }}>{[v.ia,v.ib].map(function(ic,i){return <div key={i} style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)", lineHeight:0 }}><Ico name={ic} size={18} color="rgb(200,180,140)" /></div>})}</div><h3 style={{ fontSize:16, fontWeight:600, color:"#d4d4d8", margin:"0 0 6px", flexShrink:0 }}>{v.t}</h3><p style={{ fontSize:13, color:"#71717a", lineHeight:1.7, margin:0, marginTop:"auto" }}>{v.d}</p></SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="waves_bg" position="left" y="50%" scale={1.3} opacity={0.03} /><SectionWatermark>03</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="phone">Interface</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>Designed for <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Clarity</span></h2><p style={{ fontSize:15, color:"#71717a", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>Your earnings, referrals, courses, and payouts. All in one clean dashboard that works beautifully on any screen.</p></div></FadeIn>
          <FadeIn delay={0.2}><div style={{ display:"flex", gap:32, alignItems:"center", justifyContent:"center" }}>
            <div style={{ flex:"1 1 0", maxWidth:640 }}><GCard padding={0} outerStyle={{ boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}><div style={{ padding:4 }}><DashboardDesktop /></div></GCard><div style={{ textAlign:"center", marginTop:14 }}><span style={{ fontSize:12, color:"#3f3f46", letterSpacing:"0.5px" }}>DESKTOP</span></div></div>
            <div style={{ flex:"0 0 auto", width:180 }}><GCard padding={0} outerStyle={{ boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}><div style={{ padding:4 }}><DashboardMobile /></div></GCard><div style={{ textAlign:"center", marginTop:14 }}><span style={{ fontSize:12, color:"#3f3f46", letterSpacing:"0.5px" }}>MOBILE</span></div></div>
          </div></FadeIn>
        </div>
      </section>

      {/* EARNING MODEL */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="coins" position="right" y="50%" scale={1.2} opacity={0.04} /><SectionWatermark right="2%">04</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="wallet">Earning Model</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>See What You Could <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:42, letterSpacing:"-1px" }}>Earn</ShimmerText></h2><p style={{ fontSize:15, color:"#71717a" }}>Refer just 3 people and your subscription pays for itself</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:16, maxWidth:mob?400:1100, margin:"0 auto", alignItems:"stretch" }}>
            {[{r:3,lab:"Covers subscription",net:(3*PRICE*L1_RATE-PRICE)},{r:10,lab:"Meaningful income",net:(10*PRICE*L1_RATE+5*PRICE*L2_RATE-PRICE)},{r:25,lab:"Exceeds part-time jobs",net:(25*PRICE*L1_RATE+20*PRICE*L2_RATE-PRICE)},{r:50,lab:"Real income stream",net:(50*PRICE*L1_RATE+50*PRICE*L2_RATE-PRICE)}].map(function(e,ei){return (
              <FadeIn key={e.r} delay={ei*0.1}><SpotlightCard padding={28} style={{ textAlign:"center", alignItems:"center", display:"flex", flexDirection:"column" }}><div style={{ fontSize:13, color:"#52525b", marginBottom:10 }}>{e.r+" referrals"}</div><div style={{ fontSize:28, fontWeight:500, color:"#d4d4d8", letterSpacing:"-0.5px", marginBottom:6 }}>{"AED "+e.net.toFixed(2)}</div><div style={{ fontSize:12, color:"#52525b" }}>net profit/month</div><div style={{ fontSize:12, color:"#71717a", marginTop:10, fontStyle:"italic" }}>{e.lab}</div></SpotlightCard></FadeIn>
            )})}
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign:"center", marginTop:40 }}><Btn onClick={function(){go("howItWorks")}} outline>{"See Full Earning Breakdown"}</Btn></div></FadeIn>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:mob?"60px 20px":"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="palms" position="left" y="35%" scale={0.8} opacity={0.03} /><BgIllustration name="skyline" position="right" y="70%" scale={0.7} opacity={0.03} /><SectionWatermark>05</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:16 }}><SLabel icon="chat">Reviews</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 4px", letterSpacing:"-1px" }}>Trusted by <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Many</span></h2></div><p style={{ textAlign:"center", fontSize:15, color:"#71717a", marginBottom:56 }}>Hear from real subscribers who are learning and earning</p></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:16, alignItems:"stretch" }}>
            {[{q:"I covered my subscription in the first week with just 3 referrals. The workers rights module helped me resolve an issue with my employer.",n:"Priya S.",r:"Healthcare Worker, Dubai",init:"PS"},{q:"I shared my link in two WhatsApp groups and within a month I was earning more than my weekend freelancing.",n:"David C.",r:"IT Professional, Abu Dhabi",init:"DC"},{q:"The course content is genuinely high quality. My colleagues have all found it valuable. I only recommend things I believe in.",n:"Maria L.",r:"Teacher, Sharjah",init:"ML"}].map(function(t,ti){return (
              <FadeIn key={t.n} delay={ti*0.12}><SpotlightCard padding={28}><div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexShrink:0 }}><div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:600, color:"#a1a1aa", boxShadow:"0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)", flexShrink:0 }}>{t.init}</div><div><div style={{ fontSize:14, fontWeight:600, color:"#d4d4d8" }}>{t.n}</div><div style={{ fontSize:12, color:"#52525b" }}>{t.r}</div></div></div><p style={{ fontSize:14, color:"#a1a1aa", lineHeight:1.8, margin:0, marginTop:"auto" }}>{"\u201C"+t.q+"\u201D"}</p></SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* COURSE PREVIEW */}
      <section style={{ padding:mob?"60px 20px":"100px 48px 80px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><DotGrid opacity={0.04} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:48 }}><SLabel icon="book">Curriculum</SLabel><h2 style={{ fontSize:36, fontWeight:600, color:"#d4d4d8", margin:0, letterSpacing:"-0.5px" }}>{INIT_COURSES.length+" modules. "+tl+" lessons. "}<span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Real skills.</span></h2></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat("+INIT_COURSES.length+", 1fr)", gap:12, alignItems:"stretch" }}>
            {INIT_COURSES.map(function(c,ci){return (
              <FadeIn key={c.id} delay={ci*0.08}><SpotlightCard padding={24} style={{ textAlign:"center", alignItems:"center" }}><div style={{ marginBottom:10, lineHeight:0, display:"flex", justifyContent:"center" }}><Ico name={c.icon} size={28} color="rgb(200,180,140)" /></div><h3 style={{ fontSize:14, fontWeight:600, color:"#d4d4d8", margin:"0 0 4px", textAlign:"center", width:"100%", flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>{c.module}</h3><div style={{ fontSize:12, color:"#52525b", textAlign:"center", width:"100%", marginTop:"auto" }}>{c.lessons.length+" lessons"}</div></SpotlightCard></FadeIn>
            )})}
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign:"center", marginTop:24 }}><span onClick={function(){go("curriculum")}} style={{ fontSize:14, color:"#a1a1aa", cursor:"pointer" }}>{"View the full curriculum \u2192"}</span></div></FadeIn>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding:mob?"60px 20px":"120px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="growth" position="right" y="50%" scale={1} opacity={0.035} /><SectionWatermark right="2%">06</SectionWatermark>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <FadeIn><SLabel icon="rocket">Process</SLabel><h2 style={{ fontSize:36, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-0.5px" }}>Our Simple & <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Smart Process</span></h2><p style={{ fontSize:15, color:"#71717a", marginBottom:56 }}>Getting started takes less than 2 minutes</p></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:16, alignItems:"stretch" }}>
            {[{n:"01",t:"Subscribe",d:"Pay securely via MamoPay"},{n:"02",t:"Learn",d:"Access all courses instantly"},{n:"03",t:"Share",d:"Get your unique referral link"},{n:"04",t:"Earn",d:"Weekly payouts to your bank"}].map(function(s,si){return (
              <FadeIn key={s.n} delay={si*0.1}><SpotlightCard padding={24} style={{ textAlign:"center" }}><div style={{ fontSize:28, fontWeight:700, color:"rgb(200,180,140)", marginBottom:12, fontFamily:"Georgia, serif", fontStyle:"italic", lineHeight:1 }}>{s.n}</div><h3 style={{ fontSize:15, fontWeight:600, color:"#d4d4d8", margin:"0 0 6px" }}>{s.t}</h3><p style={{ fontSize:12, color:"#52525b", margin:0 }}>{s.d}</p></SpotlightCard></FadeIn>
            )})}
          </div>
          <FadeIn delay={0.4}><div style={{ marginTop:48 }}><Btn onClick={function(){go("subscribe")}}>{"Start Your Subscription"}</Btn><div style={{ marginTop:12, fontSize:13, color:"#52525b" }}>{"AED "+PRICE+"/month \u00B7 Cancel anytime"}</div></div></FadeIn>
        </div>
      </section>

      <CtaBanner go={go} />
      <SiteFooter go={go} />
    </div>
  );
}


export default Landing;
