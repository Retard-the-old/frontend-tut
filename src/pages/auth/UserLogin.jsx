import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { users as usersApi } from "../../api";
import { Ico, FadeIn, BgIllustration, DotGrid, NoiseOverlay } from "../../components/UI";
import { Btn, Logo } from "../../components/Layout";

function UserLogin(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _email = useState("");
  var email = _email[0]; var setEmail = _email[1];
  var _pass = useState("");
  var pass = _pass[0]; var setPass = _pass[1];
  var _err = useState("");
  var error = _err[0]; var setError = _err[1];

  var _loading = useState(false);
  var loading = _loading[0]; var setLoading = _loading[1];

  var { login } = useAuth();

  async function handleLogin() {
    if (!email || !pass) { setError("Please enter your email and password"); return; }
    setLoading(true); setError("");
    try {
      await login(email, pass);
      // Check subscription before routing — authUser is guaranteed set here
      try {
        var sub = await subscriptionsApi.me();
        if (sub && sub.status === "active") { go("userPortal"); }
        else { go("subscribe"); }
      } catch(subErr) {
        go("userPortal"); // subscription endpoint failed, portal will handle it
      }
    } catch(e) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 50%", background:"#111113", display:"flex", flexDirection:"column", justifyContent:"center", padding:mob?"32px 24px":"64px 56px" }}>
        <Logo light onClick={function(){go("landing")}} />
        <h2 style={{ fontSize:mob?28:36, fontWeight:800, color:"#fff", margin:mob?"24px 0 10px":"48px 0 16px", lineHeight:1.15 }}>Welcome back</h2>
        <p style={{ fontSize:mob?14:15, color:"rgb(200,180,140)", lineHeight:1.7, maxWidth:380 }}>Log in to access your courses, track your referrals, and manage your earnings.</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:400, width:"100%" }}>
          <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Log in to your account</h3>
          <p style={{ fontSize:14, color:"#71717a", marginBottom:32 }}>Enter your email and password</p>
          {error && <div style={{ padding:"14px 18px", borderRadius:12, background:"linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))", border:"1px solid rgba(248,113,113,0.15)", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"#fca5a5", lineHeight:1.3 }}>{error === "invalid" ? "Invalid login credentials" : error}</div>
              <div style={{ fontSize:11, color:"rgba(248,113,113,0.6)", marginTop:2 }}>{error === "invalid" ? "The email or password you entered is incorrect. Please try again." : ""}</div>
            </div>
          </div>}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Email Address</label>
            <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setError("")}} placeholder="you@example.com" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Password</label>
            <input type="password" value={pass} onChange={function(e){setPass(e.target.value);setError("")}} onKeyDown={function(e){if(e.key==="Enter") handleLogin()}} placeholder="********" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
          </div>
          <div style={{ textAlign:"right", marginBottom:24 }}>
            <span onClick={function(){go("forgotPassword")}} style={{ fontSize:12, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:500 }}>Forgot password?</span>
          </div>
          <Btn onClick={handleLogin} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:12, opacity:loading?0.6:1 }}>{loading ? "Logging in..." : "Log In"}</Btn>
          <div style={{ textAlign:"center", padding:"8px 12px", borderRadius:8, background:"rgba(200,180,140,0.08)", fontSize:12, color:"rgb(200,180,140)", marginBottom:16 }}>

          </div>
          <div style={{ textAlign:"center", fontSize:13, color:"#71717a" }}>
            {"No account? "}<span onClick={function(){go("subscribe")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer" }}>Subscribe now</span>
          </div>
          <div style={{ textAlign:"center", marginTop:16 }}>
            <span onClick={function(){go("landing")}} style={{ fontSize:12, color:"#52525b", cursor:"pointer" }}>Back to home</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// FORGOT PASSWORD
// ═════════════════════════════════════════

export default UserLogin;
