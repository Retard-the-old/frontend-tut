import { useState } from "react";
import { admin as adminApi } from "../api";
import { Btn } from "./Layout";

function LessonEditPanel(props) {
  var lesson = props.lesson;
  var _title = useState(lesson.title||""); var title = _title[0]; var setTitle = _title[1];
  var _dur = useState((lesson.dur||"10 min").replace(" min","")); var dur = _dur[0]; var setDur = _dur[1];
  var _pdfUrl = useState(lesson.video_url||""); var pdfUrl = _pdfUrl[0]; var setPdfUrl = _pdfUrl[1];
  var _notes = useState(lesson.notes||""); var notes = _notes[0]; var setNotes = _notes[1];
  var inputStyle = { width:"100%", padding:"8px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.1)", background:"#131315", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
  return (
    <div style={{ padding:"16px 20px 16px 56px", background:"rgba(200,180,140,0.04)", borderBottom:"1px solid rgba(255,255,255,0.04)", borderTop:"1px solid rgba(200,180,140,0.08)" }}>
      <div style={{ fontSize:11, fontWeight:700, color:"rgb(200,180,140)", letterSpacing:0.8, marginBottom:12, textTransform:"uppercase" }}>Edit Lesson</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:8, marginBottom:8 }}>
        <input value={title} onChange={function(e){setTitle(e.target.value)}} placeholder="Lesson title" style={inputStyle} />
        <input value={dur} onChange={function(e){setDur(e.target.value)}} placeholder="Mins" style={Object.assign({},inputStyle,{width:"100%"})} />
      </div>
      <div style={{ marginBottom:8 }}>
        <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>PDF URL</label>
        <input value={pdfUrl} onChange={function(e){setPdfUrl(e.target.value)}} placeholder="https://drive.google.com/file/d/FILE_ID/preview" style={inputStyle} />
        {pdfUrl && <div style={{ fontSize:10, color:"#10b981", marginTop:4 }}>✓ PDF URL set</div>}
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>LESSON NOTES</label>
        <textarea value={notes} onChange={function(e){setNotes(e.target.value)}} placeholder="Notes or description shown to students" rows={3} style={Object.assign({},inputStyle,{resize:"vertical"})} />
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <button onClick={props.onClose} style={{ padding:"7px 14px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
        <button onClick={function(){ props.onSave({ title:title.trim(), duration_minutes:parseInt(dur)||10, video_url:pdfUrl.trim()||null, content_md:notes.trim()||null }); }} style={{ padding:"7px 18px", borderRadius:6, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:12, fontWeight:600, cursor:"pointer" }}>Save</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// SETTINGS TAB
// ═════════════════════════════════════════

export default LessonEditPanel;
