import { Badge } from "../UI";
import { useState, useEffect } from "react";
import { Btn } from "../Layout";

function AdminTicketsTab(props) {
  var mob = props.mob;
  var flash = props.flash;
  var _tFilter = useState(""); var tFilter = _tFilter[0]; var setTFilter = _tFilter[1];
  var _tCatFilter = useState(""); var tCatFilter = _tCatFilter[0]; var setTCatFilter = _tCatFilter[1];
  var _tSelected = useState(null); var tSelected = _tSelected[0]; var setTSelected = _tSelected[1];
  var _tReply = useState(""); var tReply = _tReply[0]; var setTReply = _tReply[1];

  var DEMO_TICKETS = [];
  var filtered = DEMO_TICKETS.filter(function(t){
    if(tFilter && t.status !== tFilter) return false;
    if(tCatFilter && t.category !== tCatFilter) return false;
    return true;
  });
  var openCount = DEMO_TICKETS.filter(function(t){return t.status==="open"}).length;
  var ipCount = DEMO_TICKETS.filter(function(t){return t.status==="in_progress"}).length;

  return (
    <div style={{ maxWidth:"100%", overflow:"hidden" }}>
      <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:mob?10:0, marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>Support Tickets</h2>
          <p style={{ fontSize:13, color:"#71717a", marginTop:4 }}>{openCount+" open, "+ipCount+" in progress"}</p>
        </div>
      </div>
      {DEMO_TICKETS.length === 0 ? (
        <div style={{ padding:"48px 24px", textAlign:"center", background:"#111113", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:14, color:"#52525b" }}>No support tickets yet</div>
          <div style={{ fontSize:12, color:"#3f3f46", marginTop:8 }}>Tickets submitted by users will appear here</div>
        </div>
      ) : (
        <div style={{ background:"#111113", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              {["Ref","User","Subject","Status","Priority","Updated"].map(function(h){return <th key={h} style={{ padding:"10px 12px", fontSize:11, fontWeight:700, color:"#52525b", textAlign:"left", letterSpacing:1 }}>{h}</th>})}
            </tr></thead>
            <tbody>{filtered.map(function(t){ return (
              <tr key={t.id} onClick={function(){setTSelected(tSelected && tSelected.id===t.id ? null : t)}} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
                <td style={{ padding:"10px 12px", fontSize:12, color:"#52525b", fontFamily:"monospace" }}>{t.ref}</td>
                <td style={{ padding:"10px 12px", fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{t.user}</td>
                <td style={{ padding:"10px 12px", fontSize:13, color:"#a1a1aa", maxWidth:200 }}>{t.subject}</td>
                <td style={{ padding:"10px 12px" }}><Badge s={t.status}/></td>
                <td style={{ padding:"10px 12px" }}><Badge s={t.priority}/></td>
                <td style={{ padding:"10px 12px", fontSize:12, color:"#52525b" }}>{t.updated}</td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════
// ADMIN PANEL
// ═════════════════════════════════════════

export default AdminTicketsTab;
