import { useState } from "react";
import { Ico, FadeIn } from "../components/UI";
import { SiteNav, SiteFooter } from "../components/Layout";
import LegalPage from "./legal/LegalPage";

function ContactPage(props) {
  var go = props.go;
  return (
    <LegalPage go={go} title="Contact Us">
      <p style={{ marginBottom:28, fontSize:15, color:"#a1a1aa" }}>We are here to help. Reach out to us through any of the channels below.</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:32 }}>
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:24, border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom:10, lineHeight:0 }}><Ico name="chat" size={24} color="rgb(200,180,140)" /></div>
          <h3 style={{ fontSize:16, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>General Support</h3>
          <p style={{ fontSize:13, color:"#71717a", marginBottom:8 }}>For account help, billing questions, technical issues, and general enquiries.</p>
          <a style={{ fontSize:14, fontWeight:700, color:"rgb(200,180,140)", textDecoration:"none" }}>support@tutorii.com</a>
          <p style={{ fontSize:11, color:"#52525b", marginTop:6 }}>Response time: Within 24 hours</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:24, border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom:10, lineHeight:0 }}><Ico name="book" size={24} color="rgb(200,180,140)" /></div>
          <h3 style={{ fontSize:16, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Complaints</h3>
          <p style={{ fontSize:13, color:"#71717a", marginBottom:8 }}>For formal complaints that require escalation or investigation.</p>
          <a style={{ fontSize:14, fontWeight:700, color:"rgb(200,180,140)", textDecoration:"none" }}>complaints@tutorii.com</a>
          <p style={{ fontSize:11, color:"#52525b", marginTop:6 }}>Acknowledged within 24hrs, resolved within 48hrs</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:24, border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom:10, lineHeight:0 }}><Ico name="users" size={24} color="rgb(200,180,140)" /></div>
          <h3 style={{ fontSize:16, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Partnerships</h3>
          <p style={{ fontSize:13, color:"#71717a", marginBottom:8 }}>For business partnerships, ambassador programs, and collaboration proposals.</p>
          <a style={{ fontSize:14, fontWeight:700, color:"rgb(200,180,140)", textDecoration:"none" }}>partnerships@tutorii.com</a>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:24, border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom:10, lineHeight:0 }}><Ico name="lightbulb" size={24} color="rgb(200,180,140)" /></div>
          <h3 style={{ fontSize:16, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Feedback & Content</h3>
          <p style={{ fontSize:13, color:"#71717a", marginBottom:8 }}>Suggest new courses, report content issues, or share ideas for improvement.</p>
          <a style={{ fontSize:14, fontWeight:700, color:"rgb(200,180,140)", textDecoration:"none" }}>feedback@tutorii.com</a>
        </div>
      </div>

      <div style={{ background:"rgba(200,180,140,0.06)", borderRadius:12, padding:24, border:"1px solid rgba(200,180,140,0.15)" }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Business Hours</h3>
        <p style={{ fontSize:14, color:"#71717a", margin:0 }}>Our support team is available <strong>Sunday through Thursday, 9:00 AM to 6:00 PM GST</strong> (Gulf Standard Time, UTC+4). Emails received outside business hours will be responded to on the next business day.</p>
      </div>
    </LegalPage>
  );
}

// ═════════════════════════════════════════
// SUPPORT / TICKET SUBMISSION
// ═════════════════════════════════════════

export default ContactPage;
