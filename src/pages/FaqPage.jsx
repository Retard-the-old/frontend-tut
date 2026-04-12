import { useState } from "react";
import { useIsMobile, Ico, WaveDivider, BgIllustration, DotGrid, NoiseOverlay, FadeIn, SectionWatermark, SpotlightCard } from "../components/UI";
import { Btn, Logo, SiteNav, SiteFooter, CtaBanner, SLabel } from "../components/Layout";

function FaqPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _open = useState(null);
  var open = _open[0]; var setOpen = _open[1];
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);
  var faqs = [
    {q:"What exactly is Tutorii?",a:"A subscription education platform for expats in the UAE/GCC. AED "+PRICE+"/month for "+INIT_COURSES.length+" modules, "+tl+" lessons covering life skills, legal rights, career growth, and finance  - plus an optional referral program with weekly payouts."},
    {q:"Who is Tutorii designed for?",a:"Anyone living or relocating to the UAE or GCC  - workers, professionals, families, and entrepreneurs. The content is practical and built around real challenges expats face: navigating visa rules, understanding employment rights, finding housing, managing finances, and building careers in the Gulf."},
    {q:"What topics do the courses cover?",a:"Currently "+INIT_COURSES.length+" modules: "+INIT_COURSES.map(function(c){return c.module}).join(", ")+". New modules are added regularly based on community feedback. Each lesson is 8\u201325 minutes with video content and downloadable PDF guides."},
    {q:"What languages are available?",a:"Courses are currently in English. Arabic, Hindi, Urdu, and Tagalog versions are on the roadmap. The platform interface is English-only for now."},
    {q:"Can I use Tutorii on my phone?",a:"Yes. Tutorii works on any device with a browser  - phone, tablet, laptop, or desktop. No app download needed. Your progress syncs across all your devices automatically."},
    {q:"How does the referral program work?",a:"Share your unique link. When someone subscribes through it, you earn 40% (AED "+(PRICE*L1_RATE).toFixed(2)+") every month they stay active. If they refer others, you earn 5% (AED "+(PRICE*L2_RATE).toFixed(2)+") on those too. Two levels, no complexity."},
    {q:"How much can I realistically earn?",a:"There is no cap. Each active Level 1 referral earns you AED "+(PRICE*L1_RATE).toFixed(2)+"/month. Just 3 referrals covers your subscription and puts you in profit. 10 referrals = AED "+(PRICE*L1_RATE*10).toFixed(2)+"/month. Earnings compound as your network grows."},
    {q:"When and how do I get paid?",a:"Every Tuesday via bank transfer through MamoPay to your registered IBAN. Minimum payout is AED 50. Payouts typically arrive within 1\u20133 business days depending on your bank."},
    {q:"Do I have to refer people to use Tutorii?",a:"Not at all. The referral program is completely optional. Many members use Tutorii purely for the courses and never refer anyone. The earning feature is an added benefit, not a requirement."},
    {q:"What payment methods do you accept?",a:"Visa, Mastercard, Apple Pay, and Google Pay  - all processed securely through MamoPay, a CBUAE-licensed payment provider. Tutorii never sees or stores your card details."},
    {q:"Can I cancel anytime?",a:"Yes. No cancellation fees, no lock-in contracts. Cancel from your dashboard Settings page and your access continues until the end of your current billing period. Re-subscribe anytime without losing your progress."},
    {q:"Can I get a refund?",a:"All sales are final as stated in our Terms of Service. You can cancel at any time to stop future charges, but payments already processed are non-refundable. We recommend exploring the free curriculum preview before subscribing."},
    {q:"Is my data secure?",a:"All payments are handled by MamoPay (CBUAE-licensed, PCI DSS compliant). Tutorii never sees your card numbers. We use encrypted connections, don't sell your data, and don't use advertising trackers. See our Privacy Policy for full details."},
    {q:"Is Tutorii available outside the UAE?",a:"Yes. While the content is focused on the UAE and GCC, anyone worldwide can subscribe, access courses, and participate in the referral program. Payouts are sent to any IBAN globally."},
    {q:"What if I have a problem or need help?",a:"Our AI support assistant is available 24/7 inside your dashboard and knows your account details. For human support, email support@tutorii.com  - our team responds within 24 hours (Sun\u2013Thu, 9AM\u20136PM GST)."},
    {q:"Are new courses added over time?",a:"Yes. We add new modules and lessons on a rolling basis. Upcoming topics include Digital Marketing, Mental Health & Wellbeing, and Advanced Career Skills. All new content is included in your subscription at no extra cost."},
  ];

  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} active="faq" />
      <section style={{ paddingTop:mob?120:160, padding:mob?"120px 20px 60px":"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="geometric" position="left" y="45%" scale={1} opacity={0.035} />
        <FadeIn><div style={{ maxWidth:600, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="question">FAQ</SLabel>
          <h1 style={{ fontSize:mob?32:48, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", lineHeight:1.1, letterSpacing:mob?"-1px":"-1.5px" }}>Frequently Asked <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Questions</span></h1>
          <p style={{ fontSize:15, color:"#71717a" }}>Find quick answers to the most common questions</p>
        </div></FadeIn>
      </section>
      <section style={{ padding:mob?"0 16px 60px":"0 48px 120px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.6fr", gap:24, alignItems:"start" }}>
          <FadeIn><div style={mob?{order:2}:{}}><SpotlightCard padding={32}>
            <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", lineHeight:0 }}><Ico name="question" size={22} color="rgb(200,180,140)" /></div>
            <h3 style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", margin:"0 0 8px" }}>Still Have Questions?</h3>
            <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:20 }}>Feel free to get in touch with us today!</p>
            <Btn onClick={function(){go("contact")}} outline style={{ fontSize:13, width:"100%" }}>Ask A Question</Btn>
          </SpotlightCard></div></FadeIn>
          <div style={mob?{order:1}:{}}>
            {faqs.map(function(f,fi){
              var isOpen = open === fi;
              return (
                <FadeIn key={fi} delay={fi*0.06}><div onClick={function(){setOpen(isOpen?null:fi)}} style={{ borderRadius:14, padding:"18px 22px", border:"1px solid rgba(255,255,255,"+(isOpen?"0.1":"0.06")+")", marginBottom:8, cursor:"pointer", background:isOpen?"rgba(255,255,255,0.03)":"transparent", transition:"background 0.3s, border-color 0.3s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:15, fontWeight:500, color:"#d4d4d8" }}>{f.q}</span>
                    <span style={{ fontSize:18, color:"#52525b", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.3s", flexShrink:0, marginLeft:16, lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", width:24, height:24 }}>{"\u2303"}</span>
                  </div>
                  <div style={{ maxHeight:isOpen?200:0, overflow:"hidden", transition:"max-height 0.4s ease-out, opacity 0.3s", opacity:isOpen?1:0 }}>
                    <p style={{ fontSize:14, color:"#71717a", lineHeight:1.8, margin:"16px 0 0", paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.04)" }}>{f.a}</p>
                  </div>
                </div></FadeIn>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBanner go={go} title="Ready to See What Tutorii Can Do?" sub={"Courses, referral tools, and weekly payouts for AED "+PRICE+"/month"} />
      <SiteFooter go={go} />
    </div>
  );
}


// ═════════════════════════════════════════
// USER LOGIN
// ═════════════════════════════════════════

export default FaqPage;
