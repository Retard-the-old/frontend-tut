import { useState, useEffect } from "react";
import { USER } from "../constants";
import { useAuth } from "../AuthContext";
import { users as usersApi } from "../api";
import { Ico, Badge, PasswordInput } from "./UI";
import { Btn } from "./Layout";

function SettingsTab(props) {
  var u = props.u;
  var mob = props.mob;
  var setShowCancel = props.setShowCancel;
  var cancelled = props.cancelled;
  var setRealUser = props.setRealUser;

  var _name = useState(u.name || ""); var name = _name[0]; var setName = _name[1];
  var _iban = useState(u.iban || ""); var iban = _iban[0]; var setIban = _iban[1];
  var _ibanName = useState(u.ibanName || ""); var ibanName = _ibanName[0]; var setIbanName = _ibanName[1];
  var _profileSaving = useState(false); var profileSaving = _profileSaving[0]; var setProfileSaving = _profileSaving[1];
  var _profileMsg = useState(null); var profileMsg = _profileMsg[0]; var setProfileMsg = _profileMsg[1];
  var _ibanSaving = useState(false); var ibanSaving = _ibanSaving[0]; var setIbanSaving = _ibanSaving[1];
  var _ibanMsg = useState(null); var ibanMsg = _ibanMsg[0]; var setIbanMsg = _ibanMsg[1];
  var _newPw = useState(""); var newPw = _newPw[0]; var setNewPw = _newPw[1];
  var _confirmPw = useState(""); var confirmPw = _confirmPw[0]; var setConfirmPw = _confirmPw[1];
  var _pwSaving = useState(false); var pwSaving = _pwSaving[0]; var setPwSaving = _pwSaving[1];
  var _pwMsg = useState(null); var pwMsg = _pwMsg[0]; var setPwMsg = _pwMsg[1];

  // Sync inputs when u changes (on first load)
  useEffect(function(){ setName(u.name || ""); }, [u.name]);
  useEffect(function(){ setIban(u.iban || ""); setIbanName(u.ibanName || ""); }, [u.iban]);

  async function saveProfile() {
    if (!name.trim()) { setProfileMsg({ok:false, msg:"Name cannot be empty"}); return; }
    setProfileSaving(true); setProfileMsg(null);
    try {
      var updated = await usersApi.update({ full_name: name.trim() });
      setRealUser(updated);
      setProfileMsg({ok:true, msg:"Profile updated successfully"});
    } catch(e) {
      setProfileMsg({ok:false, msg: e.message || "Failed to save"});
    } finally {
      setProfileSaving(false);
    }
  }

  async function saveIban() {
    if (!iban.trim()) { setIbanMsg({ok:false, msg:"Please enter your IBAN"}); return; }
    setIbanSaving(true); setIbanMsg(null);
    try {
      var updated = await usersApi.update({ payout_iban: iban.trim(), payout_name: ibanName.trim() });
      setRealUser(updated);
      setIbanMsg({ok:true, msg:"Payout details saved"});
    } catch(e) {
      setIbanMsg({ok:false, msg: e.message || "Failed to save — check IBAN format"});
    } finally {
      setIbanSaving(false);
    }
  }

  async function changePassword() {
    if (!newPw || !confirmPw) { setPwMsg({ok:false, msg:"Please fill in both fields"}); return; }
    if (newPw !== confirmPw) { setPwMsg({ok:false, msg:"Passwords do not match"}); return; }
    if (newPw.length < 8) { setPwMsg({ok:false, msg:"Password must be at least 8 characters"}); return; }
    setPwSaving(true); setPwMsg(null);
    try {
      await usersApi.changePassword(newPw, confirmPw);
      setNewPw(""); setConfirmPw("");
      setPwMsg({ok:true, msg:"Password updated successfully"});
    } catch(e) {
      setPwMsg({ok:false, msg: e.message || "Failed to update password"});
    } finally {
      setPwSaving(false);
    }
  }

  var inputStyle = { width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" };

  return (
    <div>
      <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>Account Settings</h2>

      {/* Profile */}
      <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16, boxSizing:"border-box" }}>
        <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 16px", color:"#d4d4d8" }}>Profile Information</h3>
        {profileMsg && <div style={{ padding:"10px 14px", borderRadius:8, background:profileMsg.ok?"rgba(16,185,129,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(profileMsg.ok?"rgba(16,185,129,0.2)":"rgba(248,113,113,0.2)"), color:profileMsg.ok?"#10b981":"#f87171", fontSize:13, fontWeight:600, marginBottom:14 }}>{profileMsg.msg}</div>}
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:mob?12:16 }}>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>Full Name</label>
            <input value={name} onChange={function(e){setName(e.target.value);setProfileMsg(null)}} style={inputStyle} />
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>Email Address</label>
            <input value={u.email} disabled style={Object.assign({},inputStyle,{opacity:0.5,cursor:"not-allowed"})} />
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>Referral Code</label>
            <div style={{ padding:"11px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", fontSize:14, fontWeight:600, fontFamily:"monospace", color:"#d4d4d8" }}>{u.code}</div>
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>Member Since</label>
            <div style={{ padding:"11px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", fontSize:14, color:"#d4d4d8" }}>{u.joined || "—"}</div>
          </div>
        </div>
        <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
          <Btn onClick={saveProfile} disabled={profileSaving} style={{ fontSize:12, padding:"10px 24px", opacity:profileSaving?0.6:1 }}>{profileSaving ? "Saving..." : "Save Changes"}</Btn>
        </div>
      </div>

      {/* Payout Details */}
      <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16, boxSizing:"border-box" }}>
        <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 6px", color:"#d4d4d8" }}>Payout Details</h3>
        <p style={{ fontSize:12, color:"#52525b", marginBottom:16 }}>Your earnings are paid every Tuesday via MamoPay to your registered IBAN. Minimum payout: AED 50.</p>
        {ibanMsg && <div style={{ padding:"10px 14px", borderRadius:8, background:ibanMsg.ok?"rgba(16,185,129,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(ibanMsg.ok?"rgba(16,185,129,0.2)":"rgba(248,113,113,0.2)"), color:ibanMsg.ok?"#10b981":"#f87171", fontSize:13, fontWeight:600, marginBottom:14 }}>{ibanMsg.msg}</div>}
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:mob?12:16 }}>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>IBAN</label>
            <input value={iban} onChange={function(e){setIban(e.target.value);setIbanMsg(null)}} placeholder="AE070331234567890123456" style={Object.assign({},inputStyle,{fontFamily:"monospace",fontSize:13})} />
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>Account Holder Name</label>
            <input value={ibanName} onChange={function(e){setIbanName(e.target.value);setIbanMsg(null)}} placeholder="Name as on bank account" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
          <Btn onClick={saveIban} disabled={ibanSaving} style={{ fontSize:12, padding:"10px 24px", opacity:ibanSaving?0.6:1 }}>{ibanSaving ? "Saving..." : "Save Payout Details"}</Btn>
        </div>
      </div>

      {/* Account info */}
      <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16, boxSizing:"border-box" }}>
        <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 12px", color:"#d4d4d8" }}>Account Details</h3>
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:mob?10:16 }}>
          <div style={{ padding:14, background:"rgba(255,255,255,0.03)", borderRadius:10, textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>MEMBER SINCE</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{u.joined || "—"}</div>
          </div>
          <div style={{ padding:14, background:"rgba(255,255,255,0.03)", borderRadius:10, textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>REFERRED BY</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{u.referredBy || "Direct"}</div>
          </div>
          <div style={{ padding:14, background:"rgba(255,255,255,0.03)", borderRadius:10, textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>SUBSCRIPTION</div>
            <div style={{ fontSize:13, fontWeight:600, color: u.status==="active"?"#10b981":"#f87171" }}>{u.status==="active"?"Active":"Inactive"}</div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16, boxSizing:"border-box" }}>
        <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 6px", color:"#d4d4d8" }}>Change Password</h3>
        <p style={{ fontSize:12, color:"#52525b", marginBottom:16 }}>Set a new password for your account. You will remain logged in on all devices.</p>
        {pwMsg && <div style={{ padding:"10px 14px", borderRadius:8, background:pwMsg.ok?"rgba(16,185,129,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(pwMsg.ok?"rgba(16,185,129,0.2)":"rgba(248,113,113,0.2)"), color:pwMsg.ok?"#10b981":"#f87171", fontSize:13, fontWeight:600, marginBottom:14 }}>{pwMsg.msg}</div>}
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:mob?12:16 }}>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>New Password</label>
            <PasswordInput value={newPw} onChange={function(e){setNewPw(e.target.value);setPwMsg(null)}} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>Confirm New Password</label>
            <PasswordInput value={confirmPw} onChange={function(e){setConfirmPw(e.target.value);setPwMsg(null)}} onKeyDown={function(e){if(e.key==="Enter") changePassword()}} placeholder="Repeat new password" />
          </div>
        </div>
        <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
          <Btn onClick={changePassword} disabled={pwSaving || !newPw || !confirmPw} style={{ fontSize:12, padding:"10px 24px", opacity:(pwSaving||!newPw||!confirmPw)?0.5:1 }}>{pwSaving ? "Updating..." : "Update Password"}</Btn>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(248,113,113,0.2)", boxSizing:"border-box" }}>
        <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 8px", color:"#f87171" }}>Danger Zone</h3>
        <p style={{ fontSize:12, color:"#71717a", marginBottom:16 }}>These actions are permanent and cannot be undone.</p>
        <div style={{ display:"flex", flexDirection:mob?"column":"row", gap:12 }}>
          <button onClick={function(){setShowCancel(true)}} style={{ padding:"10px 20px", borderRadius:8, border:"1px solid rgba(248,113,113,0.2)", background:"#131315", fontSize:12, fontWeight:600, color:"#f87171", cursor:"pointer" }}>{cancelled ? "Subscription Cancelled" : "Cancel Subscription"}</button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// USER PORTAL (Dashboard + LMS)
// ═════════════════════════════════════════

export default SettingsTab;
