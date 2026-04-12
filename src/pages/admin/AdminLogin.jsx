import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { Ico, FadeIn, BgIllustration, DotGrid, NoiseOverlay } from "../../components/UI";
import { Btn, Logo } from "../../components/Layout";

function AdminLogin(props) {
  var go = props.go;
  var _e = useState(""); var email = _e[0]; var setEmail = _e[1];
  var _p = useState(""); var pass = _p[0]; var setPass = _p[1];
  var _er = useState(""); var error = _er[0]; var setError = _er[1];
  var _loading = useState(false); var loading = _loading[0]; var setLoading = _loading[1];
  var { login, logout } = useAuth();

  // Always log out any existing session when admin login page loads
  useEffect(function() {
    logout();
  }, []);

  async function handleLogin() {
    if (!email || !pass) { setError("Enter admin credentials"); return; }
    setLoading(true); setError("");
    try {
      var me = await login(email, pass);
      if (me.role !== "admin") {
        logout();
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }
      go("adminPanel");
    } catch(e) {
      setError(e.message || "Invalid credentials");
    }
    setLoading(false);
  }


  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0c", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ maxWidth:400, width:"90%", background:"#111113", borderRadius:20, padding:40, border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Logo light />
          <div style={{ fontSize:11, fontWeight:700, color:"#71717a", letterSpacing:2, marginTop:8 }}>ADMIN ACCESS</div>
        </div>
        {error && <div style={{ padding:"10px 14px", borderRadius:8, background:"#7f1d1d", color:"#fca5a5", fontSize:13, marginBottom:16 }}>{error}</div>}
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#52525b", marginBottom:5 }}>Admin Email</label>
          <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setError("")}} placeholder="admin@tutorii.com" style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
        </div>
        <div style={{ marginBottom:28 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#52525b", marginBottom:5 }}>Password</label>
          <input type="password" value={pass} onChange={function(e){setPass(e.target.value);setError("")}} placeholder="********" style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:12, opacity:loading?0.6:1 }}>{loading ? "Logging in..." : "Log In to Admin"}</button>
        <div style={{ textAlign:"center", marginTop:12 }}>
          <span onClick={function(){go("landing")}} style={{ fontSize:12, color:"#71717a", cursor:"pointer" }}>Back to site</span>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// CREATE ADMIN FORM
// ═════════════════════════════════════════

export default AdminLogin;
