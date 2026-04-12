import { useState } from "react";
import { USER } from "../../constants";
import { admin as adminApi } from "../../api";
import { Btn } from "../Layout";

function CreateAdminForm(props) {
  var mob = props.mob;
  var _cae = useState(""); var cae = _cae[0]; var setCae = _cae[1];
  var _caLoading = useState(false); var caLoading = _caLoading[0]; var setCaLoading = _caLoading[1];
  var _caResult = useState(null); var caResult = _caResult[0]; var setCaResult = _caResult[1];

  async function handleCreateAdmin() {
    if (!cae.trim()) { setCaResult({ok:false, msg:"Enter an email address"}); return; }
    setCaLoading(true); setCaResult(null);
    try {
      const users = await adminApi.users();
      const found = users.find(function(u){ return u.email.toLowerCase() === cae.toLowerCase().trim(); });
      if (!found) { setCaResult({ok:false, msg:"No account found with that email. They must register first."}); setCaLoading(false); return; }
      await adminApi.updateRole(found.id, "admin");
      setCaResult({ok:true, msg:"\u2713 " + (found.full_name||found.email) + " is now an admin."});
      setCae("");
    } catch(e) {
      setCaResult({ok:false, msg: e.message || "Something went wrong"});
    } finally {
      setCaLoading(false);
    }
  }

  return (
    <div>
      {caResult && <div style={{ padding:"10px 14px", borderRadius:8, background:caResult.ok?"rgba(16,185,129,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(caResult.ok?"rgba(16,185,129,0.2)":"rgba(248,113,113,0.2)"), color:caResult.ok?"#10b981":"#f87171", fontSize:13, fontWeight:600, marginBottom:14 }}>{caResult.msg}</div>}
      <div style={{ display:"grid", gap:12, maxWidth:420 }}>
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#71717a", marginBottom:5 }}>EMAIL OF USER TO PROMOTE</label>
          <input type="email" value={cae} onChange={function(e){setCae(e.target.value);setCaResult(null)}} placeholder="user@example.com" style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box" }} />
        </div>
        <button onClick={handleCreateAdmin} disabled={caLoading} style={{ padding:"11px 24px", borderRadius:8, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:13, fontWeight:700, cursor:"pointer", opacity:caLoading?0.6:1 }}>{caLoading ? "Promoting..." : "Promote to Admin"}</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// ADMIN TICKETS TAB
// ═════════════════════════════════════════

export default CreateAdminForm;
