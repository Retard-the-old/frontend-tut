import { useState, useEffect } from "react";
import { users as usersApi } from "../../api";
import { useIsMobile, Ico, FadeIn, BgIllustration, DotGrid, NoiseOverlay } from "../../components/UI";
import { Btn, Logo, SiteNav, SiteFooter } from "../../components/Layout";

function ForgotPasswordPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _email = useState("");
  var email = _email[0]; var setEmail = _email[1];
  var _sent = useState(false);
  var sent = _sent[0]; var setSent = _sent[1];
  var _loading = useState(false);
  var loading = _loading[0]; var setLoading = _loading[1];
  var _error = useState("");
  var error = _error[0]; var setError = _error[1];
  var _countdown = useState(0);
  var countdown = _countdown[0]; var setCountdown = _countdown[1];

  useEffect(function() {
    if (countdown <= 0) return;
    var t = setTimeout(function() { setCountdown(countdown - 1); }, 1000);
    return function() { clearTimeout(t); };
  }, [countdown]);

  function handleSubmit() {
    if (!email.trim()) { setError("Please enter your email address"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address"); return; }
    setLoading(true); setError("");
    var API = import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1";
    fetch(API + "/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    }).then(function() {
      setSent(true);
      setCountdown(60);
    }).catch(function() {
      setError("Network error — please check your connection and try again.");
    }).finally(function() {
      setLoading(false);
    });
  }

  function handleResend() {
    if (countdown > 0) return;
    setLoading(true);
    var API = import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1";
    fetch(API + "/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    }).then(function() {
      setCountdown(60);
    }).catch(function() {}).finally(function() {
      setLoading(false);
    });
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 50%", background:"#111113", display:"flex", flexDirection:"column", justifyContent:"center", padding:mob?"32px 24px":"64px 56px" }}>
        <Logo light onClick={function(){go("landing")}} />
        <h2 style={{ fontSize:mob?28:36, fontWeight:800, color:"#fff", margin:mob?"24px 0 10px":"48px 0 16px", lineHeight:1.15 }}>Reset your password</h2>
        <p style={{ fontSize:mob?14:15, color:"rgb(200,180,140)", lineHeight:1.7, maxWidth:380 }}>{"Don\u2019t worry, it happens to everyone. We\u2019ll send you a link to get back in."}</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:400, width:"100%" }}>

          {!sent ? (
            <div>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Forgot your password?</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:32, lineHeight:1.7 }}>{"Enter the email address linked to your account and we\u2019ll send you a password reset link."}</p>

              {error && <div style={{ padding:"14px 18px", borderRadius:12, background:"linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))", border:"1px solid rgba(248,113,113,0.15)", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fca5a5", lineHeight:1.3 }}>{error}</div>
              </div>}

              <div style={{ marginBottom:24 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Email Address</label>
                <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setError("")}} onKeyDown={function(e){if(e.key==="Enter") handleSubmit()}} placeholder="you@example.com" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
              </div>

              <Btn onClick={handleSubmit} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:16, opacity:loading?0.6:1 }}>{loading ? "Sending..." : "Send Reset Link"}</Btn>

              <div style={{ textAlign:"center", fontSize:13, color:"#71717a" }}>
                {"Remember your password? "}<span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer" }}>Back to login</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="rgb(200,180,140)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="rgb(200,180,140)" strokeWidth="1.5"/></svg>
              </div>
              <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Check your inbox</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:24, lineHeight:1.7 }}>{"We\u2019ve sent a password reset link to:"}</p>

              <div style={{ background:"rgba(200,180,140,0.06)", border:"1px solid rgba(200,180,140,0.12)", borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(200,180,140,0.1)", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize:14, fontWeight:600, color:"rgb(200,180,140)" }}>{email}</span>
              </div>

              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:20, border:"1px solid rgba(255,255,255,0.06)", marginBottom:24 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:10 }}>{"Didn\u2019t receive it?"}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"#52525b", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#71717a" }}>Check your spam or junk folder</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"#52525b", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#71717a" }}>Make sure the email address is correct</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"#52525b", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#71717a" }}>The link expires in 30 minutes</span>
                  </div>
                </div>
              </div>

              <button onClick={handleResend} disabled={countdown > 0 || loading} style={{ width:"100%", padding:"13px", borderRadius:12, border:"1px solid "+(countdown > 0 ? "rgba(255,255,255,0.06)" : "rgba(200,180,140,0.2)"), background:countdown > 0 ? "transparent" : "rgba(200,180,140,0.06)", color:countdown > 0 ? "#52525b" : "rgb(200,180,140)", fontSize:14, fontWeight:600, cursor:countdown > 0 ? "default" : "pointer", marginBottom:16, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.3s" }}>
                {loading ? "Resending..." : countdown > 0 ? "Resend available in " + countdown + "s" : "Resend Reset Link"}
              </button>

              <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
                <span onClick={function(){go("login")}} style={{ fontSize:13, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600 }}>Back to login</span>
                <span style={{ color:"#27272a" }}>{"\u00B7"}</span>
                <span onClick={function(){go("support")}} style={{ fontSize:13, color:"#71717a", cursor:"pointer" }}>Contact support</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// RESET PASSWORD (user lands here from email link)
// ═════════════════════════════════════════

export default ForgotPasswordPage;
