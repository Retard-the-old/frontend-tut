import { useState } from "react";
import { Ico, FadeIn } from "../components/UI";
import { SiteNav, SiteFooter } from "../components/Layout";

function SupportPage(props) {
  var go = props.go;
  var _form = useState({name:"",email:"",category:"general",subject:"",message:""});
  var form = _form[0]; var setForm = _form[1];
  var _submitted = useState(false);
  var submitted = _submitted[0]; var setSubmitted = _submitted[1];
  var _ticket = useState("");
  var ticket = _ticket[0]; var setTicket = _ticket[1];

  function set(k,v) { setForm(function(p){var n=Object.assign({},p);n[k]=v;return n}); }
  function submit() {
    if (!form.name||!form.email||!form.subject||!form.message) return;
    setTicket("TK-" + Date.now().toString().slice(-6));
    setSubmitted(true);
  }

  return (
    <LegalPage go={go} title="Submit a Support Ticket">
      {submitted ? (
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="shield" size={48} color="rgb(200,180,140)" /></div>
          <h2 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>Ticket Submitted</h2>
          <p style={{ fontSize:15, color:"#71717a", marginBottom:8 }}>Your support ticket has been received.</p>
          <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:16, display:"inline-block", marginBottom:20, border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#52525b", marginBottom:4 }}>TICKET REFERENCE</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#d4d4d8", fontFamily:"monospace" }}>{ticket}</div>
          </div>
          <p style={{ fontSize:13, color:"#71717a", marginBottom:6 }}>A confirmation has been sent to <strong>{form.email}</strong>.</p>
          <p style={{ fontSize:13, color:"#71717a", marginBottom:24 }}>You can also reach us directly at <strong>support@tutorii.com</strong> and reference your ticket number.</p>
          <p style={{ fontSize:12, color:"#52525b" }}>Our team will respond within 24 hours during business hours (Sun-Thu 9AM-6PM GST).</p>
          <div style={{ marginTop:24 }}>
            <Btn onClick={function(){go("landing")}} outline style={{ fontSize:13 }}>Back to Home</Btn>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom:24 }}>Fill out the form below and our support team will get back to you within 24 hours. You can also email us directly at <strong>support@tutorii.com</strong>.</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16, alignItems:"stretch" }}>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Full Name *</label>
              <input value={form.name} onChange={function(e){set("name",e.target.value)}} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Email Address *</label>
              <input type="email" value={form.email} onChange={function(e){set("email",e.target.value)}} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Category</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[["general","General"],["billing","Billing & Payment"],["referrals","Referrals & Earnings"],["courses","Courses & Content"],["technical","Technical Issue"],["account","Account"]].map(function(c){ return (
                <button key={c[0]} onClick={function(){set("category",c[0])}} style={{ padding:"8px 14px", borderRadius:8, border:"2px solid "+(form.category===c[0]?"rgb(200,180,140)":"#27272a"), background:form.category===c[0]?"rgba(200,180,140,0.1)":"transparent", fontSize:12, fontWeight:600, color:form.category===c[0]?"rgb(200,180,140)":"#71717a", cursor:"pointer" }}>{c[1]}</button>
              )})}
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Subject *</label>
            <input value={form.subject} onChange={function(e){set("subject",e.target.value)}} placeholder="Brief description of your issue" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Message *</label>
            <textarea value={form.message} onChange={function(e){set("message",e.target.value)}} rows={6} placeholder="Please describe your issue in detail. Include any relevant information such as dates, amounts, or error messages." style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
          </div>

          <Btn onClick={submit} full style={{ padding:"14px", fontSize:15, borderRadius:12 }}>Submit Ticket</Btn>

          <div style={{ marginTop:20, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize:12, color:"#52525b", margin:0 }}>Prefer email? Send your enquiry directly to <strong style={{ color:"rgb(200,180,140)" }}>support@tutorii.com</strong>. Our team is available Sunday through Thursday, 9AM to 6PM GST.</p>
          </div>
        </div>
      )}
    </LegalPage>
  );
}

// ═════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════
// ═════════════════════════════════════════
// URL ROUTING HELPERS
// ═════════════════════════════════════════
var PAGE_TO_PATH = {
  landing: "/",
  howItWorks: "/how-it-works",
  curriculum: "/curriculum",
  faq: "/faq",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  subscribe: "/subscribe",
  userPortal: "/portal",
  adminLogin: "/admin-login",
  adminPanel: "/admin",
  terms: "/terms",
  privacy: "/privacy",
  contact: "/contact",
  support: "/support",
};
var PATH_TO_PAGE = {};
Object.keys(PAGE_TO_PATH).forEach(function(k){ PATH_TO_PAGE[PAGE_TO_PATH[k]] = k; });


export default SupportPage;
