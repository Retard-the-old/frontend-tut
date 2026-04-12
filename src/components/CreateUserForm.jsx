import { useState } from "react";
import { admin as adminApi } from "../api";
import { Btn } from "./Layout";

function CreateUserForm(props) {
  var _name = useState(""); var name = _name[0]; var setName = _name[1];
  var _email = useState(""); var email = _email[0]; var setEmail = _email[1];
  var _pass = useState(""); var pass = _pass[0]; var setPass = _pass[1];
  var _role = useState("user"); var role = _role[0]; var setRole = _role[1];
  var _loading = useState(false); var loading = _loading[0]; var setLoading = _loading[1];
  var _err = useState(""); var err = _err[0]; var setErr = _err[1];
  var inputStyle = { width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

  async function handleCreate() {
    if (!name.trim() || !email.trim() || !pass.trim()) { setErr("All fields are required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Enter a valid email"); return; }
    if (pass.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setLoading(true); setErr("");
    try {
      var created = await adminApi.createUser({ full_name: name.trim(), email: email.trim().toLowerCase(), password: pass, role: role });
      props.onSuccess(created);
    } catch(e) {
      setErr(e.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background:"#131315", borderRadius:14, padding:20, border:"1px solid rgba(200,180,140,0.2)", marginBottom:16 }}>
      <div style={{ fontSize:14, fontWeight:700, color:"#d4d4d8", marginBottom:16 }}>Create New User</div>
      {err && <div style={{ padding:"8px 12px", borderRadius:6, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", fontSize:12, marginBottom:12 }}>{err}</div>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <div>
          <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>FULL NAME</label>
          <input value={name} onChange={function(e){setName(e.target.value);setErr("")}} placeholder="John Smith" style={inputStyle} />
        </div>
        <div>
          <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>EMAIL</label>
          <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setErr("")}} placeholder="john@example.com" style={inputStyle} />
        </div>
        <div>
          <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>PASSWORD</label>
          <input type="password" value={pass} onChange={function(e){setPass(e.target.value);setErr("")}} placeholder="Min 8 characters" style={inputStyle} />
        </div>
        <div>
          <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>ROLE</label>
          <select value={role} onChange={function(e){setRole(e.target.value)}} style={Object.assign({},inputStyle,{cursor:"pointer"})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <button onClick={props.onClose} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
        <button onClick={handleCreate} disabled={loading} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:12, fontWeight:700, cursor:"pointer", opacity:loading?0.6:1 }}>{loading?"Creating...":"Create User"}</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// LESSON EDIT PANEL (Admin)
// ═════════════════════════════════════════

export default CreateUserForm;
