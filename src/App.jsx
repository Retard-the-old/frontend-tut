import { useState, useEffect, useRef } from "react";
import { useAuth, AuthProvider } from "./AuthContext";
import { users as usersApi, subscriptions as subscriptionsApi, courses as coursesApi, chat as chatApi, payouts as payoutsApi, admin as adminApi } from "./api";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PRICE = 95;
const L1_RATE = 0.40;
const L2_RATE = 0.05;

const INIT_COURSES = [
  { id: "c1", module: "Life in the UAE", icon: "mosque", lessons: [
    { id: "l1", title: "Understanding UAE Culture & Customs", dur: "12 min", done: true },
    { id: "l2", title: "Navigating Government Systems", dur: "18 min", done: true },
    { id: "l3", title: "Healthcare & Insurance Guide", dur: "14 min", done: false },
    { id: "l4", title: "Housing & Accommodation Tips", dur: "10 min", done: false },
  ]},
  { id: "c2", module: "Workers Rights & Legal", icon: "scale", lessons: [
    { id: "l5", title: "Know Your Employment Rights", dur: "20 min", done: true },
    { id: "l6", title: "Handling Workplace Disputes", dur: "16 min", done: false },
    { id: "l7", title: "Visa Rules & Regulations", dur: "22 min", done: false },
    { id: "l8", title: "Legal Resources & Help", dur: "8 min", done: false },
  ]},
  { id: "c3", module: "Job Search & Career", icon: "briefcase", lessons: [
    { id: "l9", title: "Building a Winning CV", dur: "15 min", done: false },
    { id: "l10", title: "Interview Masterclass", dur: "25 min", done: false },
    { id: "l11", title: "Top Job Portals", dur: "12 min", done: false },
    { id: "l12", title: "Networking in the Gulf", dur: "10 min", done: false },
  ]},
  { id: "c4", module: "Financial Literacy", icon: "dollar", lessons: [
    { id: "l13", title: "Budgeting on Any Salary", dur: "14 min", done: false },
    { id: "l14", title: "Remittance Options", dur: "11 min", done: false },
    { id: "l15", title: "Avoiding Debt Traps", dur: "16 min", done: false },
    { id: "l16", title: "Saving & Investment Basics", dur: "18 min", done: false },
  ]},
  { id: "c5", module: "Entrepreneurship", icon: "rocket", lessons: [
    { id: "l17", title: "The Entrepreneurial Mindset", dur: "13 min", done: false },
    { id: "l18", title: "Side Hustles in the UAE", dur: "20 min", done: false },
    { id: "l19", title: "Freelancing & Online Income", dur: "17 min", done: false },
    { id: "l20", title: "Scaling Your Referral Business", dur: "15 min", done: false },
  ]},
];

const USER = {
  name: "Aisha Khan", email: "aisha@example.com", code: "AISHA22", avatar: "AK",
  phone: "+971 55 123 4567",
  joined: "Jan 28, 2026",
  status: "active",
  plan: "AED 95/month",
  nextBilling: "Mar 28, 2026",
  paymentMethod: "Visa ending 6411",
  referredBy: "David Chen (DAVID2026)",
  iban: "AE07 0331 2345 6789 0123 457",
  lastLogin: "Mar 3, 2026, 10:42 AM GST",
  l1: [
    { name: "Priya Sharma", date: "Feb 5", status: "active", earned: 228 },
    { name: "Marco Santos", date: "Feb 10", status: "active", earned: 190 },
    { name: "Sara Ahmed", date: "Feb 14", status: "active", earned: 152 },
    { name: "Raj Patel", date: "Feb 18", status: "active", earned: 114 },
    { name: "Lina Gomez", date: "Feb 22", status: "active", earned: 76 },
    { name: "Omar Hassan", date: "Feb 25", status: "cancelled", earned: 38 },
    { name: "Nina Costa", date: "Feb 27", status: "active", earned: 38 },
    { name: "Ali Raza", date: "Mar 1", status: "active", earned: 0 },
  ],
  l2: [
    { name: "Jin Park", from: "Priya Sharma", date: "Feb 15", earned: 14.25 },
    { name: "Yuki Tanaka", from: "Priya Sharma", date: "Feb 20", earned: 9.50 },
    { name: "Leo Morales", from: "Marco Santos", date: "Feb 22", earned: 9.50 },
    { name: "Ava Smith", from: "Sara Ahmed", date: "Feb 26", earned: 4.75 },
  ],
  earn: { total: 2508, month: 456, pending: 456, paid: 2052 },
  payouts: [
    { date: "Feb 25", amount: 612, status: "completed", method: "Bank transfer to AE07...457" },
    { date: "Feb 18", amount: 496, status: "completed", method: "Bank transfer to AE07...457" },
    { date: "Feb 11", amount: 472, status: "completed", method: "Bank transfer to AE07...457" },
    { date: "Feb 4", amount: 472, status: "completed", method: "Bank transfer to AE07...457" },
  ],
  billing: [
    { date: "Feb 28, 2026", amount: 95, status: "paid", method: "Visa ending 6411" },
    { date: "Jan 28, 2026", amount: 95, status: "paid", method: "Visa ending 6411" },
  ],
  earningsHistory: [
    {week:"Oct 7",l1:0,l2:0,net:-95},
    {week:"Oct 14",l1:0,l2:0,net:-95},
    {week:"Oct 21",l1:38,l2:0,net:-57},
    {week:"Oct 28",l1:38,l2:0,net:-57},
    {week:"Nov 4",l1:76,l2:0,net:-19},
    {week:"Nov 11",l1:76,l2:0,net:-19},
    {week:"Nov 18",l1:114,l2:0,net:19},
    {week:"Nov 25",l1:114,l2:4.75,net:23.75},
    {week:"Dec 2",l1:152,l2:4.75,net:61.75},
    {week:"Dec 9",l1:152,l2:4.75,net:61.75},
    {week:"Dec 16",l1:190,l2:4.75,net:99.75},
    {week:"Dec 23",l1:190,l2:9.50,net:104.50},
    {week:"Dec 30",l1:190,l2:9.50,net:104.50},
    {week:"Jan 6",l1:228,l2:9.50,net:147.25},
    {week:"Jan 13",l1:228,l2:9.50,net:147.25},
    {week:"Jan 20",l1:228,l2:14.25,net:147.25},
    {week:"Jan 28",l1:228,l2:14.25,net:147.25},
    {week:"Feb 4",l1:266,l2:14.25,net:185.25},
    {week:"Feb 11",l1:266,l2:14.25,net:185.25},
    {week:"Feb 18",l1:266,l2:19,net:190},
    {week:"Feb 25",l1:266,l2:19,net:190},
    {week:"Mar 1",l1:266,l2:19,net:190},
  ],
};

const adminUsers = [
  { name: "David Chen", email: "david@tutorii.com", code: "DAVID2026", l1: 12, l2: 34, earned: 4056, pending: 749, status: "active", joined: "Oct 2, 2025", referrer: null, l1Names: ["Aisha Khan","Carlos Reyes","Priya Sharma","Maria Lopez","James Tan","Ravi Patel","Nina Gomez","Sara Al-M.","Tom Nguyen","Leo Park","Hana Ito","Yuki Sato"], l2Names: [{ref:"Aisha Khan",subs:["Fatima Al-R.","Omar Hassan","Lina Choi","Yara Farouk","Sam Rivera","Dana Malik","Noor Abbas","Khalid Zain","Reem Haddad","Layla Youssef","Tariq Nasser","Sami Khoury","Huda Salem","Jamal Othman","Rania Bishara"]},{ref:"Carlos Reyes",subs:["Pedro Santos","Ana Diaz","Luis Moreno","Marta Silva","Diego Ruiz","Rosa Vega","Ivan Cruz","Elena Rojas"]},{ref:"Maria Lopez",subs:["Sofia Herrera","Pablo Mendez","Carmen Torres","Lucia Flores","Marco Paz","Isla Reyes"]}] },
  { name: "Aisha Khan", email: "aisha@example.com", code: "AISHA22", l1: 8, l2: 15, earned: 2508, pending: 456, status: "active", joined: "Oct 14, 2025", referrer: "David Chen", l1Names: ["Fatima Al-R.","Omar Hassan","Lina Choi","Yara Farouk","Sam Rivera","Dana Malik","Noor Abbas","Khalid Zain"], l2Names: [{ref:"Omar Hassan",subs:["Ali Mansoor","Zara Begum","Imran Shah"]},{ref:"Lina Choi",subs:["Jin Park","Hye Kim","Soo Lee"]},{ref:"Yara Farouk",subs:["Mona Saleh","Dina Aziz","Rami Hanna","Fadi Issa","Nadia Karam","Tala Bishara"]},{ref:"Dana Malik",subs:["Samir Jaber","Leen Awad","Rasha Nasr"]}] },
  { name: "Carlos Reyes", email: "carlos@example.com", code: "CARLOS01", l1: 5, l2: 8, earned: 1430, pending: 304, status: "active", joined: "Nov 3, 2025", referrer: "David Chen", l1Names: ["Pedro Santos","Ana Diaz","Luis Moreno","Marta Silva","Diego Ruiz"], l2Names: [{ref:"Pedro Santos",subs:["Bruno Costa","Clara Lima"]},{ref:"Ana Diaz",subs:["Victor Paz","Gloria Herrera","Oscar Mendez"]},{ref:"Luis Moreno",subs:["Andres Vega","Camila Cruz","Felipe Rojas"]}] },
  { name: "Priya Sharma", email: "priya@example.com", code: "PRIYA05", l1: 3, l2: 2, earned: 684, pending: 228, status: "active", joined: "Nov 22, 2025", referrer: "David Chen", l1Names: ["Raj Patel","Meera Iyer","Vikram Singh"], l2Names: [{ref:"Raj Patel",subs:["Anita Gupta","Deepak Nair"]}] },
  { name: "Fatima Al-R.", email: "fatima@example.com", code: "FATIMA12", l1: 0, l2: 0, earned: 0, pending: 0, status: "inactive", joined: "Dec 5, 2025", referrer: "Aisha Khan", l1Names: [], l2Names: [] },
  { name: "Maria Lopez", email: "maria@example.com", code: "MARIA18", l1: 4, l2: 6, earned: 1031, pending: 267, status: "active", joined: "Nov 10, 2025", referrer: "David Chen", l1Names: ["Sofia Herrera","Pablo Mendez","Carmen Torres","Lucia Flores"], l2Names: [{ref:"Sofia Herrera",subs:["Eva Molina","Hugo Blanco"]},{ref:"Pablo Mendez",subs:["Isabel Cruz","Mateo Rios"]},{ref:"Carmen Torres",subs:["Rosa Vidal","Nico Pena"]}] },
];

const INIT_PAYOUTS = [
  { id: "P1", user: "David Chen", amount: 749, iban: "AE07...3456", status: "completed", date: "Feb 25" },
  { id: "P2", user: "Aisha Khan", amount: 456, iban: "AE07...3457", status: "processing", date: "Feb 28" },
  { id: "P3", user: "Carlos Reyes", amount: 304, iban: "AE07...3458", status: "queued", date: "Mar 1" },
  { id: "P4", user: "Maria Lopez", amount: 267, iban: "AE07...3462", status: "queued", date: "Mar 1" },
];

var GROWTH_DATA = [
  {date:"Feb 1",users:38,active:32,cancelled:6,signups:3,revenue:3040,commissions:1216,payouts:950,profit:1824},
  {date:"Feb 3",users:41,active:35,cancelled:6,signups:3,revenue:3325,commissions:1330,payouts:1054,profit:1995},
  {date:"Feb 5",users:44,active:38,cancelled:6,signups:3,revenue:3610,commissions:1444,payouts:1177,profit:2166},
  {date:"Feb 7",users:46,active:39,cancelled:7,signups:2,revenue:3705,commissions:1482,payouts:1237,profit:2223},
  {date:"Feb 9",users:49,active:42,cancelled:7,signups:3,revenue:3990,commissions:1596,payouts:1343,profit:2394},
  {date:"Feb 11",users:53,active:45,cancelled:8,signups:4,revenue:4275,commissions:1710,payouts:1484,profit:2565},
  {date:"Feb 13",users:56,active:47,cancelled:9,signups:3,revenue:4465,commissions:1786,payouts:1591,profit:2679},
  {date:"Feb 15",users:60,active:51,cancelled:9,signups:4,revenue:4845,commissions:1938,payouts:1723,profit:2907},
  {date:"Feb 17",users:63,active:53,cancelled:10,signups:3,revenue:5035,commissions:2014,payouts:1844,profit:3021},
  {date:"Feb 19",users:67,active:57,cancelled:10,signups:4,revenue:5415,commissions:2166,payouts:1976,profit:3249},
  {date:"Feb 21",users:71,active:60,cancelled:11,signups:4,revenue:5700,commissions:2280,payouts:2099,profit:3420},
  {date:"Feb 23",users:74,active:62,cancelled:12,signups:3,revenue:5890,commissions:2356,payouts:2202,profit:3534},
  {date:"Feb 25",users:78,active:66,cancelled:12,signups:4,revenue:6270,commissions:2508,payouts:2342,profit:3762},
  {date:"Feb 27",users:82,active:69,cancelled:13,signups:4,revenue:6555,commissions:2622,payouts:2469,profit:3933},
  {date:"Mar 1",users:86,active:72,cancelled:14,signups:4,revenue:6840,commissions:2736,payouts:2586,profit:4104},
];

var REFERRAL_LEADERS = [
  {name:"David Chen",l1:12,l2:34,total:46,earned:4056,conv:78},
  {name:"Aisha Khan",l1:8,l2:15,total:23,earned:2508,conv:72},
  {name:"Carlos Reyes",l1:5,l2:8,total:13,earned:1430,conv:65},
  {name:"Maria Lopez",l1:4,l2:6,total:10,earned:1031,conv:80},
  {name:"Priya Sharma",l1:3,l2:2,total:5,earned:684,conv:60},
];

var NETWORK_PIE = [
  {name:"Level 1 Direct",value:36,color:"#d4d4d8"},
  {name:"Level 2 Indirect",value:65,color:"#a78bfa"},
  {name:"No Referrer",value:21,color:"#a1a1aa"},
];

var CHURN_DATA = [
  {month:"Oct",rate:8.2},{month:"Nov",rate:9.1},{month:"Dec",rate:7.5},{month:"Jan",rate:6.8},{month:"Feb",rate:5.4},{month:"Mar",rate:4.9},
];

var MONTHLY_PAYOUTS = [
  {month:"Oct",amount:3926},{month:"Nov",amount:5506},{month:"Dec",amount:7086},{month:"Jan",amount:9048},{month:"Feb",amount:11203},{month:"Mar",amount:2586},
];

// ─── MOBILE DETECTION HOOK ───
function useIsMobile(breakpoint) {
  var bp = breakpoint || 768;
  var _w = useState(1024);
  var w = _w[0]; var setW = _w[1];
  useEffect(function(){
    setW(window.innerWidth);
    function onResize(){ setW(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return function(){ window.removeEventListener("resize", onResize); };
  }, []);
  return w < bp;
}

// ─── SHARED UI ───
function Badge(props) {
  var s = props.s;
  var colors = { active:["rgba(200,180,140,0.1)","rgb(200,180,140)"], completed:["rgba(200,180,140,0.1)","rgb(200,180,140)"], processing:["rgba(251,191,36,0.1)","#fbbf24"], pending:["rgba(251,191,36,0.1)","#fbbf24"], queued:["rgba(167,139,250,0.1)","#a78bfa"], cancelled:["rgba(248,113,113,0.1)","#f87171"], inactive:["rgba(255,255,255,0.04)","#71717a"], failed:["rgba(248,113,113,0.1)","#f87171"] };
  var v = colors[s] || colors.pending;
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:0.3, textTransform:"uppercase", background:v[0], color:v[1] }}>{s}</span>;
}

function StatCard(props) {
  var mob = useIsMobile();
  var icon = props.icon;
  var label = props.label;
  var value = props.value;
  var sub = props.sub;
  return (
    <div style={{ background:"linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)", borderRadius:14, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"flex-start", gap:14, height:"100%", minHeight:76, overflow:"hidden", minWidth:0 }}>
      <div style={{ width:38, height:38, borderRadius:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0, flexShrink:0, marginTop:2 }}><Ico name={icon} size={16} color="rgb(200,180,140)" /></div>
      <div style={{ display:"flex", flexDirection:"column", minHeight:44 }}>
        <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, color:"#52525b", lineHeight:1.2, height:12, overflow:"hidden" }}>{label}</div>
        <div style={{ fontSize:mob?16:20, fontWeight:500, color:"#d4d4d8", lineHeight:1.2, marginTop:4 }}>{value}</div>
        {sub ? <div style={{ fontSize:10, color:"#52525b", marginTop:2 }}>{sub}</div> : null}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// SVG ICON SYSTEM — SINGLE-COLOR ELEGANT ICONS
// ═══════════════════════════════════════════════
function Ico(props) {
  var s = props.size || 20;
  var c = props.color || "rgb(200,180,140)";
  var paths = {
    shield: "M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4zm0 2.18L6 7.09v4.91c0 4.18 2.72 8.08 6 9.73 3.28-1.65 6-5.55 6-9.73V7.09L12 4.18z",
    chart: "M3 3v18h18v-2H5V3H3zm14 4l-4 4-3-3-4 4v2.5l4-4 3 3 4-4V7z",
    rocket: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    book: "M21 4H3v16h18V4zm-2 14H5V6h14v12zM7 8h10v2H7V8zm0 4h7v2H7v-2z",
    link: "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 17h4v-2H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5zm1-6h8v2H8v-2z",
    dollar: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18h-2v1.93C7.06 19.43 4 16.07 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8c0 4.07-3.06 7.43-7 7.93zM13 9h-2v2h2V9zm0 4h-2v2h2v-2z",
    bank: "M4 10h3v7H4v-7zm6 0h3v7h-3v-7zm8-4L12 2 6 6H2v2h20V6h-4zm-6-1.5L16.55 6H7.45L12 4.5zM2 19v2h20v-2H2zm14-9h3v7h-3v-7z",
    chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z",
    phone: "M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h8a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0015.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z",
    refresh: "M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
    sparkle: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z",
    lightbulb: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
    gear: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z",
    target: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
    globe: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2 0V4.07c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93z",
    bot: "M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z",
    question: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
    wallet: "M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    lock: "M19 11H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm0 9H5v-7h14v7zm-7-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm3-10V5c0-1.66-1.34-3-3-3S9 3.34 9 5v2H7v-2c0-2.76 2.24-5 5-5s5 2.24 5 5v2h-2z",
    briefcase: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    mosque: "M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.83L18.17 11H5.83L12 4.83z",
    scale: "M12 2L4 7v4h16V7l-8-5zm0 2.53L17.74 8H6.26L12 4.53zM4 13v2h16v-2H4zm0 4v4h16v-4H4zm2 2h3v-2H6v2zm5 0h2v-2h-2v2zm5 0h2v-2h-2v2z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  };
  var d = paths[props.name] || paths.sparkle;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", filter:"drop-shadow(0 2px 4px rgba(255,255,255,0.06)) drop-shadow(0 0 8px rgba(200,180,140,0.18))" }}>
      <path d={d} fill={c} fillOpacity="0.85" />
    </svg>
  );
}

// ═══════════════════════════════════════════════
// AMBIENT VISUAL ELEMENTS
// ═══════════════════════════════════════════════

// Subtle SVG wave divider between sections
function WaveDivider(props) {
  var flip = props.flip;
  var opacity = props.opacity || 0.09;
  return (
    <div style={{ position:"absolute", left:0, right:0, height:120, overflow:"hidden", pointerEvents:"none", top:flip?"auto":0, bottom:flip?0:"auto", transform:flip?"scaleY(-1)":"none" }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width:"100%", height:"100%", display:"block" }}>
        <path d="M0,80 C320,100 560,60 720,70 C880,80 1120,55 1440,75 L1440,120 L0,120 Z" fill={"rgba(255,255,255,"+opacity+")"} />
        <path d="M0,90 C400,70 700,95 1000,75 C1200,65 1360,85 1440,90 L1440,120 L0,120 Z" fill={"rgba(255,255,255,"+(opacity*0.5)+")"} />
      </svg>
    </div>
  );
}

// Background vector illustrations — subtle architectural/thematic outlines
function BgIllustration(props) {
  var op = props.opacity || 0.04;
  var pos = props.position || "right";
  var xPos = pos === "left" ? "8%" : pos === "center" ? "50%" : "85%";
  var yPos = props.y || "50%";
  var sc = props.scale || 1;
  var illustrations = {
    skyline: "M120,380 L120,180 L125,180 L125,100 L128,60 L130,20 L132,60 L135,100 L135,180 L140,180 L140,380 M160,380 L160,240 L170,220 L180,240 L180,380 M200,380 L200,200 L205,195 L210,200 L215,195 L220,200 L220,380 M240,380 L240,260 L260,240 L280,260 L280,380 M300,380 L300,220 L305,210 L310,220 L310,380 M320,380 L320,280 L340,260 L360,280 L360,380 M80,380 L80,300 L90,290 L100,300 L100,380 M370,380 L370,250 L380,230 L385,210 L390,230 L400,250 L400,380 M410,380 L410,310 L420,300 L430,310 L430,380 M50,380 L50,320 Q70,300 90,320 L90,380",
    palms: "M80,380 L80,280 M55,255 Q80,230 80,280 M105,255 Q80,230 80,280 M45,275 Q80,245 80,280 M115,275 Q80,245 80,280 M68,245 Q80,225 92,245 M220,380 L220,300 M195,280 Q220,260 220,300 M245,280 Q220,260 220,300 M185,296 Q220,268 220,300 M255,296 Q220,268 220,300 M360,380 L360,320 M342,308 Q360,294 360,320 M378,308 Q360,294 360,320 M338,316 Q360,304 360,320 M382,316 Q360,304 360,320",
    geometric: "M100,100 L150,70 L200,100 L200,160 L150,190 L100,160 Z M200,100 L250,70 L300,100 L300,160 L250,190 L200,160 Z M150,190 L200,160 L250,190 L250,250 L200,280 L150,250 Z M50,190 L100,160 L150,190 L150,250 L100,280 L50,250 Z M250,190 L300,160 L350,190 L350,250 L300,280 L250,250 Z M100,280 L150,250 L200,280 L200,340 L150,370 L100,340 Z M200,280 L250,250 L300,280 L300,340 L250,370 L200,340 Z",
    book_bg: "M200,100 L200,320 M200,100 C160,90 100,95 60,110 L60,330 C100,315 160,310 200,320 M200,100 C240,90 300,95 340,110 L340,330 C300,315 240,310 200,320 M85,125 L180,108 M85,150 L180,133 M85,175 L180,158 M85,200 L180,183 M220,108 L315,125 M220,133 L315,150 M220,158 L315,175 M220,183 L315,200",
    growth: "M60,340 L60,60 M60,340 L380,340 M90,310 C130,290 160,275 200,230 C240,185 270,130 320,70 M90,310 L90,340 M140,278 L140,340 M200,230 L200,340 M260,155 L260,340 M320,70 L320,340",
    network: "M100,200 L200,120 M200,120 L320,150 M320,150 L280,280 M280,280 L150,300 M150,300 L100,200 M200,120 L280,280 M100,200 L320,150 M150,300 L200,120 M96,200 A8,8 0 1,0 104,200 A8,8 0 1,0 96,200 M196,120 A8,8 0 1,0 204,120 A8,8 0 1,0 196,120 M316,150 A8,8 0 1,0 324,150 A8,8 0 1,0 316,150 M276,280 A8,8 0 1,0 284,280 A8,8 0 1,0 276,280 M146,300 A8,8 0 1,0 154,300 A8,8 0 1,0 146,300 M207,207 A5,5 0 1,0 213,207 A5,5 0 1,0 207,207",
    mosque_bg: "M200,350 L200,200 Q200,130 250,130 Q300,130 300,200 L300,350 M140,350 L140,250 Q140,222 160,212 Q178,203 178,175 L178,148 L180,125 L182,148 L182,175 Q182,203 200,212 Q218,222 218,250 L218,350 M320,350 L320,280 Q340,262 360,280 L360,350 M100,350 L100,300 Q118,287 140,300 L140,350 M232,200 Q250,182 268,200 M233,214 Q250,198 267,214",
    coins: "M120,255 A80,25 0 1,1 280,255 A80,25 0 1,1 120,255 M120,235 A80,25 0 1,1 280,235 A80,25 0 1,1 120,235 M120,235 L120,255 M280,235 L280,255 M120,215 A80,25 0 1,1 280,215 A80,25 0 1,1 120,215 M120,215 L120,235 M280,215 L280,235 M145,195 A55,18 0 1,1 255,195 A55,18 0 1,1 145,195 M145,180 A55,18 0 1,1 255,180 A55,18 0 1,1 145,180 M145,180 L145,195 M255,180 L255,195",
    graduation: "M200,180 L60,230 L200,280 L340,230 Z M200,280 L200,330 M140,255 L140,315 Q168,345 200,345 Q232,345 260,315 L260,255 M312,230 L312,305 L306,316 L318,316 L312,305",
    waves_bg: "M0,200 Q60,170 120,200 Q180,230 240,200 Q300,170 360,200 Q420,230 480,200 M0,240 Q70,215 140,240 Q210,265 280,240 Q350,215 420,240 M0,160 Q50,140 100,160 Q150,180 200,160 Q250,140 300,160 Q350,180 400,160 Q450,140 480,160",
  };
  var d = illustrations[props.name] || illustrations.skyline;
  return (
    <div style={{ position:"absolute", left:xPos, top:yPos, transform:"translate(-50%,-50%) scale("+sc+")", pointerEvents:"none", zIndex:0 }}>
      <svg width="480" height="400" viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity:op }}>
        <path d={d} stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Decorative grid dot pattern overlay
function DotGrid(props) {
  var op = props.opacity || 0.045;
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:op, backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize:"32px 32px" }} />
  );
}

// Subtle noise texture overlay
function NoiseOverlay() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.06, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat:"repeat", backgroundSize:"200px 200px" }} />
  );
}

// Glowing line separator
function GlowLine(props) {
  var y = props.top || 0;
  return (
    <div style={{ position:"absolute", top:y, left:0, right:0, height:1, zIndex:5, pointerEvents:"none" }}>
      <div style={{ maxWidth:props.width || 1100, margin:"0 auto", position:"relative", height:1 }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", width:"60%", maxWidth:700, height:2, background:"linear-gradient(90deg, transparent 0%, rgba(200,180,140,0.15) 25%, rgba(200,180,140,0.4) 50%, rgba(200,180,140,0.15) 75%, transparent 100%)", borderRadius:1, top:0 }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 1: Scroll-triggered fade-up (IntersectionObserver)
// ═══════════════════════════════════════════════
function FadeIn(props) {
  var ref = useRef(null);
  var _v = useState(false); var visible = _v[0]; var setVisible = _v[1];
  var delay = props.delay || 0;
  useEffect(function() {
    var el = ref.current; if (!el) return;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-out " + delay + "s, transform 0.7s ease-out " + delay + "s", height: "100%", width: "100%", minWidth: 0 }}>
      {props.children}
    </div>
  );
}


// ═══════════════════════════════════════════════
// EFFECT 3: Cursor glow trail
// ═══════════════════════════════════════════════
function CursorGlow() {
  var mob = useIsMobile();
  var _pos = useState({ x: -200, y: -200 }); var pos = _pos[0]; var setPos = _pos[1];
  useEffect(function() {
    if (mob) return;
    var handler = function(e) { setPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", handler);
    return function() { window.removeEventListener("mousemove", handler); };
  }, [mob]);
  if (mob) return null;
  return (
    <div style={{ position: "fixed", left: pos.x - 150, top: pos.y - 150, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,180,140,0.04), transparent 70%)", pointerEvents: "none", zIndex: 9999, transition: "left 0.15s ease-out, top 0.15s ease-out" }} />
  );
}

// ═══════════════════════════════════════════════
// EFFECT 4: Floating particles
// ═══════════════════════════════════════════════
function FloatingParticles() {
  var mob = useIsMobile();
  if (mob) return null;
  var particles = Array.from({ length: 20 }, function(_, i) {
    return { id: i, left: Math.random() * 100, delay: Math.random() * 15, dur: 12 + Math.random() * 18, size: 1 + Math.random() * 2, op: 0.015 + Math.random() * 0.025 };
  });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {particles.map(function(p) {
        return <div key={p.id} style={{ position: "absolute", left: p.left + "%", bottom: "-10px", width: p.size, height: p.size, borderRadius: "50%", background: "rgba(255,255,255," + p.op + ")", animation: "floatParticle " + p.dur + "s linear " + p.delay + "s infinite" }} />;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 5: Card spotlight on hover
// ═══════════════════════════════════════════════
function SpotlightCard(props) {
  var ref = useRef(null);
  var _glow = useState({ x: 50, y: 50, active: false });
  var glow = _glow[0]; var setGlow = _glow[1];
  var handleMouse = function(e) {
    var rect = ref.current.getBoundingClientRect();
    setGlow({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100, active: true });
  };
  var handleLeave = function() { setGlow(function(g) { return Object.assign({}, g, { active: false }); }); };
  var p = props.padding !== undefined ? props.padding : 32;
  return (
    <div style={Object.assign({}, { background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)", borderRadius: 20, padding: 1, position: "relative", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box" }, props.outerStyle || {})}>
      <div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave} style={Object.assign({}, { background: "linear-gradient(180deg, #131315 0%, #111113 100%)", borderRadius: 19, padding: p, height: "100%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.3s ease", transform: glow.active ? "perspective(800px) rotateX(" + ((glow.y - 50) * -0.04) + "deg) rotateY(" + ((glow.x - 50) * 0.04) + "deg)" : "perspective(800px) rotateX(0) rotateY(0)" }, props.style || {})}>
        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", pointerEvents: "none" }} />
        {glow.active && <div style={{ position: "absolute", left: glow.x + "%", top: glow.y + "%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,180,140,0.06), transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none", transition: "left 0.1s, top 0.1s" }} />}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>{props.children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 6: Marquee trust bar
// ═══════════════════════════════════════════════
function TrustMarquee() {
  var items = ["MamoPay", "Visa", "Mastercard", "Apple Pay", "Google Pay", "MamoPay", "Visa", "Mastercard", "Apple Pay", "Google Pay"];
  return (
    <div style={{ overflow: "hidden", padding: "28px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, #0a0a0c, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(-90deg, #0a0a0c, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", gap: 48, animation: "marquee 30s linear infinite", width: "max-content" }}>
        {items.map(function(item, i) {
          return <span key={i} style={{ fontSize: 13, fontWeight: 500, color: "#3f3f46", letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3f3f46", display: "inline-block" }} />
            {item}
          </span>;
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 7: Section watermark numbers
// ═══════════════════════════════════════════════
function SectionWatermark(props) {
  var mob = useIsMobile();
  if (mob) return null;
  return (
    <div style={{ position: "absolute", top: props.top || "50%", right: props.right || "-2%", transform: "translateY(-50%)", fontSize: props.size || 280, fontWeight: 800, color: "rgba(255,255,255,0.015)", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1, pointerEvents: "none", zIndex: 0, userSelect: "none" }}>
      {props.children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 8: Step connector line with traveling dot
// ═══════════════════════════════════════════════
function StepConnector(props) {
  var h = props.height || 200;
  return (
    <div style={{ position: "absolute", left: 27, top: 56, bottom: 80, width: 2, zIndex: 0 }}>
      <div style={{ width: "100%", height: "100%", background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 6px, transparent 6px, transparent 12px)" }} />
      <div style={{ position: "absolute", top: 0, left: -2, width: 6, height: 6, borderRadius: "50%", background: "rgba(200,180,140,0.3)", animation: "travelDot 4s ease-in-out infinite" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 9: Shimmer text effect
// ═══════════════════════════════════════════════
function ShimmerText(props) {
  return (
    <span style={Object.assign({}, { backgroundImage: "linear-gradient(90deg, rgb(200,180,140), rgba(240,220,180,0.9), rgb(200,180,140))", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 4s linear infinite" }, props.style || {})}>
      {props.children}
    </span>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 10: Progress ring SVG
// ═══════════════════════════════════════════════
function ProgressRing(props) {
  var pct = props.percent || 0;
  var r = 14; var circ = 2 * Math.PI * r;
  var offset = circ - (pct / 100) * circ;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" fill="none" />
      <circle cx="18" cy="18" r={r} stroke="rgba(200,180,140,0.3)" strokeWidth="2.5" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 18 18)" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      <text x="18" y="20" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="sans-serif">{pct + "%"}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// EFFECT 11: Hover glow table row
// ═══════════════════════════════════════════════
function GlowRow(props) {
  var _h = useState(false); var hov = _h[0]; var setHov = _h[1];
  return (
    <div onMouseEnter={function(){setHov(true)}} onMouseLeave={function(){setHov(false)}} style={Object.assign({}, { position:"relative", transition:"background 0.3s", background: hov ? "rgba(200,180,140,0.03)" : "transparent" }, props.style || {})}>
      {props.children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// DEVICE MOCKUP SVGs — DASHBOARD PREVIEWS
// ═══════════════════════════════════════════════

function DashboardDesktop() {
  return (
    <svg width="100%" viewBox="0 0 720 440" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      <rect x="0" y="0" width="720" height="440" rx="12" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="rgba(255,255,255,0.09)" />
      <rect x="0" y="0" width="720" height="36" rx="12" fill="rgba(255,255,255,0.75)" />
      <rect x="0" y="24" width="720" height="12" fill="rgba(255,255,255,0.75)" />
      <circle cx="20" cy="18" r="5" fill="rgba(255,255,255,0.55)" />
      <circle cx="38" cy="18" r="5" fill="rgba(255,255,255,0.55)" />
      <circle cx="56" cy="18" r="5" fill="rgba(255,255,255,0.55)" />
      <rect x="200" y="10" width="320" height="16" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
      <text x="290" y="22" fill="rgba(255,255,255,0.65)" fontSize="8" fontFamily="sans-serif">tutorii.com/dashboard</text>
      <rect x="1" y="36" width="160" height="403" fill="rgba(255,255,255,0.09)" />
      <line x1="160" y1="36" x2="160" y2="440" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
      <rect x="20" y="52" width="24" height="24" rx="6" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
      <text x="32" y="69" fill="rgba(255,255,255,0.75)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">T</text>
      <text x="54" y="68" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Tutorii</text>
      <rect x="16" y="100" width="128" height="28" rx="6" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.5" />
      <text x="36" y="118" fill="rgba(255,255,255,0.85)" fontSize="9" fontFamily="sans-serif">Overview</text>
      {["My Referrals","Earnings","Payouts","Courses","Settings"].map(function(item, i) {
        return <text key={item} x="36" y={156 + i * 32} fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="sans-serif">{item}</text>;
      })}
      <text x="184" y="68" fill="rgba(255,255,255,0.75)" fontSize="14" fontFamily="sans-serif" fontWeight="600">Welcome back</text>
      <text x="184" y="84" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="sans-serif">Your account overview</text>
      {[{x:184,label:"Total Earned",val:"AED 1,186"},{x:318,label:"This Month",val:"AED 418"},{x:452,label:"Referrals",val:"12"},{x:586,label:"Progress",val:"68%"}].map(function(s) {
        return <g key={s.label}><rect x={s.x} y="100" width="120" height="72" rx="8" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" /><text x={s.x+12} y="120" fill="rgba(255,255,255,0.75)" fontSize="8" fontFamily="sans-serif">{s.label}</text><text x={s.x+12} y="148" fill="rgba(255,255,255,0.85)" fontSize="18" fontFamily="sans-serif" fontWeight="600">{s.val}</text></g>;
      })}
      <rect x="184" y="190" width="390" height="180" rx="8" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
      <text x="200" y="214" fill="rgba(255,255,255,0.65)" fontSize="10" fontFamily="sans-serif" fontWeight="500">Earnings Overview</text>
      <polyline points="210,340 250,320 290,330 330,290 370,270 410,240 450,220 490,200 530,210 550,195" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="210,340 250,320 290,330 330,290 370,270 410,240 450,220 490,200 530,210 550,195 550,355 210,355" fill="rgba(255,255,255,0.09)" stroke="none" />
      {[260,290,320,350].map(function(y){return <line key={y} x1="200" y1={y} x2="560" y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />;})}
      <rect x="590" y="190" width="116" height="180" rx="8" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
      <text x="604" y="214" fill="rgba(255,255,255,0.65)" fontSize="9" fontFamily="sans-serif" fontWeight="500">Your Link</text>
      <rect x="600" y="228" width="96" height="20" rx="4" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" fill="rgba(255,255,255,0.09)" />
      <text x="610" y="241" fill="rgba(255,255,255,0.75)" fontSize="7" fontFamily="sans-serif">tutorii.com/r/...</text>
      <rect x="600" y="256" width="96" height="24" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
      <text x="628" y="272" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Copy Link</text>
      {["WhatsApp","SMS","Email"].map(function(s,i){return <g key={s}><rect x="600" y={292+i*28} width="96" height="22" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" fill="rgba(255,255,255,0.07)" /><text x="632" y={307+i*28} fill="rgba(255,255,255,0.55)" fontSize="8" fontFamily="sans-serif" textAnchor="middle">{s}</text></g>;})}
      <rect x="184" y="388" width="522" height="36" rx="8" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" fill="rgba(255,255,255,0.03)" />
      <text x="200" y="410" fill="rgba(255,255,255,0.75)" fontSize="8" fontFamily="sans-serif">Next payout: Tuesday · Minimum: AED 50 · Balance: AED 226</text>
    </svg>
  );
}

function DashboardMobile() {
  return (
    <svg width="100%" viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      <rect x="0" y="0" width="260" height="520" rx="28" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="rgba(255,255,255,0.09)" />
      <rect x="85" y="0" width="90" height="24" rx="12" fill="rgba(255,255,255,0.08)" />
      <text x="24" y="18" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="sans-serif">9:41</text>
      <rect x="208" y="10" width="28" height="10" rx="2" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" fill="none" />
      <rect x="210" y="12" width="16" height="6" rx="1" fill="rgba(255,255,255,0.55)" />
      <text x="20" y="58" fill="rgba(255,255,255,0.75)" fontSize="14" fontFamily="sans-serif" fontWeight="600">Dashboard</text>
      <circle cx="236" cy="52" r="14" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="rgba(255,255,255,0.09)" />
      <text x="236" y="56" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="sans-serif" textAnchor="middle">PS</text>
      {[{x:16,y:76,label:"Total Earned",val:"AED 1,186"},{x:138,y:76,label:"This Month",val:"AED 418"},{x:16,y:146,label:"Referrals",val:"12"},{x:138,y:146,label:"Progress",val:"68%"}].map(function(s){return <g key={s.label}><rect x={s.x} y={s.y} width="106" height="56" rx="10" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" /><text x={s.x+10} y={s.y+18} fill="rgba(255,255,255,0.75)" fontSize="7" fontFamily="sans-serif">{s.label}</text><text x={s.x+10} y={s.y+40} fill="rgba(255,255,255,0.85)" fontSize="16" fontFamily="sans-serif" fontWeight="600">{s.val}</text></g>;})}
      <rect x="16" y="218" width="228" height="120" rx="10" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
      <text x="28" y="240" fill="rgba(255,255,255,0.65)" fontSize="9" fontFamily="sans-serif" fontWeight="500">Earnings</text>
      <polyline points="32,315 62,305 92,310 122,285 152,270 182,250 212,240 228,235" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="32,315 62,305 92,310 122,285 152,270 182,250 212,240 228,235 228,325 32,325" fill="rgba(255,255,255,0.09)" stroke="none" />
      {[270,290,310].map(function(y){return <line key={y} x1="28" y1={y} x2="236" y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />;})}
      <rect x="16" y="352" width="228" height="72" rx="10" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
      <text x="28" y="374" fill="rgba(255,255,255,0.65)" fontSize="9" fontFamily="sans-serif" fontWeight="500">Your Referral Link</text>
      <rect x="26" y="384" width="148" height="22" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" fill="rgba(255,255,255,0.09)" />
      <text x="36" y="399" fill="rgba(255,255,255,0.75)" fontSize="7" fontFamily="sans-serif">tutorii.com/r/priya</text>
      <rect x="180" y="384" width="52" height="22" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
      <text x="206" y="399" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Copy</text>
      <rect x="26" y="412" width="60" height="20" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" fill="rgba(255,255,255,0.07)" />
      <text x="40" y="425" fill="rgba(255,255,255,0.55)" fontSize="7" fontFamily="sans-serif">WhatsApp</text>
      <rect x="94" y="412" width="40" height="20" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" fill="rgba(255,255,255,0.07)" />
      <text x="103" y="425" fill="rgba(255,255,255,0.55)" fontSize="7" fontFamily="sans-serif">SMS</text>
      <rect x="142" y="412" width="44" height="20" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" fill="rgba(255,255,255,0.07)" />
      <text x="152" y="425" fill="rgba(255,255,255,0.55)" fontSize="7" fontFamily="sans-serif">Email</text>
      <line x1="16" y1="468" x2="244" y2="468" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
      {["Home","Courses","Earn","Settings"].map(function(t,i){return <text key={t} x={44+i*56} y={490} fill={"rgba(255,255,255,"+(i===0?"0.18":"0.07")+")"} fontSize="8" fontFamily="sans-serif" textAnchor="middle">{t}</text>;})}
      <rect x="100" y="506" width="60" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DESIGN SYSTEM — LANDIO-FAITHFUL DARK PREMIUM
// ═══════════════════════════════════════════════


function Skeleton(props) {
  var w = props.w || "100%";
  var h = props.h || 16;
  var r = props.r || 6;
  return <div style={{ width:w, height:h, borderRadius:r, background:"rgba(255,255,255,0.04)", animation:"pulse 1.5s ease-in-out infinite" }} />;
}

function DashSkeleton() {
  var mob = useIsMobile();
  return (
    <div style={{ padding:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24 }}>
        <Skeleton w={240} h={28} r={8} />
        <Skeleton w={160} h={32} r={8} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginBottom:20 }}>
        {[1,2,3,4].map(function(i){return <div key={i} style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}><Skeleton w={34} h={34} r={9} /><Skeleton w="60%" h={10} r={4} /><Skeleton w="40%" h={20} r={4} /></div>})}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        {[1,2].map(function(i){return <div key={i} style={{ background:"#131315", borderRadius:14, padding:24, border:"1px solid rgba(255,255,255,0.06)", height:200 }}><Skeleton w="50%" h={14} r={4} /><div style={{ marginTop:12 }}><Skeleton h={140} r={8} /></div></div>})}
      </div>
    </div>
  );
}

function Btn(props) {
  var isPrimary = !props.outline && !props.green;
  var bg = props.green ? "#059669" : props.outline ? "transparent" : "rgba(255,255,255,0.06)";
  var clr = props.outline ? "#e4e4e7" : "#fafafa";
  var brd = "1px solid rgba(255,255,255,0.12)";
  var w = props.full ? "100%" : "auto";
  var merged = Object.assign({}, { border:brd, borderRadius:12, fontSize:14, fontWeight:500, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"13px 28px", background:bg, color:clr, width:w, transition:"all 0.3s ease", letterSpacing:"-0.01em", backdropFilter:"blur(10px)" }, props.style || {});
  return <button onClick={props.onClick} style={merged}>{props.children}{isPrimary && <span style={{ fontSize:16, lineHeight:1, display:"inline-flex", alignItems:"center" }}>{"\u2197"}</span>}</button>;
}

function Logo(props) {
  return (
    <div onClick={props.onClick} style={{ display:"flex", alignItems:"center", gap:8, cursor:props.onClick?"pointer":"default" }}>
      <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:16, fontWeight:700, color:"#e4e4e7" }}>T</span>
      </div>
      <span style={{ fontSize:18, fontWeight:600, color:"#e4e4e7", letterSpacing:"-0.3px", fontStyle:"italic" }}>Tutorii</span>
    </div>
  );
}

function SLabel(props) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", verticalAlign:"middle", borderRadius:20, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:24 }}>
      <Ico name={props.icon || "sparkle"} size={14} color="rgb(200,180,140)" />
      <span style={{ fontSize:13, fontWeight:500, textTransform:"uppercase", letterSpacing:"1.2px", color:"#a1a1aa" }}>{props.children}</span>
    </div>
  );
}

function GCard(props) {
  var p = props.padding !== undefined ? props.padding : 32;
  return (
    <div style={Object.assign({}, { background:"linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)", borderRadius:20, padding:1, position:"relative", height:"100%", width:"100%", minWidth:0, boxSizing:"border-box" }, props.outerStyle || {})}>
      <div style={Object.assign({}, { background:"linear-gradient(180deg, #131315 0%, #111113 100%)", borderRadius:19, padding:p, height:"100%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }, props.style || {})}>
        <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", pointerEvents:"none" }} />
        {props.children}
      </div>
    </div>
  );
}

function SiteNav(props) {
  var go = props.go;
  var active = props.active || "";
  var mob = useIsMobile();
  var _open = useState(false); var menuOpen = _open[0]; var setMenuOpen = _open[1];
  var nl = function(id,label){ return (
    <span key={id} onClick={function(){go(id);setMenuOpen(false)}} style={{ fontSize:mob?16:14, fontWeight:400, color: active===id ? "#e4e4e7" : "#71717a", cursor:"pointer", transition:"color 0.2s", padding:mob?"12px 0":"6px 12px", display:mob?"block":"inline", borderBottom:mob?"1px solid rgba(255,255,255,0.04)":"none" }}>{label}</span>
  )};
  return (
    <div>
    <nav style={{ position:"fixed", top:mob?0:16, left:mob?"0":"50%", transform:mob?"none":"translateX(-50%)", display:"flex", justifyContent:"space-between", alignItems:"center", width:mob?"100%":"calc(100% - 48px)", maxWidth:1200, padding:mob?"10px 16px":"12px 8px 12px 24px", background:"rgba(17,17,19,0.85)", backdropFilter:"blur(24px) saturate(1.5)", WebkitBackdropFilter:"blur(24px) saturate(1.5)", zIndex:100, borderRadius:mob?0:16, border:mob?"none":"1px solid rgba(255,255,255,0.06)", borderBottom:mob?"1px solid rgba(255,255,255,0.06)":"none" }}>
      <Logo onClick={function(){go("landing")}} />
      {!mob && <div style={{ display:"flex", alignItems:"center", gap:0, padding:"4px 6px", borderRadius:12, background:"#0a0a0c", border:"1px solid rgba(255,255,255,0.06)" }}>
        {nl("landing","Home")}
        {nl("howItWorks","How It Works")}
        {nl("curriculum","Curriculum")}
        {nl("faq","FAQ")}
      </div>}
      {!mob && <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={function(){go("login")}} style={{ padding:"10px 20px", fontSize:13, fontWeight:500, color:"#d4d4d8", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Log In</button>
        <Btn onClick={function(){go("subscribe")}} style={{ padding:"10px 20px", fontSize:13 }}>Get Started</Btn>
      </div>}
      {mob && <button onClick={function(){setMenuOpen(!menuOpen)}} style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d={menuOpen?"M6 6l12 12M6 18L18 6":"M3 6h18M3 12h18M3 18h18"} stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round"/></svg></button>}
    </nav>
    {mob && menuOpen && <div style={{ position:"fixed", top:52, left:0, right:0, bottom:0, background:"rgba(10,10,12,0.97)", zIndex:99, padding:"24px 24px", display:"flex", flexDirection:"column", animation:"fadeIn 0.2s ease-out" }}>
      {nl("landing","Home")}
      {nl("howItWorks","How It Works")}
      {nl("curriculum","Curriculum")}
      {nl("faq","FAQ")}
      <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:10 }}>
        <button onClick={function(){go("login");setMenuOpen(false)}} style={{ padding:"14px", fontSize:15, fontWeight:600, color:"#d4d4d8", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Log In</button>
        <Btn onClick={function(){go("subscribe");setMenuOpen(false)}} full style={{ padding:"14px", fontSize:15, borderRadius:12 }}>Get Started</Btn>
      </div>
    </div>}
    </div>
  );
}

function SiteFooter(props) {
  var go = props.go;
  var mob = useIsMobile();
  return (
    <footer style={{ padding:mob?"48px 20px 32px":"80px 48px 40px", background:"#08080a", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"flex-start", maxWidth:1100, margin:"0 auto", paddingBottom:40, borderBottom:"1px solid rgba(255,255,255,0.04)", marginBottom:28, gap:mob?32:0 }}>
        <div>
          <Logo />
          <p style={{ fontSize:13, color:"#52525b", marginTop:14, maxWidth:260, lineHeight:1.7 }}>The education and income platform built for expatriates in the UAE and GCC.</p>
          <p style={{ fontSize:13, color:"#52525b", marginTop:8 }}>support@tutorii.com</p>
        </div>
        <div style={{ display:"flex", gap:mob?32:64 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px", marginBottom:16, textTransform:"uppercase" }}>Platform</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["howItWorks","How It Works"],["curriculum","Curriculum"],["faq","FAQ"]].map(function(l){return <span key={l[0]} onClick={function(){go(l[0])}} style={{ fontSize:14, color:"#71717a", cursor:"pointer" }}>{l[1]}</span>})}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px", marginBottom:16, textTransform:"uppercase" }}>Legal</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[["terms","Terms of Service"],["privacy","Privacy Policy"],["contact","Contact Us"],["support","Support"]].map(function(l){return <span key={l[0]} onClick={function(){go(l[0])}} style={{ fontSize:14, color:"#71717a", cursor:"pointer" }}>{l[1]}</span>})}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:"#3f3f46", lineHeight:1 }}>© 2026 Tutorii.com</div>
        <span onClick={function(){go("adminLogin")}} style={{ fontSize:12, color:"#3f3f46", cursor:"pointer" }}>Admin</span>
      </div>
    </footer>
  );
}

function CtaBanner(props) {
  var go = props.go;
  var mob = useIsMobile();
  var t = props.title || "Ready to Start Learning & Earning?";
  var s = props.sub || "Subscribe today and unlock courses, referral tools, and weekly payouts";
  return (
    <section style={{ padding:mob?"80px 20px":"160px 48px", background:"#0a0a0c", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <BgIllustration name="skyline" position="right" y="55%" scale={1.2} opacity={0.04} />
      <BgIllustration name="palms" position="left" y="45%" scale={1} opacity={0.035} />
      <DotGrid opacity={0.04} />
      <GlowLine />
      <FadeIn><div style={{ position:"relative", zIndex:1, maxWidth:640, margin:"0 auto" }}>
        <p style={{ fontStyle:"italic", fontSize:14, color:"#71717a", marginBottom:16 }}>Reach out anytime</p>
        <h2 style={{ fontSize:mob?28:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 12px", lineHeight:1.15, letterSpacing:"-1px" }}>{t}</h2>
        <p style={{ fontSize:15, color:"#71717a", marginBottom:40, lineHeight:1.7 }}>{s}</p>
        <Btn onClick={function(){go("subscribe")}}>{"Subscribe · AED "+PRICE+"/month"}</Btn>
        <div style={{ marginTop:14, fontSize:13, color:"#52525b" }}>Cancel anytime · No hidden fees</div>
      </div></FadeIn>
    </section>
  );
}

function Landing(props) {
  var go = props.go;
  var mob = useIsMobile();
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);
  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} />

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mob?"120px 20px 60px":"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="skyline" position="center" y="65%" scale={1.8} opacity={0.03} />
        <BgIllustration name="mosque_bg" position="left" y="55%" scale={0.9} opacity={0.025} />
        <DotGrid opacity={0.05} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:300, background:"linear-gradient(0deg, #0a0a0c, transparent)", pointerEvents:"none", zIndex:2 }} />
        <WaveDivider flip opacity={0.09} />
        <div style={{ position:"relative", zIndex:3, maxWidth:800 }}>
          <FadeIn><div style={{ width:60, height:60, borderRadius:18, background:"linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 32px", lineHeight:1, boxShadow:"0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(200,180,140,0.14), inset 0 1px 0 rgba(255,255,255,0.12)" }}><span style={{ fontSize:24, fontWeight:700, color:"#d4d4d8" }}>T</span></div></FadeIn>
          <FadeIn delay={0.1}><SLabel icon="sparkle">Education & Income Platform</SLabel></FadeIn>
          <FadeIn delay={0.2}><h1 style={{ fontSize:mob?36:68, fontWeight:600, color:"#c8c8cc", margin:"0 0 24px", lineHeight:1.08, letterSpacing:mob?"-1px":"-2.5px" }}>Learn Smarter. Earn More. <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:mob?36:68, letterSpacing:mob?"-1px":"-2.5px" }}>With Tutorii.</ShimmerText></h1></FadeIn>
          <FadeIn delay={0.3}><p style={{ fontSize:mob?15:17, color:"#71717a", lineHeight:1.8, margin:"0 auto 44px", maxWidth:520 }}>Practical education for expatriates in the Gulf, plus a referral-based income that pays you every week.</p></FadeIn>
          <FadeIn delay={0.4}><Btn onClick={function(){go("subscribe")}}>{"Start Your Subscription"}</Btn></FadeIn>
        </div>
      </section>

      <TrustMarquee />

      <GlowLine />

      {/* WHAT IS TUTORII */}
      <section style={{ padding:mob?"60px 20px":"120px 48px", position:"relative", overflow:"hidden" }}>
        <DotGrid opacity={0.04} />
        <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:56 }}>
            <SLabel icon="sparkle">What is Tutorii?</SLabel>
            <h2 style={{ fontSize:mob?28:46, fontWeight:600, color:"#d4d4d8", margin:"0 0 18px", letterSpacing:"-1px", lineHeight:1.1 }}>An Education Platform That <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:mob?28:46, letterSpacing:"-1px" }}>Pays You Back</ShimmerText></h2>
            <p style={{ fontSize:mob?15:17, color:"#a1a1aa", maxWidth:620, margin:"0 auto", lineHeight:1.8 }}>Tutorii is a subscription-based learning platform built for expatriates in the UAE and GCC. You get practical courses designed for your life here  - and a built-in referral system that turns your network into weekly income.</p>
          </div></FadeIn>

          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:20, marginBottom:48, alignItems:"stretch" }}>
            {[
              {icon:"book", num:"01", title:"You Learn", desc:"Access "+INIT_COURSES.length+" expert-led modules covering workers' rights, UAE life, career growth, financial literacy, and entrepreneurship. New content added regularly  - all included in your subscription.", accent:"rgb(200,180,140)"},
              {icon:"link", num:"02", title:"You Share", desc:"Get your own unique referral link the moment you subscribe. Share it on WhatsApp, social media, or with colleagues. When someone signs up through your link, they're permanently connected to you.", accent:"rgb(200,180,140)"},
              {icon:"dollar", num:"03", title:"You Earn", desc:"Earn recurring commissions every month for each person you refer. You also earn on the people they refer, building a growing income stream. Payouts go straight to your bank, every week.", accent:"rgb(200,180,140)"}
            ].map(function(item, idx){return (
              <FadeIn key={item.num} delay={idx*0.12}><SpotlightCard padding={32} style={{ display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.03))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}><Ico name={item.icon} size={22} color={item.accent} /></div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#52525b", letterSpacing:"0.8px", textTransform:"uppercase", lineHeight:1 }}>{"STEP "+item.num}</div>
                    <div style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", marginTop:3 }}>{item.title}</div>
                  </div>
                </div>
                <p style={{ fontSize:14, color:"#71717a", lineHeight:1.8, margin:0, flex:1 }}>{item.desc}</p>
              </SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* QUOTE STRIP */}
      <section style={{ padding:mob?"48px 20px 60px":"80px 48px 100px", textAlign:"center", position:"relative" }}>
        <BgIllustration name="waves_bg" position="right" y="50%" scale={1.2} opacity={0.04} />
        <FadeIn><div style={{ maxWidth:800, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="star">What Our Subscribers Say</SLabel>
          <p style={{ fontSize:mob?20:28, color:"#a1a1aa", lineHeight:1.6, fontWeight:400 }}>{"We find what to "}<span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>learn</span>{", how to earn, and how Tutorii can change your financial future. The best part is we give you the tools to "}<span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>make it happen.</span>{"\u201D"}</p>
        </div></FadeIn>
      </section>

      {/* BENEFITS */}
      <section style={{ padding:mob?"60px 20px":"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine top={120} /><WaveDivider opacity={0.08} /><BgIllustration name="geometric" position="left" y="40%" scale={1.1} opacity={0.035} /><SectionWatermark>01</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="lightbulb">Benefits</SLabel><h2 style={{ fontSize:mob?28:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>Why Choose <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Tutorii?</span></h2><p style={{ fontSize:15, color:"#71717a", maxWidth:460, margin:"0 auto" }}>Everything you need to learn, earn, and grow as an expatriate</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3, 1fr)", gap:16, alignItems:"stretch" }}>
            {[{i:"book",t:"Learn",d:"Access expert-led courses on UAE life, workers' rights, career growth, and financial literacy — built specifically for expatriates in the Gulf."},{i:"dollar",t:"Earn",d:"Share your referral link and earn 40% recurring commission on every subscriber you bring in. Paid weekly, directly to your bank."},{i:"rocket",t:"Grow",d:"Build real skills, real income, and real confidence. Whether you want a side hustle or a career change, Tutorii gives you the tools to level up."}].map(function(v,vi){return (
              <FadeIn key={v.t} delay={vi*0.12}><SpotlightCard padding={36} style={{ alignItems:"center" }}><div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, margin:"0 auto 20px", lineHeight:0, flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}><Ico name={v.i} size={28} color="rgb(200,180,140)" /></div><h3 style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", margin:"0 0 16px", flexShrink:0, width:"100%", textAlign:"center", minHeight:22 }}>{v.t}</h3><p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, margin:0, width:"100%", textAlign:"left" }}>{v.d}</p></SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:mob?"60px 20px":"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="network" position="right" y="35%" scale={1} opacity={0.04} /><DotGrid opacity={0.045} /><SectionWatermark right="2%">02</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="gear">Features</SLabel><h2 style={{ fontSize:mob?28:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>All features in <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>one place</span></h2><p style={{ fontSize:15, color:"#71717a" }}>{"AED "+PRICE+"/month. Everything included from day one."}</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"repeat(3, 1fr)", gap:16, alignItems:"stretch" }}>
            {[{ia:"book",ib:"target",t:"Course Library",d:INIT_COURSES.length+" modules, "+tl+" lessons covering practical skills for expats."},{ia:"link",ib:"chart",t:"Referral Dashboard",d:"Your unique link, real-time tracking, and commission analytics."},{ia:"dollar",ib:"bank",t:"Weekly Payouts",d:"40% commission paid every Tuesday directly to your bank."},{ia:"chat",ib:"bot",t:"AI Support",d:"24/7 chat that knows your account, earnings, and progress."},{ia:"phone",ib:"globe",t:"Access Anywhere",d:"Works on any device. No app download required."},{ia:"refresh",ib:"sparkle",t:"Growing Content",d:"New lessons added regularly at no extra cost."}].map(function(v,vi){return (
              <FadeIn key={v.t} delay={(vi%3)*0.1}><SpotlightCard padding={28}><div style={{ display:"flex", gap:8, marginBottom:18, flexShrink:0 }}>{[v.ia,v.ib].map(function(ic,i){return <div key={i} style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)", lineHeight:0 }}><Ico name={ic} size={18} color="rgb(200,180,140)" /></div>})}</div><h3 style={{ fontSize:16, fontWeight:600, color:"#d4d4d8", margin:"0 0 6px", flexShrink:0 }}>{v.t}</h3><p style={{ fontSize:13, color:"#71717a", lineHeight:1.7, margin:0, marginTop:"auto" }}>{v.d}</p></SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="waves_bg" position="left" y="50%" scale={1.3} opacity={0.03} /><SectionWatermark>03</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="phone">Interface</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>Designed for <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Clarity</span></h2><p style={{ fontSize:15, color:"#71717a", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>Your earnings, referrals, courses, and payouts. All in one clean dashboard that works beautifully on any screen.</p></div></FadeIn>
          <FadeIn delay={0.2}><div style={{ display:"flex", gap:32, alignItems:"center", justifyContent:"center" }}>
            <div style={{ flex:"1 1 0", maxWidth:640 }}><GCard padding={0} outerStyle={{ boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}><div style={{ padding:4 }}><DashboardDesktop /></div></GCard><div style={{ textAlign:"center", marginTop:14 }}><span style={{ fontSize:12, color:"#3f3f46", letterSpacing:"0.5px" }}>DESKTOP</span></div></div>
            <div style={{ flex:"0 0 auto", width:180 }}><GCard padding={0} outerStyle={{ boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}><div style={{ padding:4 }}><DashboardMobile /></div></GCard><div style={{ textAlign:"center", marginTop:14 }}><span style={{ fontSize:12, color:"#3f3f46", letterSpacing:"0.5px" }}>MOBILE</span></div></div>
          </div></FadeIn>
        </div>
      </section>

      {/* EARNING MODEL */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="coins" position="right" y="50%" scale={1.2} opacity={0.04} /><SectionWatermark right="2%">04</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:72 }}><SLabel icon="wallet">Earning Model</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>See What You Could <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:42, letterSpacing:"-1px" }}>Earn</ShimmerText></h2><p style={{ fontSize:15, color:"#71717a" }}>Refer just 3 people and your subscription pays for itself</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:16, maxWidth:mob?400:1100, margin:"0 auto", alignItems:"stretch" }}>
            {[{r:3,lab:"Covers subscription",net:(3*PRICE*L1_RATE-PRICE)},{r:10,lab:"Meaningful income",net:(10*PRICE*L1_RATE+5*PRICE*L2_RATE-PRICE)},{r:25,lab:"Exceeds part-time jobs",net:(25*PRICE*L1_RATE+20*PRICE*L2_RATE-PRICE)},{r:50,lab:"Real income stream",net:(50*PRICE*L1_RATE+50*PRICE*L2_RATE-PRICE)}].map(function(e,ei){return (
              <FadeIn key={e.r} delay={ei*0.1}><SpotlightCard padding={28} style={{ textAlign:"center", alignItems:"center", display:"flex", flexDirection:"column" }}><div style={{ fontSize:13, color:"#52525b", marginBottom:10 }}>{e.r+" referrals"}</div><div style={{ fontSize:28, fontWeight:500, color:"#d4d4d8", letterSpacing:"-0.5px", marginBottom:6 }}>{"AED "+e.net.toFixed(2)}</div><div style={{ fontSize:12, color:"#52525b" }}>net profit/month</div><div style={{ fontSize:12, color:"#71717a", marginTop:10, fontStyle:"italic" }}>{e.lab}</div></SpotlightCard></FadeIn>
            )})}
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign:"center", marginTop:40 }}><Btn onClick={function(){go("howItWorks")}} outline>{"See Full Earning Breakdown"}</Btn></div></FadeIn>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:mob?"60px 20px":"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="palms" position="left" y="35%" scale={0.8} opacity={0.03} /><BgIllustration name="skyline" position="right" y="70%" scale={0.7} opacity={0.03} /><SectionWatermark>05</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:16 }}><SLabel icon="chat">Reviews</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 4px", letterSpacing:"-1px" }}>Trusted by <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Many</span></h2></div><p style={{ textAlign:"center", fontSize:15, color:"#71717a", marginBottom:56 }}>Hear from real subscribers who are learning and earning</p></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:16, alignItems:"stretch" }}>
            {[{q:"I covered my subscription in the first week with just 3 referrals. The workers rights module helped me resolve an issue with my employer.",n:"Priya S.",r:"Healthcare Worker, Dubai",init:"PS"},{q:"I shared my link in two WhatsApp groups and within a month I was earning more than my weekend freelancing.",n:"David C.",r:"IT Professional, Abu Dhabi",init:"DC"},{q:"The course content is genuinely high quality. My colleagues have all found it valuable. I only recommend things I believe in.",n:"Maria L.",r:"Teacher, Sharjah",init:"ML"}].map(function(t,ti){return (
              <FadeIn key={t.n} delay={ti*0.12}><SpotlightCard padding={28}><div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexShrink:0 }}><div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:600, color:"#a1a1aa", boxShadow:"0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)", flexShrink:0 }}>{t.init}</div><div><div style={{ fontSize:14, fontWeight:600, color:"#d4d4d8" }}>{t.n}</div><div style={{ fontSize:12, color:"#52525b" }}>{t.r}</div></div></div><p style={{ fontSize:14, color:"#a1a1aa", lineHeight:1.8, margin:0, marginTop:"auto" }}>{"\u201C"+t.q+"\u201D"}</p></SpotlightCard></FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* COURSE PREVIEW */}
      <section style={{ padding:mob?"60px 20px":"100px 48px 80px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><DotGrid opacity={0.04} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:48 }}><SLabel icon="book">Curriculum</SLabel><h2 style={{ fontSize:36, fontWeight:600, color:"#d4d4d8", margin:0, letterSpacing:"-0.5px" }}>{INIT_COURSES.length+" modules. "+tl+" lessons. "}<span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Real skills.</span></h2></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat("+INIT_COURSES.length+", 1fr)", gap:12, alignItems:"stretch" }}>
            {INIT_COURSES.map(function(c,ci){return (
              <FadeIn key={c.id} delay={ci*0.08}><SpotlightCard padding={24} style={{ textAlign:"center", alignItems:"center" }}><div style={{ marginBottom:10, lineHeight:0, display:"flex", justifyContent:"center" }}><Ico name={c.icon} size={28} color="rgb(200,180,140)" /></div><h3 style={{ fontSize:14, fontWeight:600, color:"#d4d4d8", margin:"0 0 4px", textAlign:"center", width:"100%", flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>{c.module}</h3><div style={{ fontSize:12, color:"#52525b", textAlign:"center", width:"100%", marginTop:"auto" }}>{c.lessons.length+" lessons"}</div></SpotlightCard></FadeIn>
            )})}
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign:"center", marginTop:24 }}><span onClick={function(){go("curriculum")}} style={{ fontSize:14, color:"#a1a1aa", cursor:"pointer" }}>{"View the full curriculum \u2192"}</span></div></FadeIn>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding:mob?"60px 20px":"120px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="growth" position="right" y="50%" scale={1} opacity={0.035} /><SectionWatermark right="2%">06</SectionWatermark>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <FadeIn><SLabel icon="rocket">Process</SLabel><h2 style={{ fontSize:36, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-0.5px" }}>Our Simple & <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Smart Process</span></h2><p style={{ fontSize:15, color:"#71717a", marginBottom:56 }}>Getting started takes less than 2 minutes</p></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:16, alignItems:"stretch" }}>
            {[{n:"01",t:"Subscribe",d:"Pay securely via MamoPay"},{n:"02",t:"Learn",d:"Access all courses instantly"},{n:"03",t:"Share",d:"Get your unique referral link"},{n:"04",t:"Earn",d:"Weekly payouts to your bank"}].map(function(s,si){return (
              <FadeIn key={s.n} delay={si*0.1}><SpotlightCard padding={24} style={{ textAlign:"center" }}><div style={{ fontSize:28, fontWeight:700, color:"rgb(200,180,140)", marginBottom:12, fontFamily:"Georgia, serif", fontStyle:"italic", lineHeight:1 }}>{s.n}</div><h3 style={{ fontSize:15, fontWeight:600, color:"#d4d4d8", margin:"0 0 6px" }}>{s.t}</h3><p style={{ fontSize:12, color:"#52525b", margin:0 }}>{s.d}</p></SpotlightCard></FadeIn>
            )})}
          </div>
          <FadeIn delay={0.4}><div style={{ marginTop:48 }}><Btn onClick={function(){go("subscribe")}}>{"Start Your Subscription"}</Btn><div style={{ marginTop:12, fontSize:13, color:"#52525b" }}>{"AED "+PRICE+"/month \u00B7 Cancel anytime"}</div></div></FadeIn>
        </div>
      </section>

      <CtaBanner go={go} />
      <SiteFooter go={go} />
    </div>
  );
}

function HowItWorksPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _refs = useState(5);
  var refs = _refs[0]; var setRefs = _refs[1];
  var l1earn = refs * PRICE * L1_RATE;
  var estL2 = Math.round(refs * 1.5);
  var l2earn = estL2 * PRICE * L2_RATE;
  var net = l1earn + l2earn - PRICE;
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);

  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} active="howItWorks" />
      <section style={{ paddingTop:160, padding:"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="skyline" position="center" y="60%" scale={1.5} opacity={0.03} />
        <DotGrid opacity={0.045} />
        <FadeIn><div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="gear">How It Works</SLabel>
          <h1 style={{ fontSize:52, fontWeight:600, color:"#d4d4d8", margin:"0 0 18px", lineHeight:1.1, letterSpacing:"-1.5px" }}>A Simple Model That <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:52, letterSpacing:"-1.5px" }}>Rewards You</ShimmerText></h1>
          <p style={{ fontSize:16, color:"#71717a", maxWidth:560, margin:"0 auto", lineHeight:1.7 }}>Tutorii gives you access to expert-led courses and a built-in way to earn recurring income.</p>
        </div></FadeIn>
      </section>

      {/* STEPS WITH CONNECTOR */}
      <section style={{ padding:"40px 48px 120px" }}>
        <div style={{ maxWidth:760, margin:"0 auto", position:"relative" }}>
          <StepConnector />
          {[{n:"01",i:"phone",t:"Subscribe and get immediate access",d:"Pay AED "+PRICE+"/month via MamoPay (Visa, Mastercard, Apple Pay, Google Pay). Unlock every course, every lesson, and your referral dashboard instantly."},{n:"02",i:"book",t:"Learn skills that matter",d:INIT_COURSES.length+" modules, "+tl+" lessons covering UAE culture, legal rights, career development, financial literacy, and entrepreneurship."},{n:"03",i:"link",t:"Share your personal referral link",d:"Every subscriber gets a unique link. Share through WhatsApp, SMS, email, or social media. When someone subscribes, they are permanently connected to you."},{n:"04",i:"dollar",t:"Earn recurring commissions weekly",d:"40% ($"+(PRICE*L1_RATE).toFixed(2)+") per direct referral per month. 5% ($"+(PRICE*L2_RATE).toFixed(2)+") on their referrals. Paid every Tuesday to your bank."}].map(function(s,si){return (
            <FadeIn key={s.n} delay={si*0.15}><div style={{ display:"flex", gap:24, marginBottom:48, position:"relative", zIndex:1 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", lineHeight:0 }}><Ico name={s.i} size={24} color="rgb(200,180,140)" /></div>
              <div><div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px", marginBottom:6 }}>{"STEP "+s.n}</div><h3 style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", margin:"0 0 8px" }}>{s.t}</h3><p style={{ fontSize:14, color:"#71717a", lineHeight:1.8, margin:0 }}>{s.d}</p></div>
            </div></FadeIn>
          )})}
          <FadeIn delay={0.6}><div style={{ textAlign:"center" }}><Btn onClick={function(){go("subscribe")}}>{"Start Your Subscription"}</Btn></div></FadeIn>
        </div>
      </section>

      {/* COMMISSION CARDS */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="coins" position="left" y="35%" scale={1} opacity={0.035} /><SectionWatermark>40%</SectionWatermark>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:64 }}><SLabel icon="dollar">Earning Potential</SLabel><h2 style={{ fontSize:42, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", letterSpacing:"-1px" }}>Two Ways to Earn. Both <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Recurring.</span></h2><p style={{ fontSize:15, color:"#71717a", maxWidth:480, margin:"0 auto" }}>Tutorii pays you every month for as long as your referrals stay subscribed.</p></div></FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:720, margin:"0 auto 40px", alignItems:"stretch" }}>
            <FadeIn delay={0.1}><SpotlightCard padding={40} style={{ textAlign:"center", justifyContent:"center", alignItems:"center" }} outerStyle={{ background:"linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)" }}><div style={{ fontSize:12, fontWeight:500, color:"#a1a1aa", letterSpacing:"1px", marginBottom:12, minHeight:32, display:"flex", alignItems:"center", justifyContent:"center" }}>LEVEL 1 · DIRECT</div><div style={{ fontSize:40, fontWeight:500, color:"#d4d4d8", letterSpacing:"-1.5px" }}>40%</div><div style={{ fontSize:16, fontWeight:400, color:"#a1a1aa", margin:"4px 0 16px" }}>{"AED "+(PRICE*L1_RATE).toFixed(2)+"/mo each"}</div><p style={{ fontSize:13, color:"#71717a", lineHeight:1.7, margin:0 }}>For every person who subscribes through your link.</p></SpotlightCard></FadeIn>
            <FadeIn delay={0.2}><SpotlightCard padding={40} style={{ textAlign:"center", justifyContent:"center", alignItems:"center" }}><div style={{ fontSize:12, fontWeight:500, color:"#71717a", letterSpacing:"1px", marginBottom:12, minHeight:32, display:"flex", alignItems:"center", justifyContent:"center" }}>LEVEL 2 · INDIRECT</div><div style={{ fontSize:40, fontWeight:500, color:"#a1a1aa", letterSpacing:"-1.5px" }}>5%</div><div style={{ fontSize:16, fontWeight:400, color:"#71717a", margin:"4px 0 16px" }}>{"AED "+(PRICE*L2_RATE).toFixed(2)+"/mo each"}</div><p style={{ fontSize:13, color:"#52525b", lineHeight:1.7, margin:0 }}>For subscribers brought in by your referrals.</p></SpotlightCard></FadeIn>
          </div>
          <FadeIn delay={0.3}><GCard padding={24} outerStyle={{ maxWidth:720, margin:"0 auto" }}><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>{["No cap on referrals","No recruitment requirement","Paid every Tuesday to your bank","Only 2 levels  - not MLM","No inventory or quotas","Earn from day one"].map(function(f){return <div key={f} style={{ fontSize:13, color:"#71717a", display:"flex", gap:8, alignItems:"center", lineHeight:1.5 }}><span style={{ color:"#a1a1aa" }}>{"\u2713"}</span>{f}</div>})}</div></GCard></FadeIn>
        </div>
      </section>

      {/* CALCULATOR */}
      <section style={{ padding:"140px 48px", position:"relative", overflow:"hidden" }}>
        <GlowLine /><BgIllustration name="growth" position="right" y="40%" scale={0.9} opacity={0.04} />
        <div style={{ maxWidth:580, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <FadeIn><h2 style={{ fontSize:32, fontWeight:600, color:"#d4d4d8", margin:"0 0 8px", letterSpacing:"-0.5px" }}>Income <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Calculator</span></h2><p style={{ fontSize:14, color:"#71717a", marginBottom:40 }}>Drag the slider to see your potential monthly earnings</p></FadeIn>
          <FadeIn delay={0.15}><GCard padding={40}>
            <div style={{ marginBottom:28 }}>
              <input type="range" min={1} max={100} value={refs} onChange={function(e){setRefs(Number(e.target.value))}} style={{ width:"100%", accentColor:"#a1a1aa", height:2 }} />
              <div style={{ fontSize:40, fontWeight:600, color:"#d4d4d8", marginTop:12, letterSpacing:"-1px" }}>{refs+" referral"+(refs===1?"":"s")}</div>
              <div style={{ fontSize:12, color:"#52525b" }}>{"+ ~"+estL2+" indirect referrals"}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, maxWidth:420, margin:"0 auto" }}>
              {[["Direct 40%",l1earn],["Indirect 5%",l2earn],["Net Profit",net]].map(function(d){return (
                <div key={d[0]} style={{ background: d[0]==="Net Profit" && net>0 ? "rgba(200,180,140,0.06)" : "rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid "+(d[0]==="Net Profit" && net>0 ? "rgba(200,180,140,0.12)" : "rgba(255,255,255,0.04)"), textAlign:"center", transition:"background 0.3s, border-color 0.3s" }}>
                  <div style={{ fontSize:11, color:"#52525b", marginBottom:4 }}>{d[0]}</div>
                  <div style={{ fontSize:18, fontWeight:500, color:d[0]==="Net Profit"&&d[1]<0?"#ef4444":"#d4d4d8" }}>{"AED "+d[1].toFixed(2)}</div>
                </div>
              )})}
            </div>
            <div style={{ marginTop:16, fontSize:12, color:"#52525b" }}>{"AED "+(net*12).toFixed(2)+"/year"}</div>
          </GCard></FadeIn>
          <FadeIn delay={0.3}><div style={{ marginTop:40 }}><Btn onClick={function(){go("subscribe")}}>{"Start Earning Today"}</Btn></div></FadeIn>
        </div>
      </section>

      {/* INCOME TABLE WITH GLOW ROWS */}
      <section style={{ padding:"80px 48px 140px", position:"relative", overflow:"hidden" }}>
        <GlowLine />
        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:1 }}>
          <FadeIn><div style={{ textAlign:"center", marginBottom:40 }}><h2 style={{ fontSize:28, fontWeight:600, color:"#d4d4d8", letterSpacing:"-0.5px" }}>Realistic Income <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Scenarios</span></h2></div></FadeIn>
          <FadeIn delay={0.15}><GCard padding={0}><div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.2fr 1.2fr", minWidth:580 }}>
            {["Situation","Direct","Indirect","Monthly","Annually"].map(function(h){return <div key={h} style={{ padding:"16px 14px", fontSize:12, fontWeight:500, color:"#52525b", borderBottom:"1px solid rgba(255,255,255,0.06)", textTransform:"uppercase", letterSpacing:"0.5px", display:"flex", alignItems:"center" }}>{h}</div>})}
            {[{s:"Just started",l1:3,l2:2},{s:"Building momentum",l1:10,l2:8},{s:"Strong network",l1:25,l2:30},{s:"Serious earner",l1:50,l2:80},{s:"Top 1%",l1:100,l2:200}].map(function(r,ri){var m=r.l1*PRICE*L1_RATE+r.l2*PRICE*L2_RATE-PRICE;var row=[r.s,r.l1,r.l2,"AED "+m.toFixed(2),"AED "+(m*12).toFixed(2)];return <GlowRow key={ri} style={{ display:"contents" }}>{row.map(function(cell,ci){return <div key={ri+"-"+ci} style={{ padding:"14px 14px", fontSize:14, fontWeight:ci>2?500:400, color:ci>2?"#d4d4d8":"#71717a", borderBottom:"1px solid rgba(255,255,255,0.03)", display:"flex", alignItems:"center" }}>{cell}</div>})}</GlowRow>})}
          </div></div></GCard></FadeIn>
        </div>
      </section>

      <CtaBanner go={go} title="The Sooner You Start, the Sooner You Earn" sub="Every week that passes is a week of commissions you could have been collecting" />
      <SiteFooter go={go} />
    </div>
  );
}

function CurriculumPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);
  var md = {"Life in the UAE":"Navigate daily life confidently. Customs, government services, healthcare, and housing.","Workers Rights & Legal":"Know your rights. Employment law, disputes, visa regulations, and legal resources.","Job Search & Career":"Stand out in the Gulf market. CV building, interviews, job portals, and networking.","Financial Literacy":"Control your money. Budgeting, remittance, debt avoidance, and building savings.","Entrepreneurship":"Create your own opportunity. Side hustles, freelancing, and scaling your referral business."};

  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} active="curriculum" />
      <section style={{ paddingTop:mob?120:160, padding:mob?"120px 20px 60px":"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="book_bg" position="right" y="45%" scale={1.2} opacity={0.04} /><DotGrid opacity={0.045} />
        <FadeIn><div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="book">The Curriculum</SLabel>
          <h1 style={{ fontSize:mob?32:48, fontWeight:600, color:"#d4d4d8", margin:"0 0 18px", lineHeight:1.1, letterSpacing:mob?"-1px":"-1.5px" }}>Education for <ShimmerText style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, fontSize:48, letterSpacing:"-1.5px" }}>Your Life Here</ShimmerText></h1>
          <p style={{ fontSize:16, color:"#71717a", maxWidth:560, margin:"0 auto 32px", lineHeight:1.7 }}>Practical skills for expatriates. Every lesson built for the Gulf.</p>
          <div style={{ display:"flex", gap:48, justifyContent:"center" }}>
            {[[INIT_COURSES.length+"","Modules"],[tl+"","Lessons"]].map(function(s){return <div key={s[1]}><div style={{ fontSize:32, fontWeight:600, color:"#d4d4d8", letterSpacing:"-1px" }}>{s[0]}</div><div style={{ fontSize:12, color:"#52525b", marginTop:2 }}>{s[1]}</div></div>})}
          </div>
        </div></FadeIn>
      </section>
      <section style={{ padding:mob?"0 16px 60px":"0 48px 100px" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          {INIT_COURSES.map(function(c,ci){return (
            <FadeIn key={c.id} delay={ci*0.1}><SpotlightCard padding={32} outerStyle={{ marginBottom:16 }}>
              <div style={{ display:mob?"flex":"flex", flexDirection:mob?"column":"row", alignItems:mob?"flex-start":"center", gap:mob?12:16, marginBottom:18 }}>
                {!mob && <ProgressRing percent={0} />}
                <div style={{ width:mob?44:52, height:mob?44:52, borderRadius:14, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", lineHeight:0 }}><Ico name={c.icon} size={22} color="rgb(200,180,140)" /></div>
                <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:500, color:"#52525b", letterSpacing:"1px" }}>{"MODULE "+(ci+1)}</div><h2 style={{ fontSize:mob?18:20, fontWeight:600, color:"#d4d4d8", margin:"2px 0 6px" }}>{c.module}</h2><p style={{ fontSize:13, color:"#52525b", margin:0 }}>{md[c.module]||""}</p></div>
                {!mob && <div style={{ fontSize:12, color:"#3f3f46" }}>{c.lessons.length+" lessons"}</div>}
              </div>
              {c.lessons.map(function(l,li){return (
                <div key={l.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderTop:"1px solid rgba(255,255,255,0.04)", minHeight:44 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:26, height:26, borderRadius:7, background:"rgba(255,255,255,0.03)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500, color:"#3f3f46", flexShrink:0, lineHeight:1 }}>{li+1}</div>
                    <span style={{ fontSize:14, color:"#a1a1aa" }}>{l.title}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:"#3f3f46" }}>{l.dur}</span>
                    
                  </div>
                </div>
              )})}
            </SpotlightCard></FadeIn>
          )})}
        </div>
      </section>
      <CtaBanner go={go} title={"Get Instant Access to All "+tl+" Lessons"} sub={"AED "+PRICE+"/month \u00B7 Every module \u00B7 Every update"} />
      <SiteFooter go={go} />
    </div>
  );
}

function FaqPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _open = useState(null);
  var open = _open[0]; var setOpen = _open[1];
  var tl = INIT_COURSES.reduce(function(s,c){return s+c.lessons.length},0);
  var faqs = [
    {q:"What exactly is Tutorii?",a:"A subscription education platform for expats in the UAE/GCC. $"+PRICE+"/month for "+INIT_COURSES.length+" modules, "+tl+" lessons covering life skills, legal rights, career growth, and finance  - plus an optional referral program with weekly payouts."},
    {q:"Who is Tutorii designed for?",a:"Anyone living or relocating to the UAE or GCC  - workers, professionals, families, and entrepreneurs. The content is practical and built around real challenges expats face: navigating visa rules, understanding employment rights, finding housing, managing finances, and building careers in the Gulf."},
    {q:"What topics do the courses cover?",a:"Currently "+INIT_COURSES.length+" modules: "+INIT_COURSES.map(function(c){return c.module}).join(", ")+". New modules are added regularly based on community feedback. Each lesson is 8\u201325 minutes with video content and downloadable PDF guides."},
    {q:"What languages are available?",a:"Courses are currently in English. Arabic, Hindi, Urdu, and Tagalog versions are on the roadmap. The platform interface is English-only for now."},
    {q:"Can I use Tutorii on my phone?",a:"Yes. Tutorii works on any device with a browser  - phone, tablet, laptop, or desktop. No app download needed. Your progress syncs across all your devices automatically."},
    {q:"How does the referral program work?",a:"Share your unique link. When someone subscribes through it, you earn 40% ($"+(PRICE*L1_RATE).toFixed(2)+") every month they stay active. If they refer others, you earn 5% ($"+(PRICE*L2_RATE).toFixed(2)+") on those too. Two levels, no complexity."},
    {q:"How much can I realistically earn?",a:"There is no cap. Each active Level 1 referral earns you $"+(PRICE*L1_RATE).toFixed(2)+"/month. Just 3 referrals covers your subscription and puts you in profit. 10 referrals = $"+(PRICE*L1_RATE*10).toFixed(2)+"/month. Earnings compound as your network grows."},
    {q:"When and how do I get paid?",a:"Every Tuesday via bank transfer through MamoPay to your registered IBAN. Minimum payout is AED 50. Payouts typically arrive within 1\u20133 business days depending on your bank."},
    {q:"Do I have to refer people to use Tutorii?",a:"Not at all. The referral program is completely optional. Many members use Tutorii purely for the courses and never refer anyone. The earning feature is an added benefit, not a requirement."},
    {q:"What payment methods do you accept?",a:"Visa, Mastercard, Apple Pay, and Google Pay  - all processed securely through MamoPay, a CBUAE-licensed payment provider. Tutorii never sees or stores your card details."},
    {q:"Can I cancel anytime?",a:"Yes. No cancellation fees, no lock-in contracts. Cancel from your dashboard Settings page and your access continues until the end of your current billing period. Re-subscribe anytime without losing your progress."},
    {q:"Can I get a refund?",a:"All sales are final as stated in our Terms of Service. You can cancel at any time to stop future charges, but payments already processed are non-refundable. We recommend exploring the free curriculum preview before subscribing."},
    {q:"Is my data secure?",a:"All payments are handled by MamoPay (CBUAE-licensed, PCI DSS compliant). Tutorii never sees your card numbers. We use encrypted connections, don't sell your data, and don't use advertising trackers. See our Privacy Policy for full details."},
    {q:"Is Tutorii available outside the UAE?",a:"Yes. While the content is focused on the UAE and GCC, anyone worldwide can subscribe, access courses, and participate in the referral program. Payouts are sent to any IBAN globally."},
    {q:"What if I have a problem or need help?",a:"Our AI support assistant is available 24/7 inside your dashboard and knows your account details. For human support, email support@tutorii.com  - our team responds within 24 hours (Sun\u2013Thu, 9AM\u20136PM GST)."},
    {q:"Are new courses added over time?",a:"Yes. We add new modules and lessons on a rolling basis. Upcoming topics include Digital Marketing, Mental Health & Wellbeing, and Advanced Career Skills. All new content is included in your subscription at no extra cost."},
  ];

  return (
    <div style={{ background:"#0a0a0c", color:"#d4d4d8", position:"relative" }}>
      <NoiseOverlay />
      <SiteNav go={go} active="faq" />
      <section style={{ paddingTop:mob?120:160, padding:mob?"120px 20px 60px":"160px 48px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <BgIllustration name="geometric" position="left" y="45%" scale={1} opacity={0.035} />
        <FadeIn><div style={{ maxWidth:600, margin:"0 auto", position:"relative", zIndex:1 }}>
          <SLabel icon="question">FAQ</SLabel>
          <h1 style={{ fontSize:mob?32:48, fontWeight:600, color:"#d4d4d8", margin:"0 0 14px", lineHeight:1.1, letterSpacing:mob?"-1px":"-1.5px" }}>Frequently Asked <span style={{ fontStyle:"italic", fontFamily:"Georgia, serif", fontWeight:200, color:"rgb(200,180,140)" }}>Questions</span></h1>
          <p style={{ fontSize:15, color:"#71717a" }}>Find quick answers to the most common questions</p>
        </div></FadeIn>
      </section>
      <section style={{ padding:mob?"0 16px 60px":"0 48px 120px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1.6fr", gap:24, alignItems:"start" }}>
          <FadeIn><div style={mob?{order:2}:{}}><SpotlightCard padding={32}>
            <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", lineHeight:0 }}><Ico name="question" size={22} color="rgb(200,180,140)" /></div>
            <h3 style={{ fontSize:18, fontWeight:600, color:"#d4d4d8", margin:"0 0 8px" }}>Still Have Questions?</h3>
            <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:20 }}>Feel free to get in touch with us today!</p>
            <Btn onClick={function(){go("contact")}} outline style={{ fontSize:13, width:"100%" }}>Ask A Question</Btn>
          </SpotlightCard></div></FadeIn>
          <div style={mob?{order:1}:{}}>
            {faqs.map(function(f,fi){
              var isOpen = open === fi;
              return (
                <FadeIn key={fi} delay={fi*0.06}><div onClick={function(){setOpen(isOpen?null:fi)}} style={{ borderRadius:14, padding:"18px 22px", border:"1px solid rgba(255,255,255,"+(isOpen?"0.1":"0.06")+")", marginBottom:8, cursor:"pointer", background:isOpen?"rgba(255,255,255,0.03)":"transparent", transition:"background 0.3s, border-color 0.3s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:15, fontWeight:500, color:"#d4d4d8" }}>{f.q}</span>
                    <span style={{ fontSize:18, color:"#52525b", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.3s", flexShrink:0, marginLeft:16, lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", width:24, height:24 }}>{"\u2303"}</span>
                  </div>
                  <div style={{ maxHeight:isOpen?200:0, overflow:"hidden", transition:"max-height 0.4s ease-out, opacity 0.3s", opacity:isOpen?1:0 }}>
                    <p style={{ fontSize:14, color:"#71717a", lineHeight:1.8, margin:"16px 0 0", paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.04)" }}>{f.a}</p>
                  </div>
                </div></FadeIn>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBanner go={go} title="Ready to See What Tutorii Can Do?" sub={"Courses, referral tools, and weekly payouts for AED "+PRICE+"/month"} />
      <SiteFooter go={go} />
    </div>
  );
}


// ═════════════════════════════════════════
// USER LOGIN
// ═════════════════════════════════════════
function UserLogin(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _email = useState("");
  var email = _email[0]; var setEmail = _email[1];
  var _pass = useState("");
  var pass = _pass[0]; var setPass = _pass[1];
  var _err = useState("");
  var error = _err[0]; var setError = _err[1];

  var _loading = useState(false);
  var loading = _loading[0]; var setLoading = _loading[1];

  var { login } = useAuth();

  async function handleLogin() {
    if (!email || !pass) { setError("Please enter your email and password"); return; }
    setLoading(true); setError("");
    try {
      await login(email, pass);
      go("userPortal");
    } catch(e) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 50%", background:"#111113", display:"flex", flexDirection:"column", justifyContent:"center", padding:mob?"32px 24px":"64px 56px" }}>
        <Logo light onClick={function(){go("landing")}} />
        <h2 style={{ fontSize:mob?28:36, fontWeight:800, color:"#fff", margin:mob?"24px 0 10px":"48px 0 16px", lineHeight:1.15 }}>Welcome back</h2>
        <p style={{ fontSize:mob?14:15, color:"rgb(200,180,140)", lineHeight:1.7, maxWidth:380 }}>Log in to access your courses, track your referrals, and manage your earnings.</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:400, width:"100%" }}>
          <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Log in to your account</h3>
          <p style={{ fontSize:14, color:"#71717a", marginBottom:32 }}>Enter your email and password</p>
          {error && <div style={{ padding:"14px 18px", borderRadius:12, background:"linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))", border:"1px solid rgba(248,113,113,0.15)", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"#fca5a5", lineHeight:1.3 }}>{error === "invalid" ? "Invalid login credentials" : error}</div>
              <div style={{ fontSize:11, color:"rgba(248,113,113,0.6)", marginTop:2 }}>{error === "invalid" ? "The email or password you entered is incorrect. Please try again." : ""}</div>
            </div>
          </div>}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Email Address</label>
            <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setError("")}} placeholder="you@example.com" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Password</label>
            <input type="password" value={pass} onChange={function(e){setPass(e.target.value);setError("")}} onKeyDown={function(e){if(e.key==="Enter") handleLogin()}} placeholder="********" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
          </div>
          <div style={{ textAlign:"right", marginBottom:24 }}>
            <span onClick={function(){go("forgotPassword")}} style={{ fontSize:12, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:500 }}>Forgot password?</span>
          </div>
          <Btn onClick={handleLogin} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:12, opacity:loading?0.6:1 }}>{loading ? "Logging in..." : "Log In"}</Btn>
          <div style={{ textAlign:"center", padding:"8px 12px", borderRadius:8, background:"rgba(200,180,140,0.08)", fontSize:12, color:"rgb(200,180,140)", marginBottom:16 }}>

          </div>
          <div style={{ textAlign:"center", fontSize:13, color:"#71717a" }}>
            {"No account? "}<span onClick={function(){go("subscribe")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer" }}>Subscribe now</span>
          </div>
          <div style={{ textAlign:"center", marginTop:16 }}>
            <span onClick={function(){go("landing")}} style={{ fontSize:12, color:"#52525b", cursor:"pointer" }}>Back to home</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// FORGOT PASSWORD
// ═════════════════════════════════════════
function ForgotPasswordPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _email = useState("");
  var email = _email[0]; var setEmail = _email[1];
  var _sent = useState(false);
  var sent = _sent[0]; var setSent = _sent[1];
  var _loading = useState(false);
  var loading = _loading[0]; var setLoading = _loading[1];
  var _error = useState("");
  var error = _error[0]; var setError = _error[1];
  var _countdown = useState(0);
  var countdown = _countdown[0]; var setCountdown = _countdown[1];

  useEffect(function() {
    if (countdown <= 0) return;
    var t = setTimeout(function() { setCountdown(countdown - 1); }, 1000);
    return function() { clearTimeout(t); };
  }, [countdown]);

  function handleSubmit() {
    if (!email.trim()) { setError("Please enter your email address"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address"); return; }
    setLoading(true); setError("");
    setTimeout(function() {
      setSent(true);
      setLoading(false);
      setCountdown(60);
    }, 1200);
  }

  function handleResend() {
    if (countdown > 0) return;
    setLoading(true);
    setTimeout(function() {
      setLoading(false);
      setCountdown(60);
    }, 800);
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 50%", background:"#111113", display:"flex", flexDirection:"column", justifyContent:"center", padding:mob?"32px 24px":"64px 56px" }}>
        <Logo light onClick={function(){go("landing")}} />
        <h2 style={{ fontSize:mob?28:36, fontWeight:800, color:"#fff", margin:mob?"24px 0 10px":"48px 0 16px", lineHeight:1.15 }}>Reset your password</h2>
        <p style={{ fontSize:mob?14:15, color:"rgb(200,180,140)", lineHeight:1.7, maxWidth:380 }}>{"Don\u2019t worry, it happens to everyone. We\u2019ll send you a link to get back in."}</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:400, width:"100%" }}>

          {!sent ? (
            <div>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Forgot your password?</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:32, lineHeight:1.7 }}>{"Enter the email address linked to your account and we\u2019ll send you a password reset link."}</p>

              {error && <div style={{ padding:"14px 18px", borderRadius:12, background:"linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))", border:"1px solid rgba(248,113,113,0.15)", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fca5a5", lineHeight:1.3 }}>{error}</div>
              </div>}

              <div style={{ marginBottom:24 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Email Address</label>
                <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setError("")}} onKeyDown={function(e){if(e.key==="Enter") handleSubmit()}} placeholder="you@example.com" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
              </div>

              <Btn onClick={handleSubmit} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:16, opacity:loading?0.6:1 }}>{loading ? "Sending..." : "Send Reset Link"}</Btn>

              <div style={{ textAlign:"center", fontSize:13, color:"#71717a" }}>
                {"Remember your password? "}<span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer" }}>Back to login</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="rgb(200,180,140)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="rgb(200,180,140)" strokeWidth="1.5"/></svg>
              </div>
              <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Check your inbox</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:24, lineHeight:1.7 }}>{"We\u2019ve sent a password reset link to:"}</p>

              <div style={{ background:"rgba(200,180,140,0.06)", border:"1px solid rgba(200,180,140,0.12)", borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(200,180,140,0.1)", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize:14, fontWeight:600, color:"rgb(200,180,140)" }}>{email}</span>
              </div>

              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:20, border:"1px solid rgba(255,255,255,0.06)", marginBottom:24 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:10 }}>{"Didn\u2019t receive it?"}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"#52525b", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#71717a" }}>Check your spam or junk folder</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"#52525b", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#71717a" }}>Make sure the email address is correct</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"#52525b", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#71717a" }}>The link expires in 30 minutes</span>
                  </div>
                </div>
              </div>

              <button onClick={handleResend} disabled={countdown > 0 || loading} style={{ width:"100%", padding:"13px", borderRadius:12, border:"1px solid "+(countdown > 0 ? "rgba(255,255,255,0.06)" : "rgba(200,180,140,0.2)"), background:countdown > 0 ? "transparent" : "rgba(200,180,140,0.06)", color:countdown > 0 ? "#52525b" : "rgb(200,180,140)", fontSize:14, fontWeight:600, cursor:countdown > 0 ? "default" : "pointer", marginBottom:16, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.3s" }}>
                {loading ? "Resending..." : countdown > 0 ? "Resend available in " + countdown + "s" : "Resend Reset Link"}
              </button>

              <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
                <span onClick={function(){go("login")}} style={{ fontSize:13, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600 }}>Back to login</span>
                <span style={{ color:"#27272a" }}>{"\u00B7"}</span>
                <span onClick={function(){go("support")}} style={{ fontSize:13, color:"#71717a", cursor:"pointer" }}>Contact support</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// RESET PASSWORD (user lands here from email link)
// ═════════════════════════════════════════
function ResetPasswordPage(props) {
  var go = props.go;
  var mob = useIsMobile();

  // In production, extract token from URL: new URLSearchParams(window.location.search).get("token")
  var _token = useState(new URLSearchParams(window.location.search).get("token") || "");
  var token = _token[0];
  var _pass = useState(""); var pass = _pass[0]; var setPass = _pass[1];
  var _confirm = useState(""); var confirm = _confirm[0]; var setConfirm = _confirm[1];
  var _loading = useState(false); var loading = _loading[0]; var setLoading = _loading[1];
  var _error = useState(""); var error = _error[0]; var setError = _error[1];
  var _done = useState(false); var done = _done[0]; var setDone = _done[1];
  var _validating = useState(true); var validating = _validating[0]; var setValidating = _validating[1];
  var _tokenValid = useState(false); var tokenValid = _tokenValid[0]; var setTokenValid = _tokenValid[1];
  var _tokenEmail = useState(""); var tokenEmail = _tokenEmail[0]; var setTokenEmail = _tokenEmail[1];
  var _showPass = useState(false); var showPass = _showPass[0]; var setShowPass = _showPass[1];

  // Validate token on mount
  useEffect(function() {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      return;
    }
    // In production, call: auth.validateResetToken(token)
    // For demo, simulate validation
    setTimeout(function() {
      setTokenValid(true);
      setTokenEmail("aisha@example.com");
      setValidating(false);
    }, 600);
  }, []);

  function validate() {
    if (!pass) { setError("Please enter a new password"); return false; }
    if (pass.length < 8) { setError("Password must be at least 8 characters"); return false; }
    if (!/[A-Z]/.test(pass)) { setError("Password must contain at least one uppercase letter"); return false; }
    if (!/[0-9]/.test(pass)) { setError("Password must contain at least one number"); return false; }
    if (pass !== confirm) { setError("Passwords do not match"); return false; }
    return true;
  }

  function handleSubmit() {
    setError("");
    if (!validate()) return;
    setLoading(true);
    // In production, call: auth.resetPassword(token, pass)
    setTimeout(function() {
      setDone(true);
      setLoading(false);
    }, 1000);
  }

  // Password strength indicator
  var strength = 0;
  if (pass.length >= 8) strength++;
  if (/[A-Z]/.test(pass)) strength++;
  if (/[0-9]/.test(pass)) strength++;
  if (/[^A-Za-z0-9]/.test(pass)) strength++;
  var strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] || "";
  var strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e", "#10b981"][strength] || "";

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 50%", background:"#111113", display:"flex", flexDirection:"column", justifyContent:"center", padding:mob?"32px 24px":"64px 56px" }}>
        <Logo light onClick={function(){go("landing")}} />
        <h2 style={{ fontSize:mob?28:36, fontWeight:800, color:"#fff", margin:mob?"24px 0 10px":"48px 0 16px", lineHeight:1.15 }}>Choose a new password</h2>
        <p style={{ fontSize:mob?14:15, color:"rgb(200,180,140)", lineHeight:1.7, maxWidth:380 }}>{"Pick something secure that you\u2019ll remember. You\u2019ll be able to log in immediately after."}</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:400, width:"100%" }}>

          {validating ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", animation:"pulse 1.5s ease-in-out infinite" }}>
                <Ico name="shield" size={18} color="rgb(200,180,140)" />
              </div>
              <p style={{ fontSize:14, color:"#71717a" }}>Validating your reset link...</p>
            </div>
          ) : !tokenValid ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.15)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Invalid or expired link</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:28, lineHeight:1.7 }}>This password reset link is no longer valid. It may have expired or already been used.</p>
              <Btn onClick={function(){go("forgotPassword")}} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:12 }}>Request a New Link</Btn>
              <div style={{ textAlign:"center" }}>
                <span onClick={function(){go("login")}} style={{ fontSize:13, color:"#71717a", cursor:"pointer" }}>Back to login</span>
              </div>
            </div>
          ) : done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="rgb(200,180,140)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="rgb(200,180,140)" strokeWidth="1.5"/></svg>
              </div>
              <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Password reset complete</h3>
              <p style={{ fontSize:14, color:"#71717a", marginBottom:28, lineHeight:1.7 }}>Your password has been updated successfully. You can now log in with your new password.</p>
              <Btn onClick={function(){go("login")}} full style={{ padding:"13px", fontSize:15, borderRadius:12 }}>Log In</Btn>
            </div>
          ) : (
            <div>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, rgba(200,180,140,0.12), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="rgb(200,180,140)" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="rgb(200,180,140)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Set a new password</h3>
              {tokenEmail && <p style={{ fontSize:13, color:"#52525b", marginBottom:24 }}>{"for " + tokenEmail}</p>}

              {error && <div style={{ padding:"14px 18px", borderRadius:12, background:"linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))", border:"1px solid rgba(248,113,113,0.15)", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fca5a5", lineHeight:1.3 }}>{error}</div>
              </div>}

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>New Password</label>
                <div style={{ position:"relative" }}>
                  <input type={showPass ? "text" : "password"} value={pass} onChange={function(e){setPass(e.target.value);setError("")}} placeholder="Minimum 8 characters" style={{ width:"100%", padding:"12px 44px 12px 16px", borderRadius:10, border:"1px solid "+(error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
                  <button onClick={function(){setShowPass(!showPass)}} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:4, lineHeight:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d={showPass ? "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"} stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>{!showPass && <circle cx="12" cy="12" r="3" stroke="#52525b" strokeWidth="1.5"/>}</svg>
                  </button>
                </div>
                {pass && <div style={{ display:"flex", gap:4, marginTop:8 }}>
                  {[1,2,3,4].map(function(i){return <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i <= strength ? strengthColor : "rgba(255,255,255,0.06)", transition:"background 0.3s" }} />})}
                  <span style={{ fontSize:10, color:strengthColor, fontWeight:600, marginLeft:4 }}>{strengthLabel}</span>
                </div>}
                <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:4 }}>
                  {[["8+ characters", pass.length >= 8],["One uppercase letter",/[A-Z]/.test(pass)],["One number",/[0-9]/.test(pass)]].map(function(r){return <div key={r[0]} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:r[1] ? "rgb(200,180,140)" : "#3f3f46", transition:"color 0.3s" }}><span>{r[1] ? "\u2713" : "\u2022"}</span>{r[0]}</div>})}
                </div>
              </div>

              <div style={{ marginBottom:28 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={function(e){setConfirm(e.target.value);setError("")}} onKeyDown={function(e){if(e.key==="Enter") handleSubmit()}} placeholder="Re-enter your password" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid "+(error && error.includes("match") ? "rgba(248,113,113,0.3)" : confirm && confirm === pass ? "rgba(200,180,140,0.3)" : "rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8", transition:"border-color 0.3s" }} />
                {confirm && confirm === pass && <div style={{ fontSize:11, color:"rgb(200,180,140)", marginTop:4, display:"flex", alignItems:"center", gap:4 }}>{"\u2713"} Passwords match</div>}
              </div>

              <Btn onClick={handleSubmit} full style={{ padding:"13px", fontSize:15, borderRadius:12, marginBottom:16, opacity:loading?0.6:1 }}>{loading ? "Updating..." : "Reset Password"}</Btn>

              <div style={{ textAlign:"center" }}>
                <span onClick={function(){go("login")}} style={{ fontSize:13, color:"#71717a", cursor:"pointer" }}>Back to login</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// SUBSCRIBE
// ═════════════════════════════════════════
function Subscribe(props) {
  var go = props.go;
  var mob = useIsMobile();
  var _step = useState(1);
  var step = _step[0]; var setStep = _step[1];
var _form = useState({ name:"", email:"", password:"", phone:"", language:"English", ref: props.refCode || "" });  var form = _form[0]; var setForm = _form[1];
  var _proc = useState(false);
  var processing = _proc[0]; var setProcessing = _proc[1];
  var _err = useState({}); var errors = _err[0]; var setErrors = _err[1];
  var _terms = useState(false); var termsAgreed = _terms[0]; 
  var setTermsAgreed = _terms[1];
  var { register } = useAuth();

  function set(k, v) { setForm(function(p) { var n = Object.assign({}, p); n[k] = v; return n; }); setErrors(function(p){ var n=Object.assign({},p); delete n[k]; return n; }); }
  function validateStep1() {
    var e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Password must contain at least one uppercase letter";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[+]?[\d\s-]{7,15}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handlePay() {
    if (!termsAgreed) return;
    setProcessing(true);
    try {
      await register(form.name, form.email, form.password, form.ref || null);
      const sub = await subscriptionsApi.create();
      if (sub.payment_link) window.open(sub.payment_link, "_blank");
      setStep(3);
    } catch(e) {
      var msg = e.message || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exist") || msg.includes("409")) {
        msg = "An account with this email already exists. Please log in instead.";
      }
      setErrors({ api: msg });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:mob?"column":"row", background:"#0a0a0c" }}>
      <div style={{ flex:mob?"none":"0 0 420px", background:"#111113", padding:mob?"32px 24px":"48px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <Logo light onClick={function(){go("landing")}} />
          <h2 style={{ fontSize:mob?22:26, fontWeight:800, color:"#d4d4d8", margin:mob?"24px 0 10px":"48px 0 12px" }}>Start your journey</h2>
          <p style={{ fontSize:14, color:"rgb(200,180,140)", lineHeight:1.7 }}>Instant access to all courses and your earning dashboard.</p>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:mob?"24px 20px":48 }}>
        <div style={{ maxWidth:460, width:"100%" }}>
          <div style={{ display:"flex", gap:8, marginBottom:36 }}>
            {["Your Details","Payment","Welcome!"].map(function(s,i){ return (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:3, borderRadius:2, background: i+1<=step ? "rgb(200,180,140)" : "#27272a", marginBottom:6 }} />
                <div style={{ fontSize:11, fontWeight:600, color: i+1<=step ? "#d4d4d8" : "#b0b8c4" }}>{s}</div>
              </div>
            )})}
          </div>

          {step === 1 && <div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 24px" }}>Create your account</h3>
            {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"],["Phone","phone","tel"]].map(function(f){ return (
              <div key={f[1]} style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:5 }}>{f[0]} *</label>
                <input type={f[2]} value={form[f[1]]} onChange={function(e){set(f[1],e.target.value)}} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid "+(errors[f[1]]?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
                {errors[f[1]] && <div style={{ fontSize:11, color:"#f87171", marginTop:4 }}>{errors[f[1]]}</div>}
              </div>
            )})}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:5 }}>Referral Code (optional)</label>
              <input value={form.ref} onChange={function(e){set("ref",e.target.value)}} placeholder="e.g. DAVID2026" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid "+(errors.ref?"rgba(248,113,113,0.5)":form.ref && !errors.ref?"rgba(200,180,140,0.4)":"rgba(255,255,255,0.1)"), fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:form.ref && !errors.ref?"rgba(200,180,140,0.06)":"#0a0a0c", color:"#d4d4d8" }} />
              {errors.ref && <div style={{ fontSize:11, color:"#f87171", marginTop:4 }}>{errors.ref}</div>}
              {form.ref && !errors.ref && <div style={{ fontSize:11, color:"rgb(200,180,140)", marginTop:4, display:"flex", alignItems:"center", gap:4 }}><Ico name="shield" size={10} color="rgb(200,180,140)" />{" Referred by code: "+form.ref.toUpperCase()}</div>}
            </div>
            <Btn onClick={function(){if(validateStep1())setStep(2)}} full style={{ padding:"13px", fontSize:15, borderRadius:12 }}>Continue to Payment</Btn>
            <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#71717a" }}>
              {"Already have an account? "}<span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer" }}>Log in</span>
            </div>
          </div>}

          {step === 2 && <div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#d4d4d8", margin:"0 0 24px" }}>Complete payment</h3>
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:20, marginBottom:24, border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:14, color:"#71717a" }}>Tutorii Monthly</span>
                <span style={{ fontSize:14, fontWeight:500, color:"#d4d4d8" }}>{"AED "+PRICE+"/month"}</span>
              </div>
            </div>
            <div style={{ background:"#131315", borderRadius:12, border:"2px dashed rgba(255,255,255,0.1)", padding:36, textAlign:"center", marginBottom:24 }}>
              <div style={{ marginBottom:10, lineHeight:0 }}><Ico name="bank" size={32} color="rgb(200,180,140)" /></div>
              <div style={{ fontSize:14, fontWeight:600, color:"#d4d4d8" }}>MamoPay Secure Checkout</div>
              <div style={{ fontSize:12, color:"#52525b" }}>Visa - Mastercard - Apple Pay - Google Pay</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                <input type="checkbox" checked={termsAgreed} onChange={function(e){setTermsAgreed(e.target.checked)}} style={{ marginTop:3, accentColor:"rgb(200,180,140)" }} />
                <span style={{ fontSize:12, color:"#71717a", lineHeight:1.6 }}>{"I agree to the "}<span onClick={function(e){e.preventDefault();go("terms")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Terms of Service</span>{" including the "}<strong style={{ color:"#f87171" }}>no-refund policy</strong>{" and "}<span onClick={function(e){e.preventDefault();go("privacy")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Privacy Policy</span>{"."}</span>
              </label>
            </div>
            <Btn onClick={function(){if(termsAgreed)handlePay()}} full style={{ padding:"13px", fontSize:15, borderRadius:12, opacity:termsAgreed?1:0.4, cursor:termsAgreed?"pointer":"not-allowed" }}>
              {processing ? "Processing..." : "Pay AED "+PRICE+" - Subscribe"}
            </Btn>
            {errors.api && <div style={{ marginTop:12, padding:"10px 14px", borderRadius:8, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", fontSize:13, textAlign:"center" }}>{errors.api}{errors.api.includes("log in") && <span> <span onClick={function(){go("login")}} style={{ color:"rgb(200,180,140)", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Log in here</span></span>}</div>}
            {!termsAgreed && <div style={{ textAlign:"center", fontSize:11, color:"#52525b", marginTop:8 }}>You must accept the terms to continue</div>}
            <div style={{ textAlign:"center", marginTop:12 }}>
              <span onClick={function(){setStep(1)}} style={{ fontSize:13, color:"rgb(200,180,140)", cursor:"pointer" }}>Back</span>
            </div>
          </div>}

          {step === 3 && <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(200,180,140,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", lineHeight:0 }}><Ico name="shield" size={28} color="rgb(200,180,140)" /></div>
            <h3 style={{ fontSize:24, fontWeight:700, color:"#d4d4d8", margin:"0 0 10px" }}>Welcome to Tutorii!</h3>
            <p style={{ fontSize:14, color:"#71717a", marginBottom:12 }}>Your subscription is active.</p>
            <div style={{ background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.15)", borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
              <Ico name="chat" size={16} color="rgb(200,180,140)" />
              <span style={{ fontSize:12, color:"rgb(200,180,140)" }}>{"A verification email has been sent to "}<strong>{form.email}</strong>{". Please verify your email to secure your account."}</span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:16, marginBottom:24, border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#52525b", marginBottom:6 }}>YOUR REFERRAL LINK</div>
              <code style={{ fontSize:13, color:"#d4d4d8", fontWeight:600 }}>{"tutorii.com/ref/" + (form.ref || "YOUR_CODE")}</code>
            </div>
            <Btn onClick={function(){go("userPortal")}} full style={{ padding:"13px", fontSize:15, borderRadius:12 }}>Enter My Dashboard</Btn>
          </div>}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// LESSON EDIT PANEL (Admin)
// ═════════════════════════════════════════
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
function UserPortal(props) {
  var go = props.go;
  var courses = props.courses;
  var setCourses = props.setCourses;
  var _tab = useState(function(){
    var parts = window.location.pathname.split("/");
    var sub = parts[2];
    var valid = ["overview","referrals","earnings","payouts","courses","settings","support"];
    return (sub && valid.includes(sub)) ? sub : "overview";
  });
  var tab = _tab[0]; var setTab = _tab[1];

  function gotoTab(t) {
    setTab(t);
    window.history.pushState({}, "", "/portal/" + t);
    if (contentRef && contentRef.current) contentRef.current.scrollTop = 0;
  }
  var _oc = useState(null);
  var openCourse = _oc[0]; var setOpenCourse = _oc[1];
  var _al = useState(null);
  var activeLesson = _al[0]; var setActiveLesson = _al[1];
  var _cp = useState(false);
  var copied = _cp[0]; var setCopied = _cp[1];
  var chatOpen = props.chatOpen; var setChatOpen = props.setChatOpen;
  var chatMinimized = props.chatMinimized; var setChatMinimized = props.setChatMinimized;
  var chatMsgs = props.chatMsgs; var setChatMsgs = props.setChatMsgs;
  var chatInput = props.chatInput; var setChatInput = props.setChatInput;
  var chatLoading = props.chatLoading; var setChatLoading = props.setChatLoading;
  var _onboard = useState(0);
  var onboard = _onboard[0]; var setOnboard = _onboard[1];
  var _showOnboard = useState(true);
  var showOnboard = _showOnboard[0]; var setShowOnboard = _showOnboard[1];
  var _showCancel = useState(false); var showCancel = _showCancel[0]; var setShowCancel = _showCancel[1];
  var _cancelled = useState(false); var cancelled = _cancelled[0]; var setCancelled = _cancelled[1];
  var _cancelling = useState(false); var cancelling = _cancelling[0]; var setCancelling = _cancelling[1];
  var _cancelErr = useState(""); var cancelErr = _cancelErr[0]; var setCancelErr = _cancelErr[1];

  async function doCancel() {
    setCancelling(true); setCancelErr("");
    try {
      await subscriptionsApi.cancel();
      setCancelled(true); setShowCancel(false);
    } catch(e) {
      setCancelErr(e.message || "Failed to cancel. Please try again.");
      setCancelling(false);
    }
  }
  var _chartRange = useState("all"); var chartRange = _chartRange[0]; var setChartRange = _chartRange[1];
  var _dashLoading = useState(true); var dashLoading = _dashLoading[0]; var setDashLoading = _dashLoading[1];
  // Support ticket state
  var _tickets = useState([
    { id:"T001", ref:"TK-8291", subject:"Payout not received for February", category:"billing", status:"in_progress", created:"Feb 26, 2026", updated:"Mar 2, 2026", messages:3 },
    { id:"T002", ref:"TK-8315", subject:"Cannot access module 3 lessons", category:"courses", status:"resolved", created:"Mar 1, 2026", updated:"Mar 3, 2026", messages:5 },
    { id:"T003", ref:"TK-8402", subject:"Referral code not tracked for Sara", category:"referrals", status:"open", created:"Mar 8, 2026", updated:"Mar 8, 2026", messages:1 },
  ]);
  var tickets = _tickets[0]; var setTickets = _tickets[1];
  var _viewTicket = useState(null); var viewTicket = _viewTicket[0]; var setViewTicket = _viewTicket[1];
  var _newTicket = useState(false); var newTicket = _newTicket[0]; var setNewTicket = _newTicket[1];
  var _ticketForm = useState({ subject:"", category:"general", message:"" }); var ticketForm = _ticketForm[0]; var setTicketForm = _ticketForm[1];
  var _ticketReply = useState(""); var ticketReply = _ticketReply[0]; var setTicketReply = _ticketReply[1];
  var _ticketMsgs = useState([]);  var ticketMsgs = _ticketMsgs[0]; var setTicketMsgs = _ticketMsgs[1];
  var contentRef = useRef(null);
  var { user: authUser, logout } = useAuth();
  var _realUser = useState(null); var realUser = _realUser[0]; var setRealUser = _realUser[1];
  var _referralStats = useState(null); var referralStats = _referralStats[0]; var setReferralStats = _referralStats[1];
  var _referralList = useState(null); var referralList = _referralList[0]; var setReferralList = _referralList[1];
  var _myCommissions = useState([]); var myCommissions = _myCommissions[0]; var setMyCommissions = _myCommissions[1];
  var _myPayouts = useState([]); var myPayouts = _myPayouts[0]; var setMyPayouts = _myPayouts[1];
  var _mySub = useState(null); var mySub = _mySub[0]; var setMySub = _mySub[1];

  useEffect(function(){
    Promise.allSettled([
      usersApi.me(),
      usersApi.referrals(),
      payoutsApi.commissions(),
      payoutsApi.mine(),
      subscriptionsApi.me(),
      coursesApi.list(),
      usersApi.referralList(),
    ]).then(function(results){
      // If /users/me 403s, session is dead — redirect to login
      if(results[0].status==="rejected" && results[0].reason && results[0].reason.message === "Session expired") {
        go("login"); return;
      }
      if(results[0].status==="fulfilled") setRealUser(results[0].value);
      if(results[1].status==="fulfilled") setReferralStats(results[1].value);
      if(results[2].status==="fulfilled") setMyCommissions(results[2].value || []);
      if(results[3].status==="fulfilled") setMyPayouts(results[3].value || []);
      if(results[4].status==="fulfilled") setMySub(results[4].value);
      if(results[5].status==="fulfilled" && results[5].value && results[5].value.length > 0) {
        setCourses(results[5].value.map(function(c){ return { id:c.id, module:c.title, icon:c.icon||"book", lessons: (c.lessons||[]).map(function(l){ return { id:l.id, title:l.title, dur:l.duration_minutes?(l.duration_minutes+" min"):"10 min", done:l.completed||false }; }) }; }));
      }
      if(results[6].status==="fulfilled") setReferralList(results[6].value);
      setDashLoading(false);
    });
  }, []);

  // Build u object from real data, falling back to USER mock for missing fields
  var u = realUser ? {
    name: realUser.full_name || "User",
    email: realUser.email || "",
    phone: realUser.phone || "",
    code: realUser.referral_code || "",
    avatar: (realUser.full_name||"U").split(" ").map(function(n){return n[0]}).join("").slice(0,2).toUpperCase(),
    status: mySub ? mySub.status : "inactive",
    plan: "Tutorii Monthly",
    paymentMethod: "MamoPay",
    joined: realUser.created_at ? new Date(realUser.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "",
    lastLogin: "Today",
    nextBilling: mySub && mySub.current_period_end ? new Date(mySub.current_period_end).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "N/A",
    referredBy: referralStats && referralStats.referred_by ? referralStats.referred_by : "Direct",
    iban: realUser.payout_iban || "",
    ibanName: realUser.payout_name || "",
    billing: [],
    earn: {
      total: parseFloat(myCommissions.reduce(function(s,c){return s+(c.amount_aed||0)},0).toFixed(2)),
      month: parseFloat(myCommissions.filter(function(c){ var d=new Date(c.created_at); var n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).reduce(function(s,c){return s+(c.amount_aed||0)},0).toFixed(2)),
      pending: parseFloat(myCommissions.filter(function(c){return c.status==="pending"}).reduce(function(s,c){return s+(c.amount_aed||0)},0).toFixed(2)),
      paid: parseFloat(myPayouts.filter(function(p){return p.status==="completed"}).reduce(function(s,p){return s+(p.amount_aed||0)},0).toFixed(2)),
    },
    l1: referralList && Array.isArray(referralList.level1) ? referralList.level1.map(function(r){ return { name:r.name||r.email, status:r.subscription_status||"inactive", date: r.joined_at ? new Date(r.joined_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "", earned: r.commission_earned||0 }; }) : [],
    l2: referralList && Array.isArray(referralList.level2) ? referralList.level2.map(function(r){ return { name:r.name||r.email, from:r.referred_by_name||"", date: r.joined_at ? new Date(r.joined_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "", earned: r.commission_earned||0 }; }) : [],
    payouts: myPayouts.map(function(p){ return { date: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "", amount: p.amount_aed||0, status: p.status||"pending", ref: p.id||"" }; }),
    earningsHistory: (function(){
      // Build weekly earnings history from commissions
      var weeks = {};
      (myCommissions||[]).forEach(function(c){
        var d = new Date(c.created_at);
        // Get week start (Monday)
        var day = d.getDay(); var diff = (day===0?-6:1-day);
        var mon = new Date(d); mon.setDate(d.getDate()+diff);
        var key = mon.toLocaleDateString("en-US",{month:"short",day:"numeric"});
        if (!weeks[key]) weeks[key] = {week:key, l1:0, l2:0, net:0};
        if (c.level===1) weeks[key].l1 += c.amount_aed||0;
        if (c.level===2) weeks[key].l2 += c.amount_aed||0;
      });
      return Object.values(weeks).map(function(w){ w.net=parseFloat((w.l1+w.l2).toFixed(2)); w.l1=parseFloat(w.l1.toFixed(2)); w.l2=parseFloat(w.l2.toFixed(2)); return w; });
    })(),
  } : {
    name: authUser ? (authUser.full_name || authUser.email) : "Loading...",
    email: authUser ? authUser.email : "",
    phone: "", code: "", avatar: authUser ? (authUser.full_name||"U").split(" ").map(function(n){return n[0]}).join("").slice(0,2).toUpperCase() : "?",
    status: "inactive", plan: "Tutorii Monthly", paymentMethod: "MamoPay",
    joined: "", lastLogin: "", nextBilling: "N/A", referredBy: "Direct",
    iban: "", ibanName: "", billing: [], earn: { total:0, month:0, pending:0, paid:0 },
    l1: [], l2: [], payouts: [], earningsHistory: [],
  };

  var mob = useIsMobile();

  var totalL = courses.reduce(function(s,c){return s+c.lessons.length},0);
  var doneL = courses.reduce(function(s,c){return s+c.lessons.filter(function(l){return l.done}).length},0);
  var pct = totalL > 0 ? Math.round((doneL/totalL)*100) : 0;
  var activeL1 = (u.l1||[]).filter(function(r){return r.status==="active"}).length;

  function copyLink() { setCopied(true); setTimeout(function(){setCopied(false)},2000); }
  function markDone(cid,lid) { setCourses(function(p){return p.map(function(c){return c.id===cid?Object.assign({},c,{lessons:c.lessons.map(function(l){return l.id===lid?Object.assign({},l,{done:true}):l})}):c})}); }

  function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    var userMsg = chatInput.trim();
    setChatInput("");
    var newMsgs = chatMsgs.concat([{role:"user",content:userMsg}]);
    setChatMsgs(newMsgs);
    setChatLoading(true);

    var l1active = (u.l1||[]).filter(function(r){return r.status==="active"});
    var l1cancelled = (u.l1||[]).filter(function(r){return r.status==="cancelled"});
    var monthlyL1 = l1active.length * PRICE * L1_RATE;
    var monthlyL2 = (u.l2||[]).length * PRICE * L2_RATE;
    var completedLessons = courses.reduce(function(s,c){return s+c.lessons.filter(function(l){return l.done}).length},0);
    var tLessons = courses.reduce(function(s,c){return s+c.lessons.length},0);

    var systemPrompt = "You are the Tutorii AI support assistant. Your job is to eliminate the need for human support by answering every possible question a user could have - about their account, billing, referrals, earnings, payouts, courses, and platform policies. Be friendly, accurate, and thorough. ONLY use the data provided below. Never guess or make up information.\n\n" +

      "=== USER PROFILE ===\n" +
      "Full Name: " + u.name + "\n" +
      "Email: " + u.email + "\n" +
      "Phone: ***" + u.phone.slice(-4) + "\n" +
      "Account Status: " + u.status + "\n" +
      "Member Since: " + u.joined + "\n" +
      "Last Login: " + u.lastLogin + "\n" +
      "Referred By: " + u.referredBy + "\n" +
      "Referral Code: " + u.code + "\n" +
      "Referral Link: tutorii.com/ref/" + u.code + "\n\n" +

      "=== SUBSCRIPTION & BILLING ===\n" +
      "Plan: " + u.plan + "\n" +
      "Payment Method: " + u.paymentMethod + " (via MamoPay)\n" +
      "Next Billing Date: " + u.nextBilling + "\n" +
      "Billing History:\n" +
      (u.billing||[]).map(function(b){return "- " + b.date + ": $" + b.amount.toFixed(2) + " (" + b.status + ") via " + b.method}).join("\n") + "\n" +
      "Total Spent on Subscription: AED " + ((u.billing||[]).length * PRICE).toFixed(2) + " (" + (u.billing||[]).length + " payments)\n\n" +

      "=== EARNINGS SUMMARY ===\n" +
      "Total Earned (all time): AED " + u.earn.total + "\n" +
      "Earned This Month: AED " + u.earn.month + "\n" +
      "Pending Payout: AED " + u.earn.pending + " (will be paid next Tuesday if above AED 50 minimum)\n" +
      "Already Paid Out: AED " + u.earn.paid + "\n" +
      "Monthly L1 Income: AED " + monthlyL1.toFixed(2) + " (" + l1active.length + " active L1 referrals x $" + (PRICE*L1_RATE).toFixed(2) + " each)\n" +
      "Monthly L2 Income: AED " + monthlyL2.toFixed(2) + " (" + (u.l2||[]).length + " L2 referrals x $" + (PRICE*L2_RATE).toFixed(2) + " each)\n" +
      "Total Monthly Gross: $" + (monthlyL1 + monthlyL2).toFixed(2) + "\n" +
      "Monthly Subscription Cost: -$" + PRICE + "\n" +
      "Net Monthly Profit: $" + (monthlyL1 + monthlyL2 - PRICE).toFixed(2) + "\n" +
      "ROI: " + (((monthlyL1 + monthlyL2 - PRICE) / PRICE) * 100).toFixed(0) + "% return on subscription cost\n" +
      "Break-even: Achieved (need 1 active L1 referral to cover subscription, user has " + l1active.length + ")\n" +
      "Lifetime Net Profit: $" + (u.earn.total - ((u.billing||[]).length * PRICE)).toFixed(2) + " (total earned minus total subscription payments)\n\n" +

      "=== EARNING PROJECTIONS ===\n" +
      "If user maintains current " + l1active.length + " active L1 and " + (u.l2||[]).length + " L2 referrals:\n" +
      "- Monthly: $" + (monthlyL1 + monthlyL2 - PRICE).toFixed(2) + " net profit\n" +
      "- Quarterly: $" + ((monthlyL1 + monthlyL2 - PRICE) * 3).toFixed(2) + " net profit\n" +
      "- Annually: $" + ((monthlyL1 + monthlyL2 - PRICE) * 12).toFixed(2) + " net profit\n" +
      "Each new L1 referral adds $" + (PRICE*L1_RATE).toFixed(2) + "/month ($" + (PRICE*L1_RATE*12).toFixed(2) + "/year)\n" +
      "Each new L2 referral adds $" + (PRICE*L2_RATE).toFixed(2) + "/month ($" + (PRICE*L2_RATE*12).toFixed(2) + "/year)\n" +
      "To reach AED 2,400/month net: need ~" + Math.ceil((500 + PRICE - monthlyL2) / (PRICE*L1_RATE)) + " active L1 referrals (currently has " + l1active.length + ")\n" +
      "To reach AED 5000/month net: need ~" + Math.ceil((1000 + PRICE - monthlyL2) / (PRICE*L1_RATE)) + " active L1 referrals\n\n" +

      "=== PAYOUT DETAILS ===\n" +
      "Payout Method: MamoPay bank transfer\n" +
      "IBAN on File: ****" + u.iban.slice(-4) + " (masked for security)" + "\n" +
      "Payout Schedule: Every Tuesday\n" +
      "Minimum Payout: AED 50\n" +
      "Current Pending: $" + u.earn.pending + "\n" +
      "Payout History:\n" +
      (u.payouts||[]).map(function(p){return "- " + p.date + " 2026: $" + p.amount.toFixed(2) + " (" + p.status + ") - " + p.method}).join("\n") + "\n" +
      "Total Payouts Received: " + (u.payouts||[]).length + " payouts totalling $" + (u.payouts||[]).reduce(function(s,p){return s+p.amount},0).toFixed(2) + "\n" +
      "Average Payout: $" + ((u.payouts||[]).reduce(function(s,p){return s+p.amount},0) / (u.payouts||[]).length).toFixed(2) + "\n\n" +

      "=== LEVEL 1 REFERRALS (Direct, 40% = $" + (PRICE*L1_RATE).toFixed(2) + "/each/month) ===\n" +
      "Total L1: " + (u.l1||[]).length + " (" + l1active.length + " active, " + l1cancelled.length + " cancelled)\n" +
      (u.l1||[]).map(function(r,i){return (i+1) + ". " + r.name + " - Joined: " + r.date + " 2026, Status: " + r.status.toUpperCase() + ", Total earned you: $" + r.earned.toFixed(2) + (r.status==="active" ? ", Currently earning $"+(PRICE*L1_RATE).toFixed(2)+"/month" : ", No longer earning (cancelled)")}).join("\n") + "\n" +
      "Best performing L1: " + (function(){var best=u.l1.reduce(function(a,b){return a.earned>b.earned?a:b});return best.name+" ($"+best.earned.toFixed(2)+" earned)"})() + "\n" +
      "Most recent L1: " + u.l1[(u.l1||[]).length-1].name + " (joined " + u.l1[(u.l1||[]).length-1].date + ")\n" +
      "L1 retention rate: " + Math.round((l1active.length/(u.l1||[]).length)*100) + "% (" + l1active.length + " of " + (u.l1||[]).length + " still active)\n\n" +

      "=== LEVEL 2 REFERRALS (Indirect, 5% = $" + (PRICE*L2_RATE).toFixed(2) + "/each/month) ===\n" +
      "Total L2: " + (u.l2||[]).length + "\n" +
      (u.l2||[]).map(function(r,i){return (i+1) + ". " + r.name + " - Referred by: " + r.from + ", Joined: " + r.date + " 2026, Earned you: $" + r.earned.toFixed(2)}).join("\n") + "\n" +
      "L2 breakdown by L1 referrer:\n" +
      (function(){var map={};u.l2.forEach(function(r){if(!map[r.from])map[r.from]=0;map[r.from]++});return Object.keys(map).map(function(k){return "- "+k+": "+map[k]+" L2 referral"+(map[k]>1?"s":"")}).join("\n")})() + "\n" +
      "Best L1 recruiter (most L2s): " + (function(){var map={};u.l2.forEach(function(r){if(!map[r.from])map[r.from]=0;map[r.from]++});var best="";var max=0;Object.keys(map).forEach(function(k){if(map[k]>max){max=map[k];best=k}});return best+" ("+max+" L2 referrals)"})() + "\n\n" +

      "=== NETWORK SUMMARY ===\n" +
      "Total Network Size: " + ((u.l1||[]).length + (u.l2||[]).length) + " people (" + (u.l1||[]).length + " L1 + " + (u.l2||[]).length + " L2)\n" +
      "Active Network: " + (l1active.length + (u.l2||[]).length) + " people generating income\n" +
      "Total Earned from L1: $" + u.l1.reduce(function(s,r){return s+r.earned},0).toFixed(2) + "\n" +
      "Total Earned from L2: $" + u.l2.reduce(function(s,r){return s+r.earned},0).toFixed(2) + "\n" +
      "Average L1 has earned user: $" + (u.l1.reduce(function(s,r){return s+r.earned},0)/(u.l1||[]).length).toFixed(2) + "\n" +
      "Average L2 has earned user: $" + (u.l2.reduce(function(s,r){return s+r.earned},0)/(u.l2||[]).length).toFixed(2) + "\n\n" +

      "=== COURSE PROGRESS (DETAILED) ===\n" +
      "Overall: " + completedLessons + "/" + tLessons + " lessons completed (" + (tLessons>0?Math.round(completedLessons/tLessons*100):0) + "%)\n" +
      "Modules Available: " + courses.length + "\n\n" +
      courses.map(function(c){
        var doneCnt = c.lessons.filter(function(l){return l.done}).length;
        var modPct = c.lessons.length > 0 ? Math.round((doneCnt/c.lessons.length)*100) : 0;
        return c.icon + " " + c.module + " - " + doneCnt + "/" + c.lessons.length + " completed (" + modPct + "%)\n" +
          c.lessons.map(function(l){
            return "  " + (l.done ? "[DONE]" : "[NOT DONE]") + " " + l.title + " (" + l.dur + ")" +
              (l.video ? " | Video: " + l.video.name + " (" + l.video.size + ")" : " | Video: not uploaded") +
              (l.pdf ? " | PDF: " + l.pdf.name + " (" + l.pdf.size + ")" : " | PDF: not available");
          }).join("\n");
      }).join("\n\n") + "\n\n" +

      "Next uncompleted lessons:\n" +
      courses.reduce(function(arr,c){
        c.lessons.forEach(function(l){if(!l.done) arr.push({module:c.module,title:l.title,dur:l.dur,hasVideo:!!l.video,hasPdf:!!l.pdf})});
        return arr;
      },[]).slice(0,5).map(function(l,i){return (i+1)+". "+l.title+" ("+l.module+", "+l.dur+")"+(l.hasVideo?" - has video":"")+(l.hasPdf?" - has PDF":"")}).join("\n") + "\n\n" +

      "Lessons with video available: " + courses.reduce(function(s,c){return s+c.lessons.filter(function(l){return l.video}).length},0) + "/" + tLessons + "\n" +
      "Lessons with PDF available: " + courses.reduce(function(s,c){return s+c.lessons.filter(function(l){return l.pdf}).length},0) + "/" + tLessons + "\n" +
      "Lessons with no content yet: " + courses.reduce(function(s,c){return s+c.lessons.filter(function(l){return !l.video&&!l.pdf}).length},0) + "/" + tLessons + "\n\n" +

      "=== PLATFORM INFO ===\n" +
      "Subscription: $" + PRICE + "/month, cancel anytime, ALL SALES FINAL (no refunds)\n" +
      "L1 Commission: 40% ($" + (PRICE*L1_RATE).toFixed(2) + ") on direct referrals\n" +
      "L2 Commission: 5% ($" + (PRICE*L2_RATE).toFixed(2) + ") on referrals of your referrals\n" +
      "Payment Processing: All payments exclusively through MamoPay (Visa, Mastercard, Apple Pay, Google Pay)\n" +
      "Payouts: Weekly Tuesdays via MamoPay bank transfer, AED 50 minimum\n" +
      "Courses: " + courses.length + " modules, " + courses.reduce(function(s,c){return s+c.lessons.length},0) + " lessons. Modules: " + courses.map(function(c){return c.module + " (" + c.lessons.length + " lessons)"}).join(", ") + "\n" +
      "Today's Date: " + new Date().toLocaleDateString("en-US", {weekday:"long",year:"numeric",month:"long",day:"numeric"}) + "\n\n" +

      "=== FAQ KNOWLEDGE BASE ===\n\n" +

      "SUBSCRIPTION & BILLING:\n" +
      "Q: How much does Tutorii cost? A: $" + PRICE + "/month. No contracts, no hidden fees, cancel anytime.\n" +
      "Q: What payment methods are accepted? A: Visa, Mastercard, Apple Pay, and Google Pay via MamoPay secure checkout.\n" +
      "Q: How do I cancel my subscription? A: Go to Account Settings and click Cancel Subscription. Your access continues until the end of your current billing period. No cancellation fees apply.\n" +
      "Q: Will I be charged automatically? A: Yes, your card is charged monthly on the same date you first subscribed. You receive an email receipt for each charge.\n" +
      "Q: Can I pause my subscription? A: We do not currently offer a pause option. You can cancel and re-subscribe at any time without losing your course progress or referral network.\n" +
      "Q: My payment failed, what do I do? A: Check your card details are up to date in Account Settings. Ensure sufficient funds are available. Try a different payment method. If problems persist, contact support@tutorii.com.\n" +
      "Q: Do you offer refunds? A: No. All sales are final and non-refundable as stated in our Terms of Service. You can cancel your subscription at any time to stop future charges, but payments already made will not be refunded. Please review our Terms of Service for full details.\n" +
      "Q: Is my payment information secure? A: Yes. All payments are processed through MamoPay, a CBUAE-licensed payment provider. Tutorii never sees, stores, or has access to your card details.\n" +
      "Q: Can I change my payment method? A: Yes, go to Account Settings and update your payment method. The new card will be used starting from your next billing cycle.\n" +
      "Q: What currency am I charged in? A: All charges are in AED (United Arab Emirates Dirham). This is the local currency used across the UAE.\n" +
      "Q: What happens if my subscription lapses? A: You lose access to courses and your dashboard. Your referral link becomes inactive and you stop earning commissions. Re-subscribe to restore everything.\n" +
      "Q: Can I upgrade or downgrade my plan? A: Currently there is one plan at $" + PRICE + "/month. All features are included.\n" +
      "Q: Do you offer annual billing or discounts? A: Not at this time. We may introduce annual plans in the future.\n" +
      "Q: I was charged twice. A: Contact support@tutorii.com immediately with your email and payment receipt. We will investigate and refund any duplicate charges.\n" +
      "Q: Can I pay with bank transfer instead of card? A: Subscriptions must be paid via card through MamoPay. Bank transfer is only used for receiving payouts.\n\n" +

      "REFERRAL PROGRAM:\n" +
      "Q: How does the referral program work? A: Share your unique referral link. When someone subscribes through it, you earn 40% ($" + (PRICE*L1_RATE).toFixed(2) + ") monthly as long as they stay subscribed (Level 1). You also earn 5% ($" + (PRICE*L2_RATE).toFixed(2) + ") on anyone they refer (Level 2).\n" +
      "Q: Where is my referral link? A: Your link is displayed at the top of your dashboard and in the Referrals tab: tutorii.com/ref/YOUR_CODE.\n" +
      "Q: Is there a limit to how many people I can refer? A: No. There is no cap on Level 1 or Level 2 referrals. The more active referrals you have, the more you earn.\n" +
      "Q: What is Level 1 vs Level 2? A: Level 1 (L1) are people who subscribe directly through YOUR link - you earn 40%. Level 2 (L2) are people who subscribe through THEIR links - you earn 5%.\n" +
      "Q: Do I earn commissions forever? A: You earn for as long as the referred user remains an active paying subscriber. If they cancel, your commission from them stops. If they re-subscribe, it resumes.\n" +
      "Q: What happens if my referral cancels? A: Your commission from that referral stops immediately. Their status shows as cancelled in your dashboard. If they re-subscribe later, the original referrer retains credit.\n" +
      "Q: Can I refer myself or create fake accounts? A: Absolutely not. Self-referrals, fake accounts, and any fraudulent referral activity is strictly prohibited and will result in immediate account termination and forfeiture of all earnings.\n" +
      "Q: How do I track my referrals? A: Go to the Referrals tab to see all L1 and L2 referrals with their names, join dates, active/cancelled status, and individual earnings.\n" +
      "Q: Can someone change their referrer after signing up? A: No. Referral credit is permanently and irrevocably assigned at the moment of account creation and cannot be changed, transferred, or reassigned under any circumstances. This applies even if the user cancels and re-subscribes - the original referrer always retains credit.\n" +
      "Q: Can I change who referred me? A: No. Your referrer was set when you created your account and cannot be changed. This is permanent regardless of circumstances.\n" +
      "Q: Do referrals need to complete courses for me to earn? A: No. You earn commissions as soon as they subscribe and pay, regardless of whether they use the courses.\n" +
      "Q: What if someone subscribes without using any referral link? A: They will not be assigned to any referrer. They can still use the platform and earn by referring others.\n" +
      "Q: Can I share my referral link on social media? A: Yes. You can share your link anywhere - social media, messaging apps, email, in person, etc. There are no restrictions on where you share it.\n" +
      "Q: Why are there only 2 levels? A: Tutorii uses a simple 2-level structure to keep things fair and transparent. Unlike multi-level schemes, your earnings come from direct referrals and one level below, not from deep downline chains.\n" +
      "Q: Is the referral program optional? A: Completely optional. You can use Tutorii purely for the courses and never refer anyone. The earning feature is an additional benefit, not a requirement.\n" +
      "Q: What counts as an active referral? A: Any referred user with a current, paid subscription. Cancelled, expired, or suspended accounts do not count as active.\n" +
      "Q: Can I see who my referrals have referred (my L2s)? A: Yes. Your L2 referrals are listed in the Referrals tab showing their name, who referred them (your L1), join date, and earnings.\n" +
      "Q: What if my referral disputes being under me? A: Referral assignments are system-generated based on the link used at signup and are final. Disputes are not entertained as the system is automated.\n\n" +

      "EARNINGS & PAYOUTS:\n" +
      "Q: When do I get paid? A: Payouts are processed weekly every Tuesday. Earnings must meet the minimum threshold of AED 50 to be included.\n" +
      "Q: How do I receive my money? A: Via bank transfer through MamoPay to the IBAN registered in your Account Settings.\n" +
      "Q: What is the minimum payout? A: AED 50. If your pending earnings are below AED 50, they roll over to the next payout cycle until the threshold is met.\n" +
      "Q: How long does a payout take? A: Once processed, bank transfers typically arrive within 1-3 business days depending on your bank and country.\n" +
      "Q: What does Pending mean? A: Pending earnings are commissions calculated but not yet included in a weekly payout. They will be paid on the next Tuesday payout cycle.\n" +
      "Q: What does Processing mean? A: Processing means the payout has been submitted to MamoPay and is in transit to your bank. Allow 1-3 business days.\n" +
      "Q: What does Completed mean? A: Completed means the funds have been successfully transferred and should be in your bank account.\n" +
      "Q: What does Failed mean? A: A failed payout means the bank rejected the transfer, usually due to an incorrect IBAN. Update your banking details and the payout will be retried on the next cycle.\n" +
      "Q: My payout failed, what do I do? A: Check your IBAN is correct in Account Settings. Common issues: wrong IBAN format, closed bank account, bank not accepting international transfers. Fix the issue and your payout retries automatically next Tuesday.\n" +
      "Q: Is there a fee for payouts? A: Tutorii does not charge any payout fees. Your bank may charge incoming transfer fees depending on your account type.\n" +
      "Q: Can I receive payouts via any method other than bank transfer? A: No. All payouts are processed exclusively through MamoPay via bank transfer to your registered IBAN. This is the only payout method available.\n" +
      "Q: Are my earnings taxable? A: You are responsible for reporting and paying taxes on your earnings per the laws of your country of residence. Tutorii does not withhold taxes or provide tax advice. We recommend consulting a qualified tax advisor.\n" +
      "Q: How is my commission calculated? A: L1 = $" + PRICE + " x 40% = $" + (PRICE*L1_RATE).toFixed(2) + " per active L1 referral per month. L2 = $" + PRICE + " x 5% = $" + (PRICE*L2_RATE).toFixed(2) + " per active L2 referral per month. Total monthly = sum of all active L1 and L2 commissions.\n" +
      "Q: Do I earn commissions on my own subscription? A: No. You only earn commissions on other people's subscriptions, not your own.\n" +
      "Q: Can I see a breakdown of my earnings? A: Yes. The Earnings tab shows your total, monthly, pending, and paid amounts, plus a breakdown of L1 vs L2 income.\n" +
      "Q: Is there a cap on how much I can earn? A: No. There is no earnings cap. Your income grows with every active referral in your network.\n" +
      "Q: When do commissions start after someone signs up? A: Immediately upon their first successful payment.\n" +
      "Q: What IBAN format do you accept? A: We accept IBANs from any country. UAE IBANs start with AE followed by 21 digits. Ensure you enter the full IBAN without spaces.\n" +
      "Q: Can I split payouts between multiple bank accounts? A: No. Payouts go to a single IBAN. You can change your IBAN at any time but only one can be active.\n" +
      "Q: What happens to my pending earnings if I cancel? A: Pending earnings above the AED 50 minimum will still be paid out on the next cycle. Earnings below AED 50 are forfeited upon cancellation.\n\n" +

      "COURSES & LEARNING:\n" +
      "Q: How many courses are there? A: There are currently " + courses.length + " modules with " + courses.reduce(function(s,c){return s+c.lessons.length},0) + " lessons total: " + courses.map(function(c){return c.module}).join(", ") + ".\n" +
      "Q: Do I have to complete courses in order? A: No. You can take any lesson in any module in any order. However, we recommend following the module sequence for the best learning experience.\n" +
      "Q: How do I mark a lesson complete? A: Open the lesson and click the Mark Complete button at the top right. Your progress is saved automatically.\n" +
      "Q: Can I undo marking a lesson complete? A: Not currently. Once marked complete, the status is permanent.\n" +
      "Q: Can I re-watch lessons? A: Yes. Completed lessons remain fully accessible. You can revisit any lesson at any time.\n" +
      "Q: Are new courses added? A: Yes, we regularly add new modules, lessons, and update existing content. New content appears automatically in your Courses tab.\n" +
      "Q: Can I download course materials? A: PDF guides can be downloaded where available. Video content is streaming only and cannot be downloaded.\n" +
      "Q: What format are the lessons? A: Lessons include video content (MP4) and/or downloadable PDF study guides. Some lessons have both, some have one or the other.\n" +
      "Q: Do I lose my progress if I cancel? A: No. Your course progress is saved permanently. If you re-subscribe, you resume exactly where you left off.\n" +
      "Q: How long are the lessons? A: Lessons range from 8-25 minutes depending on the topic. Duration is shown next to each lesson title.\n" +
      "Q: Can I suggest a course topic? A: Yes! Email content@tutorii.com with your suggestion. We actively develop content based on user feedback.\n" +
      "Q: Is the content available offline? A: PDF guides can be downloaded for offline reading. Video lessons require an internet connection.\n" +
      "Q: Are the courses accredited? A: Tutorii courses are practical educational content and are not currently accredited by any formal educational body.\n" +
      "Q: Can I share course content with others? A: Course materials are for your personal use only. Sharing, copying, or distributing content is prohibited under our Terms of Service.\n" +
      "Q: What if a video is not loading? A: Try refreshing the page, clearing your browser cache, or switching to a different browser. Ensure you have a stable internet connection. If the issue persists, contact support.\n" +
      "Q: When are new lessons added? A: Content is added on a rolling basis. New lessons typically become available every 2-4 weeks.\n\n" +

      "ACCOUNT & TECHNICAL:\n" +
      "Q: How do I change my password? A: Go to Account Settings and click Change Password. You will receive an email to confirm the change.\n" +
      "Q: How do I update my email? A: Go to Account Settings and update your email. You must verify the new email address before the change takes effect.\n" +
      "Q: How do I update my name? A: Go to Account Settings and edit your name. Changes take effect immediately.\n" +
      "Q: How do I update my banking/IBAN details? A: Go to the Payouts section in your dashboard and edit your payout details. Changes apply from the next payout cycle.\n" +
      "Q: Can I use Tutorii on mobile? A: Yes. Tutorii works on all devices including phones, tablets, and computers through your web browser. No app download is needed.\n" +
      "Q: Is there a mobile app? A: Not currently. Tutorii is fully optimized for mobile browsers and works like a native app on your phone.\n" +
      "Q: I forgot my password. A: Click Forgot Password on the login page. A reset link will be sent to your registered email.\n" +
      "Q: I am not receiving emails from Tutorii. A: Check your spam/junk folder. Add support@tutorii.com to your contacts. If still not receiving, contact support with an alternative email.\n" +
      "Q: Can I have multiple accounts? A: No. One account per person. Multiple accounts are flagged automatically and may result in suspension of all associated accounts.\n" +
      "Q: How do I delete my account? A: Email support@tutorii.com to request permanent account deletion. This will cancel your subscription, forfeit any pending earnings below AED 50, and permanently remove your data.\n" +
      "Q: Is my data private? A: Yes. We comply with UAE data protection laws. Your personal data is never sold to third parties. See our Privacy Policy for full details.\n" +
      "Q: What data does Tutorii collect? A: Name, email, phone number, payment information (processed by MamoPay, not stored by us), course activity, and referral data. This is used solely to provide and improve the service.\n" +
      "Q: Can I export my data? A: Contact support@tutorii.com to request a data export. We will provide your data within 14 business days.\n" +
      "Q: My account was suspended. A: Accounts are suspended for Terms of Service violations such as fraud, fake referrals, or multiple accounts. Email compliance@tutorii.com to appeal.\n" +
      "Q: What browsers are supported? A: Chrome, Safari, Firefox, and Edge. We recommend using the latest version of any major browser.\n" +
      "Q: The site is loading slowly. A: Try clearing your browser cache, disabling browser extensions, or switching to a different browser. Check your internet connection speed.\n" +
      "Q: Can I log in on multiple devices? A: Yes. You can be logged in on multiple devices simultaneously. Your progress syncs across all devices.\n" +
      "Q: How do I log out? A: Click Log Out at the bottom of the left sidebar in your dashboard.\n\n" +

      "ABOUT TUTORII:\n" +
      "Q: What is Tutorii? A: Tutorii is an education and referral platform built specifically for expatriates in the UAE and GCC. It offers practical courses on Gulf life, work, and finance, combined with an optional referral-based earning model.\n" +
      "Q: Who is Tutorii for? A: Anyone living or planning to live in the UAE/GCC - workers, professionals, entrepreneurs, families, and students who want to learn practical skills and optionally earn extra income through referrals.\n" +
      "Q: Where is Tutorii based? A: Tutorii is based in the United Arab Emirates.\n" +
      "Q: How is Tutorii different from MLM? A: Tutorii has a simple 2-level referral structure, not an unlimited-depth multi-level model. There are only 2 commission levels (L1 direct, L2 indirect). The primary product is educational courses. There are no signup fees, no inventory, no ranks, and no pressure to recruit.\n" +
      "Q: Is Tutorii legal in the UAE? A: Yes. Tutorii is a fully licensed business operating in the United Arab Emirates. Our referral program complies with UAE commercial regulations.\n" +
      "Q: How do I contact human support? A: Email support@tutorii.com. Human support is available Sunday through Thursday, 9am to 6pm GST. You can also use the Contact Us form on the website.\n" +
      "Q: What if I have a complaint? A: Email complaints@tutorii.com with details. We aim to acknowledge complaints within 24 hours and resolve them within 48 hours.\n" +
      "Q: What are the Terms of Service? A: Full Terms of Service are available on the website footer. Key points: one account per person, no fraud, no content redistribution, subscription auto-renews monthly.\n" +
      "Q: Does Tutorii have a social media presence? A: Yes. Follow us on Instagram, Twitter, and LinkedIn @TutoriiOfficial for updates, tips, and community content.\n" +
      "Q: Can I partner with Tutorii or become an ambassador? A: For partnership or ambassador inquiries, email partnerships@tutorii.com.\n" +
      "Q: I have a suggestion for improving the platform. A: We love user feedback! Email feedback@tutorii.com or use the chat to share your ideas.\n\n" +

      "TROUBLESHOOTING:\n" +
      "Q: I cannot log in. A: Ensure you are using the correct email and password. Try Forgot Password if unsure. Clear browser cache and cookies. Try a different browser. If still unable, contact support.\n" +
      "Q: My referral link is not working. A: Ensure your subscription is active - referral links are deactivated if your subscription lapses. Check the link is copied correctly with no extra spaces. Test it in an incognito window.\n" +
      "Q: My earnings seem incorrect. A: Check the Referrals tab to verify which referrals are active vs cancelled. Only active subscribers generate commissions. If you believe there is an error, contact support with specifics.\n" +
      "Q: A friend signed up but does not appear in my referrals. A: They must have used your exact referral link when subscribing. If they signed up without a link or used a different link, they cannot be reassigned. Referrer assignment is permanent and automatic.\n" +
      "Q: Videos are buffering or not playing. A: Check your internet connection. Try lowering video quality if available. Clear browser cache. Disable VPN if using one. Try a different browser or device.\n" +
      "Q: The dashboard is showing wrong information. A: Try refreshing the page. Data updates may take a few minutes. If the issue persists, clear your browser cache and log in again. Contact support if the problem continues.\n" +
      "Q: I cannot download a PDF. A: Ensure pop-ups are not blocked in your browser. Try right-clicking the download button and selecting Save As. Not all lessons have PDFs - check if one is available for that lesson.\n\n" +

      "Keep responses short, friendly, and helpful. Use the user's actual account data when answering personal questions - cite specific numbers and names. For FAQ-type questions, answer directly and naturally without saying 'according to our FAQ'. If you truly don't know something or it is outside the scope of what is documented here, say so and suggest contacting support@tutorii.com.";

    var apiMsgs = newMsgs.map(function(m){return {role:m.role,content:m.content}});

    chatApi.send(chatInput, null, null)
    .then(function(data){
      var reply = data.response || "Sorry, I couldn't process that. Please try again.";
      setChatMsgs(function(prev){return prev.concat([{role:"assistant",content:reply}])});
      setChatLoading(false);
    })
    .catch(function(){
      setChatMsgs(function(prev){return prev.concat([{role:"assistant",content:"I'm having trouble connecting right now. Please try again or email support@tutorii.com."}])});
      setChatLoading(false);
    });










  }

  var navItems = [
    { id:"overview", icon:"chart", label:"Overview" },
    { id:"referrals", icon:"users", label:"My Referrals" },
    { id:"earnings", icon:"dollar", label:"Earnings" },
    { id:"payouts", icon:"bank", label:"Payouts" },
    { id:"courses", icon:"book", label:"Courses" },
    { id:"support", icon:"chat", label:"Support" },
    { id:"settings", icon:"gear", label:"Settings" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:mob?"column":"row", minHeight:"100vh", background:"rgba(255,255,255,0.03)" }}>
      {!mob && <div style={{ width:230, background:"#111113", padding:"24px 0", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"0 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}><Logo light /></div>
        <nav style={{ flex:1, padding:"12px 10px" }}>
          {navItems.map(function(n){ return (
            <button key={n.id} onClick={function(){gotoTab(n.id);setActiveLesson(null)}} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", borderRadius:8, border:"none", textAlign:"left",
              background: tab===n.id ? "rgba(200,180,140,0.15)" : "transparent", color: tab===n.id ? "#d4d4d8" : "#71717a",
              fontSize:13, fontWeight: tab===n.id ? 600 : 500, cursor:"pointer", marginBottom:2
            }}><Ico name={n.icon} size={16} color={tab===n.id ? "rgb(200,180,140)" : "#52525b"} />{" "+n.label}</button>
          )})}
        </nav>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"rgb(200,180,140)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0a0a0c" }}>{u.avatar}</div>
            <div><div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>{u.name}</div><div style={{ fontSize:10, color:"#52525b" }}>{u.email}</div></div>
          </div>
          <button onClick={function(){ logout(); go("landing"); }} style={{ width:"100%", padding:"8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Log Out</button>
        </div>
      </div>}
      {mob && <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#111113", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:0, zIndex:50 }}>
        <Logo light />
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={function(){gotoTab("support")}} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:6, border:"1px solid "+(tab==="support"?"rgba(200,180,140,0.3)":"rgba(255,255,255,0.06)"), background:tab==="support"?"rgba(200,180,140,0.08)":"transparent", cursor:"pointer" }}>
            <Ico name="chat" size={13} color={tab==="support"?"rgb(200,180,140)":"#71717a"} />
            <span style={{ fontSize:11, fontWeight:600, color:tab==="support"?"rgb(200,180,140)":"#71717a" }}>Support</span>
          </button>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"rgb(200,180,140)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#0a0a0c" }}>{u.avatar}</div>
          <button onClick={function(){go("landing")}} style={{ padding:"6px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:11, cursor:"pointer" }}>Log Out</button>
        </div>
      </div>}

      <div ref={contentRef} style={{ flex:1, padding:mob?16:28, overflow:"auto", maxHeight:"100vh", paddingBottom:mob?80:28, overflowX:"hidden", boxSizing:"border-box", minWidth:0, width:mob?"100%":"auto" }}>
        {dashLoading ? <DashSkeleton /> : <div>
        <div style={{ background:"linear-gradient(135deg, rgba(200,180,140,0.08), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.12)", borderRadius:14, padding:mob?"16px":"18px 24px", marginBottom:mob?16:24 }}>
          <div style={{ marginBottom:mob?8:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:"rgb(200,180,140)", marginBottom:3 }}>YOUR REFERRAL LINK</div>
            <div style={{ fontSize:mob?12:14, fontWeight:600, color:"#d4d4d8", fontFamily:"monospace", wordBreak:"break-all" }}>{"tutorii.com/ref/"+u.code}</div>
          </div>
          <button onClick={copyLink} style={{ background:"#131315", color:"#d4d4d8", border:"1px solid rgba(200,180,140,0.2)", padding:mob?"9px 0":"9px 18px", borderRadius:mob?20:8, fontSize:12, fontWeight:600, cursor:"pointer", width:mob?"100%":"auto", marginBottom:mob?12:12, display:mob?"block":"inline-block" }}>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={function(){window.open("https://wa.me/?text="+encodeURIComponent("Learn practical skills for life in the UAE and earn while you grow! Join Tutorii for just AED 95/month. Use my link: https://tutorii.com/ref/"+u.code),"_blank")}} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:8, border:"none", background:"#25D366", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              <Ico name="phone" size={12} color="#fff" /> WhatsApp
            </button>
            <button onClick={function(){window.open("sms:?body="+encodeURIComponent("Check out Tutorii - courses for expats + earn 40% on referrals! Join: https://tutorii.com/ref/"+u.code))}} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:8, border:"none", background:"#3f3f46", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              <Ico name="chat" size={12} color="#fff" /> SMS
            </button>
            <button onClick={function(){window.open("mailto:?subject="+encodeURIComponent("Join me on Tutorii!")+"&body="+encodeURIComponent("Hey! Check out Tutorii: https://tutorii.com/ref/"+u.code))}} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:8, border:"none", background:"rgb(200,180,140)", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              <Ico name="globe" size={12} color="#fff" /> Email
            </button>
          </div>
          <button onClick={function(){go("subscribe",u.code)}} style={{ width:"100%", marginTop:8, padding:"8px 12px", borderRadius:8, border:"1px dashed rgba(200,180,140,0.25)", background:"transparent", color:"#71717a", fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Ico name="link" size={11} color="#71717a" /> Preview what your referral sees
          </button>
        </div>

        {tab === "overview" && <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>{"Welcome back, " + u.name.split(" ")[0]}</h2>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:14, marginBottom:mob?16:24, alignItems:"stretch" }}>
            <StatCard icon="dollar" label="Total Earnings" value={"AED "+u.earn.total} />
            <StatCard icon="chart" label="This Month's Earnings" value={"AED "+u.earn.month} />
            <StatCard icon="users" label="My Referrals" value={(u.l1||[]).length} sub={activeL1+" active"} />
            <StatCard icon="book" label="Course Progress" value={pct+"%"} sub={doneL+"/"+totalL+" lessons"} color="#d97706" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:14, alignItems:"stretch" }}>
            <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Recent Referral Activity</h3>
              {u.l1.slice(0,4).map(function(r){ return (
                <div key={r.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <div><div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{r.name}</div><div style={{ fontSize:11, color:"#52525b" }}>{r.date}</div></div>
                  <div style={{ textAlign:"right" }}><div style={{ fontSize:13, fontWeight:500, color:"#d4d4d8" }}>{"AED "+r.earned.toFixed(2)}</div><Badge s={r.status} /></div>
                </div>
              )})}
            </div>
            <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Continue Where You Left Off</h3>
              {courses.filter(function(c){return c.lessons.some(function(l){return !l.done})}).slice(0,3).map(function(c){
                var next = c.lessons.find(function(l){return !l.done});
                return (
                  <div key={c.id} onClick={function(){gotoTab("courses");setOpenCourse(c.id);setActiveLesson(next)}} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
                    <span style={{ lineHeight:0 }}><Ico name={c.icon} size={20} color="rgb(200,180,140)" /></span>
                    <div><div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{next ? next.title : ""}</div><div style={{ fontSize:11, color:"#52525b" }}>{c.module}</div></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ PERFORMANCE VISUALISATIONS ═══ */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:14, marginTop:14, alignItems:"stretch" }}>

            {/* Payout Countdown */}
            {(function(){
              var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
              var today = new Date().getDay();
              var daysUntil = today <= 2 ? (2 - today) : (9 - today);
              if (daysUntil === 0) daysUntil = 7;
              var pctDone = Math.round(((7 - daysUntil) / 7) * 100);
              return (
                <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <h3 style={{ fontSize:14, fontWeight:700, margin:0, color:"#d4d4d8" }}>Next Payout Date</h3>
                    <div style={{ width:28, height:28, borderRadius:7, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name="bank" size={13} color="rgb(200,180,140)" /></div>
                  </div>
                  <div style={{ fontSize:28, fontWeight:500, color:"#d4d4d8", marginBottom:2 }}>{daysUntil === 1 ? "Tomorrow" : daysUntil + " days"}</div>
                  <div style={{ display:"inline-block", fontSize:10, color:"#52525b", marginBottom:14, padding:"3px 10px", borderRadius:6, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", letterSpacing:0.3 }}>Tuesday via MamoPay</div>
                  <div style={{ width:"100%", height:6, borderRadius:3, background:"rgba(255,255,255,0.06)", marginBottom:10 }}>
                    <div style={{ height:6, borderRadius:3, background:"linear-gradient(90deg, rgba(200,180,140,0.6), rgb(200,180,140))", width:pctDone+"%", boxShadow:"0 0 8px rgba(200,180,140,0.3)", transition:"width 0.5s" }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#52525b" }}>
                    <span style={{ padding:"2px 8px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>Pending Balance</span>
                    <span style={{ padding:"2px 8px", borderRadius:5, background:u.earn.pending >= 10 ? "rgba(200,180,140,0.08)" : "rgba(248,113,113,0.08)", border:"1px solid "+(u.earn.pending >= 10 ? "rgba(200,180,140,0.12)" : "rgba(248,113,113,0.12)"), color: u.earn.pending >= 10 ? "rgb(200,180,140)" : "#f87171", fontWeight:600 }}>{"AED "+u.earn.pending.toFixed(2)}{u.earn.pending >= 10 ? " \u2713" : " (min AED 50)"}</span>
                  </div>
                </div>
              );
            })()}

            {/* Income vs Subscription Donut */}
            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ fontSize:14, fontWeight:700, margin:0, color:"#d4d4d8" }}>Monthly Profit</h3>
                <div style={{ width:28, height:28, borderRadius:7, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name="target" size={13} color="rgb(200,180,140)" /></div>
              </div>
              {(function(){
                var monthlyGross = activeL1 * PRICE * L1_RATE + (u.l2||[]).length * PRICE * L2_RATE;
                var monthlyNet = monthlyGross - PRICE;
                var roiPct = monthlyGross > 0 ? Math.round((monthlyNet / monthlyGross) * 100) : 0;
                var r = 44; var circ = 2 * Math.PI * r;
                var earnPct = monthlyGross > 0 ? Math.min((monthlyGross / (monthlyGross + PRICE)) * 100, 100) : 0;
                var offset = circ - (earnPct / 100) * circ;
                return (
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <svg width="96" height="96" viewBox="0 0 96 96" style={{ flexShrink:0 }}><defs><filter id="glowRing" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <circle cx="48" cy="48" r={r} stroke="rgba(248,113,113,0.15)" strokeWidth="7" fill="none" />
                      <circle cx="48" cy="48" r={r} stroke="rgb(200,180,140)" strokeWidth="7" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 48 48)" filter="url(#glowRing)" style={{ transition:"stroke-dashoffset 1s ease-out" }} />
                      <text x="48" y="44" textAnchor="middle" fill="#d4d4d8" fontSize="16" fontFamily="sans-serif" fontWeight="500">{"AED "+monthlyNet.toFixed(0)}</text>
                      <text x="48" y="58" textAnchor="middle" fill="#52525b" fontSize="8" fontFamily="sans-serif">PROFIT</text>
                    </svg>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:"rgb(200,180,140)" }} />
                        <span style={{ fontSize:10, color:"#71717a", padding:"2px 8px", borderRadius:5, background:"rgba(200,180,140,0.06)", border:"1px solid rgba(200,180,140,0.1)" }}>{"Earned $"+monthlyGross.toFixed(2)}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:"rgba(248,113,113,0.4)" }} />
                        <span style={{ fontSize:10, color:"#71717a", padding:"2px 8px", borderRadius:5, background:"rgba(248,113,113,0.05)", border:"1px solid rgba(248,113,113,0.1)" }}>{"Subscription -$"+PRICE}</span>
                      </div>
                      <div style={{ display:"inline-block", fontSize:13, fontWeight:600, color:monthlyNet>=0?"rgb(200,180,140)":"#f87171", padding:"4px 12px", borderRadius:8, background:monthlyNet>=0?"rgba(200,180,140,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(monthlyNet>=0?"rgba(200,180,140,0.15)":"rgba(248,113,113,0.15)"), marginTop:4 }}>{"Net Profit $"+monthlyNet.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Network Health */}
            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ fontSize:14, fontWeight:700, margin:0, color:"#d4d4d8" }}>Referral Network Health</h3>
                <div style={{ width:28, height:28, borderRadius:7, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name="users" size={13} color="rgb(200,180,140)" /></div>
              </div>
              {(function(){
                var l1cancelled = (u.l1||[]).filter(function(r){return r.status==="cancelled"}).length;
                var retPct = (u.l1||[]).length > 0 ? Math.round((activeL1 / (u.l1||[]).length) * 100) : 0;
                return (
                  <div>
                    <div style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#52525b", marginBottom:4 }}>
                        <span>Level 1 Retention</span>
                        <span style={{ color:retPct>=70?"rgb(200,180,140)":"#fbbf24", fontWeight:600, fontSize:10, padding:"2px 8px", borderRadius:5, background:retPct>=70?"rgba(200,180,140,0.08)":"rgba(251,191,36,0.08)", border:"1px solid "+(retPct>=70?"rgba(200,180,140,0.12)":"rgba(251,191,36,0.12)") }}>{retPct+"%"}</span>
                      </div>
                      <div style={{ width:"100%", height:8, borderRadius:4, background:"rgba(255,255,255,0.06)", overflow:"hidden", display:"flex" }}>
                        <div style={{ height:8, background:"linear-gradient(90deg, rgba(200,180,140,0.7), rgb(200,180,140))", width:(activeL1/Math.max((u.l1||[]).length,1)*100)+"%", borderRadius:"4px 0 0 4px", boxShadow:"0 0 6px rgba(200,180,140,0.2)", transition:"width 0.5s" }} />
                        <div style={{ height:8, background:"rgba(248,113,113,0.3)", width:(l1cancelled/Math.max((u.l1||[]).length,1)*100)+"%", borderRadius:"0 4px 4px 0" }} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:6, height:6, borderRadius:1, background:"rgb(200,180,140)" }} /><span style={{ fontSize:9, color:"#52525b", padding:"1px 6px", borderRadius:4, background:"rgba(200,180,140,0.06)", border:"1px solid rgba(200,180,140,0.08)" }}>{activeL1+" active"}</span></div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:6, height:6, borderRadius:1, background:"rgba(248,113,113,0.4)" }} /><span style={{ fontSize:9, color:"#52525b", padding:"1px 6px", borderRadius:4, background:"rgba(248,113,113,0.05)", border:"1px solid rgba(248,113,113,0.08)" }}>{l1cancelled+" cancelled"}</span></div>
                      </div>
                    </div>
                    <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#52525b", marginBottom:4 }}>
                        <span>Network</span>
                        <span style={{ fontWeight:600, color:"#71717a", fontSize:10, padding:"2px 8px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>{((u.l1||[]).length + (u.l2||[]).length)+" total"}</span>
                      </div>
                      <div style={{ display:"flex", gap:4 }}>
                        <div style={{ flex:(u.l1||[]).length, height:20, borderRadius:"4px 0 0 4px", background:"rgba(200,180,140,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:600, color:"rgb(200,180,140)", letterSpacing:0.5 }}>{(u.l1||[]).length+" L1"}</div>
                        <div style={{ flex:Math.max((u.l2||[]).length,1), height:20, borderRadius:"0 4px 4px 0", background:"rgba(167,139,250,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:600, color:"#a78bfa", letterSpacing:0.5 }}>{(u.l2||[]).length+" L2"}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>


        </div>}

        {tab === "referrals" && <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>My Referrals</h2>

          {/* Network summary cards */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:14, marginBottom:mob?16:20, alignItems:"stretch" }}>
            <StatCard icon="users" label="Level 1 Referrals" value={(u.l1||[]).length} sub={activeL1+" active"} />
            <StatCard icon="link" label="Level 2 Referrals" value={(u.l2||[]).length} sub={"via "+new Set((u.l2||[]).map(function(r){return r.from})).size+" referrers"} />
            <StatCard icon="chart" label="Total Network Size" value={(u.l1||[]).length + (u.l2||[]).length} />
            <StatCard icon="dollar" label="Total Network Revenue" value={"AED "+(u.l1.reduce(function(s,r){return s+r.earned},0)+u.l2.reduce(function(s,r){return s+r.earned},0)).toFixed(2)} />
          </div>

          {/* Network composition + Referral timeline side by side */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:14, marginBottom:16, alignItems:"stretch" }}>
            {/* Pie chart */}
            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Referral Network Breakdown</h3>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={[{name:"L1 Active",value:activeL1},{name:"L1 Cancelled",value:(u.l1||[]).length-activeL1},{name:"Level 2",value:(u.l2||[]).length}]} cx="50%" cy="50%" innerRadius={32} outerRadius={55} paddingAngle={3} dataKey="value">
                      <Cell fill="rgb(200,180,140)" />
                      <Cell fill="rgba(248,113,113,0.35)" />
                      <Cell fill="rgba(167,139,250,0.6)" />
                    </Pie>
                    <Tooltip contentStyle={{background:"rgba(10,10,12,0.95)",border:"1px solid rgba(200,180,140,0.15)",borderRadius:10,fontSize:11,color:"#d4d4d8",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",padding:"8px 12px"}} itemStyle={{color:"#d4d4d8"}} />
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  {[{c:"rgb(200,180,140)",l:"Level 1 Active",v:activeL1},{c:"rgba(248,113,113,0.6)",l:"Level 1 Cancelled",v:(u.l1||[]).length-activeL1},{c:"rgba(167,139,250,0.7)",l:"Level 2",v:(u.l2||[]).length}].map(function(d){return (
                    <div key={d.l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:d.c, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:"#71717a" }}>{d.l}</span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#d4d4d8", marginLeft:"auto", padding:"1px 8px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>{d.v}</span>
                    </div>
                  )})}
                </div>
              </div>
            </div>
            {/* Referral join timeline */}
            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Referral Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={(function(){
                  var months = {};
                  u.l1.concat(u.l2).forEach(function(r){
                    var m = r.date.split(" ").slice(0,1).join(" ");
                    if (!months[m]) months[m] = {month:m, l1:0, l2:0};
                    if (u.l1.indexOf(r) >= 0) months[m].l1 += 1;
                    else months[m].l2 += 1;
                  });
                  return Object.values(months);
                })()} margin={{top:5,right:5,left:mob?-25:-10,bottom:5}}>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{fill:"#52525b",fontSize:10}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{background:"rgba(10,10,12,0.95)",border:"1px solid rgba(200,180,140,0.15)",borderRadius:10,fontSize:11,color:"#d4d4d8",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",padding:"8px 12px"}} itemStyle={{color:"#d4d4d8"}} cursor={{fill:"rgba(255,255,255,0.03)"}} />
                  <Bar dataKey="l1" stackId="a" fill="rgb(200,180,140)" radius={[0,0,0,0]} name="Level 1" />
                  <Bar dataKey="l2" stackId="a" fill="rgba(167,139,250,0.6)" radius={[4,4,0,0]} name="Level 2" />
                  <Legend iconSize={10} wrapperStyle={{fontSize:11,color:"#71717a",paddingTop:8}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16, boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>{"Level 1 - Direct (40% = $"+(PRICE*L1_RATE).toFixed(2)+" each)"}</h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Name","Joined","Status","Earned"].map(function(h){return <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#52525b", textAlign:"left", borderBottom:"2px solid rgba(255,255,255,0.08)" }}>{h}</th>})}</tr></thead>
              <tbody>{(u.l1||[]).map(function(r){return <tr key={r.name} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}><td style={{ padding:"10px", fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{r.name}</td><td style={{ padding:"10px", fontSize:12, color:"#52525b" }}>{r.date}</td><td style={{ padding:"10px" }}><Badge s={r.status}/></td><td style={{ padding:"10px", fontSize:13, fontWeight:500, color:"#d4d4d8" }}>{"AED "+r.earned.toFixed(2)}</td></tr>})}</tbody>
            </table>
          </div>
          <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>{"Level 2 - Indirect (5% = $"+(PRICE*L2_RATE).toFixed(2)+" each)"}</h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Name","Via","Joined","Earned"].map(function(h){return <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#52525b", textAlign:"left", borderBottom:"2px solid rgba(255,255,255,0.08)" }}>{h}</th>})}</tr></thead>
              <tbody>{(u.l2||[]).map(function(r){return <tr key={r.name} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}><td style={{ padding:"10px", fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{r.name}</td><td style={{ padding:"10px", fontSize:12, color:"#a1a1aa" }}>{r.from}</td><td style={{ padding:"10px", fontSize:12, color:"#52525b" }}>{r.date}</td><td style={{ padding:"10px", fontSize:13, fontWeight:500, color:"#a78bfa" }}>{"AED "+r.earned.toFixed(2)}</td></tr>})}</tbody>
            </table>
          </div>
        </div>}

        {tab === "earnings" && <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>Earnings</h2>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:14, marginBottom:mob?16:20, alignItems:"stretch" }}>
            <StatCard icon="dollar" label="Total Earnings" value={"AED "+u.earn.total} />
            <StatCard icon="chart" label="This Month's Earnings" value={"AED "+u.earn.month} />
            <StatCard icon="refresh" label="Pending Payout" value={"AED "+u.earn.pending} color="#d97706" />
            <StatCard icon="shield" label="Total Paid Out" value={"AED "+u.earn.paid} />
          </div>
          <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:0, color:"#d4d4d8" }}>Weekly Earnings Breakdown</h3>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {[["4w",mob?"4W":"Last 4 Weeks"],["3m",mob?"3M":"Last 3 Months"],["all","All"]].map(function(r){ return (
                  <button key={r[0]} onClick={function(){setChartRange(r[0])}} style={{ padding:mob?"4px 8px":"4px 10px", borderRadius:6, border:"1px solid "+(chartRange===r[0]?"rgba(200,180,140,0.3)":"rgba(255,255,255,0.06)"), background:chartRange===r[0]?"rgba(200,180,140,0.1)":"transparent", fontSize:10, fontWeight:600, color:chartRange===r[0]?"rgb(200,180,140)":"#52525b", cursor:"pointer" }}>{r[1]}</button>
                )})}
              </div>
            </div>
            <p style={{ fontSize:11, color:"#52525b", margin:"0 0 16px" }}>Weekly commission breakdown — Level 1 direct, Level 2 indirect, and net profit</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={(function(){ var h=u.earningsHistory||[]; return chartRange==="4w"?h.slice(-4):chartRange==="3m"?h.slice(-12):h; })()} margin={{top:5,right:5,left:mob?-25:-10,bottom:5}}>
                <defs>
                  <linearGradient id="uL1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(200,180,140)" stopOpacity={0.45}/><stop offset="50%" stopColor="rgb(200,180,140)" stopOpacity={0.15}/><stop offset="100%" stopColor="rgb(200,180,140)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="uL2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4}/><stop offset="50%" stopColor="#7c3aed" stopOpacity={0.12}/><stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                <XAxis dataKey="week" tick={{fill:"#52525b",fontSize:10}} />
                <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return "AED "+v}} />
                <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:12}} formatter={function(v){return "AED "+v.toFixed(2)}} />
                <Area type="monotone" dataKey="l1" stroke="rgb(200,180,140)" fill="url(#uL1)" strokeWidth={2.5} name="Level 1 Income" />
                <Area type="monotone" dataKey="l2" stroke="#a78bfa" fill="url(#uL2)" strokeWidth={2} name="Level 2 Income" />
                <Line type="monotone" dataKey="net" stroke="rgb(220,200,160)" strokeWidth={2} dot={{fill:"rgb(200,180,140)",r:4,stroke:"rgba(200,180,140,0.3)",strokeWidth:6}} activeDot={{fill:"rgb(200,180,140)",r:6,stroke:"rgba(200,180,140,0.4)",strokeWidth:8}} name="Net Profit" />
                <Legend iconSize={10} wrapperStyle={{fontSize:11,color:"#71717a",paddingTop:8}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 16px", color:"#d4d4d8" }}>Monthly Earnings Breakdown</h3>
            <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:mob?10:14, alignItems:"stretch" }}>
              <div style={{ background:"rgba(200,180,140,0.1)", borderRadius:12, padding:18, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgb(200,180,140)", marginBottom:6, letterSpacing:0.5, textTransform:"uppercase" }}>Level 1 (40%)</div>
                <div style={{ fontSize:18, fontWeight:500, color:"rgb(200,180,140)" }}>{"AED "+(activeL1*PRICE*L1_RATE).toFixed(2)}</div>
              </div>
              <div style={{ background:"rgba(167,139,250,0.08)", borderRadius:12, padding:18, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#a78bfa", marginBottom:6, letterSpacing:0.5, textTransform:"uppercase" }}>Level 2 (5%)</div>
                <div style={{ fontSize:18, fontWeight:500, color:"#a78bfa" }}>{"AED "+((u.l2||[]).length*PRICE*L2_RATE).toFixed(2)}</div>
              </div>
              <div style={{ background:"rgba(200,180,140,0.06)", borderRadius:12, padding:18, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgb(200,180,140)", marginBottom:6, letterSpacing:0.5, textTransform:"uppercase" }}>Net Monthly</div>
                <div style={{ fontSize:18, fontWeight:500, color:"rgb(200,180,140)" }}>{"AED "+(activeL1*PRICE*L1_RATE + (u.l2||[]).length*PRICE*L2_RATE - PRICE).toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Cumulative earnings + Projected annual */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"2fr 1fr", gap:14, marginTop:16, alignItems:"stretch" }}>
            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 4px", color:"#d4d4d8" }}>Total Earnings Over Time</h3>
              <p style={{ fontSize:11, color:"#52525b", margin:"0 0 16px" }}>Running total of all commissions earned since you joined</p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart margin={{top:5,right:5,left:mob?-25:-10,bottom:5}} data={(function(){
                  var running = 0;
                  return (u.earningsHistory||[]).map(function(w){
                    running += w.l1 + w.l2;
                    return {week:w.week, total:Math.round(running*100)/100};
                  });
                })()}>
                  <defs>
                    <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(200,180,140)" stopOpacity={0.4}/><stop offset="40%" stopColor="rgb(200,180,140)" stopOpacity={0.15}/><stop offset="100%" stopColor="rgb(200,180,140)" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="week" tick={{fill:"#52525b",fontSize:9}} interval={3} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return "AED "+v}} />
                  <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:12}} formatter={function(v){return "AED "+v.toFixed(2)}} />
                  <Area type="monotone" dataKey="total" stroke="rgb(200,180,140)" fill="url(#cumGrad)" strokeWidth={2.5} dot={false} activeDot={{fill:"rgb(200,180,140)",r:5,stroke:"rgba(200,180,140,0.3)",strokeWidth:8}} name="Total Earned" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Projected Annual */}
            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box", display:"flex", flexDirection:"column" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 16px", color:"#d4d4d8" }}>Projected Annual Earnings</h3>
              {(function(){
                var monthlyGross = activeL1 * PRICE * L1_RATE + (u.l2||[]).length * PRICE * L2_RATE;
                var monthlyNet = monthlyGross - PRICE;
                var annualNet = monthlyNet * 12;
                return (
                  <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ display:"inline-block", fontSize:9, fontWeight:700, color:"#52525b", marginBottom:8, padding:"3px 10px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", letterSpacing:0.8 }}>IF CURRENT RATE HOLDS</div>
                      <div style={{ fontSize:28, fontWeight:500, color:annualNet>=0?"rgb(200,180,140)":"#f87171", marginBottom:4 }}>{"AED "+annualNet.toFixed(2)}</div>
                      <div style={{ display:"inline-block", fontSize:9, color:"#52525b", marginTop:4, padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", letterSpacing:0.3 }}>{"net per year · " + activeL1 + " active L1 · " + (u.l2||[]).length + " L2"}</div>
                    </div>
                    <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:14, marginTop:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:10, color:"#52525b", padding:"1px 6px", borderRadius:4, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)" }}>Gross annual</span>
                        <span style={{ fontSize:11, fontWeight:600, color:"#d4d4d8" }}>{"AED "+(monthlyGross*12).toFixed(2)}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:10, color:"#52525b", padding:"1px 6px", borderRadius:4, background:"rgba(248,113,113,0.04)", border:"1px solid rgba(248,113,113,0.06)" }}>Subscription cost</span>
                        <span style={{ fontSize:11, fontWeight:600, color:"#f87171" }}>{"-$"+(PRICE*12).toFixed(2)}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", paddingTop:6, borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize:10, fontWeight:600, color:"#71717a", padding:"1px 6px", borderRadius:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>Net annual</span>
                        <span style={{ fontSize:11, fontWeight:700, color:annualNet>=0?"rgb(200,180,140)":"#f87171", padding:"2px 8px", borderRadius:5, background:annualNet>=0?"rgba(200,180,140,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(annualNet>=0?"rgba(200,180,140,0.12)":"rgba(248,113,113,0.12)") }}>{"AED "+annualNet.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>}

        {tab === "payouts" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>Payouts</h2>

          {/* Payout summary cards */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:14, marginBottom:mob?16:20, alignItems:"stretch" }}>
            <StatCard icon="bank" label="Total Paid Out" value={"AED "+u.earn.paid} />
            <StatCard icon="refresh" label="Pending Payout" value={"AED "+u.earn.pending} />
            <StatCard icon="check" label="Total Payouts" value={(u.payouts||[]).length} />
            <StatCard icon="dollar" label="Avg Payout" value={"AED "+((u.payouts||[]).length>0?((u.payouts||[]).reduce(function(s,p){return s+p.amount},0)/(u.payouts||[]).length).toFixed(2):"0.00")} />
          </div>

          {/* Payout amounts bar chart + cumulative */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:14, marginBottom:16, alignItems:"stretch" }}>
            <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 4px", color:"#d4d4d8" }}>Weekly Payout History</h3>
              <p style={{ fontSize:11, color:"#52525b", margin:"0 0 16px" }}>Amount paid out to your bank each Tuesday</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart margin={{top:5,right:5,left:mob?-25:-10,bottom:5}} data={(u.payouts||[]).map(function(p){return {date:p.date,amount:p.amount,status:p.status}})}>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} vertical={false} />
                  <XAxis dataKey="date" tick={{fill:"#52525b",fontSize:9}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return "AED "+v}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:12}} formatter={function(v){return "AED "+v.toFixed(2)}} />
                  <Bar dataKey="amount" radius={[4,4,0,0]} name="Amount">
                    {(u.payouts||[]).map(function(p,i){return <Cell key={i} fill={p.status==="completed"?"rgb(200,180,140)":p.status==="processing"?"rgba(251,191,36,0.5)":"rgba(248,113,113,0.4)"} />})}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background:"linear-gradient(180deg, rgba(19,19,21,1) 0%, rgba(14,14,16,1) 100%)", borderRadius:16, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.06)", boxShadow:"0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 4px", color:"#d4d4d8" }}>Total Paid Over Time</h3>
              <p style={{ fontSize:11, color:"#52525b", margin:"0 0 16px" }}>Running total of all money transferred to your bank</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart margin={{top:5,right:5,left:mob?-25:-10,bottom:5}} data={(function(){
                  var running = 0;
                  return (u.payouts||[]).filter(function(p){return p.status==="completed"}).map(function(p){
                    running += p.amount;
                    return {date:p.date, total:Math.round(running*100)/100};
                  });
                })()}>
                  <defs>
                    <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(200,180,140)" stopOpacity={0.4}/><stop offset="40%" stopColor="rgb(200,180,140)" stopOpacity={0.12}/><stop offset="100%" stopColor="rgb(200,180,140)" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="date" tick={{fill:"#52525b",fontSize:9}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return "AED "+v}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:12}} formatter={function(v){return "AED "+v.toFixed(2)}} />
                  <Area type="monotone" dataKey="total" stroke="rgb(200,180,140)" fill="url(#payGrad)" strokeWidth={2} name="Cumulative" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16, boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 12px", color:"#d4d4d8" }}>Payout Method & Settings</h3>
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:14, display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:16, alignItems:"stretch" }}>
              <div><div style={{ display:"inline-block", fontSize:9, fontWeight:700, color:"#52525b", marginBottom:5, padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", letterSpacing:0.8 }}>IBAN</div><div style={{ fontSize:13, fontWeight:600, fontFamily:"monospace", color:"#d4d4d8" }}>{"****  ****  ****  ****  **** " + u.iban.slice(-3)}</div><div style={{ fontSize:11, fontStyle:"italic", color:"#52525b", marginTop:4 }}>{"You can update your IBAN in "}<span onClick={function(){gotoTab("settings")}} style={{ color:"rgb(200,180,140)", cursor:"pointer" }}>Settings</span></div></div>
              <div><div style={{ display:"inline-block", fontSize:9, fontWeight:700, color:"#52525b", marginBottom:5, padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", letterSpacing:0.8 }}>METHOD</div><div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>MamoPay - Bank Transfer (Weekly)</div></div>
            </div>
          </div>
          <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Payout History</h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Date","Amount","Status"].map(function(h){return <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#52525b", textAlign:"left", borderBottom:"2px solid rgba(255,255,255,0.08)" }}>{h}</th>})}</tr></thead>
              <tbody>{(u.payouts||[]).map(function(p){return <tr key={p.date} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}><td style={{ padding:"10px", fontSize:13, color:"#a1a1aa" }}>{p.date+", 2026"}</td><td style={{ padding:"10px", fontSize:14, fontWeight:500, color:"#d4d4d8" }}>{"AED "+p.amount.toFixed(2)}</td><td style={{ padding:"10px" }}><Badge s={p.status}/></td></tr>})}</tbody>
            </table>
          </div>
        </div>}

        {tab === "courses" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          {activeLesson ? (
            <div>
              <button onClick={function(){setActiveLesson(null)}} style={{ background:"none", border:"none", fontSize:13, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600, marginBottom:16, padding:0 }}>← Back to courses</button>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h2 style={{ fontSize:mob?16:20, fontWeight:700, margin:0, color:"#d4d4d8" }}>{activeLesson.title}</h2>
                {activeLesson.done
                  ? <Badge s="completed" />
                  : <Btn onClick={function(){markDone(openCourse,activeLesson.id);setActiveLesson(Object.assign({},activeLesson,{done:true}))}} green style={{ fontSize:12 }}>Mark Complete</Btn>
                }
              </div>
              {activeLesson.video_url ? (
                <div style={{ background:"#131315", borderRadius:16, overflow:"hidden", marginBottom:20, border:"1px solid rgba(255,255,255,0.06)" }}>
                  <iframe
                    src={activeLesson.video_url.includes("drive.google.com") ? activeLesson.video_url.replace("/view","/preview") : activeLesson.video_url}
                    style={{ width:"100%", height:mob?"60vw":"520px", border:"none", display:"block" }}
                    allow="autoplay"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{ background:"#131315", borderRadius:16, padding:"48px 24px", marginBottom:20, border:"1px solid rgba(255,255,255,0.06)", textAlign:"center" }}>
                  <div style={{ opacity:0.3, lineHeight:0, marginBottom:12 }}><Ico name="book" size={48} color="#71717a" /></div>
                  <div style={{ fontSize:14, color:"#71717a" }}>PDF not yet available for this lesson</div>
                </div>
              )}
              {activeLesson.notes && (
                <div style={{ background:"#131315", borderRadius:12, padding:"16px 20px", border:"1px solid rgba(255,255,255,0.06)", marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#52525b", letterSpacing:0.8, marginBottom:8, textTransform:"uppercase" }}>Lesson Notes</div>
                  <p style={{ fontSize:14, color:"#a1a1aa", lineHeight:1.7, margin:0, whiteSpace:"pre-wrap" }}>{activeLesson.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>My Courses</h2>
                <div style={{ background:"#131315", borderRadius:10, padding:"10px 16px", border:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:100, height:6, borderRadius:3, background:"rgba(255,255,255,0.06)" }}><div style={{ height:6, borderRadius:3, background:"rgb(200,180,140)", width:pct+"%" }}/></div>
                  <span style={{ fontSize:12, fontWeight:600, color:"rgb(200,180,140)" }}>{pct+"% complete"}</span>
                </div>
              </div>
              {u.status !== "active" ? (
                <div style={{ background:"#131315", borderRadius:16, padding:"48px 24px", border:"1px solid rgba(200,180,140,0.15)", textAlign:"center", marginTop:8 }}>
                  <div style={{ lineHeight:0, marginBottom:16 }}><Ico name="lock" size={40} color="rgb(200,180,140)" /></div>
                  <h3 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Course Access Locked</h3>
                  <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, maxWidth:380, margin:"0 auto 24px" }}>An active subscription is required to access course materials. Subscribe now to unlock all modules and lessons.</p>
                  <Btn onClick={function(){go("subscribe")}} style={{ fontSize:14, padding:"12px 32px" }}>{"Subscribe · AED "+PRICE+"/month"}</Btn>
                  <div style={{ fontSize:12, color:"#52525b", marginTop:12 }}>Already paid? Contact support and we'll activate your account.</div>
                </div>
              ) : courses.map(function(c){
                var done = c.lessons.filter(function(l){return l.done}).length;
                return (
                  <div key={c.id} style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:12 }}>
                    <div onClick={async function(){
                      if (u.status !== "active") {
                        gotoTab("overview");
                        return;
                      }
                      var next = openCourse===c.id ? null : c.id;
                      setOpenCourse(next);
                      if (next && c.lessons.length === 0) {
                        try {
                          var lessons = await coursesApi.lessons(c.id);
                          setCourses(function(p){return p.map(function(x){return x.id===c.id ? Object.assign({},x,{lessons:lessons.map(function(l){return {id:l.id,title:l.title,dur:l.duration_minutes+" min",video_url:l.video_url,notes:l.content_md,done:false}})}) : x})});
                        } catch(e) {}
                      }
                    }} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", cursor:"pointer" }}>
                      <span style={{ lineHeight:0, display:"flex", alignItems:"center", justifyContent:"center", width:40, height:40, borderRadius:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.1)", flexShrink:0 }}><Ico name={c.icon} size={20} color="rgb(200,180,140)" /></span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:"#d4d4d8" }}>{c.module}</div>
                        <div style={{ fontSize:12, color:"#52525b" }}>{c.lessons.length > 0 ? done+"/"+c.lessons.length+" completed" : "Click to load lessons"}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2.5" strokeLinecap="round"><path d={openCourse===c.id?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/></svg>
                    </div>
                    {openCourse===c.id && (
                      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                        {c.lessons.length === 0 && (
                          <div style={{ padding:"20px", textAlign:"center", color:"#52525b", fontSize:13 }}>Loading lessons...</div>
                        )}
                        {c.lessons.map(function(l){ return (
                          <div key={l.id} onClick={function(){setActiveLesson(l)}} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px 12px 60px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid "+(l.done?"rgb(200,180,140)":"#3f3f46"), background:l.done?"rgb(200,180,140)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>{l.done ? "✓" : ""}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:500, color:l.done?"#71717a":"#d4d4d8" }}>{l.title}</div>
                              <div style={{ display:"flex", gap:6, marginTop:2 }}>
                                <span style={{ fontSize:10, color:"#3f3f46" }}>{l.dur}</span>
                                {l.video_url ? <span style={{ fontSize:10, color:"rgb(200,180,140)" }}>PDF ✓</span> : <span style={{ fontSize:10, color:"#3f3f46" }}>Coming soon</span>}
                              </div>
                            </div>
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>}

        {tab === "support" && <div>
          {viewTicket ? (
            <div>
              <button onClick={function(){setViewTicket(null);setTicketMsgs([]);setTicketReply("")}} style={{ background:"none", border:"none", fontSize:13, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600, marginBottom:16, padding:0 }}>{"\u2190 Back to tickets"}</button>

              <div style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:16 }}>
                <div style={{ padding:mob?"14px":"20px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:mob?"flex-start":"center", flexDirection:mob?"column":"row", gap:mob?8:0 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <code style={{ fontSize:10, color:"#52525b", background:"#0a0a0c", padding:"2px 8px", borderRadius:4 }}>{viewTicket.ref}</code>
                      <Badge s={viewTicket.status} />
                    </div>
                    <h3 style={{ fontSize:mob?16:18, fontWeight:700, color:"#d4d4d8", margin:0 }}>{viewTicket.subject}</h3>
                    <div style={{ fontSize:11, color:"#52525b", marginTop:4 }}>{"Created "+viewTicket.created+" \u00B7 "+viewTicket.category}</div>
                  </div>
                </div>

                <div style={{ padding:mob?"14px":"20px 24px" }}>
                  {(function(){
                    var msgs = ticketMsgs.length > 0 ? ticketMsgs : [
                      { sender: u.name, role: "user", content: "Hi, I need help with: " + viewTicket.subject, time: viewTicket.created + ", 10:15 AM" },
                      { sender: "Support Team", role: "admin", content: "Hi " + u.name.split(" ")[0] + ", thanks for reaching out. We're looking into this for you and will update you shortly.", time: viewTicket.created + ", 2:30 PM" },
                      viewTicket.status !== "open" ? { sender: "Support Team", role: "admin", content: "We've investigated this and taken action. Please let us know if there's anything else we can help with.", time: viewTicket.updated + ", 11:00 AM" } : null,
                    ].filter(Boolean);
                    return msgs.map(function(msg, i) {
                      var isUser = msg.role === "user";
                      return (
                        <div key={i} style={{ display:"flex", gap:12, marginBottom:16, flexDirection:isUser?"row-reverse":"row" }}>
                          <div style={{ width:32, height:32, borderRadius:"50%", background:isUser?"rgb(200,180,140)":"rgba(59,130,246,0.15)", border:"1px solid "+(isUser?"rgba(200,180,140,0.3)":"rgba(59,130,246,0.2)"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:isUser?"#0a0a0c":"#3b82f6", flexShrink:0 }}>{isUser ? u.avatar : "S"}</div>
                          <div style={{ maxWidth:"75%" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexDirection:isUser?"row-reverse":"row" }}>
                              <span style={{ fontSize:12, fontWeight:600, color:isUser?"#d4d4d8":"#3b82f6" }}>{msg.sender}</span>
                              <span style={{ fontSize:10, color:"#3f3f46" }}>{msg.time}</span>
                            </div>
                            <div style={{ padding:"12px 16px", borderRadius:12, background:isUser?"rgba(200,180,140,0.08)":"rgba(255,255,255,0.03)", border:"1px solid "+(isUser?"rgba(200,180,140,0.12)":"rgba(255,255,255,0.06)"), fontSize:13, color:"#a1a1aa", lineHeight:1.7, borderBottomRightRadius:isUser?4:12, borderBottomLeftRadius:isUser?12:4 }}>{msg.content}</div>
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {viewTicket.status !== "closed" && viewTicket.status !== "resolved" && (
                    <div style={{ display:"flex", gap:8, marginTop:8 }}>
                      <input value={ticketReply} onChange={function(e){setTicketReply(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter"&&ticketReply.trim()){setTicketMsgs(function(prev){var base=prev.length>0?prev:[{sender:u.name,role:"user",content:"Hi, I need help with: "+viewTicket.subject,time:viewTicket.created+", 10:15 AM"},{sender:"Support Team",role:"admin",content:"Hi "+u.name.split(" ")[0]+", thanks for reaching out. We're looking into this.",time:viewTicket.created+", 2:30 PM"}];return base.concat([{sender:u.name,role:"user",content:ticketReply,time:"Just now"}])});setTicketReply("")}}} placeholder="Type your reply..." style={{ flex:1, padding:"11px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
                      <button onClick={function(){if(!ticketReply.trim())return;setTicketMsgs(function(prev){var base=prev.length>0?prev:[{sender:u.name,role:"user",content:"Hi, I need help with: "+viewTicket.subject,time:viewTicket.created+", 10:15 AM"},{sender:"Support Team",role:"admin",content:"Hi "+u.name.split(" ")[0]+", thanks for reaching out.",time:viewTicket.created+", 2:30 PM"}];return base.concat([{sender:u.name,role:"user",content:ticketReply,time:"Just now"}])});setTicketReply("")}} style={{ padding:"11px 20px", borderRadius:10, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:13, fontWeight:600, cursor:"pointer" }}>Send</button>
                    </div>
                  )}
                  {(viewTicket.status === "closed" || viewTicket.status === "resolved") && (
                    <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.12)", fontSize:12, color:"#10b981", textAlign:"center" }}>This ticket has been {viewTicket.status}. Need more help? Open a new ticket.</div>
                  )}
                </div>
              </div>
            </div>
          ) : newTicket ? (
            <div>
              <button onClick={function(){setNewTicket(false)}} style={{ background:"none", border:"none", fontSize:13, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600, marginBottom:16, padding:0 }}>{"\u2190 Back to tickets"}</button>
              <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>Submit a Support Ticket</h2>

              <div style={{ background:"#131315", borderRadius:14, padding:mob?16:24, border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Category</label>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {[["general","General"],["billing","Billing & Payment"],["referrals","Referrals & Earnings"],["courses","Courses & Content"],["technical","Technical Issue"],["account","Account"]].map(function(c){ return (
                      <button key={c[0]} onClick={function(){setTicketForm(function(p){return Object.assign({},p,{category:c[0]})})}} style={{ padding:"8px 14px", borderRadius:8, border:"2px solid "+(ticketForm.category===c[0]?"rgb(200,180,140)":"#27272a"), background:ticketForm.category===c[0]?"rgba(200,180,140,0.08)":"transparent", fontSize:12, fontWeight:600, color:ticketForm.category===c[0]?"rgb(200,180,140)":"#71717a", cursor:"pointer" }}>{c[1]}</button>
                    )})}
                  </div>
                </div>

                <div style={{ marginBottom:18 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Subject</label>
                  <input value={ticketForm.subject} onChange={function(e){setTicketForm(function(p){return Object.assign({},p,{subject:e.target.value})})}} placeholder="Brief description of your issue" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
                </div>

                <div style={{ marginBottom:24 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#71717a", marginBottom:6 }}>Message</label>
                  <textarea value={ticketForm.message} onChange={function(e){setTicketForm(function(p){return Object.assign({},p,{message:e.target.value})})}} rows={5} placeholder="Describe your issue in detail..." style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
                </div>

                <Btn onClick={function(){
                  if(!ticketForm.subject.trim()||!ticketForm.message.trim()) return;
                  var newRef = "TK-" + (8400 + Math.floor(Math.random()*100));
                  var now = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
                  setTickets(function(prev){return [{id:"T"+Date.now(), ref:newRef, subject:ticketForm.subject, category:ticketForm.category, status:"open", created:now, updated:now, messages:1}].concat(prev)});
                  setTicketForm({subject:"",category:"general",message:""});
                  setNewTicket(false);
                }} full style={{ padding:"13px", fontSize:15, borderRadius:12 }}>Submit Ticket</Btn>

                <div style={{ marginTop:16, padding:14, background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(255,255,255,0.04)" }}>
                  <p style={{ fontSize:12, color:"#52525b", margin:0 }}>You can also email us directly at <strong style={{ color:"rgb(200,180,140)" }}>support@tutorii.com</strong>. Our team responds within 24 hours (Sun-Thu, 9AM-6PM GST).</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:mob?10:0, marginBottom:20 }}>
                <div>
                  <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>Support</h2>
                  <p style={{ fontSize:13, color:"#71717a", marginTop:4 }}>View your tickets or get help</p>
                </div>
                <Btn onClick={function(){setNewTicket(true)}} style={{ fontSize:13, padding:"10px 20px" }}>New Ticket</Btn>
              </div>

              {/* Quick actions */}
              <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:10, marginBottom:20 }}>
                {[
                  ["chat","Talk to AI Assistant",function(){setChatOpen(true);setChatMinimized(false)}],
                  ["link","Copy Referral Link",function(){copyLink()}],
                  ["gear","Account Settings",function(){gotoTab("settings")}],
                  ["globe","Email Support",function(){window.open("mailto:support@tutorii.com?subject=Support Request - "+u.code)}],
                ].map(function(a){return (
                  <div key={a[1]} onClick={a[2]} style={{ background:"#131315", borderRadius:12, padding:"16px 14px", border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", textAlign:"center", transition:"border-color 0.2s" }}>
                    <div style={{ marginBottom:8, lineHeight:0, display:"flex", justifyContent:"center" }}><Ico name={a[0]} size={20} color="rgb(200,180,140)" /></div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#71717a" }}>{a[1]}</div>
                  </div>
                )})}
              </div>

              {/* Ticket list */}
              {tickets.length === 0 ? (
                <div style={{ background:"#131315", borderRadius:14, padding:48, border:"1px solid rgba(255,255,255,0.06)", textAlign:"center" }}>
                  <div style={{ marginBottom:12, lineHeight:0 }}><Ico name="chat" size={36} color="#27272a" /></div>
                  <div style={{ fontSize:15, fontWeight:600, color:"#52525b", marginBottom:4 }}>No tickets yet</div>
                  <div style={{ fontSize:13, color:"#3f3f46" }}>When you submit a support request, it will appear here.</div>
                </div>
              ) : (
                <div style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  {tickets.map(function(t, ti) {
                    var statusColors = { open:"rgb(200,180,140)", in_progress:"#3b82f6", resolved:"#10b981", closed:"#71717a" };
                    return (
                      <div key={t.id} onClick={function(){setViewTicket(t)}} style={{ display:"flex", alignItems:mob?"flex-start":"center", gap:mob?10:16, padding:mob?"14px":"16px 20px", borderBottom:ti<tickets.length-1?"1px solid rgba(255,255,255,0.04)":"none", cursor:"pointer", transition:"background 0.2s" }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:statusColors[t.status]||"#52525b", flexShrink:0, marginTop:mob?6:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                            <span style={{ fontSize:14, fontWeight:600, color:"#d4d4d8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.subject}</span>
                          </div>
                          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                            <code style={{ fontSize:9, color:"#3f3f46", background:"#0a0a0c", padding:"1px 6px", borderRadius:3 }}>{t.ref}</code>
                            <span style={{ fontSize:11, color:"#52525b" }}>{t.category}</span>
                            <span style={{ fontSize:10, color:"#3f3f46" }}>{"\u00B7"}</span>
                            <span style={{ fontSize:11, color:"#3f3f46" }}>{t.created}</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                          <Badge s={t.status.replace("_"," ")} />
                          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <Ico name="chat" size={12} color="#3f3f46" />
                            <span style={{ fontSize:11, color:"#3f3f46" }}>{t.messages}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop:16, padding:14, background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#52525b" }}>Our team responds within 24 hours (Sun-Thu, 9AM-6PM GST)</span>
                <span style={{ fontSize:12, color:"rgb(200,180,140)", fontWeight:600 }}>support@tutorii.com</span>
              </div>
            </div>
          )}
        </div>}

        {tab === "settings" && <SettingsTab u={u} mob={mob} setShowCancel={setShowCancel} cancelled={cancelled} setRealUser={setRealUser} />}
        </div>}
      </div>
      {/* ═══ CANCEL SUBSCRIPTION MODAL ═══ */}
      {showCancel && !cancelled && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={function(){setShowCancel(false)}}>
          <div onClick={function(e){e.stopPropagation()}} style={{ background:"#131315", borderRadius:16, padding:32, maxWidth:440, width:"90%", border:"1px solid rgba(248,113,113,0.2)" }}>
            <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="shield" size={36} color="#f87171" /></div>
            <h3 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Cancel Your Subscription?</h3>
            <p style={{ fontSize:13, color:"#71717a", lineHeight:1.7, marginBottom:8 }}>If you cancel:</p>
            <div style={{ fontSize:13, color:"#71717a", lineHeight:1.9, marginBottom:20, paddingLeft:16 }}>
              <div>{"• Access continues until "+u.nextBilling}</div>
              <div>{"• Your referral link will stop earning commissions"}</div>
              <div>{"• Pending earnings above AED 50 will still be paid"}</div>
              <div>{"• Pending earnings below AED 50 are forfeited"}</div>
              <div>{"• Course progress is saved — you can re-subscribe anytime"}</div>
            </div>
            {cancelErr && <div style={{ padding:"10px 14px", borderRadius:8, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", fontSize:13, marginBottom:14 }}>{cancelErr}</div>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={function(){setShowCancel(false)}} style={{ flex:1, padding:"11px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#d4d4d8", fontSize:13, fontWeight:600, cursor:"pointer" }}>Keep Subscription</button>
              <button onClick={doCancel} disabled={cancelling} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:"#dc2626", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", opacity:cancelling?0.6:1 }}>{cancelling ? "Cancelling..." : "Yes, Cancel"}</button>
            </div>
          </div>
        </div>
      )}
      {/* ═══ ONBOARDING WALKTHROUGH ═══ */}
      {showOnboard && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#131315", borderRadius:20, padding:"36px 40px", maxWidth:480, width:"90%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            {onboard === 0 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="sparkle" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:500, color:"#d4d4d8", margin:"0 0 8px" }}>{"Welcome to Tutorii, "+u.name.split(" ")[0]+"!"}</h2>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:24 }}>{"Let's take a quick tour of your dashboard so you can start learning and earning right away."}</p>
            </div>}
            {onboard === 1 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="link" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Your Referral Link</h2>
              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:14, marginBottom:12, border:"1px solid rgba(255,255,255,0.06)" }}>
                <code style={{ fontSize:14, fontWeight:700, color:"rgb(200,180,140)" }}>{"tutorii.com/ref/"+u.code}</code>
              </div>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:16 }}>{"Share this link with friends and contacts. When they subscribe, you earn 40% ($"+(PRICE*L1_RATE).toFixed(2)+") every month. Use the WhatsApp, SMS, and Email buttons at the top of your dashboard to share instantly."}</p>
            </div>}
            {onboard === 2 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="book" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Start Learning</h2>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:16 }}>{"You have access to "+courses.length+" modules with "+courses.reduce(function(s,c){return s+c.lessons.length},0)+" lessons. Head to the Courses tab to start watching videos and downloading guides. Mark lessons complete to track your progress."}</p>
            </div>}
            {onboard === 3 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="dollar" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Track Your Earnings</h2>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:16 }}>{"The Earnings and Payouts tabs show your income in real time. Payouts are processed every Tuesday via MamoPay to your bank account. Make sure your IBAN is set up in Settings."}</p>
            </div>}
            {onboard === 4 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="chat" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Need Help? Ask the Bot</h2>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:16 }}>{"Click the chat icon in the bottom-right corner anytime. Our AI assistant knows your account details and can answer questions about your earnings, referrals, courses, and more."}</p>
            </div>}
            <div style={{ display:"flex", gap:4, justifyContent:"center", marginBottom:20 }}>
              {[0,1,2,3,4].map(function(i){return <div key={i} style={{ width: i===onboard?20:8, height:8, borderRadius:4, background: i===onboard?"rgb(200,180,140)": i<onboard?"rgb(200,180,140)":"#27272a", transition:"all 0.3s" }} />})}
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              {onboard > 0 && <button onClick={function(){setOnboard(onboard-1)}} style={{ padding:"11px 24px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"#131315", fontSize:13, fontWeight:600, color:"#71717a", cursor:"pointer" }}>Back</button>}
              {onboard < 4 ? (
                <Btn onClick={function(){setOnboard(onboard+1)}} style={{ padding:"11px 28px", fontSize:13 }}>Next</Btn>
              ) : (
                <Btn onClick={function(){setShowOnboard(false)}} style={{ padding:"11px 28px", fontSize:13, background:"rgb(200,180,140)", color:"#0a0a0c" }}>{"Get Started"}</Btn>
              )}
            </div>
            {onboard < 4 && <div style={{ marginTop:12 }}><span onClick={function(){setShowOnboard(false)}} style={{ fontSize:12, color:"#52525b", cursor:"pointer" }}>Skip tour</span></div>}
          </div>
        </div>
      )}

      {/* ═══ MOBILE BOTTOM TAB BAR ═══ */}
      {mob && <div style={{ position:"fixed", bottom:0, left:0, right:0, display:"flex", justifyContent:"space-around", alignItems:"center", background:"rgba(17,17,19,0.95)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"6px 0 8px", zIndex:60 }}>
        {[["overview","chart","Overview"],["referrals","users","Referrals"],["earnings","dollar","Earnings"],["payouts","bank","Payouts"],["courses","book","Courses"],["settings","gear","Settings"]].map(function(item){ return (
          <button key={item[0]} onClick={function(){gotoTab(item[0])}} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"6px 4px", minWidth:48 }}>
            <Ico name={item[1]} size={18} color={tab===item[0]?"rgb(200,180,140)":"#52525b"} />
            <span style={{ fontSize:9, fontWeight:tab===item[0]?700:500, color:tab===item[0]?"rgb(200,180,140)":"#52525b" }}>{item[2]}</span>
          </button>
        )})}
      </div>}

      {/* ═══ SUPPORT CHAT WIDGET ═══ */}
      {(!chatOpen || chatMinimized) && (
        <button onClick={function(){setChatOpen(true);setChatMinimized(false)}} style={{
          position:"fixed", bottom:mob?80:24, right:mob?16:24, borderRadius:chatMinimized?28:"50%",
          background:"linear-gradient(135deg, rgba(200,180,140,0.9), rgba(200,180,140,0.7))", border:"1px solid rgba(200,180,140,0.3)", cursor:"pointer",
          boxShadow:"0 4px 24px rgba(200,180,140,0.15), 0 8px 40px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          zIndex:300, transition:"all 0.3s ease",
          width:chatMinimized?"auto":mob?48:56, height:chatMinimized?"auto":mob?48:56,
          padding:chatMinimized?"10px 18px":0
        }}>
          <Ico name="chat" size={chatMinimized?16:22} color="#0a0a0c" />
          {chatMinimized && <span style={{ fontSize:12, fontWeight:700, color:"#0a0a0c" }}>Support</span>}
        </button>
      )}

      {chatOpen && !chatMinimized && (
        <div style={{
          position:"fixed", bottom:mob?70:24, right:mob?8:24, width:mob?"calc(100% - 16px)":380, height:520,
          background:"#131315", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,0.2)",
          display:"flex", flexDirection:"column", overflow:"hidden", zIndex:300,
          border:"1px solid rgba(255,255,255,0.08)"
        }}>
          {/* Chat Header */}
          <div style={{ padding:"16px 20px", background:"linear-gradient(135deg, #131315, #18181b)", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(200,180,140,0.2)", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name="bot" size={16} color="rgb(200,180,140)" /></div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Tutorii Support</div>
                <div style={{ fontSize:10, color:"rgb(200,180,140)" }}>Online - knows your account</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={function(){setChatMinimized(true)}} title="Minimize" style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.06)", width:28, height:28, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="2" viewBox="0 0 12 2"><rect width="12" height="2" rx="1" fill="#71717a"/></svg></button>
              <button onClick={function(){setChatOpen(false);setChatMinimized(false)}} title="Close" style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.06)", width:28, height:28, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex:1, overflow:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12 }}>
            {chatMsgs.map(function(msg, i) {
              var isUser = msg.role === "user";
              return (
                <div key={i} style={{ display:"flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth:"85%", padding:"10px 14px", borderRadius:12,
                    background: isUser ? "rgba(200,180,140,0.12)" : "rgba(255,255,255,0.04)",
                    color: isUser ? "#d4d4d8" : "#a1a1aa",
                    fontSize:13, lineHeight:1.6,
                    borderBottomRightRadius: isUser ? 4 : 12,
                    borderBottomLeftRadius: isUser ? 12 : 4,
                    whiteSpace:"pre-wrap"
                  }}>{msg.content}</div>
                </div>
              );
            })}
            {chatLoading && (
              <div style={{ display:"flex", justifyContent:"flex-start" }}>
                <div style={{ padding:"10px 14px", borderRadius:12, background:"rgba(255,255,255,0.04)", borderBottomLeftRadius:4 }}>
                  <div style={{ display:"flex", gap:4 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#52525b", animation:"pulse 1s infinite" }} />
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#52525b", animation:"pulse 1s infinite 0.2s" }} />
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#52525b", animation:"pulse 1s infinite 0.4s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Quick Ask Buttons (shown at start) */}
          {chatMsgs.length <= 1 && (
            <div style={{ padding:"0 16px 8px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#52525b", letterSpacing:0.5, marginBottom:6, textTransform:"uppercase" }}>Ask me anything</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {["How much have I earned?","Who are my referrals?","My course progress","How do payouts work?"].map(function(q){
                  return (
                    <button key={q} onClick={function(){
                      setChatMsgs(function(prev){return prev.concat([{role:"user",content:q}])});
                      setChatLoading(true);
                      chatApi.send(q, null, null)
                      .then(function(data){
                        var reply = data.response || "Sorry, something went wrong.";
                        setChatMsgs(function(p){return p.concat([{role:"assistant",content:reply}])});
                        setChatLoading(false);
                      }).catch(function(){
                        setChatMsgs(function(p){return p.concat([{role:"assistant",content:"Connection issue. Please try again."}])});
                        setChatLoading(false);
                      });
                    }} style={{
                      padding:"5px 10px", borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", background:"#131315",
                      fontSize:10, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:500
                    }}>{q}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Self-Service Quick Actions (appear after first message) */}
          {chatMsgs.length > 1 && (
            <div style={{ padding:"4px 16px 6px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {[
                  ["Copy Referral Link", "link", function(){ copyLink(); setChatMsgs(function(p){return p.concat([{role:"assistant",content:"Your referral link has been copied!\n\ntutorii.com/ref/"+u.code+"\n\nShare it on WhatsApp, SMS, or social media."}])}); }],
                  ["Cancel Subscription", "lock", function(){ setChatMsgs(function(p){return p.concat([{role:"user",content:"I want to cancel my subscription"},{role:"assistant",content:"Before you cancel, here\u2019s what happens:\n\n\u2022 Access continues until "+u.nextBilling+"\n\u2022 Your referral link stops earning\n\u2022 Pending earnings above AED 50 are still paid\n\u2022 Course progress is saved\n\nTo confirm, go to Settings \u2192 Danger Zone \u2192 Cancel Subscription."}])}); }],
                  ["Update My IBAN", "bank", function(){ setChatMsgs(function(p){return p.concat([{role:"user",content:"I need to update my IBAN"},{role:"assistant",content:"You can update your payout IBAN in Settings \u2192 Payout Details.\n\nYour current IBAN ends in ..."+u.iban.slice(-3)+". Changes take effect on the next Tuesday payout."}])}); }],
                  ["Change Password", "shield", function(){ setChatMsgs(function(p){return p.concat([{role:"user",content:"I want to change my password"},{role:"assistant",content:"Two options:\n\n1. Settings \u2192 Change Password (if you know your current one)\n2. I can send a reset link to "+u.email+"\n\nWhich would you prefer?"}])}); }],
                  ["Share on WhatsApp", "phone", function(){ window.open("https://wa.me/?text="+encodeURIComponent("Learn practical skills for life in the UAE and earn while you grow! Join Tutorii: https://tutorii.com/ref/"+u.code),"_blank"); setChatMsgs(function(p){return p.concat([{role:"assistant",content:"WhatsApp opened with your referral link ready to share!"}])}); }],
                ].map(function(a){return (
                  <button key={a[0]} onClick={a[2]} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 9px", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)", fontSize:9, fontWeight:600, color:"#71717a", cursor:"pointer" }}>
                    <Ico name={a[1]} size={10} color="#52525b" />{a[0]}
                  </button>
                )})}
              </div>
            </div>
          )}

          {/* Escalate to Human */}
          <div style={{ padding:"6px 16px", borderTop:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span onClick={function(){
              var ref = "TK-"+Math.floor(8400+Math.random()*600);
              setChatMsgs(function(p){return p.concat([
                {role:"user",content:"I need to speak to a human"},
                {role:"assistant",content:"I\u2019ve escalated this conversation to our support team. A ticket has been created with the full chat context so you won\u2019t need to repeat anything.\n\nTicket: "+ref+"\nTrack it in your Support tab.\n\nOur team responds within 24 hours (Sun\u2013Thu, 9AM\u20136PM GST)."}
              ])});
              setTickets(function(prev){
                var now = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
                return [{id:"T"+Date.now(),ref:ref,subject:"Chat escalation",category:"general",status:"open",created:now,updated:now,messages:chatMsgs.length+2}].concat(prev);
              });
            }} style={{ fontSize:10, color:"#52525b", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              <Ico name="users" size={10} color="#52525b" />
              <span>{"Need a human? "}<span style={{ color:"rgb(200,180,140)", fontWeight:600 }}>Escalate to support</span></span>
            </span>
            <span onClick={function(){gotoTab("support");setChatOpen(false)}} style={{ fontSize:10, color:"#52525b", cursor:"pointer" }}>View tickets</span>
          </div>

          {/* Chat Input */}
          <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:8, alignItems:"center" }}>
            <input
              value={chatInput}
              onChange={function(e){setChatInput(e.target.value)}}
              onKeyDown={function(e){if(e.key==="Enter") sendChat()}}
              placeholder="Type your message..."
              style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", fontSize:13, outline:"none", background:"#0a0a0c", color:"#d4d4d8", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{
              width:40, height:40, borderRadius:10, border:"none",
              background: chatInput.trim() ? "rgb(200,180,140)" : "#27272a",
              color:"#fff", fontSize:16, cursor: chatInput.trim() ? "pointer" : "default",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
            }}><Ico name="rocket" size={16} color="#fff" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
// ═════════════════════════════════════════
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
          <input type="email" value={email} onChange={function(e){setEmail(e.target.value);setError("")}} placeholder="admin@tutorii.com" style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
        </div>
        <div style={{ marginBottom:28 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#52525b", marginBottom:5 }}>Password</label>
          <input type="password" value={pass} onChange={function(e){setPass(e.target.value);setError("")}} placeholder="********" style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#0a0a0c", color:"#d4d4d8" }} />
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
function AdminPanel(props) {
  var go = props.go;
  var courses = props.courses;
  var setCourses = props.setCourses;
  var mob = useIsMobile();
  var _tab = useState("dash"); var tab = _tab[0]; var setTab = _tab[1];
  var _search = useState(""); var search = _search[0]; var setSearch = _search[1];
  var _pay = useState([]); var payouts = _pay[0]; var setPayouts = _pay[1];
  var _sel = useState([]); var sel = _sel[0]; var setSel = _sel[1];
  var _toast = useState(null); var toast = _toast[0]; var setToast = _toast[1];
  var _em = useState(null); var editingModule = _em[0]; var setEditingModule = _em[1];
  var _el = useState(null); var editingLesson = _el[0]; var setEditingLesson = _el[1];
  var _ex = useState(null); var expandedModule = _ex[0]; var setExpandedModule = _ex[1];
  var _sam = useState(false); var showAddModule = _sam[0]; var setShowAddModule = _sam[1];
  var _sal = useState(null); var showAddLesson = _sal[0]; var setShowAddLesson = _sal[1];
  var _nm = useState({module:"",icon:"book"}); var newModule = _nm[0]; var setNewModule = _nm[1];
  var _nl = useState({title:"",dur:"10",pdfUrl:"",notes:""}); var newLesson = _nl[0]; var setNewLesson = _nl[1];
  var _cd = useState(null); var confirmDelete = _cd[0]; var setConfirmDelete = _cd[1];
  var _mm = useState(null); var manageMedia = _mm[0]; var setManageMedia = _mm[1];
  var _confirmPay = useState(false); var confirmPayout = _confirmPay[0]; var setConfirmPayout = _confirmPay[1];
  var _upl = useState(null); var uploading = _upl[0]; var setUploading = _upl[1];
  var _selUser = useState(null); var selectedUser = _selUser[0]; var setSelectedUser = _selUser[1];
  var adminContentRef = useRef(null);

  // Admin action states
  var _actionPanel = useState(null); var actionPanel = _actionPanel[0]; var setActionPanel = _actionPanel[1]; // "resetPass"|"changeEmail"|"reassignRef"|"updateIban"|"extendSub"|"viewProgress"
  var _tempPass = useState(""); var tempPass = _tempPass[0]; var setTempPass = _tempPass[1];
  var _newEmail = useState(""); var newEmail = _newEmail[0]; var setNewEmail = _newEmail[1];
  var _newRefCode = useState(""); var newRefCode = _newRefCode[0]; var setNewRefCode = _newRefCode[1];
  var _newIban = useState(""); var newIban = _newIban[0]; var setNewIban = _newIban[1];
  var _newIbanName = useState(""); var newIbanName = _newIbanName[0]; var setNewIbanName = _newIbanName[1];
  var _extendDays = useState("7"); var extendDays = _extendDays[0]; var setExtendDays = _extendDays[1];
  var _actionLoading = useState(false); var actionLoading = _actionLoading[0]; var setActionLoading = _actionLoading[1];
  var _actionResult = useState(null); var actionResult = _actionResult[0]; var setActionResult = _actionResult[1];
  var _auditEntries = useState([]); var auditEntries = _auditEntries[0]; var setAuditEntries = _auditEntries[1];
  var _auditFilter = useState(""); var auditFilter = _auditFilter[0]; var setAuditFilter = _auditFilter[1];
  var _adminUsers = useState([]); var adminUsers = _adminUsers[0]; var setAdminUsers = _adminUsers[1];
  var _adminStats = useState(null); var adminStats = _adminStats[0]; var setAdminStats = _adminStats[1];
  var _adminLoading = useState(true); var adminLoading = _adminLoading[0]; var setAdminLoading = _adminLoading[1];
  var { user: adminAuthUser } = useAuth();

  useEffect(function(){
    if (!adminAuthUser || adminAuthUser.role !== "admin") return;
    Promise.allSettled([
      adminApi.users(),
      adminApi.dashboard(),
      adminApi.payouts(),
      coursesApi.list(),
    ]).then(function(results){
      if(results[0].status==="fulfilled" && Array.isArray(results[0].value)){
        setAdminUsers(results[0].value.map(function(u){
          return {
            name: u.full_name||u.email, email: u.email, code: u.referral_code||"",
            l1: u.referral_count||0, l2: 0, earned: u.total_earned||0, pending: u.pending_payout||0,
            status: u.subscription_status||"inactive", joined: u.created_at ? new Date(u.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "",
            referrer: u.referred_by_name||null, l1Names:[], l2Names:[], id: u.id, role: u.role,
            iban: u.payout_iban||"", ibanName: u.payout_name||"",
          };
        }));
      }
      if(results[1].status==="fulfilled") setAdminStats(results[1].value);
      if(results[2].status==="fulfilled" && Array.isArray(results[2].value)) setPayouts(results[2].value);
      if(results[3].status==="fulfilled" && Array.isArray(results[3].value)){
        setCourses(results[3].value.map(function(c){
          return { id:c.id, module:c.title, icon:c.category||"book", lessons:[] };
        }));
      }
      setAdminLoading(false);
    });
  }, [adminAuthUser]);

  var active = adminUsers.filter(function(u){return u.status==="active"}).length;
  var mrr = adminStats ? adminStats.total_revenue_aed : active * PRICE;
  var totalLessons = courses.reduce(function(s,c){return s+c.lessons.length},0);

  function flash(msg) { setToast(msg); setTimeout(function(){setToast(null)},3000); }

  async function processPayouts() {
    try {
      var result = await adminApi.triggerPayouts();
      flash("Payouts processed: " + (result.payouts_processed || 0) + " sent to MamoPay");
      // Refresh payout list
      var updated = await adminApi.payouts();
      if (Array.isArray(updated)) setPayouts(updated);
    } catch(e) {
      flash("Error: " + (e.message || "Failed to process payouts"));
    }
    setSel([]);
  }

  async function addModule() {
    if (!newModule.module.trim()) return;
    try {
      var slug = newModule.module.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
      var created = await adminApi.createCourse({ title: newModule.module, slug: slug, category: newModule.icon, is_published: true, sort_order: courses.length });
      setCourses(function(p){ return p.concat([{ id: created.id, module: created.title, icon: created.category || newModule.icon, lessons: [] }]) });
      setNewModule({module:"",icon:"book"});
      setShowAddModule(false);
      flash("Module added!");
    } catch(e) {
      flash("Error: " + (e.message || "Failed to create module"));
    }
  }

  function updateModule(cid, field, value) {
    setCourses(function(p){return p.map(function(c){if(c.id!==cid) return c; var n=Object.assign({},c); n[field]=value; return n;})});
  }

  async function deleteModule(cid) {
    try {
      await adminApi.deleteCourse(cid);
      setCourses(function(p){return p.filter(function(c){return c.id!==cid})});
      setConfirmDelete(null); setExpandedModule(null);
      flash("Module deleted");
    } catch(e) {
      flash("Error: " + (e.message || "Failed to delete module"));
      setConfirmDelete(null);
    }
  }

  async function addLessonTo(cid) {
    if (!newLesson.title.trim()) return;
    var durMins = parseInt(newLesson.dur) || 10;
    try {
      var created = await adminApi.createLesson(cid, {
        title: newLesson.title,
        video_url: newLesson.pdfUrl || null,
        content_md: newLesson.notes || null,
        duration_minutes: durMins,
        sort_order: (courses.find(function(c){return c.id===cid})||{lessons:[]}).lessons.length,
        is_published: true,
      });
      setCourses(function(p){return p.map(function(c){
        return c.id===cid ? Object.assign({},c,{lessons:c.lessons.concat([{
          id: created.id, title: created.title,
          dur: created.duration_minutes + " min",
          video_url: created.video_url, done: false,
        }])}) : c;
      })});
      setNewLesson({title:"",dur:"10",pdfUrl:"",notes:""});
      setShowAddLesson(null);
      flash("Lesson added!");
    } catch(e) {
      flash("Error: " + (e.message || "Failed to add lesson"));
    }
  }

  function updateLesson(cid,lid,field,value) {
    setCourses(function(p){return p.map(function(c){return c.id===cid ? Object.assign({},c,{lessons:c.lessons.map(function(l){if(l.id!==lid) return l; var n=Object.assign({},l); n[field]=value; return n;})}) : c})});
  }

  async function deleteLessonFrom(cid, lid) {
    try {
      await adminApi.deleteLesson(cid, lid);
      setCourses(function(p){return p.map(function(c){return c.id===cid ? Object.assign({},c,{lessons:c.lessons.filter(function(l){return l.id!==lid})}) : c})});
      setConfirmDelete(null);
      flash("Lesson deleted");
    } catch(e) {
      flash("Error: " + (e.message || "Failed to delete lesson"));
      setConfirmDelete(null);
    }
  }

  function moveLesson(cid,lid,dir) {
    setCourses(function(p){return p.map(function(c){
      if(c.id!==cid) return c;
      var idx = c.lessons.findIndex(function(l){return l.id===lid});
      if((dir===-1 && idx===0)||(dir===1 && idx===c.lessons.length-1)) return c;
      var arr = c.lessons.slice();
      var tmp = arr[idx]; arr[idx] = arr[idx+dir]; arr[idx+dir] = tmp;
      return Object.assign({},c,{lessons:arr});
    })});
  }

  async function moveModule(cid,dir) {
    var newCourses;
    setCourses(function(p){
      var idx = p.findIndex(function(c){return c.id===cid});
      if((dir===-1 && idx===0)||(dir===1 && idx===p.length-1)) return p;
      var arr = p.slice();
      var tmp = arr[idx]; arr[idx] = arr[idx+dir]; arr[idx+dir] = tmp;
      newCourses = arr;
      return arr;
    });
    // Persist new sort_order for all courses
    if (newCourses) {
      newCourses.forEach(function(c, i) {
        adminApi.patchCourse(c.id, { sort_order: i }).catch(function(){});
      });
    }
  }

  function simulateUpload(cid,lid,type,file) { flash("Use PDF URL instead — click the lesson to edit"); }
  function removeMedia(cid,lid,type) { flash("Edit the lesson to update the PDF URL"); }

  var ICONS = ["book","globe","shield","target","dollar","rocket","book","target","lightbulb","globe","bank","shield","chart","users","phone","bank","phone","lock","chart","sparkle"];

  function doAction(label, cb) {
    setActionLoading(true); setActionResult(null);
    setTimeout(function(){
      setActionLoading(false);
      var msg = cb();
      setActionResult({ok:true, msg:msg});
      flash(msg);
      setTimeout(function(){setActionResult(null)},4000);
    }, 800);
  }

  function clearActionPanel() { setActionPanel(null); setActionResult(null); setTempPass(""); setNewEmail(""); setNewRefCode(""); setNewIban(""); setNewIbanName(""); setExtendDays("7"); }

  var DEMO_AUDIT = [];

  var admSide = [["dash","chart","Dashboard"],["users","users","Users"],["tickets","chat","Tickets"],["courses","book","Courses"],["payouts","dollar","Payouts"],["audit","shield","Audit Log"],["api","gear","API Config"]];

  return (
    <div style={{ display:"flex", flexDirection:mob?"column":"row", minHeight:"100vh", background:"#0a0a0c" }}>
      {!mob && <div style={{ width:230, background:"#111113", padding:"24px 0", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"0 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <Logo light />
          <div style={{ fontSize:10, color:"#71717a", letterSpacing:1.5, marginTop:4 }}>ADMIN PANEL</div>
        </div>
        <nav style={{ flex:1, padding:"12px 10px" }}>
          {admSide.map(function(item){ return (
            <button key={item[0]} onClick={function(){setTab(item[0])}} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", borderRadius:8, border:"none", textAlign:"left",
              background: tab===item[0] ? "rgba(200,180,140,0.15)" : "transparent", color: tab===item[0] ? "#d4d4d8" : "#52525b",
              fontSize:13, fontWeight: tab===item[0]?600:500, cursor:"pointer", marginBottom:2
            }}><Ico name={item[1]} size={16} color={tab===item[0] ? "rgb(200,180,140)" : "#52525b"} />{" "+item[2]}</button>
          )})}
        </nav>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#fff", marginBottom:8 }}>{adminAuthUser ? (adminAuthUser.full_name || adminAuthUser.email) : "Admin"}</div>
          <button onClick={function(){go("landing")}} style={{ width:"100%", padding:"8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#71717a", fontSize:12, cursor:"pointer" }}>Log Out</button>
        </div>
      </div>}

      {mob && <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#111113", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:0, zIndex:50 }}>
        <div><Logo light /><div style={{ fontSize:9, color:"#52525b", letterSpacing:1, marginTop:2 }}>ADMIN</div></div>
        <button onClick={function(){go("landing")}} style={{ padding:"6px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:11, cursor:"pointer" }}>Log Out</button>
      </div>}

      {/* ADMIN MOBILE BOTTOM TAB BAR */}
      {mob && <div style={{ position:"fixed", bottom:0, left:0, right:0, display:"flex", justifyContent:"space-around", alignItems:"center", background:"rgba(17,17,19,0.95)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"6px 0 8px", zIndex:60 }}>
        {admSide.map(function(item){ return (
          <button key={item[0]} onClick={function(){setTab(item[0]);if(adminContentRef.current)adminContentRef.current.scrollTop=0}} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"6px 4px", minWidth:52 }}>
            <Ico name={item[1]} size={18} color={tab===item[0]?"rgb(200,180,140)":"#52525b"} />
            <span style={{ fontSize:9, fontWeight:tab===item[0]?700:500, color:tab===item[0]?"rgb(200,180,140)":"#52525b" }}>{item[2]}</span>
          </button>
        )})}
      </div>}

      <div ref={adminContentRef} style={{ flex:1, padding:mob?16:28, overflow:"auto", maxHeight:"100vh", paddingBottom:mob?80:28, overflowX:"hidden", boxSizing:"border-box", minWidth:0, width:mob?"100%":"auto" }}>

        {tab === "dash" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>Analytics Dashboard</h2>
              <p style={{ fontSize:mob?11:12, color:"#71717a", marginTop:4 }}>Live data from your database</p>
            </div>
          </div>

          {/* KPI CARDS ROW 1 */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:12, marginBottom:16, alignItems:"stretch" }}>
            {[
              ["dollar","Total Revenue","AED "+(adminStats?adminStats.total_revenue_aed.toFixed(2):"—"),"All time payments","#059669","#064e3b"],
              ["users","Total Users",adminStats?adminStats.total_users:"—","Registered accounts","#8b5cf6","#2e1065"],
              ["shield","Active Subscribers",adminStats?adminStats.active_subscribers:"—","Current active subs","#f59e0b","#451a03"],
              ["book","Total Courses",adminStats?adminStats.total_courses:"—","Published modules","rgb(200,180,140)","rgba(200,180,140,0.12)"],
            ].map(function(c){ return (
              <div key={c[1]} style={{ background:"linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)", borderRadius:14, padding:mob?"12px 10px":"18px 20px", border:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:mob?8:14, boxSizing:"border-box", overflow:"hidden" }}>
                <div style={{ width:mob?30:38, height:mob?30:38, borderRadius:mob?8:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0, flexShrink:0 }}><Ico name={c[0]} size={16} color="rgb(200,180,140)" /></div>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, color:"#52525b", marginBottom:2 }}>{c[1]}</div>
                  <div style={{ fontSize:mob?16:20, fontWeight:500, color:"#d4d4d8", lineHeight:1.2 }}>{c[2]}</div>
                  <div style={{ fontSize:10, color:c[4], marginTop:2, fontWeight:500 }}>{c[3]}</div>
                </div>
              </div>
            )})}
          </div>

          {/* KPI CARDS ROW 2 */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:12, marginBottom:20, alignItems:"stretch" }}>
            {[
              ["dollar","Commissions Pending","AED "+(adminStats?adminStats.pending_commissions_aed.toFixed(2):"—"),"Awaiting payout","#f59e0b"],
              ["bank","Total Paid Out","AED "+(adminStats?adminStats.total_payouts_aed.toFixed(2):"—"),"Completed payouts","#d97706"],
              ["link","Avg Referrals/User",(adminUsers.length>0?(adminUsers.reduce(function(s,u){return s+u.l1},0)/adminUsers.length).toFixed(1):"—"),"L1 referrals per user","#8b5cf6"],
              ["refresh","Active Rate",(adminUsers.length>0?((adminUsers.filter(function(u){return u.status==="active"}).length/adminUsers.length)*100).toFixed(1)+"%":"—"),"Subscribers / total users","#10b981"],
            ].map(function(c){ return (
              <div key={c[1]} style={{ background:"linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)", borderRadius:14, padding:mob?"12px 10px":"18px 20px", border:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:mob?8:14, boxSizing:"border-box", overflow:"hidden" }}>
                <div style={{ width:mob?30:38, height:mob?30:38, borderRadius:mob?8:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.12)", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0, flexShrink:0 }}><Ico name={c[0]} size={16} color="rgb(200,180,140)" /></div>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, color:"#52525b", marginBottom:2 }}>{c[1]}</div>
                  <div style={{ fontSize:mob?16:20, fontWeight:500, color:"#d4d4d8", lineHeight:1.2 }}>{c[2]}</div>
                  <div style={{ fontSize:10, color:c[4], marginTop:2, fontWeight:500 }}>{c[3]}</div>
                </div>
              </div>
            )})}
          </div>

          {/* CHARTS ROW 1: User Growth + Revenue */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:14, marginBottom:14 }}>
            {/* User Growth Over Time */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?"14px 10px 10px":"20px 20px 12px", border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:"#d4d4d8", margin:0 }}>User Growth</h3>
                <span style={{ fontSize:mob?9:10, color:"#52525b", padding:"3px 10px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", whiteSpace:mob?"nowrap":"normal", overflow:"hidden", textOverflow:"ellipsis", maxWidth:mob?120:"none" }}>Total users, active & cancelled</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={GROWTH_DATA} margin={{top:5,right:5,left:mob?-25:-15,bottom:5}}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(200,180,140)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgb(200,180,140)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(200,180,140)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgb(200,180,140)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="date" tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return v.replace("Feb ","F").replace("Mar ","M")}} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} />
                  <Tooltip contentStyle={{background:"#0a0a0c",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:12,color:"#d4d4d8"}} />
                  <Area type="monotone" dataKey="users" stroke="rgb(200,180,140)" fill="url(#gUsers)" strokeWidth={2} name="Total Users" />
                  <Area type="monotone" dataKey="active" stroke="rgb(200,180,140)" fill="url(#gActive)" strokeWidth={2} name="Active" />
                  <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Cancelled" />
                  <Legend iconSize={8} wrapperStyle={{fontSize:10,color:"#52525b"}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue & Profit */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?"14px 10px 10px":"20px 20px 12px", border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:"#d4d4d8", margin:0 }}>Revenue vs Commissions vs Profit</h3>
                <span style={{ fontSize:mob?9:10, color:"#52525b", padding:"3px 10px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", whiteSpace:mob?"nowrap":"normal", overflow:"hidden", textOverflow:"ellipsis", maxWidth:mob?120:"none" }}>Where the money goes</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={GROWTH_DATA} margin={{top:5,right:5,left:mob?-25:-15,bottom:5}}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(200,180,140)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="rgb(200,180,140)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(200,180,140)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="rgb(200,180,140)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="date" tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return v.replace("Feb ","F").replace("Mar ","M")}} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return "AED "+v}} />
                  <Tooltip contentStyle={{background:"#0a0a0c",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:12,color:"#d4d4d8"}} formatter={function(v){return "AED "+v.toFixed(2)}} />
                  <Area type="monotone" dataKey="revenue" stroke="rgb(200,180,140)" fill="url(#gRev)" strokeWidth={2} name="Revenue" />
                  <Area type="monotone" dataKey="profit" stroke="rgb(200,180,140)" fill="url(#gProf)" strokeWidth={2} name="Net Profit" />
                  <Line type="monotone" dataKey="commissions" stroke="#f59e0b" strokeWidth={2} dot={false} name="Commissions" />
                  <Legend iconSize={8} wrapperStyle={{fontSize:10,color:"#52525b"}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHARTS ROW 2: Signups Bar + Churn Trend + Payouts */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
            {/* Daily Signups */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?"14px 10px 10px":"20px 20px 12px", border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:"#d4d4d8", margin:0 }}>New Signups</h3>
                <span style={{ fontSize:9, color:"#52525b", padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>Per period</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={GROWTH_DATA} margin={{top:5,right:5,left:mob?-25:-15,bottom:5}}>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="date" tick={{fill:"#52525b",fontSize:9}} tickFormatter={function(v){return v.replace("Feb ","").replace("Mar ","")}} />
                  <YAxis tick={{fill:"#52525b",fontSize:9}} />
                  <Tooltip contentStyle={{background:"#0a0a0c",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:11,color:"#d4d4d8"}} />
                  <Bar dataKey="signups" fill="rgb(200,180,140)" radius={[3,3,0,0]} name="Signups" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Churn Rate Trend */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?"14px 10px 10px":"20px 20px 12px", border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:"#d4d4d8", margin:0 }}>Churn Rate Trend</h3>
                <span style={{ fontSize:9, color:"#10b981", padding:"2px 8px", borderRadius:4, background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.1)" }}>Trending down</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={CHURN_DATA} margin={{top:5,right:5,left:mob?-25:-15,bottom:5}}>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="month" tick={{fill:"#52525b",fontSize:10}} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return v+"%"}} />
                  <Tooltip contentStyle={{background:"#0a0a0c",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:11,color:"#d4d4d8"}} formatter={function(v){return v+"%"}} />
                  <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{fill:"#ef4444",r:4}} name="Churn %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Payouts */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?"14px 10px 10px":"20px 20px 12px", border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:"#d4d4d8", margin:0 }}>Payouts to Users</h3>
                <span style={{ fontSize:9, color:"#52525b", padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>Monthly disbursed</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={MONTHLY_PAYOUTS} margin={{top:5,right:5,left:mob?-25:-15,bottom:5}}>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                  <XAxis dataKey="month" tick={{fill:"#52525b",fontSize:10}} />
                  <YAxis tick={{fill:"#52525b",fontSize:10}} tickFormatter={function(v){return "AED "+v}} />
                  <Tooltip contentStyle={{background:"#0a0a0c",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,fontSize:11,color:"#d4d4d8"}} formatter={function(v){return "AED "+v}} />
                  <Bar dataKey="amount" fill="#8b5cf6" radius={[3,3,0,0]} name="Paid Out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROW 3: Referral Network + Leaderboard */}
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 2fr", gap:14 }}>
            {/* Referral Network Breakdown Pie */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?12:20, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box", overflow:"hidden" }}>
              <h3 style={{ fontSize:13, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Referral Network</h3>
              <div style={{ display:"flex", flexDirection:mob?"column":"row", alignItems:"center", gap:mob?8:0 }}>
                <ResponsiveContainer width={mob?"100%":"50%"} height={mob?130:180}>
                  <PieChart>
                    <Pie data={NETWORK_PIE} cx="50%" cy="50%" innerRadius={mob?25:45} outerRadius={mob?48:75} paddingAngle={3} dataKey="value">
                      {NETWORK_PIE.map(function(entry,i){return <Cell key={i} fill={entry.color} />})}
                    </Pie>
                    <Tooltip contentStyle={{background:"rgba(10,10,12,0.95)",border:"1px solid rgba(200,180,140,0.15)",borderRadius:10,fontSize:11,color:"#d4d4d8",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",padding:"8px 12px"}} itemStyle={{color:"#d4d4d8"}} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:mob?"row":"column", gap:mob?6:8, flexWrap:"wrap", justifyContent:mob?"center":"flex-start" }}>
                  {NETWORK_PIE.map(function(item){ return (
                    <div key={item.name} style={{ display:"flex", alignItems:"center", gap:4, padding:mob?"3px 6px":"4px 10px", borderRadius:6, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:item.color, flexShrink:0 }} />
                      <span style={{ fontSize:mob?9:10, color:"#52525b" }}>{item.name}</span>
                      <span style={{ fontSize:mob?10:11, fontWeight:700, color:"#d4d4d8" }}>{item.value}</span>
                    </div>
                  )})}
                </div>
              </div>
            </div>

            {/* Top Referrers Leaderboard */}
            <div style={{ background:"#131315", borderRadius:14, padding:mob?12:20, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box", overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:"#d4d4d8", margin:0 }}>Top Referrers</h3>
                {!mob && <span style={{ fontSize:9, color:"#52525b", padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>By network size (L1 + L2)</span>}
              </div>
              <div style={{ width:"100%" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{(mob?["#","Name","L1","L2","Tot","Earned"]:["#","Name","Level 1","Level 2","Total","Earned","Status"]).map(function(h){return <th key={h} style={{ padding:mob?"6px 5px":"8px 8px", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:"#71717a", textAlign:"left", verticalAlign:"middle", borderBottom:"1px solid rgba(255,255,255,0.06)", whiteSpace:"nowrap" }}>{h}</th>})}</tr></thead>
                <tbody>{[...adminUsers].sort(function(a,b){return (b.l1+b.l2)-(a.l1+a.l2)}).slice(0,10).map(function(r,i){ return (
                  <tr key={r.name+i} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding:mob?"7px 5px":"10px 8px", verticalAlign:"middle" }}>
                      <div style={{ width:mob?18:22, height:mob?18:22, borderRadius:"50%", background:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:mob?8:10, fontWeight:700, color:i<3?"#0a0a0c":"#9ca3af" }}>{i+1}</div>
                    </td>
                    <td style={{ padding:mob?"7px 5px":"10px 8px", fontSize:mob?11:12, fontWeight:600, color:"#d4d4d8", verticalAlign:"middle", whiteSpace:"nowrap" }}>{r.name}</td>
                    <td style={{ padding:mob?"7px 5px":"10px 8px", fontSize:mob?11:12, color:"#d4d4d8", fontWeight:600, verticalAlign:"middle" }}>{r.l1}</td>
                    <td style={{ padding:mob?"7px 5px":"10px 8px", fontSize:mob?11:12, color:"#8b5cf6", fontWeight:600, verticalAlign:"middle" }}>{r.l2}</td>
                    <td style={{ padding:mob?"7px 5px":"10px 8px", fontSize:mob?12:13, fontWeight:700, color:"#fff", verticalAlign:"middle" }}>{r.l1+r.l2}</td>
                    <td style={{ padding:mob?"7px 5px":"10px 8px", fontSize:mob?11:12, fontWeight:500, color:"#d4d4d8", verticalAlign:"middle", whiteSpace:"nowrap" }}>{"AED "+(r.earned||0).toFixed(2)}</td>
                    {!mob && <td style={{ padding:"10px 8px", verticalAlign:"middle" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <Badge s={r.status} />
                      </div>
                    </td>}
                  </tr>
                )})}</tbody>
              </table>
              </div>
            </div>
          </div>
        </div>}

        {tab === "users" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:mob?10:0, marginBottom:20 }}>
            <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>{"Users ("+adminUsers.length+")"}</h2>
            <div style={{ position:"relative", width:mob?"100%":"auto" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", lineHeight:0, pointerEvents:"none" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
              <input value={search} onChange={function(e){setSearch(e.target.value)}} placeholder="Search name, email, or code..." style={{ padding:"9px 14px 9px 34px", borderRadius:8, border:"1px solid "+(search ? "rgba(200,180,140,0.2)" : "rgba(255,255,255,0.06)"), background:search ? "rgba(200,180,140,0.04)" : "#0a0a0c", color:"#fff", fontSize:13, width:mob?"100%":340, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s, background 0.2s" }} />
              {search && <button onClick={function(){setSearch("")}} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", lineHeight:0, padding:2 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>}
            </div>
          </div>
          {(function(){
            var q = search.toLowerCase().trim();
            var filtered = adminUsers.filter(function(u){
              if (!q) return true;
              return u.name.toLowerCase().includes(q) ||
                     u.email.toLowerCase().includes(q) ||
                     u.code.toLowerCase().includes(q) ||
                     u.status.toLowerCase().includes(q);
            });
            return (
              <div>
                {search && <div style={{ fontSize:11, color:"#52525b", marginBottom:10 }}>{"Showing "+filtered.length+" of "+adminUsers.length+" users"+(filtered.length===0 ? " — try a different search" : "")}</div>}
                <div style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", minWidth:mob?700:"auto" }}>
                    <thead><tr>{["User","Code","Level 1","Level 2","Earned","Status","Actions"].map(function(h){return <th key={h} style={{ padding:"12px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#71717a", textAlign:"left", verticalAlign:"middle", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>})}</tr></thead>
                    <tbody>{filtered.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:"#3f3f46", fontSize:13 }}>
                        <div style={{ marginBottom:8 }}><Ico name="users" size={28} color="#27272a" /></div>
                        {"No users match \u201C"+search+"\u201D"}
                      </td></tr>
                    ) : filtered.map(function(u){ return (
                <tr key={u.name} onClick={function(){setSelectedUser(selectedUser && selectedUser.name===u.name ? null : u)}} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", background:selectedUser && selectedUser.name===u.name ? "rgba(200,180,140,0.06)" : "transparent", transition:"background 0.2s" }}>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}><div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{u.name}</div><div style={{ fontSize:11, color:"#71717a" }}>{u.email}</div></td>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}><code style={{ fontSize:11, background:"#0a0a0c", padding:"2px 8px", borderRadius:4, color:"#52525b" }}>{u.code}</code></td>
                  <td style={{ padding:"12px", fontSize:13, color:"#d4d4d8", verticalAlign:"middle" }}>{u.l1}</td>
                  <td style={{ padding:"12px", fontSize:13, color:"#d4d4d8", verticalAlign:"middle" }}>{u.l2}</td>
                  <td style={{ padding:"12px", fontSize:13, fontWeight:500, color:"#d4d4d8", verticalAlign:"middle" }}>{"AED "+u.earned.toFixed(2)}</td>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}><Badge s={u.status}/></td>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}>
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={function(e){e.stopPropagation();setSelectedUser(selectedUser && selectedUser.name===u.name ? null : u)}} style={{ width:26, height:26, borderRadius:6, border:"1px solid "+(selectedUser && selectedUser.name===u.name?"rgba(200,180,140,0.3)":"rgba(255,255,255,0.06)"), background:selectedUser && selectedUser.name===u.name?"rgba(200,180,140,0.1)":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name="chart" size={11} color={selectedUser && selectedUser.name===u.name?"rgb(200,180,140)":"#52525b"} /></button>
                      <button onClick={function(e){e.stopPropagation();flash(u.status==="active"?"Suspended "+u.name:"Reactivated "+u.name)}} style={{ width:26, height:26, borderRadius:6, border:"1px solid "+(u.status==="active"?"rgba(248,113,113,0.2)":"rgba(200,180,140,0.2)"), background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name={u.status==="active"?"lock":"shield"} size={11} color={u.status==="active"?"#f87171":"rgb(200,180,140)"} /></button>
                      <button onClick={function(e){e.stopPropagation();flash("Manual payout initiated for "+u.name)}} style={{ width:26, height:26, borderRadius:6, border:"1px solid rgba(200,180,140,0.2)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name="dollar" size={11} color="rgb(200,180,140)" /></button>
                    </div>
                  </td>
                </tr>
              )})}
              </tbody>
                  </table></div>
                </div>
              </div>
            );
          })()}

          {/* USER DETAIL PANEL WITH REFERRAL TREE */}
          {selectedUser && (
            <div style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(200,180,140,0.15)", marginTop:14, overflow:"hidden", animation:"scaleIn 0.3s ease-out" }}>
              {/* Header */}
              <div style={{ padding:mob?"14px 14px":"20px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <h3 style={{ fontSize:mob?16:18, fontWeight:700, color:"#d4d4d8", margin:0 }}>{selectedUser.name}</h3>
                  <div style={{ display:"flex", gap:mob?8:16, marginTop:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, color:"#71717a" }}>{selectedUser.email}</span>
                    <span style={{ fontSize:11, color:"#52525b" }}>{"Joined "+selectedUser.joined}</span>
                    <span style={{ fontSize:11, color:"#52525b" }}>{"Code: "+selectedUser.code}</span>
                  </div>
                </div>
                <button onClick={function(){setSelectedUser(null);clearActionPanel()}} style={{ width:28, height:28, borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              </div>

              {/* Stats row */}
              <div style={{ display:"grid", gridTemplateColumns:mob?"repeat(3,1fr)":"repeat(5,1fr)", gap:1, background:"rgba(255,255,255,0.04)" }}>
                {[["Level 1",selectedUser.l1,"rgb(200,180,140)"],["Level 2",selectedUser.l2,"#a78bfa"],["Total",selectedUser.l1+selectedUser.l2,"#d4d4d8"],["Earned","AED "+selectedUser.earned.toFixed(2),"#059669"],["Pending","AED "+selectedUser.pending.toFixed(2),"#f59e0b"]].map(function(s){return (
                  <div key={s[0]} style={{ background:"#131315", padding:mob?"10px 8px":"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:"#52525b", marginBottom:4 }}>{s[0]}</div>
                    <div style={{ fontSize:mob?16:20, fontWeight:600, color:s[2] }}>{s[1]}</div>
                  </div>
                )})}
              </div>

              {/* ═══ ADMIN ACTIONS ═══ */}
              <div style={{ padding:mob?"14px":"20px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:"#52525b", marginBottom:12 }}>Admin Actions</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom: actionPanel ? 16 : 0 }}>
                  {[
                    ["resetPass","lock","Reset Password","#f59e0b"],
                    ["changeEmail","chat","Change Email","#3b82f6"],
                    ["reassignRef","link","Reassign Referrer","#a78bfa"],
                    ["updateIban","bank","Update IBAN","rgb(200,180,140)"],
                    ["toggleActive",selectedUser.status==="active"?"lock":"shield",selectedUser.status==="active"?"Deactivate":"Reactivate",selectedUser.status==="active"?"#ef4444":"#10b981"],
                    ["cancelSub","dollar","Cancel Sub","#ef4444"],
                    ["activateSub","shield","Activate Sub","#10b981"],
                    ["extendSub","chart","Extend Sub","#3b82f6"],
                    ["viewProgress","book","View Progress","#10b981"],
                  ].map(function(a){
                    var isActive = actionPanel === a[0];
                    return (
                      <button key={a[0]} onClick={async function(){
                        if (a[0]==="toggleActive") { doAction(a[2], function(){ return (selectedUser.status==="active" ? "Deactivated " : "Reactivated ") + selectedUser.name }); return; }
                        if (a[0]==="cancelSub") {
                          setActionLoading(true);
                          try {
                            await adminApi.cancelSubscription(selectedUser.id);
                            setAdminUsers(function(p){return p.map(function(u){return u.id===selectedUser.id?Object.assign({},u,{status:"inactive"}):u})});
                            setSelectedUser(function(u){return Object.assign({},u,{status:"inactive"})});
                            flash("Subscription cancelled for "+selectedUser.name);
                          } catch(e){ flash("Error: "+(e.message||"Failed")); }
                          setActionLoading(false); return;
                        }
                        if (a[0]==="activateSub") {
                          setActionLoading(true);
                          try {
                            await adminApi.activateSubscription(selectedUser.id);
                            setAdminUsers(function(p){return p.map(function(u){return u.id===selectedUser.id?Object.assign({},u,{status:"active"}):u})});
                            setSelectedUser(function(u){return Object.assign({},u,{status:"active"})});
                            flash("Subscription activated for "+selectedUser.name);
                          } catch(e){ flash("Error: "+(e.message||"Failed")); }
                          setActionLoading(false); return;
                        }
                        clearActionPanel(); setActionPanel(isActive ? null : a[0]);
                      }} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 12px", borderRadius:8, border:"1px solid "+(isActive ? a[3]+"40" : "rgba(255,255,255,0.06)"), background:isActive ? a[3]+"15" : "transparent", fontSize:11, fontWeight:600, color:isActive ? a[3] : "#71717a", cursor:"pointer", transition:"all 0.2s" }}>
                        <Ico name={a[1]} size={12} color={isActive ? a[3] : "#52525b"} />
                        {a[2]}
                      </button>
                    );
                  })}
                </div>

                {/* Action Result Banner */}
                {actionResult && (
                  <div style={{ padding:"10px 14px", borderRadius:8, background:actionResult.ok?"rgba(16,185,129,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(actionResult.ok?"rgba(16,185,129,0.15)":"rgba(248,113,113,0.15)"), marginBottom:12, fontSize:12, fontWeight:600, color:actionResult.ok?"#10b981":"#f87171", display:"flex", alignItems:"center", gap:8 }}>
                    <span>{actionResult.ok ? "\u2713" : "\u2717"}</span>
                    {actionResult.msg}
                  </div>
                )}

                {/* Reset Password Panel */}
                {actionPanel === "resetPass" && (
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:8 }}>Reset Password for {selectedUser.name}</div>
                    <p style={{ fontSize:11, color:"#52525b", marginBottom:12 }}>Generate a temporary password or enter one manually. You will need to communicate this to the user securely (WhatsApp, phone, etc.).</p>
                    <input value={tempPass} onChange={function(e){setTempPass(e.target.value)}} placeholder="Leave blank to auto-generate" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box", marginBottom:10, fontFamily:"monospace" }} />
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={function(){ doAction("Reset", function(){ var p = tempPass || "Tut" + Math.random().toString(36).slice(2,6).toUpperCase() + "9A"; setTempPass(p); return "Password reset. Temporary: " + p; }) }} disabled={actionLoading} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#f59e0b", color:"#0a0a0c", fontSize:12, fontWeight:700, cursor:"pointer", opacity:actionLoading?0.6:1 }}>{actionLoading ? "Resetting..." : "Reset Password"}</button>
                      <button onClick={clearActionPanel} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                    </div>
                    {actionResult && actionResult.msg && actionResult.msg.includes("Temporary") && (
                      <div style={{ marginTop:12, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:8, padding:"10px 14px" }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#f59e0b", marginBottom:4 }}>TEMPORARY PASSWORD</div>
                        <code style={{ fontSize:16, fontWeight:700, color:"#d4d4d8", letterSpacing:1 }}>{tempPass}</code>
                        <div style={{ fontSize:10, color:"#52525b", marginTop:6 }}>User should change this on first login.</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Change Email Panel */}
                {actionPanel === "changeEmail" && (
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:4 }}>Change Email for {selectedUser.name}</div>
                    <div style={{ fontSize:11, color:"#52525b", marginBottom:4 }}>{"Current: "}<strong style={{color:"#71717a"}}>{selectedUser.email}</strong></div>
                    <p style={{ fontSize:11, color:"#52525b", marginBottom:12 }}>Use this when a user has lost access to their registration email. They can then use forgot-password with the new email.</p>
                    <input value={newEmail} onChange={function(e){setNewEmail(e.target.value)}} placeholder="New email address" type="email" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box", marginBottom:10 }} />
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={function(){ if(!newEmail.trim()||!newEmail.includes("@")){flash("Enter a valid email");return;} doAction("Change", function(){ return "Email changed to "+newEmail; }) }} disabled={actionLoading} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#3b82f6", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", opacity:actionLoading?0.6:1 }}>{actionLoading ? "Updating..." : "Update Email"}</button>
                      <button onClick={clearActionPanel} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Reassign Referrer Panel */}
                {actionPanel === "reassignRef" && (
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:4 }}>Reassign Referrer for {selectedUser.name}</div>
                    <div style={{ fontSize:11, color:"#52525b", marginBottom:4 }}>{"Current referrer: "}<strong style={{color:"#71717a"}}>{selectedUser.referrer || "None"}</strong></div>
                    <p style={{ fontSize:11, color:"#52525b", marginBottom:12 }}>Enter the new referrer's code, or leave blank and click "Remove Referrer" to unlink.</p>
                    <input value={newRefCode} onChange={function(e){setNewRefCode(e.target.value.toUpperCase())}} placeholder="Referral code (e.g. DAVID2026)" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box", marginBottom:10, fontFamily:"monospace", textTransform:"uppercase" }} />
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={function(){ if(!newRefCode.trim()){flash("Enter a referral code");return;} doAction("Reassign", function(){ return "Referrer changed to "+newRefCode; }) }} disabled={actionLoading} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#a78bfa", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", opacity:actionLoading?0.6:1 }}>Assign Referrer</button>
                      <button onClick={function(){ doAction("Remove", function(){ return "Referrer removed for "+selectedUser.name; }) }} disabled={actionLoading} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(248,113,113,0.2)", background:"transparent", color:"#f87171", fontSize:12, fontWeight:600, cursor:"pointer" }}>Remove Referrer</button>
                      <button onClick={clearActionPanel} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                    </div>
                    <div style={{ marginTop:10, fontSize:10, color:"#3f3f46", fontStyle:"italic" }}>Note: Past commissions are not retroactively recalculated.</div>
                  </div>
                )}

                {/* Update IBAN Panel */}
                {actionPanel === "updateIban" && (
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:8 }}>Update Payout Info for {selectedUser.name}</div>
                    <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:10, marginBottom:10 }}>
                      <div>
                        <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>IBAN</label>
                        <input value={newIban} onChange={function(e){setNewIban(e.target.value.toUpperCase().replace(/\s/g,""))}} placeholder="AE070331234567890123456" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"monospace" }} />
                      </div>
                      <div>
                        <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#52525b", marginBottom:4 }}>Account Holder Name</label>
                        <input value={newIbanName} onChange={function(e){setNewIbanName(e.target.value)}} placeholder="Full name on account" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", boxSizing:"border-box" }} />
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={function(){ if(!newIban.trim()){flash("Enter an IBAN");return;} doAction("Update", function(){ return "IBAN updated for "+selectedUser.name; }) }} disabled={actionLoading} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:12, fontWeight:700, cursor:"pointer", opacity:actionLoading?0.6:1 }}>Update Payout Info</button>
                      <button onClick={clearActionPanel} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Extend Subscription Panel */}
                {actionPanel === "extendSub" && (
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:8 }}>Extend Subscription for {selectedUser.name}</div>
                    <p style={{ fontSize:11, color:"#52525b", marginBottom:12 }}>Add extra days to the current billing period. Use for goodwill, service issues, or compensation.</p>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
                      <input type="number" value={extendDays} onChange={function(e){setExtendDays(e.target.value)}} min="1" max="365" style={{ width:80, padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:14, fontWeight:600, outline:"none", textAlign:"center" }} />
                      <span style={{ fontSize:13, color:"#71717a" }}>days</span>
                      <div style={{ display:"flex", gap:4, marginLeft:8 }}>
                        {["7","14","30"].map(function(d){return <button key={d} onClick={function(){setExtendDays(d)}} style={{ padding:"6px 10px", borderRadius:6, border:"1px solid "+(extendDays===d?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.06)"), background:extendDays===d?"rgba(59,130,246,0.1)":"transparent", fontSize:11, fontWeight:600, color:extendDays===d?"#3b82f6":"#52525b", cursor:"pointer" }}>{d+"d"}</button>})}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={function(){ var d=parseInt(extendDays); if(!d||d<1||d>365){flash("Enter 1-365 days");return;} doAction("Extend", function(){ return "Subscription extended by "+d+" days for "+selectedUser.name; }) }} disabled={actionLoading} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#3b82f6", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", opacity:actionLoading?0.6:1 }}>Extend</button>
                      <button onClick={clearActionPanel} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* View Progress Panel */}
                {actionPanel === "viewProgress" && (
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>Course Progress for {selectedUser.name}</div>
                        <div style={{ fontSize:11, color:"#52525b", marginTop:2 }}>Click any lesson to toggle its completion status</div>
                      </div>
                      <button onClick={clearActionPanel} style={{ padding:"6px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:11, cursor:"pointer" }}>Close</button>
                    </div>

                    {(function(){
                      var totalL = courses.reduce(function(s,c){return s+c.lessons.length},0);
                      var doneL = courses.reduce(function(s,c){return s+c.lessons.filter(function(l){return l.done}).length},0);
                      var pct = totalL > 0 ? Math.round((doneL/totalL)*100) : 0;

                      return (
                        <div>
                          {/* Progress bar */}
                          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, padding:"12px 14px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                            <div style={{ flex:1 }}>
                              <div style={{ width:"100%", height:6, borderRadius:3, background:"rgba(255,255,255,0.06)" }}>
                                <div style={{ height:6, borderRadius:3, background:"rgb(200,180,140)", width:pct+"%", transition:"width 0.3s" }} />
                              </div>
                            </div>
                            <span style={{ fontSize:13, fontWeight:700, color:"rgb(200,180,140)", minWidth:48, textAlign:"right" }}>{pct+"%"}</span>
                            <span style={{ fontSize:11, color:"#52525b" }}>{doneL+"/"+totalL+" lessons"}</span>
                          </div>

                          {/* Course list */}
                          {courses.map(function(c){
                            var courseDone = c.lessons.filter(function(l){return l.done}).length;
                            var coursePct = c.lessons.length > 0 ? Math.round((courseDone/c.lessons.length)*100) : 0;
                            return (
                              <div key={c.id} style={{ marginBottom:8 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)" }}>
                                  <Ico name={c.icon} size={16} color="rgb(200,180,140)" />
                                  <span style={{ fontSize:12, fontWeight:600, color:"#d4d4d8", flex:1 }}>{c.module}</span>
                                  <span style={{ fontSize:10, color:coursePct===100?"#10b981":"#52525b", fontWeight:600 }}>{courseDone+"/"+c.lessons.length}</span>
                                  <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.06)" }}>
                                    <div style={{ height:4, borderRadius:2, background:coursePct===100?"#10b981":"rgb(200,180,140)", width:coursePct+"%", transition:"width 0.3s" }} />
                                  </div>
                                </div>
                                <div style={{ paddingLeft:mob?20:38 }}>
                                  {c.lessons.map(function(l){
                                    return (
                                      <div key={l.id} onClick={function(){
                                        var newDone = !l.done;
                                        setCourses(function(prev){return prev.map(function(cc){return cc.id===c.id?Object.assign({},cc,{lessons:cc.lessons.map(function(ll){return ll.id===l.id?Object.assign({},ll,{done:newDone}):ll})}):cc})});
                                        flash("Lesson '"+ l.title +"' marked " + (newDone ? "complete" : "incomplete"));
                                      }} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
                                        <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid "+(l.done?"#10b981":"#3f3f46"), background:l.done?"#10b981":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", flexShrink:0, transition:"all 0.2s", cursor:"pointer" }}>{l.done ? "\u2713" : ""}</div>
                                        <span style={{ fontSize:11, color:l.done?"#71717a":"#d4d4d8", textDecoration:l.done?"line-through":"none", flex:1, transition:"color 0.2s" }}>{l.title}</span>
                                        <span style={{ fontSize:9, color:"#3f3f46" }}>{l.dur}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Referral Tree */}
              <div style={{ padding:mob?"14px":"20px 24px" }}>
                <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:"#52525b", marginBottom:16 }}>Referral Tree</div>

                {/* Referrer (who brought this user in) */}
                {selectedUser.referrer ? (
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:600, color:"#71717a", marginBottom:8 }}>REFERRED BY</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                      <div style={{ width:28, height:28, borderRadius:8, background:"rgba(200,180,140,0.1)", border:"1px solid rgba(200,180,140,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"rgb(200,180,140)" }}>{selectedUser.referrer.split(" ").map(function(n){return n[0]}).join("")}</div>
                      <span style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{selectedUser.referrer}</span>
                      <span style={{ fontSize:10, color:"#52525b", marginLeft:"auto" }}>Upline</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:600, color:"#71717a", marginBottom:8 }}>REFERRED BY</div>
                    <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(255,255,255,0.06)", fontSize:12, color:"#3f3f46", fontStyle:"italic" }}>Direct signup — no referrer</div>
                  </div>
                )}

                {/* This user (the root node) */}
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:"linear-gradient(135deg, rgba(200,180,140,0.1), rgba(200,180,140,0.04))", border:"1px solid rgba(200,180,140,0.2)", marginBottom:4 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:"rgba(200,180,140,0.15)", border:"1px solid rgba(200,180,140,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"rgb(200,180,140)" }}>{selectedUser.name.split(" ").map(function(n){return n[0]}).join("")}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#d4d4d8" }}>{selectedUser.name}</div>
                    <div style={{ fontSize:11, color:"rgb(200,180,140)" }}>{selectedUser.code}</div>
                  </div>
                  <Badge s={selectedUser.status} />
                </div>

                {/* L1 Tree */}
                {selectedUser.l1Names.length > 0 ? (
                  <div style={{ marginLeft:mob?12:24, borderLeft:"2px solid rgba(200,180,140,0.15)", paddingLeft:mob?12:20, paddingTop:8 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"rgb(200,180,140)", marginBottom:8, letterSpacing:0.5 }}>{"LEVEL 1 — "+selectedUser.l1Names.length+" DIRECT REFERRALS"}</div>
                    {selectedUser.l1Names.map(function(name){
                      var l2Group = selectedUser.l2Names.find(function(g){return g.ref===name});
                      return (
                        <div key={name} style={{ marginBottom: l2Group ? 12 : 4 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", marginBottom:l2Group?4:0 }}>
                            <div style={{ width:6, height:6, borderRadius:"50%", background:"rgb(200,180,140)", flexShrink:0 }} />
                            <div style={{ width:24, height:24, borderRadius:6, background:"rgba(200,180,140,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#a1a1aa", flexShrink:0 }}>{name.split(" ").map(function(n){return n[0]}).join("")}</div>
                            <span style={{ fontSize:12, fontWeight:500, color:"#d4d4d8", flex:1 }}>{name}</span>
                            {l2Group && <span style={{ fontSize:9, padding:"2px 8px", borderRadius:4, background:"rgba(167,139,250,0.1)", color:"#a78bfa", fontWeight:600 }}>{l2Group.subs.length+" L2"}</span>}
                            <span style={{ fontSize:10, color:"#52525b" }}>L1</span>
                          </div>

                          {/* L2 under this L1 */}
                          {l2Group && (
                            <div style={{ marginLeft:mob?16:28, borderLeft:"2px solid rgba(167,139,250,0.12)", paddingLeft:mob?10:16, paddingTop:4 }}>
                              {l2Group.subs.map(function(sub){return (
                                <div key={sub} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px", marginBottom:2 }}>
                                  <div style={{ width:4, height:4, borderRadius:"50%", background:"#a78bfa", flexShrink:0 }} />
                                  <span style={{ fontSize:11, color:"#71717a" }}>{sub}</span>
                                  <span style={{ fontSize:9, color:"#3f3f46", marginLeft:"auto" }}>L2</span>
                                </div>
                              )})}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ marginLeft:mob?12:24, paddingLeft:mob?12:20, paddingTop:12 }}>
                    <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(255,255,255,0.06)", fontSize:12, color:"#3f3f46", fontStyle:"italic" }}>No referrals yet</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>}

        {tab === "tickets" && <AdminTicketsTab mob={mob} flash={flash} adminUsers={adminUsers} />}

        {tab === "courses" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:mob?10:0, marginBottom:20 }}>
            <div>
              <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>Course Management</h2>
              <p style={{ fontSize:13, color:"#71717a", marginTop:4 }}>{courses.length+" modules - "+totalLessons+" total lessons"}</p>
            </div>
            <button onClick={function(){setShowAddModule(true)}} style={{ background:"rgb(200,180,140)", color:"#fff", border:"none", padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", color:"#d4d4d8" }}>+ Add Module</button>
          </div>

          {showAddModule && (
            <div style={{ background:"#131315", borderRadius:14, padding:mob?14:24, border:"1px solid rgba(200,180,140,0.2)", marginBottom:16, boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:"#d4d4d8", margin:"0 0 16px" }}>New Module</h3>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
                {ICONS.map(function(ic){ return (
                  <button key={ic} onClick={function(){setNewModule(function(p){return {module:p.module,icon:ic}})}} style={{ width:32, height:32, borderRadius:6, border: newModule.icon===ic ? "2px solid rgb(200,180,140)" : "1px solid rgba(255,255,255,0.06)", background: newModule.icon===ic ? "rgba(200,180,140,0.12)" : "#0a0a0c", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}><Ico name={ic} size={14} color={newModule.icon===ic ? "rgb(200,180,140)" : "#52525b"} /></button>
                )})}
              </div>
              <input value={newModule.module} onChange={function(e){setNewModule(function(p){return {module:e.target.value,icon:p.icon}})}} placeholder="Module name" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:12 }} />
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button onClick={function(){setShowAddModule(false)}} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                <button onClick={addModule} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"rgb(200,180,140)", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>Add Module</button>
              </div>
            </div>
          )}

          {courses.map(function(c, ci){ return (
            <div key={c.id} style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:mob?8:12, padding:mob?"12px 10px":"16px 20px", minHeight:mob?44:56, flexWrap:"wrap" }}>
                <span style={{ lineHeight:0, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", width:40, height:40, borderRadius:10, background:"rgba(200,180,140,0.08)", border:"1px solid rgba(200,180,140,0.1)", flexShrink:0 }} onClick={async function(){
                  var next = expandedModule===c.id ? null : c.id;
                  setExpandedModule(next);
                  if (next && c.lessons.length === 0) {
                    try {
                      var lessons = await adminApi.getLessons(c.id);
                      setCourses(function(p){return p.map(function(x){return x.id===c.id ? Object.assign({},x,{lessons: lessons.map(function(l){return {id:l.id,title:l.title,dur:l.duration_minutes+" min",video_url:l.video_url,done:false}})}) : x})});
                    } catch(e) { /* not subscribed as admin is fine, lessons may still load */ }
                  }
                }}><Ico name={c.icon} size={20} color="rgb(200,180,140)" /></span>
                <div style={{ flex:1, cursor:"pointer" }} onClick={async function(){
                  var next = expandedModule===c.id ? null : c.id;
                  setExpandedModule(next);
                  if (next && c.lessons.length === 0) {
                    try {
                      var lessons = await adminApi.getLessons(c.id);
                      setCourses(function(p){return p.map(function(x){return x.id===c.id ? Object.assign({},x,{lessons: lessons.map(function(l){return {id:l.id,title:l.title,dur:l.duration_minutes+" min",video_url:l.video_url,done:false}})}) : x})});
                    } catch(e) {}
                  }
                }}>
                  {editingModule === c.id ? (
                    <input value={c.module} onChange={function(e){updateModule(c.id,"module",e.target.value)}} onBlur={function(){setEditingModule(null)}} autoFocus style={{ background:"#0a0a0c", border:"1px solid rgb(200,180,140)", borderRadius:6, padding:"6px 10px", color:"#fff", fontSize:15, fontWeight:700, outline:"none", width:"100%" }} />
                  ) : (
                    <div style={{ fontSize:15, fontWeight:700, color:"#d4d4d8" }}>{c.module}</div>
                  )}
                  <div style={{ fontSize:12, color:"#71717a", marginTop:2 }}>{c.lessons.length+" lessons"}</div>
                </div>
                <div style={{ display:"flex", gap:mob?2:4, flexShrink:0 }}>
                  <button onClick={function(){moveModule(c.id,-1);flash("Moved up")}} disabled={ci===0} title="Move Up" style={{ width:28, height:28, borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:ci===0?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ci===0?"rgba(255,255,255,0.1)":"#9ca3af"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg></button>
                  <button onClick={function(){moveModule(c.id,1);flash("Moved down")}} disabled={ci===courses.length-1} title="Move Down" style={{ width:28, height:28, borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:ci===courses.length-1?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ci===courses.length-1?"rgba(255,255,255,0.1)":"#9ca3af"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
                  <button onClick={function(){setEditingModule(c.id);flash("Editing module name")}} title="Edit Name" style={{ width:28, height:28, borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                  <button onClick={function(){setConfirmDelete({type:"module",cid:c.id,name:c.module})}} title="Delete Module" style={{ width:28, height:28, borderRadius:6, border:"1px solid #7f1d1d", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                </div>
              </div>

              {expandedModule === c.id && (
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  {c.lessons.map(function(l, li){ return (
                    <div key={l.id}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:mob?"10px 10px 10px 16px":"10px 20px 10px 56px", borderBottom:"1px solid rgba(255,255,255,0.04)", background:"#0a0a0c" }}>
                        <div style={{ width:22, height:22, borderRadius:"50%", border:"2px solid "+(l.done?"#059669":"rgba(255,255,255,0.06)"), background:l.done?"#059669":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>{l.done ? "\u2713" : ""}</div>
                        {editingLesson === l.id ? (
                          <div style={{ flex:1, display:"flex", gap:8 }}>
                            <input value={l.title} onChange={function(e){updateLesson(c.id,l.id,"title",e.target.value)}} onBlur={function(){setEditingLesson(null)}} autoFocus style={{ flex:1, background:"#131315", border:"1px solid rgb(200,180,140)", borderRadius:6, padding:"5px 10px", color:"#fff", fontSize:13, outline:"none" }} />
                            <input value={l.dur} onChange={function(e){updateLesson(c.id,l.id,"dur",e.target.value)}} style={{ width:80, background:"#131315", border:"1px solid rgb(200,180,140)", borderRadius:6, padding:"5px 8px", color:"#fff", fontSize:12, outline:"none" }} />
                          </div>
                        ) : (
                          <div style={{ flex:1, cursor:"pointer" }} onClick={function(){setManageMedia(manageMedia && manageMedia.lid===l.id ? null : {cid:c.id,lid:l.id})}}>
                            <div style={{ fontSize:13, fontWeight:500, color:"#d4d4d8" }}>{l.title}</div>
                            <div style={{ display:"flex", gap:8, marginTop:3 }}>
                              <span style={{ fontSize:10, color:"#71717a" }}>{l.dur}</span>
                              {!mob && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, background:l.video_url?"rgba(200,180,140,0.12)":"rgba(255,255,255,0.04)", color:l.video_url?"rgb(200,180,140)":"#52525b" }}>{l.video_url ? "PDF ✓" : "No PDF"}</span>}
                            </div>
                          </div>
                        )}
                        <div style={{ display:"flex", gap:mob?2:3, flexShrink:0 }}>
                          <button onClick={function(){setManageMedia(manageMedia && manageMedia.lid===l.id ? null : {cid:c.id,lid:l.id});flash(manageMedia && manageMedia.lid===l.id?"Closed media":"Manage media")}} title="Manage Media" style={{ width:24, height:24, borderRadius:4, border:"1px solid "+(manageMedia && manageMedia.lid===l.id?"rgb(200,180,140)":"rgba(255,255,255,0.06)"), background:manageMedia && manageMedia.lid===l.id?"rgba(200,180,140,0.12)":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={manageMedia && manageMedia.lid===l.id?"rgb(200,180,140)":"#6b7280"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></button>
                          <button onClick={function(){moveLesson(c.id,l.id,-1);flash("Lesson moved up")}} disabled={li===0} title="Move Up" style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:li===0?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={li===0?"rgba(255,255,255,0.1)":"#6b7280"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg></button>
                          <button onClick={function(){moveLesson(c.id,l.id,1);flash("Lesson moved down")}} disabled={li===c.lessons.length-1} title="Move Down" style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:li===c.lessons.length-1?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={li===c.lessons.length-1?"rgba(255,255,255,0.1)":"#6b7280"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
                          <button onClick={function(){setEditingLesson(l.id);flash("Editing lesson")}} title="Edit Lesson" style={{ width:24, height:24, borderRadius:4, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                          <button onClick={function(){setConfirmDelete({type:"lesson",cid:c.id,lid:l.id,name:l.title})}} title="Delete Lesson" style={{ width:24, height:24, borderRadius:4, border:"1px solid #7f1d1d", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                        </div>
                      </div>

                      {manageMedia && manageMedia.lid === l.id && (
                        <LessonEditPanel key={l.id} lesson={l} cid={c.id} onSave={async function(updates){
                          try {
                            var updated = await adminApi.updateLesson(c.id, l.id, updates);
                            setCourses(function(p){return p.map(function(x){return x.id===c.id ? Object.assign({},x,{lessons:x.lessons.map(function(ls){return ls.id===l.id ? Object.assign({},ls,{title:updated.title,dur:updated.duration_minutes+" min",video_url:updated.video_url}) : ls})}) : x})});
                            setManageMedia(null);
                            flash("Lesson updated!");
                          } catch(e){ flash("Error: "+(e.message||"Failed to save")); }
                        }} onClose={function(){setManageMedia(null)}} />
                      )}
                    </div>
                  )})}

                  {showAddLesson === c.id ? (
                    <div style={{ padding:"16px 20px", background:"#0a0a0c", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#d4d4d8", marginBottom:12 }}>New Lesson</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:8, marginBottom:8 }}>
                        <input value={newLesson.title} onChange={function(e){setNewLesson(function(p){return Object.assign({},p,{title:e.target.value})})}} placeholder="Lesson title" style={{ padding:"8px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"#131315", color:"#fff", fontSize:13, outline:"none" }} />
                        <input value={newLesson.dur} onChange={function(e){setNewLesson(function(p){return Object.assign({},p,{dur:e.target.value})})}} placeholder="Mins" style={{ padding:"8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"#131315", color:"#fff", fontSize:12, outline:"none" }} />
                      </div>
                      <input value={newLesson.pdfUrl} onChange={function(e){setNewLesson(function(p){return Object.assign({},p,{pdfUrl:e.target.value})})}} placeholder="PDF URL (e.g. https://drive.google.com/file/d/FILE_ID/preview)" style={{ width:"100%", padding:"8px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"#131315", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box", marginBottom:8 }} />
                      <textarea value={newLesson.notes} onChange={function(e){setNewLesson(function(p){return Object.assign({},p,{notes:e.target.value})})}} placeholder="Lesson notes / description (optional)" rows={3} style={{ width:"100%", padding:"8px 12px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"#131315", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit", marginBottom:8 }} />
                      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                        <button onClick={function(){setShowAddLesson(null)}} style={{ padding:"8px 16px", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:12, cursor:"pointer" }}>Cancel</button>
                        <button onClick={function(){addLessonTo(c.id)}} style={{ padding:"8px 20px", borderRadius:6, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:12, fontWeight:600, cursor:"pointer" }}>Add Lesson</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={function(){setShowAddLesson(c.id)}} style={{ width:"100%", padding:mob?"10px 10px 10px 16px":"10px 20px 10px 56px", background:"#0a0a0c", border:"none", borderTop:"1px solid rgba(255,255,255,0.04)", color:"rgb(200,180,140)", fontSize:12, fontWeight:600, cursor:"pointer", textAlign:"left" }}>+ Add Lesson</button>
                  )}
                </div>
              )}
            </div>
          )})}
        </div>}

        {tab === "payouts" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:mob?10:0, marginBottom:20 }}>
            <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>Payouts</h2>
            <button onClick={function(){setConfirmPayout(true)}} style={{ background:"rgb(200,180,140)", color:"#0a0a0c", border:"none", padding:mob?"8px 16px":"10px 22px", borderRadius:10, fontSize:mob?12:13, fontWeight:600, cursor:"pointer" }}>{"Process "+(sel.length>0?"("+sel.length+")":"All Queued")}</button>
          </div>
          <div style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", minWidth:mob?750:"auto" }}>
              <thead><tr>
                <th style={{ padding:"12px", width:40, verticalAlign:"middle", borderBottom:"1px solid rgba(255,255,255,0.06)" }}><input type="checkbox" onChange={function(e){setSel(e.target.checked ? payouts.filter(function(p){return p.status==="queued"}).map(function(p){return p.id}) : [])}} /></th>
                {["User","IBAN","Amount","Status","Date","Actions"].map(function(h){return <th key={h} style={{ padding:"12px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#71717a", textAlign:"left", verticalAlign:"middle", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>})}
              </tr></thead>
              <tbody>{payouts.map(function(p){ return (
                <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", background:sel.includes(p.id)?"rgba(200,180,140,0.12)":"transparent" }}>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}><input type="checkbox" checked={sel.includes(p.id)} disabled={p.status!=="queued"} onChange={function(e){setSel(function(v){return e.target.checked ? v.concat([p.id]) : v.filter(function(x){return x!==p.id})})}} /></td>
                  <td style={{ padding:"12px", fontSize:13, fontWeight:600, color:"#d4d4d8", verticalAlign:"middle" }}>{p.user}</td>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}><code style={{ fontSize:11, color:"#52525b" }}>{p.iban}</code></td>
                  <td style={{ padding:"12px", fontSize:14, fontWeight:500, color:"#d4d4d8", verticalAlign:"middle" }}>{"AED "+p.amount.toFixed(2)}</td>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}><Badge s={p.status}/></td>
                  <td style={{ padding:"12px", fontSize:12, color:"#71717a", verticalAlign:"middle" }}>{p.date}</td>
                  <td style={{ padding:"12px", verticalAlign:"middle" }}>
                    <div style={{ display:"flex", gap:4 }}>
                      {p.status === "failed" && <button onClick={function(e){e.stopPropagation(); setPayouts(function(prev){return prev.map(function(x){return x.id===p.id?Object.assign({},x,{status:"processing"}):x})}); setTimeout(function(){setPayouts(function(prev){return prev.map(function(x){return x.id===p.id?Object.assign({},x,{status:"completed"}):x})}); flash("Payout "+p.id+" retried successfully")},1200)}} style={{ padding:"5px 10px", borderRadius:6, border:"1px solid rgba(200,180,140,0.2)", background:"rgba(200,180,140,0.06)", fontSize:10, fontWeight:600, color:"rgb(200,180,140)", cursor:"pointer", whiteSpace:"nowrap" }}>Retry</button>}
                      {(p.status === "failed" || p.status === "processing") && <button onClick={function(e){e.stopPropagation(); setPayouts(function(prev){return prev.map(function(x){return x.id===p.id?Object.assign({},x,{status:"completed"}):x})}); flash("Payout "+p.id+" marked as completed")}} style={{ padding:"5px 10px", borderRadius:6, border:"1px solid rgba(16,185,129,0.2)", background:"rgba(16,185,129,0.06)", fontSize:10, fontWeight:600, color:"#10b981", cursor:"pointer", whiteSpace:"nowrap" }}>Mark Done</button>}
                      {p.status === "completed" && <span style={{ fontSize:10, color:"#3f3f46" }}>{"\u2014"}</span>}
                      {p.status === "queued" && <span style={{ fontSize:10, color:"#3f3f46" }}>Pending</span>}
                    </div>
                  </td>
                </tr>
              )})}</tbody>
            </table></div>
          </div>
        </div>}

        {tab === "audit" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:mob?10:0, marginBottom:20 }}>
            <div>
              <h2 style={{ fontSize:mob?18:22, fontWeight:700, margin:0, color:"#d4d4d8" }}>Audit Log</h2>
              <p style={{ fontSize:13, color:"#71717a", marginTop:4 }}>All admin actions are recorded here</p>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <select value={auditFilter} onChange={function(e){setAuditFilter(e.target.value)}} style={{ padding:"8px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#d4d4d8", fontSize:12, outline:"none", cursor:"pointer" }}>
                <option value="">All actions</option>
                <option value="reset_password">Reset Password</option>
                <option value="change_email">Change Email</option>
                <option value="reassign_referrer">Reassign Referrer</option>
                <option value="activate_user">Activate User</option>
                <option value="deactivate_user">Deactivate User</option>
                <option value="activate_subscription">Activate Subscription</option>
                <option value="cancel_subscription">Cancel Subscription</option>
                <option value="extend_subscription">Extend Subscription</option>
                <option value="retry_payout">Retry Payout</option>
                <option value="manual_payout_complete">Manual Payout</option>
                <option value="update_payout_info">Update IBAN</option>
                <option value="mark_lesson_complete">Mark Lesson</option>
                <option value="trigger_payouts">Trigger Payouts</option>
              </select>
            </div>
          </div>

          <div style={{ background:"#131315", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:mob?700:"auto" }}>
                <thead><tr>{["Time","Action","Admin","Target","Detail"].map(function(h){return <th key={h} style={{ padding:"12px 14px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#71717a", textAlign:"left", verticalAlign:"middle", borderBottom:"1px solid rgba(255,255,255,0.06)", whiteSpace:"nowrap" }}>{h}</th>})}</tr></thead>
                <tbody>
                  {DEMO_AUDIT.filter(function(e){return !auditFilter || e.action === auditFilter}).map(function(entry){
                    var actionColors = {
                      reset_password:"#f59e0b", change_email:"#3b82f6", reassign_referrer:"#a78bfa",
                      deactivate_user:"#ef4444", activate_user:"#10b981", cancel_subscription:"#ef4444",
                      activate_subscription:"#10b981", extend_subscription:"#3b82f6",
                      retry_payout:"rgb(200,180,140)", retry_payout_failed:"#ef4444",
                      manual_payout_complete:"rgb(200,180,140)", update_payout_info:"rgb(200,180,140)",
                      trigger_payouts:"#71717a", mark_lesson_complete:"#10b981", mark_lesson_incomplete:"#f59e0b",
                    };
                    var color = actionColors[entry.action] || "#71717a";
                    var actionLabel = entry.action.replace(/_/g," ").replace(/\b\w/g, function(c){return c.toUpperCase()});
                    var d = new Date(entry.created_at);
                    var timeStr = d.toLocaleDateString("en-GB",{day:"numeric",month:"short"}) + " " + d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
                    var targetName = "";
                    if(entry.target_user_id){
                      var found = adminUsers.find(function(u){return "u"+adminUsers.indexOf(u) === entry.target_user_id || u.email === (entry.detail||"").match(/for (\S+@\S+)/)?.[1]});
                      targetName = found ? found.name : (entry.detail||"").match(/for (.+?)(?:\.|$)/)?.[1] || entry.target_user_id;
                    }
                    return (
                      <tr key={entry.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding:"10px 14px", fontSize:11, color:"#52525b", whiteSpace:"nowrap", verticalAlign:"middle" }}>{timeStr}</td>
                        <td style={{ padding:"10px 14px", verticalAlign:"middle" }}>
                          <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:6, fontSize:10, fontWeight:700, background:color+"15", color:color, letterSpacing:0.3, lineHeight:1.4, textAlign:"center" }}>{actionLabel}</span>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"#a1a1aa", verticalAlign:"middle", whiteSpace:"nowrap" }}>{entry.admin_email}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"#d4d4d8", fontWeight:500, verticalAlign:"middle", whiteSpace:"nowrap" }}>{targetName || "\u2014"}</td>
                        <td style={{ padding:"10px 14px", fontSize:11, color:"#71717a", verticalAlign:"middle", maxWidth:300 }}>
                          <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.detail}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {DEMO_AUDIT.filter(function(e){return !auditFilter || e.action === auditFilter}).length === 0 && (
              <div style={{ padding:40, textAlign:"center", color:"#3f3f46", fontSize:13 }}>No audit entries found for this filter.</div>
            )}
          </div>
          <div style={{ marginTop:12, fontSize:11, color:"#3f3f46", textAlign:"right" }}>{"Showing "+DEMO_AUDIT.filter(function(e){return !auditFilter || e.action === auditFilter}).length+" of "+DEMO_AUDIT.length+" entries"}</div>
        </div>}

        {tab === "api" && <div style={{ maxWidth:"100%", overflow:"hidden" }}>
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>Admin Management</h2>

          {/* Create Admin */}
          <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 6px", color:"#d4d4d8" }}>Create New Admin</h3>
            <p style={{ fontSize:12, color:"#52525b", marginBottom:16 }}>The user must already have a registered account. This will promote their role to admin.</p>
            <CreateAdminForm mob={mob} adminApi={adminApi} />
          </div>

          <h2 style={{ fontSize:18, fontWeight:700, margin:"24px 0 16px", color:"#d4d4d8" }}>MamoPay API Config</h2>
          <div style={{ background:"#131315", borderRadius:14, padding:mob?16:22, border:"1px solid rgba(255,255,255,0.06)", marginBottom:20, boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 16px", color:"#d4d4d8" }}>Connection</h3>
            <div style={{ display:"grid", gap:16, maxWidth:mob?"100%":480 }}>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#71717a", marginBottom:6 }}>ENVIRONMENT</label>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"1px solid rgba(200,180,140,0.2)", background:"rgba(200,180,140,0.12)", fontSize:12, fontWeight:600, color:"rgb(200,180,140)", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Ico name="gear" size={12} color="rgb(200,180,140)" />Sandbox</div>
                  <div style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"2px solid rgba(255,255,255,0.06)", fontSize:12, fontWeight:600, color:"#71717a", textAlign:"center", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Ico name="lock" size={12} color="#71717a" />Production</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:mob?"column":"row", alignItems:mob?"flex-start":"center", gap:mob?4:14 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#71717a", minWidth:mob?"auto":90, flexShrink:0 }}>API KEY</label>
                <input type="password" placeholder="sk-xxxxxxxx-xxxx" style={{ flex:1, padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#fff", fontSize:12, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"flex", flexDirection:mob?"column":"row", alignItems:mob?"flex-start":"center", gap:mob?4:14 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#71717a", minWidth:mob?"auto":90, flexShrink:0 }}>WEBHOOK URL</label>
                <input placeholder="https://tutorii.com/api/webhooks/mamopay" style={{ flex:1, padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0c", color:"#fff", fontSize:12, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }} />
              </div>
            </div>
          </div>
          <div style={{ background:"#0a0a0c", borderRadius:14, padding:mob?16:22 }}>
            <h3 style={{ fontSize:13, fontWeight:600, color:"rgb(200,180,140)", margin:"0 0 12px", display:"flex", alignItems:"center", gap:8 }}><Ico name="link" size={14} color="rgb(200,180,140)" />MamoPay Endpoints</h3>
            <div style={{ fontSize:mob?11:12, color:"#71717a", lineHeight:2.2, fontFamily:"monospace" }}>
              <div>{"PAY-IN  POST /manage_api/v1/links"}</div>
              <div>{"        POST /manage_api/v1/webhooks"}</div>
              <div>{"        GET  /manage_api/v1/charges/:id"}</div>
              <div style={{ height:8 }} />
              <div>{"PAYOUT  POST /manage_api/v1/disbursements"}</div>
              <div>{"        GET  /manage_api/v1/disbursements/:id"}</div>
            </div>
          </div>
        </div>}

        {confirmPayout && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }} onClick={function(){setConfirmPayout(false)}}>
            <div onClick={function(e){e.stopPropagation()}} style={{ background:"#131315", borderRadius:16, padding:32, maxWidth:440, width:"90%", border:"1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>Confirm Payout Processing</h3>
              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:16, marginBottom:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontSize:13, color:"#71717a" }}>{"Payouts to process"}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{sel.length > 0 ? sel.length : payouts.filter(function(p){return p.status==="queued"}).length}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontSize:13, color:"#71717a" }}>Total amount</div>
                  <div style={{ fontSize:20, fontWeight:500, color:"#d4d4d8" }}>{"AED "+(sel.length > 0 ? payouts.filter(function(p){return sel.includes(p.id)}).reduce(function(s,p){return s+p.amount},0).toFixed(2) : payouts.filter(function(p){return p.status==="queued"}).reduce(function(s,p){return s+p.amount},0).toFixed(2))}</div>
                </div>
                <div style={{ fontSize:11, color:"#52525b", padding:"4px 10px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.04)", display:"inline-block" }}>Via MamoPay bank transfer to registered IBANs</div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={function(){setConfirmPayout(false)}} style={{ flex:1, padding:"11px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#d4d4d8", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                <button onClick={function(){setConfirmPayout(false);processPayouts()}} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:13, fontWeight:600, cursor:"pointer" }}>Confirm & Process</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div style={{ position:"fixed", bottom:mob?72:24, right:mob?16:24, padding:mob?"10px 18px":"12px 24px", borderRadius:10, background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:13, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", zIndex:100 }}>{toast}</div>}

        {confirmDelete && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }} onClick={function(){setConfirmDelete(null)}}>
            <div onClick={function(e){e.stopPropagation()}} style={{ background:"#131315", borderRadius:16, padding:32, maxWidth:400, width:"90%", border:"1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#fff", margin:"0 0 8px" }}>{"Delete "+confirmDelete.type+"?"}</h3>
              <p style={{ fontSize:13, color:"#52525b", marginBottom:24 }}>{"Are you sure you want to delete \""+confirmDelete.name+"\"? This cannot be undone."}</p>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button onClick={function(){setConfirmDelete(null)}} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"#52525b", fontSize:13, cursor:"pointer" }}>Cancel</button>
                <button onClick={function(){if(confirmDelete.type==="module") deleteModule(confirmDelete.cid); else deleteLessonFrom(confirmDelete.cid,confirmDelete.lid)}} style={{ padding:"9px 18px", borderRadius:8, border:"none", background:"#dc2626", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// LEGAL PAGE SHELL
// ═════════════════════════════════════════
function LegalPage(props) {
  var go = props.go;
  var mob = useIsMobile();
  var title = props.title;
  var children = props.children;
  return (
    <div style={{ background:"#0a0a0c", minHeight:"100vh" }}>
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 48px", background:"#131315", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <Logo onClick={function(){go("landing")}} />
        <div style={{ display:"flex", gap:20 }}>
          <span onClick={function(){go("login")}} style={{ fontSize:13, fontWeight:600, color:"rgb(200,180,140)", cursor:"pointer" }}>Log In</span>
          <Btn onClick={function(){go("subscribe")}} style={{ padding:"8px 18px", fontSize:12 }}>Subscribe</Btn>
        </div>
      </nav>
      <div style={{ maxWidth:800, margin:"0 auto", padding:mob?"24px 16px 60px":"48px 24px 80px" }}>
        <span onClick={function(){go("landing")}} style={{ fontSize:13, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600 }}>Home</span>
        <h1 style={{ fontSize:32, fontWeight:800, color:"#d4d4d8", margin:"20px 0 32px" }}>{title}</h1>
        <div style={{ background:"#131315", borderRadius:16, padding:mob?"20px 18px":"36px 40px", border:"1px solid rgba(255,255,255,0.06)", fontSize:mob?13:14, color:"#71717a", lineHeight:1.9 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════
// TERMS OF SERVICE
// ═════════════════════════════════════════
function TermsPage(props) {
  var go = props.go;
  return (
    <LegalPage go={go} title="Terms of Service">
      <p style={{ fontSize:12, color:"#52525b", marginBottom:24 }}>Last updated: March 1, 2026</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>1. Acceptance of Terms</h2>
      <p style={{ marginBottom:20 }}>By creating an account or using Tutorii.com ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>2. Service Description</h2>
      <p style={{ marginBottom:20 }}>Tutorii provides educational courses designed for expatriates in the UAE and GCC region, along with an optional two-level referral program that allows subscribers to earn commissions by referring new users.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>3. Subscription and Payment</h2>
      <p style={{ marginBottom:10 }}>The Platform operates on a monthly subscription model at the current rate of AED 95 per month. All payments are processed exclusively through MamoPay. By subscribing, you authorize recurring monthly charges to your payment method. You may cancel at any time; cancellation takes effect at the end of your current billing period.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px", color:"#f87171" }}>4. No Refund Policy</h2>
      <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10, padding:"16px 20px", marginBottom:20 }}>
        <p style={{ margin:0, fontWeight:600, color:"#f87171" }}>ALL SALES ARE FINAL. Tutorii operates a strict no-refund policy. Once a payment has been processed, it is non-refundable under any circumstances. This applies to all subscription payments, including the initial payment and all subsequent renewal charges. By subscribing, you acknowledge and accept this no-refund policy. You may cancel your subscription at any time to prevent future charges, but no refund will be issued for any payment already made.</p>
      </div>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>5. Referral Program</h2>
      <p style={{ marginBottom:10 }}>Subscribers may earn commissions through the referral program. Level 1 (direct referrals) earn 40% of the subscription fee. Level 2 (indirect referrals) earn 5%. Commissions are calculated monthly and paid weekly via MamoPay bank transfer to your registered IBAN, subject to a AED 50 minimum payout threshold.</p>
      <p style={{ marginBottom:20 }}>Referral assignments are permanent and irrevocable. Once a user is assigned to a referrer at account creation, this assignment cannot be changed, transferred, or reassigned under any circumstances. Self-referrals, fraudulent referrals, and manipulation of the referral system are strictly prohibited and will result in immediate account termination and forfeiture of all earnings.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>6. User Accounts</h2>
      <p style={{ marginBottom:20 }}>You are limited to one account per person. You are responsible for maintaining the confidentiality of your login credentials. Multiple accounts, shared accounts, and impersonation are prohibited. Tutorii reserves the right to suspend or terminate accounts that violate these terms.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>7. Course Content</h2>
      <p style={{ marginBottom:20 }}>All course materials, including videos and PDF documents, are the intellectual property of Tutorii. Content is provided for personal, non-commercial use only. You may not copy, distribute, reproduce, sell, or share any course materials. Unauthorized distribution may result in account termination and legal action.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>8. Earnings and Tax</h2>
      <p style={{ marginBottom:20 }}>Referral earnings are classified as income. You are solely responsible for reporting and paying any applicable taxes in your country of residence. Tutorii does not withhold taxes, provide tax advice, or issue tax documents. Pending earnings below the AED 50 minimum threshold are forfeited upon account cancellation.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>9. Limitation of Liability</h2>
      <p style={{ marginBottom:20 }}>Tutorii is provided "as is" without warranties of any kind. Tutorii shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to loss of earnings, data, or business opportunities. Our total liability shall not exceed the amount you paid in subscription fees during the three months preceding the claim.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>10. Termination</h2>
      <p style={{ marginBottom:20 }}>Tutorii reserves the right to suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any conduct deemed harmful to the Platform or its users. Upon termination for cause, all pending earnings are forfeited.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>11. Modifications</h2>
      <p style={{ marginBottom:20 }}>Tutorii reserves the right to modify these Terms at any time. Changes will be communicated via email and posted on the Platform. Continued use after notification constitutes acceptance of the modified terms.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>12. Governing Law</h2>
      <p style={{ marginBottom:20 }}>These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved through the courts of the UAE.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>13. Anti-Fraud & Self-Referral Policy</h2>
      <p style={{ marginBottom:10 }}>Users are strictly limited to one account per person. Creating multiple accounts for the purpose of self-referral, earning commissions on your own subscription, or artificially inflating referral numbers is prohibited. Tutorii employs automated detection systems including email verification, device fingerprinting, and payment method analysis to identify duplicate and fraudulent accounts.</p>
      <p style={{ marginBottom:20 }}>Violations will result in immediate termination of all associated accounts, forfeiture of all pending and future earnings, and potential legal action to recover commissions obtained through fraud.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>14. Email Verification & Account Security</h2>
      <p style={{ marginBottom:20 }}>You must provide a valid email address at registration and complete email verification to activate your account. Accounts with unverified emails may have limited functionality including disabled referral links and withheld payouts. You are responsible for maintaining access to your registered email for billing notifications, payout confirmations, and security alerts. Tutorii is not responsible for missed communications due to unverified or inaccessible email addresses.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>15. Consent & Electronic Agreement</h2>
      <p style={{ marginBottom:20 }}>By checking the Terms agreement checkbox during subscription and completing payment, you provide explicit, informed consent to all terms contained herein, including the no-refund policy. This electronic agreement constitutes a legally binding acceptance equivalent to a handwritten signature under UAE Electronic Transactions Law (Federal Law No. 1 of 2006). The date, time, and version of Terms accepted are recorded and stored for dispute resolution purposes.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>16. Regulatory Compliance</h2>
      <p style={{ marginBottom:20 }}>Tutorii operates as a subscription-based educational platform with an optional referral program. The referral program is limited to two levels and commissions are derived solely from subscription revenue for a genuine educational product. This structure is compliant with UAE Federal Law No. 18 of 1993 (Commercial Transactions Law) and does not constitute a multi-level marketing scheme, pyramid scheme, or chain referral program as defined under applicable regulations. Tutorii reserves the right to modify the referral program structure to maintain compliance with evolving regulations.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>17. Dispute Resolution</h2>
      <p style={{ marginBottom:20 }}>Any dispute arising from or relating to these Terms shall first be addressed through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to mediation in accordance with the rules of the Dubai International Arbitration Centre (DIAC). If mediation fails, the dispute shall be resolved through binding arbitration under DIAC rules. The language of arbitration shall be English, and the seat shall be Dubai, UAE.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>18. Contact</h2>
      <p>For questions about these Terms, contact us at <strong>support@tutorii.com</strong>.</p>
    </LegalPage>
  );
}

// ═════════════════════════════════════════
// PRIVACY POLICY
// ═════════════════════════════════════════
function PrivacyPage(props) {
  var go = props.go;
  return (
    <LegalPage go={go} title="Privacy Policy">
      <p style={{ fontSize:12, color:"#52525b", marginBottom:24 }}>Last updated: March 1, 2026</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>1. Information We Collect</h2>
      <p style={{ marginBottom:10 }}>We collect the following information when you use Tutorii:</p>
      <p style={{ marginBottom:10 }}><strong>Account Information:</strong> Full name, email address, phone number, and preferred language provided during registration.</p>
      <p style={{ marginBottom:10 }}><strong>Payment Information:</strong> All payment data is processed by MamoPay. Tutorii does not store, access, or have visibility into your card numbers, CVVs, or banking credentials. We store only your IBAN for the purpose of commission payouts.</p>
      <p style={{ marginBottom:10 }}><strong>Usage Data:</strong> Course progress, lesson completion status, login activity, and referral data.</p>
      <p style={{ marginBottom:20 }}><strong>Referral Data:</strong> Your referral code, referral link, the identity of users you have referred, and commission earnings.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom:10 }}>Your information is used to: provide and maintain the Platform and your account; process subscription payments via MamoPay; calculate and disburse referral commissions; track and display your course progress; communicate service updates, billing notifications, and support responses; prevent fraud and enforce our Terms of Service.</p>
      <p style={{ marginBottom:20 }}>We do not use your data for advertising. We do not sell or rent your personal information to third parties.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>3. Data Sharing</h2>
      <p style={{ marginBottom:10 }}>We share data only with: <strong>MamoPay</strong> for payment processing and commission disbursement; <strong>hosting providers</strong> for infrastructure; <strong>law enforcement</strong> when required by UAE law.</p>
      <p style={{ marginBottom:20 }}>Your referral network data (names of your referrals) is visible only to you in your dashboard. Referrals cannot see who referred them beyond what is displayed in their own account.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>4. Data Security</h2>
      <p style={{ marginBottom:20 }}>We implement industry-standard security measures including encrypted data transmission (TLS/SSL), secure server infrastructure, and access controls. Payment processing is handled entirely by MamoPay, a CBUAE-licensed payment provider with PCI DSS compliance.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>5. Data Retention</h2>
      <p style={{ marginBottom:20 }}>We retain your account data for as long as your account is active. Upon account deletion, personal data is permanently removed within 30 days, except where retention is required by law (e.g., financial records may be retained for up to 5 years per UAE regulations).</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>6. Your Rights</h2>
      <p style={{ marginBottom:20 }}>You have the right to: access your personal data at any time through your dashboard; request a complete export of your data by contacting support; request correction of inaccurate information; request deletion of your account and associated data; withdraw consent for non-essential data processing. To exercise these rights, email <strong>support@tutorii.com</strong>.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>7. Cookies and Tracking</h2>
      <p style={{ marginBottom:20 }}>Tutorii uses essential cookies required for authentication and session management. We do not use advertising cookies or third-party tracking pixels. No data is shared with advertising networks.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>8. Children</h2>
      <p style={{ marginBottom:20 }}>Tutorii is not intended for users under the age of 18. We do not knowingly collect data from minors. If we become aware of data collected from a minor, we will delete it promptly.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>9. Changes to This Policy</h2>
      <p style={{ marginBottom:20 }}>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. Continued use of the Platform after changes constitutes acceptance.</p>

      <h2 style={{ fontSize:18, fontWeight:700, color:"#d4d4d8", margin:"0 0 12px" }}>10. Contact</h2>
      <p>For privacy-related questions or requests, contact us at <strong>support@tutorii.com</strong>.</p>
    </LegalPage>
  );
}

// ═════════════════════════════════════════
// CONTACT US
// ═════════════════════════════════════════
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
    }).catch(function(){});
  }, []);
  var _chatOpen = useState(false); var chatOpen = _chatOpen[0]; var setChatOpen = _chatOpen[1];
  var _chatMinimized = useState(false); var chatMinimized = _chatMinimized[0]; var setChatMinimized = _chatMinimized[1];
  var { user: authUser } = useAuth();
  var firstName = authUser && authUser.full_name ? authUser.full_name.split(" ")[0] : "there";
  var _chatMsgs = useState([{role:"assistant",content:"Hi "+firstName+"! I'm your Tutorii support assistant. I have access to your account details, referrals, earnings, and course progress. How can I help you today?"}]);
  var chatMsgs = _chatMsgs[0]; var setChatMsgs = _chatMsgs[1];
  var _chatInput = useState(""); var chatInput = _chatInput[0]; var setChatInput = _chatInput[1];
  var _chatLoading = useState(false); var chatLoading = _chatLoading[0]; var setChatLoading = _chatLoading[1];

  return (
    <div style={{ fontFamily:"'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'); * { box-sizing:border-box; margin:0; } body { margin:0; font-family:'Plus Jakarta Sans',sans-serif; -webkit-font-smoothing:antialiased; background:#0a0a0c; } h1,h2,h3,h4 { font-family:'DM Sans',sans-serif; } button { font-family:'Plus Jakarta Sans',sans-serif; } input { font-family:'Plus Jakarta Sans',sans-serif; } textarea { font-family:'Plus Jakarta Sans',sans-serif; } ::selection { background:rgba(200,180,140,0.2); } @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } } @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } } @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } } @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } } @keyframes glowPulse { 0%,100% { box-shadow:0 4px 20px rgba(59,156,196,0.3); } 50% { box-shadow:0 4px 32px rgba(59,156,196,0.5); } } @keyframes driftOrb { 0% { transform:translate(-50%,-50%) scale(1); } 50% { transform:translate(-48%,-52%) scale(1.04); } 100% { transform:translate(-50%,-50%) scale(1); } } @keyframes driftOrb2 { 0% { transform:translate(-50%,-50%) scale(1.05); } 50% { transform:translate(-52%,-48%) scale(0.97); } 100% { transform:translate(-50%,-50%) scale(1.05); } } @keyframes floatUp { 0% { transform:translateY(0); opacity:0.04; } 50% { opacity:0.07; } 100% { transform:translateY(-40px); opacity:0.04; } } .fade-up { animation:fadeUp 0.7s ease-out both; } .fade-up-d1 { animation:fadeUp 0.7s ease-out 0.1s both; } .fade-up-d2 { animation:fadeUp 0.7s ease-out 0.2s both; } .fade-up-d3 { animation:fadeUp 0.7s ease-out 0.3s both; } .fade-up-d4 { animation:fadeUp 0.7s ease-out 0.4s both; } .fade-in { animation:fadeIn 0.6s ease-out both; } .scale-in { animation:scaleIn 0.5s ease-out both; } .cta-glow { animation:glowPulse 2.5s ease-in-out infinite; } @media(max-width:768px) { nav[style] { padding:12px 16px !important; } section { padding-left:16px !important; padding-right:16px !important; } }  @keyframes floatParticle { 0% { transform:translateY(0) translateX(0); opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { transform:translateY(-100vh) translateX(20px); opacity:0; } } @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } } @keyframes travelDot { 0% { top:0%; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { top:100%; opacity:0; } } @keyframes pulseGlow { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }"}</style>
      {page === "landing" && <><CursorGlow /><FloatingParticles /><Landing go={go} /></>}
      {page === "howItWorks" && <><CursorGlow /><FloatingParticles /><HowItWorksPage go={go} /></>}
      {page === "curriculum" && <><CursorGlow /><FloatingParticles /><CurriculumPage go={go} /></>}
      {page === "faq" && <><CursorGlow /><FloatingParticles /><FaqPage go={go} /></>}
      {page === "login" && <UserLogin go={go} />}
      {page === "forgotPassword" && <ForgotPasswordPage go={go} />}
      {page === "resetPassword" && <ResetPasswordPage go={go} />}
      {page === "subscribe" && <Subscribe go={go} refCode={refCode} />}
      {page === "userPortal" && <UserPortal go={go} courses={courses} setCourses={setCourses} chatOpen={chatOpen} setChatOpen={setChatOpen} chatMinimized={chatMinimized} setChatMinimized={setChatMinimized} chatMsgs={chatMsgs} setChatMsgs={setChatMsgs} chatInput={chatInput} setChatInput={setChatInput} chatLoading={chatLoading} setChatLoading={setChatLoading} />}
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
