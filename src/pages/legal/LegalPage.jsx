import { SiteNav, SiteFooter, Btn, Logo } from "../../components/Layout";
import { useIsMobile } from "../../components/UI";

function LegalPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var title = props.title;
  var children = props.children;
  return (
    <div style={{ background:"#000000", minHeight:"100vh" }}>
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 48px", background:"#0a0f0d", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <Logo onClick={function(){go("landing")}} />
        <div style={{ display:"flex", gap:20 }}>
          <span onClick={function(){go("login")}} style={{ fontSize:13, fontWeight:600, color:"rgb(0,228,193)", cursor:"pointer" }}>Log In</span>
          <Btn onClick={function(){go("subscribe")}} style={{ padding:"8px 18px", fontSize:12 }}>Subscribe</Btn>
        </div>
      </nav>
      <div style={{ maxWidth:800, margin:"0 auto", padding:mob?"24px 16px 60px":"48px 24px 80px" }}>
        <span onClick={function(){go("landing")}} style={{ fontSize:13, color:"rgb(0,228,193)", cursor:"pointer", fontWeight:600 }}>Home</span>
        <h1 style={{ fontSize:32, fontWeight:800, color:"#bdf9fc", margin:"20px 0 32px" }}>{title}</h1>
        <div style={{ background:"#0a0f0d", borderRadius:16, padding:mob?"20px 18px":"36px 40px", border:"1px solid rgba(255,255,255,0.06)", fontSize:mob?13:14, color:"#6ec9c4", lineHeight:1.9 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// TERMS OF SERVICE
// ═════════════════════════════════════════

export default LegalPage;
