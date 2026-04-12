import { useState, useEffect } from "react";
import { users as usersApi } from "../../api";
import { useIsMobile, Ico, FadeIn, BgIllustration, DotGrid, NoiseOverlay } from "../../components/UI";
import { Btn, Logo, SiteNav, SiteFooter } from "../../components/Layout";

function ResetPasswordPage(props) {
  var go = props.go;
  var mob = useIsMobile();

  // In production, extract token from URL: new URLSearchParams(window.location.search).get("token")
  var _token = useState(new URLSearchParams(window.location.search).get("token") || "");
  var token = _token[0];
  var _pass = useState(""); var pass = _pass[0]; var setPass = _pass[1];
  var _confirm = useState(""); var confirm = _confirm[0]; var setConfirm = _confirm[1];
  var _loading = useState(false); var loading = _loading[0]; var setLoading = _loading[1];
  var _error = useState(""); var error = _error[0]; var setError = _error[1];
  var _done = useState(false); var done = _done[0]; var setDone = _done[1];
  var _validating = useState(true); var validating = _validating[0]; var setValidating = _validating[1];
  var _tokenValid = useState(false); var tokenValid = _tokenValid[0]; var setTokenValid = _tokenValid[1];
  var _tokenEmail = useState(""); var tokenEmail = _tokenEmail[0]; var setTokenEmail = _tokenEmail[1];
  var _showPass = useState(false); var showPass = _showPass[0]; var setShowPass = _showPass[1];

  // Validate token on mount
  useEffect(function() {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      return;
    }
    var API = import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1";
    fetch(API + "/auth/validate-reset-token?token=" + encodeURIComponent(token))
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.valid) {
          setTokenValid(true);
          setTokenEmail(d.email || "");
        } else {
          setTokenValid(false);
        }
      })
      .catch(function() { setTokenValid(false); })
      .finally(function() { setValidating(false); });
  }, []);

  function validate() {
    if (!pass) { setError("Please enter a new password"); return false; }
    if (pass.length < 8) { setError("Password must be at least 8 characters"); return false; }
    if (!/[A-Z]/.test(pass)) { setError("Password must contain at least one uppercase letter"); return false; }
    if (!/[0-9]/.test(pass)) { setError("Password must contain at least one number"); return false; }
    if (pass !== confirm) { setError("Passwords do not match"); return false; }
    return true;
  }

  function handleSubmit() {
    setError("");
    if (!validate()) return;
    setLoading(true);
    var API = import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1";
    fetch(API + "/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token, new_password: pass })
    }).then(function(r) {
      if (!r.ok) throw new Error("Reset failed");
      setDone(true);
    }).catch(function() {
      setError("Reset link has expired or is invalid. Please request a new one.");
    }).finally(function() { setLoading(false); });
  }

  // Password strength indicator
  var strength = 0;
  if (pass.length >= 8) strength++;
  if (/[A-Z]/.test(pass)) strength++;
  if (/[0-9]/.test(pass)) strength++;
  if (/[^A-Za-z0-9]/.test(pass)) strength++;
  var strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] || "";
  var strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e", "#10b981"][strength] || "";

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 50%", background:"#111113", display:"flex", flexDirection:"column", justifyContent:"center", padding:mob?"32px 24px":"64px 56px" }}>
        <Logo light onClick={function(){go("landing")}} />
        <h2 style={{ fontSize:mob?28:36, fontWeight:800, color:"#fff", margin:mob?"24px 0 10px":"48px 0 16px", lineHeight:1.15 }}>Choose a new password</h2>
        <p style={{ fontSize:mob?14:15, color:"rgb(200,180,140)", lineHeight:1.7, maxWidth:380 }}>{"Pick something secure that you\u2019ll remember. You\u2019ll be able to log in immediately after."}</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:400, width:"100%" }}>

          {validating ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", animation:"pulse 1.5s ease-in-out infinite" }}>
                <Ico name="shield" size={18} color="rgb(200,180,140)" />
              </div>
              <p style={{ fontSize:14, color:"#71717a" }}>Validating your reset link...</p>
            </div>
          ) : !tokenValid ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.15)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Invalid or expired link</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:28, lineHeight:1.7 }}>This password reset link is no longer valid. It may have expired or already been used.</p>
              <Btn onClick={function(){go("forgotPassword")}} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:12 }}>Request a New Link</Btn>
              <div style={{ textAlign:"center" }}>
                <span onClick={function(){go("login")}} style={{ fontSize:13, color:"#71717a", cursor:"pointer" }}>Back to login</span>
              </div>
            </div>
          ) : done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="rgb(200,180,140)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="rgb(200,180,140)" strokeWidth="1.5"/></svg>
              </div>
              <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Password reset complete</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:28, lineHeight:1.7 }}>Your password has been updated successfully. You can now log in with your new password.</p>
              <Btn onClick={function(){go("login")}} full style={{ padding:"13px", fontSize:15, borderRadius:12 }}>Log In</Btn>
            </div>
          ) : (
            <div>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="rgb(200,180,140)" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Set a new password</h3>
              {tokenEmail && <p style={{ fontSize:13, color:"#52525b", marginBottom:24 }}>{"for " + tokenEmail}</p>}

              {error && <div style={{ padding:"14px 18px", borderRadius:12, background:"linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))", border:"1px solid rgba(248,113,113,0.15)", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fca5a5", lineHeight:1.3 }}>{error}</div>
              </div>}

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>New Password</label>
                <div style={{ position:"relative" }}>
                  <input type={showPass ? "text" : "password"} value={pass} onChange={function(e){setPass(e.target.value);setError("")}} placeholder="Minimum 8 characters" style={{ width:"100%", padding:"12px 44px 12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
                  <button onClick={function(){setShowPass(!showPass)}} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:4, lineHeight:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d={showPass ? "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"} stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>{!showPass && <circle cx="12" cy="12" r="3" stroke="#52525b" strokeWidth="1.5"/>}</svg>
                  </button>
                </div>
                {pass && <div style={{ display:"flex", gap:4, marginTop:8 }}>
                  {[1,2,3,4].map(function(i){return <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i <= strength ? strengthColor : "rgba(255,255,255,0.06)", transition:"background 0.3s" }} />})}
                  <span style={{ fontSize:10, color:strengthColor, fontWeight:600, marginLeft:4 }}>{strengthLabel}</span>
                </div>}
                <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:4 }}>
                  {[["8+ characters", pass.length >= 8],["One uppercase letter",/[A-Z]/.test(pass)],["One number",/[0-9]/.test(pass)]].map(function(r){return <div key={r[0]} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:r[1] ? "rgb(200,180,140)" : "#3f3f46", transition:"color 0.3s" }}><span>{r[1] ? "\u2713" : "\u2022"}</span>{r[0]}</div>})}
                </div>
              </div>

              <div style={{ marginBottom:28 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={function(e){setConfirm(e.target.value);setError("")}} onKeyDown={function(e){if(e.key==="Enter") handleSubmit()}} placeholder="Re-enter your password" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error && error.includes("match") ? "rgba(248,113,113,0.3)" : confirm && confirm === pass ? "rgba(200,180,140,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
                {confirm && confirm === pass && <div style={{ fontSize:11, color:"rgb(200,180,140)", marginTop:4, display:"flex", alignItems:"center", gap:4 }}>{"\u2713"} Passwords match</div>}
              </div>

              <Btn onClick={handleSubmit} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:16, opacity:loading?0.6:1 }}>{loading ? "Updating..." : "Reset Password"}</Btn>

              <div style={{ textAlign:"center" }}>
                <span onClick={function(){go("login")}} style={{ fontSize:13, color:"#71717a", cursor:"pointer" }}>Back to login</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// SUBSCRIBE
// ═════════════════════════════════════════

export default ResetPasswordPage;
