import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { courses as coursesApi } from "./api";
import { CursorGlow, FloatingParticles } from "./components/UI";

import Landing from "./pages/Landing";
import HowItWorksPage from "./pages/HowItWorksPage";
import CurriculumPage from "./pages/CurriculumPage";
import FaqPage from "./pages/FaqPage";
import Subscribe from "./pages/Subscribe";
import ContactPage from "./pages/ContactPage";
import SupportPage from "./pages/SupportPage";

import UserLogin from "./pages/auth/UserLogin";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import UserPortal from "./pages/UserPortal";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";

import LegalPage from "./pages/legal/LegalPage";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPage from "./pages/legal/PrivacyPage";

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

function getInitialPage() {
  var path = window.location.pathname;
  // Handle /ref/:code
  var refMatch = path.match(/^\/ref\/(.+)$/);
  if (refMatch) return { page: "subscribe", refCode: refMatch[1] };
  // Handle /portal/* and /admin/*
  if (path.startsWith("/portal")) return { page: "userPortal", refCode: "" };
  if (path.startsWith("/admin") && path !== "/admin-login") return { page: "adminPanel", refCode: "" };
  return { page: PATH_TO_PAGE[path] || "landing", refCode: "" };
}

function TutoriiApp() {
  var initial = getInitialPage();
  var _page = useState(initial.page);
  var page = _page[0]; var setPage = _page[1];
  var _refCode = useState(initial.refCode); var refCode = _refCode[0]; var setRefCode = _refCode[1];

  var go = function(p, ref) {
    setPage(p);
    if (ref) setRefCode(ref);
    var path = p === "userPortal" ? "/portal/overview" : (PAGE_TO_PATH[p] || "/");
    window.history.pushState({page: p}, "", path);
    window.scrollTo(0, 0);
  };

  // Handle browser back/forward buttons
  useEffect(function() {
    function onPop(e) {
      var path = window.location.pathname;
      var refMatch = path.match(/^\/ref\/(.+)$/);
      if (refMatch) { setPage("subscribe"); setRefCode(refMatch[1]); }
      else { setPage(PATH_TO_PAGE[path] || "landing"); }
    }
    window.addEventListener("popstate", onPop);
    return function() { window.removeEventListener("popstate", onPop); };
  }, []);
  var _courses = useState([]);
  var courses = _courses[0]; var setCourses = _courses[1];

  useEffect(function(){
    coursesApi.list().then(function(list){
      if (Array.isArray(list) && list.length > 0) {
        setCourses(list.map(function(c){ return { id:c.id, module:c.title, icon:c.category||"book", lessons:[] }; }));
      }
    }).catch(function(err){
      console.error("Failed to preload courses:", err && err.message ? err.message : err);
    });
  }, []);
  var _chatOpen = useState(false); var chatOpen = _chatOpen[0]; var setChatOpen = _chatOpen[1];
  var _chatMinimized = useState(false); var chatMinimized = _chatMinimized[0]; var setChatMinimized = _chatMinimized[1];
  var { user: authUser, loading: authLoading } = useAuth();
  var firstName = authUser && authUser.full_name ? authUser.full_name.split(" ")[0] : "there";
  var _chatMsgs = useState([{role:"assistant",content:"Hi "+firstName+"! I'm your Tutorii support assistant. I have access to your account details, referrals, earnings, and course progress. How can I help you today?"}]);
  var chatMsgs = _chatMsgs[0]; var setChatMsgs = _chatMsgs[1];
  var _chatInput = useState(""); var chatInput = _chatInput[0]; var setChatInput = _chatInput[1];
  var _chatLoading = useState(false); var chatLoading = _chatLoading[0]; var setChatLoading = _chatLoading[1];

  // Don't render portal pages until auth is restored from localStorage
  return (
    <div style={{ fontFamily:"'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'); * { box-sizing:border-box; margin:0; } body { margin:0; font-family:'Plus Jakarta Sans',sans-serif; -webkit-font-smoothing:antialiased; background:#0a0a0c; } h1,h2,h3,h4 { font-family:'DM Sans',sans-serif; } button { font-family:'Plus Jakarta Sans',sans-serif; } input { font-family:'Plus Jakarta Sans',sans-serif; } textarea { font-family:'Plus Jakarta Sans',sans-serif; } ::selection { background:rgba(200,180,140,0.2); } @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } } @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } } @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } } @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } } @keyframes glowPulse { 0%,100% { box-shadow:0 4px 20px rgba(59,156,196,0.3); } 50% { box-shadow:0 4px 32px rgba(59,156,196,0.5); } } @keyframes driftOrb { 0% { transform:translate(-50%,-50%) scale(1); } 50% { transform:translate(-48%,-52%) scale(1.04); } 100% { transform:translate(-50%,-50%) scale(1); } } @keyframes driftOrb2 { 0% { transform:translate(-50%,-50%) scale(1.05); } 50% { transform:translate(-52%,-48%) scale(0.97); } 100% { transform:translate(-50%,-50%) scale(1.05); } } @keyframes floatUp { 0% { transform:translateY(0); opacity:0.04; } 50% { opacity:0.07; } 100% { transform:translateY(-40px); opacity:0.04; } } .fade-up { animation:fadeUp 0.7s ease-out both; } .fade-up-d1 { animation:fadeUp 0.7s ease-out 0.1s both; } .fade-up-d2 { animation:fadeUp 0.7s ease-out 0.2s both; } .fade-up-d3 { animation:fadeUp 0.7s ease-out 0.3s both; } .fade-up-d4 { animation:fadeUp 0.7s ease-out 0.4s both; } .fade-in { animation:fadeIn 0.6s ease-out both; } .scale-in { animation:scaleIn 0.5s ease-out both; } .cta-glow { animation:glowPulse 2.5s ease-in-out infinite; } @media(max-width:768px) { nav[style] { padding:12px 16px !important; } section { padding-left:16px !important; padding-right:16px !important; } }  @keyframes floatParticle { 0% { transform:translateY(0) translateX(0); opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { transform:translateY(-100vh) translateX(20px); opacity:0; } } @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } } @keyframes travelDot { 0% { top:0%; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { top:100%; opacity:0; } } @keyframes pulseGlow { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } } @keyframes spin { to { transform:rotate(360deg); } }"}</style>
      {page === "landing" && <><CursorGlow /><FloatingParticles /><Landing go={go} /></>}
      {page === "howItWorks" && <><CursorGlow /><FloatingParticles /><HowItWorksPage go={go} /></>}
      {page === "curriculum" && <><CursorGlow /><FloatingParticles /><CurriculumPage go={go} /></>}
      {page === "faq" && <><CursorGlow /><FloatingParticles /><FaqPage go={go} /></>}
      {page === "login" && <UserLogin go={go} />}
      {page === "forgotPassword" && <ForgotPasswordPage go={go} />}
      {page === "resetPassword" && <ResetPasswordPage go={go} />}
      {page === "subscribe" && <Subscribe go={go} refCode={refCode} />}
      {authLoading && (page === "login" || page === "subscribe") && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:9999, animation:"fadeUp 0.3s ease-out both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 18px", borderRadius:12, background:"#111113", border:"1px solid rgba(200,180,140,0.2)", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
            <div style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(200,180,140,0.3)", borderTopColor:"rgb(200,180,140)", animation:"spin 0.8s linear infinite" }} />
            <span style={{ fontSize:12, color:"#a1a1aa", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Restoring session...</span>
          </div>
        </div>
      )}
      {page === "userPortal" && !authLoading && <UserPortal go={go} courses={courses} setCourses={setCourses} chatOpen={chatOpen} setChatOpen={setChatOpen} chatMinimized={chatMinimized} setChatMinimized={setChatMinimized} chatMsgs={chatMsgs} setChatMsgs={setChatMsgs} chatInput={chatInput} setChatInput={setChatInput} chatLoading={chatLoading} setChatLoading={setChatLoading} />}
      {page === "adminLogin" && <AdminLogin go={go} />}
      {page === "adminPanel" && <AdminPanel go={go} courses={courses} setCourses={setCourses} />}
      {page === "terms" && <TermsPage go={go} />}
      {page === "privacy" && <PrivacyPage go={go} />}
      {page === "contact" && <ContactPage go={go} />}
      {page === "support" && <SupportPage go={go} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TutoriiApp />
    </AuthProvider>
  );
}

