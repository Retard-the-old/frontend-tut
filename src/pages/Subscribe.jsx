import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { subscriptions as subscriptionsApi } from "../api";
import { useIsMobile, Ico, FadeIn, BgIllustration, DotGrid, NoiseOverlay } from "../components/UI";
import { Btn, Logo, SiteNav, SiteFooter } from "../components/Layout";
import { PRICE, USER } from "../constants";

function subscriptionHasAccess(sub) {
  if (!sub) return false;
  if (sub.has_access === true) return true;
  if (sub.status === "active") {
    return !sub.current_period_end || new Date(sub.current_period_end).getTime() > Date.now();
  }
  if (sub.status === "cancelled" && sub.current_period_end) {
    return new Date(sub.current_period_end).getTime() > Date.now();
  }
  return false;
}

function Subscribe(props) {
  var go = props.go;
  var mob = useIsMobile();
  var { register, user: authUser } = useAuth();
  // Only jump to step 3 if there's no refCode — a refCode means this is a
  // referral landing page for a NEW user, always show registration (step 1)
  var isReferralLink = !!(props.refCode);
  var _step = useState(authUser && !isReferralLink ? 3 : 1);
  var step = _step[0]; var setStep = _step[1];
  useEffect(function() { if (authUser && !isReferralLink && step === 1) setStep(3); }, [authUser]);
var _form = useState({ name:"", email:"", password:"", phone:"", language:"English", ref: props.refCode || "" });  var form = _form[0]; var setForm = _form[1];
  var _proc = useState(false);
  var processing = _proc[0]; var setProcessing = _proc[1];
  var _err = useState({}); var errors = _err[0]; var setErrors = _err[1];
  var _terms = useState(false); var termsAgreed = _terms[0];
  var setTermsAgreed = _terms[1];
  var _checking = useState(false); var checking = _checking[0]; var setChecking = _checking[1];
  var _checkMsg = useState(""); var checkMsg = _checkMsg[0]; var setCheckMsg = _checkMsg[1];
  var _checkout = useState(false); var checkoutLoading = _checkout[0]; var setCheckoutLoading = _checkout[1];
  var _checkoutMsg = useState(""); var checkoutMsg = _checkoutMsg[0]; var setCheckoutMsg = _checkoutMsg[1];
  var _existingSub = useState(null); var existingSub = _existingSub[0]; var setExistingSub = _existingSub[1];

  useEffect(function() {
    if (!authUser || isReferralLink) return;
    subscriptionsApi.me().then(function(sub){ setExistingSub(sub); }).catch(function(){});
  }, [authUser, isReferralLink]);

  function set(k, v) { setForm(function(p) { var n = Object.assign({}, p); n[k] = v; return n; }); setErrors(function(p){ var n=Object.assign({},p); delete n[k]; return n; }); }
  function validateStep1() {
    var e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Password must contain at least one uppercase letter";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[+]?[\d\s-]{7,15}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handlePay() {
    if (!termsAgreed) return;
    setProcessing(true);
    try {
      await register(form.name, form.email, form.password, form.ref || null, form.phone);
      setStep(3);
    } catch(e) {
      var msg = e.message || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exist") || msg.includes("409")) {
        msg = "An account with this email already exists. Please log in instead.";
      }
      setErrors({ api: msg });
    } finally {
      setProcessing(false);
    }
  }

  async function checkAndRedirect() {
    setChecking(true); setCheckMsg("Checking your payment status...");
    try {
      var data = await subscriptionsApi.verifyPayment();
      if (data.activated) {
        setCheckMsg(data.already_active ? "Your access is active. Taking you to your dashboard..." : "Payment confirmed! Taking you to your dashboard...");
        setTimeout(function(){ go("userPortal"); }, 1200);
      } else {
        if (data.status === "not_found") {
          setCheckMsg(data.message || "Start checkout first, then return here after payment.");
        } else {
          setCheckMsg(data.message || "Your payment is still processing. If you just paid, please wait a moment and try again.");
        }
        setChecking(false);
      }
    } catch(e) {
      setCheckMsg(e.message || "Could not reach payment server. Please try again.");
      setChecking(false);
    }
  }

  async function openCheckout() {
    if (subscriptionHasAccess(existingSub)) {
      var until = existingSub && existingSub.current_period_end ? existingSub.current_period_end.slice(0, 10) : "";
      setCheckoutMsg("You already have paid access" + (until ? " until " + until : "") + ". You can resubscribe after it ends.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutMsg("");
    var checkoutWindow = window.open("", "_blank");
    try {
      var data = await subscriptionsApi.create();
      if (!data.payment_link) throw new Error("Could not create checkout link. Please try again.");
      if (checkoutWindow) checkoutWindow.location.href = data.payment_link;
      else window.location.href = data.payment_link;
      setCheckoutMsg("MamoPay checkout opened. Complete payment there, then come back here.");
    } catch(e) {
      if (checkoutWindow) checkoutWindow.close();
      setCheckoutMsg(e.message || "Could not create secure checkout right now. Please try again in a moment.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 420px", background:"#111113", padding:mob?"32px 24px":"48px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <Logo light onClick={function(){go("landing")}} />
          <h2 style={{ fontSize:mob?22:26, fontWeight:800, color:"#d4d4d8", margin:mob?"24px 0 10px":"48px 0 12px" }}>Start your journey</h2>
          <p style={{ fontSize:14, color:"rgb(200,180,140)", lineHeight:1.7 }}>Instant access to all courses and your earning dashboard.</p>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:460, width:"100%" }}>
          <div style={{ display:"flex", gap:8, marginBottom:36 }}>
            {["Your Details","Payment","Welcome!"].map(function(s,i){ return (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:3, borderRadius:2, background: i+1<=step ? "rgb(200,180,140)" : "#27272a", marginBottom:6 }} />
                <div style={{ fontSize:11, fontWeight:600, color: i+1<=step ? "#d4d4d8" : "#b0b8c4" }}>{s}</div>
              </div>
            )})}
          </div>

          {step === 1 && <div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 24px" }}>Create your account</h3>
            {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"],["Phone","phone","tel"]].map(function(f){ return (
              <div key={f[1]} style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:5 }}>{f[0]} *</label>
                <input type={f[2]} value={form[f[1]]} onChange={function(e){set(f[1],e.target.value)}} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid "+(errors[f[1]]?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
                {errors[f[1]] && <div style={{ fontSize:11, color:"#f87171", marginTop:4 }}>{errors[f[1]]}</div>}
              </div>
            )})}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:5 }}>Referral Code (optional)</label>
              <input value={form.ref} onChange={function(e){set("ref",e.target.value)}} placeholder="e.g. ABC12345" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid "+(errors.ref?"rgba(248,113,113,0.5)":form.ref && !errors.ref?"rgba(200,180,140,0.4)":"rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:form.ref && !errors.ref?"rgba(200,180,140,0.06)":"#0a0a0c", color:"#d4d4d8" }} />
              {errors.ref && <div style={{ fontSize:11, color:"#f87171", marginTop:4 }}>{errors.ref}</div>}
              {form.ref && !errors.ref && <div style={{ fontSize:11, color:"rgb(200,180,140)", marginTop:4, display:"flex", alignItems:"center", gap:4 }}><Ico name="shield" size={10} color="rgb(200,180,140)" />{" Referred by code: "+form.ref.toUpperCase()}</div>}
            </div>
            <Btn onClick={function(){if(validateStep1())setStep(2)}} full style={{ padding:"13px", fontSize:15, borderRadius:12 }}>Continue to Payment</Btn>
            <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#71717a" }}>
              {"Already have an account? "}<span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer" }}>Log in</span>
            </div>
          </div>}

          {step === 2 && <div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 24px" }}>Complete payment</h3>
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:20, marginBottom:16, border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:14, color:"#71717a" }}>Tutorii Monthly</span>
                <span style={{ fontSize:14, fontWeight:500, color:"#d4d4d8" }}>{"AED "+PRICE+"/month"}</span>
              </div>
            </div>
            <div style={{ background:"rgba(200,180,140,0.06)", borderRadius:10, padding:"12px 16px", marginBottom:16, border:"1px solid rgba(200,180,140,0.2)", display:"flex", gap:10, alignItems:"flex-start" }}>
              <Ico name="shield" size={16} color="rgb(200,180,140)" />
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"rgb(200,180,140)", marginBottom:3 }}>Secure Tutorii checkout</div>
                <div style={{ fontSize:12, color:"#a1a1aa", lineHeight:1.6 }}>{"Your checkout is created from your Tutorii account. Complete payment on MamoPay, then return here so we can confirm it."}</div>
              </div>
            </div>
            <div style={{ background:"#131315", borderRadius:12, border:"2px dashed rgba(255,255,255,0.1)", padding:36, textAlign:"center", marginBottom:24 }}>
              <div style={{ marginBottom:10, lineHeight:0 }}><Ico name="bank" size={32} color="rgb(200,180,140)" /></div>
              <div style={{ fontSize:14, fontWeight:600, color:"#d4d4d8" }}>MamoPay Secure Checkout</div>
              <div style={{ fontSize:12, color:"#52525b" }}>Visa - Mastercard - Apple Pay - Google Pay</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                <input type="checkbox" checked={termsAgreed} onChange={function(e){setTermsAgreed(e.target.checked)}} style={{ marginTop:3, accentColor:"rgb(200,180,140)" }} />
                <span style={{ fontSize:12, color:"#71717a", lineHeight:1.6 }}>{"I agree to the "}<span onClick={function(e){e.preventDefault();go("terms")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Terms of Service</span>{" including the "}<strong style={{ color:"#f87171" }}>no-refund policy</strong>{" and "}<span onClick={function(e){e.preventDefault();go("privacy")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Privacy Policy</span>{"."}</span>
              </label>
            </div>
            <Btn onClick={function(){if(termsAgreed)handlePay()}} full style={{ padding:"13px", fontSize:15, borderRadius:12, opacity:termsAgreed?1:0.4, cursor:termsAgreed?"pointer":"not-allowed" }}>
              {processing ? "Processing..." : "Pay AED "+PRICE+" - Subscribe"}
            </Btn>
            {errors.api && <div style={{ marginTop:12, padding:"10px 14px", borderRadius:8, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", fontSize:13, textAlign:"center" }}>{errors.api}{errors.api.includes("log in") && <span> <span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Log in here</span></span>}</div>}
            {!termsAgreed && <div style={{ textAlign:"center", fontSize:11, color:"#52525b", marginTop:8 }}>You must accept the terms to continue</div>}
            <div style={{ textAlign:"center", marginTop:12 }}>
              <span onClick={function(){setStep(1)}} style={{ fontSize:13, color:"rgb(200,180,140)", cursor:"pointer" }}>Back</span>
            </div>
          </div>}

          {step === 3 && <div style={{ textAlign:"center", padding:"32px 0" }}>
                <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(200,180,140,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", lineHeight:0 }}><Ico name="bank" size={28} color="rgb(200,180,140)" /></div>
                <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 10px" }}>Complete Your Payment</h3>
                <p style={{ fontSize:14, color:"#71717a", marginBottom:20, lineHeight:1.7 }}>{authUser ? "Complete your payment on MamoPay to unlock full access." : "Your account has been created. Complete your payment on MamoPay to unlock full access."}</p>
                <div style={{ background:"rgba(200,180,140,0.06)", border:"1px solid rgba(200,180,140,0.2)", borderRadius:10, padding:"14px 18px", marginBottom:20, textAlign:"left" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgb(200,180,140)", marginBottom:4 }}>Secure checkout</div>
                  <div style={{ fontSize:12, color:"#a1a1aa", lineHeight:1.7 }}>{"This checkout is linked to your Tutorii account. After payment, come back here and we’ll confirm it for you."}</div>
                </div>
                <Btn onClick={function(){ if (!checkoutLoading) openCheckout(); }} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:12, opacity:checkoutLoading?0.7:1, cursor:checkoutLoading?"wait":"pointer" }}>{checkoutLoading ? "Creating checkout..." : "Pay AED "+PRICE+" on MamoPay ↗"}</Btn>
                <Btn onClick={checkAndRedirect} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:8, background:"rgba(255,255,255,0.06)", color:"#d4d4d8" }} disabled={checking}>
                  {checking ? "Checking payment..." : "I've paid — check status"}
                </Btn>
                {checkoutMsg && <div style={{ fontSize:12, color: checkoutMsg.includes("Could not") ? "#f87171" : "rgb(200,180,140)", marginTop:8, padding:"8px 12px", borderRadius:6, background:"rgba(255,255,255,0.03)" }}>{checkoutMsg}</div>}
                {checkMsg && <div style={{ fontSize:12, color: checkMsg.includes("No payment") ? "#f87171" : "rgb(200,180,140)", marginTop:8, padding:"8px 12px", borderRadius:6, background:"rgba(255,255,255,0.03)" }}>{checkMsg}</div>}
                {!authUser && <p style={{ fontSize:12, color:"#52525b", marginTop:12 }}>Already have an account? <span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600 }}>Log in here</span></p>}
              </div>}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// CREATE USER FORM (Admin)
// ═════════════════════════════════════════

export default Subscribe;
