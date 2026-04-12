import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { users as usersApi, subscriptions as subscriptionsApi, courses as coursesApi, chat as chatApi, payouts as payoutsApi } from "../api";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, Cell, Legend, Pie, PieChart } from "recharts";
import { useIsMobile, Ico, Badge, StatCard, FadeIn, Skeleton, DashSkeleton, ProgressRing, GlowRow, DashboardDesktop, DashboardMobile } from "../components/UI";
import { Btn, Logo } from "../components/Layout";
import { PRICE, L1_RATE, L2_RATE, MAMOPAY_LINK, INIT_COURSES, USER } from "../constants";
import SettingsTab from "../components/SettingsTab";

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
  var _showOnboard = useState(function(){ return !localStorage.getItem("tutorii_tour_done"); });
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
  var { user: authUser, logout, updateUser } = useAuth();
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
      if(results[0].status==="fulfilled") { setRealUser(results[0].value); updateUser(results[0].value); }
      if(results[1].status==="fulfilled") setReferralStats(results[1].value);
      if(results[2].status==="fulfilled") setMyCommissions(results[2].value || []);
      if(results[3].status==="fulfilled") setMyPayouts(results[3].value || []);
      if(results[4].status==="fulfilled") setMySub(results[4].value);
      if(results[5].status==="fulfilled" && results[5].value && results[5].value.length > 0) {
        setCourses(results[5].value.map(function(c){ return { id:c.id, module:c.title, icon:c.icon||"book", lessons: (c.lessons||[]).map(function(l){ return { id:l.id, title:l.title, dur:l.duration_minutes?(l.duration_minutes+" min"):"10 min", done:l.completed||false }; }) }; }));
      } else if(results[5].status==="rejected") {
        console.error("Failed to load courses:", results[5].reason && results[5].reason.message ? results[5].reason.message : results[5].reason);
      }
      if(results[6].status==="fulfilled") setReferralList(results[6].value);
      // If /users/me failed, user is not logged in — redirect to login
      if(results[0].status==="rejected") {
        go("login");
        return;
      }
      // Check subscription — only redirect if we got a valid response
      var sub = results[4].status==="fulfilled" ? results[4].value : null;
      if (results[4].status==="fulfilled" && (!sub || sub.status !== "active")) {
        go("subscribe");
        return;
      }
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
    status: mySub && mySub.status === "active" ? "active" : "inactive",
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
      "Phone: ***" + (u.phone||"").slice(-4) + "\n" +
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
      "Monthly Subscription Cost: -AED " + PRICE + "\n" +
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
      "Average Payout: $" + ((u.payouts||[]).length > 0 ? ((u.payouts||[]).reduce(function(s,p){return s+p.amount},0) / (u.payouts||[]).length).toFixed(2) : "0.00") + "\n\n" +

      "=== LEVEL 1 REFERRALS (Direct, 40% = AED " + (PRICE*L1_RATE).toFixed(2) + "/each/month) ===\n" +
      "Total L1: " + (u.l1||[]).length + " (" + l1active.length + " active, " + l1cancelled.length + " cancelled)\n" +
      (u.l1||[]).map(function(r,i){return (i+1) + ". " + r.name + " - Joined: " + r.date + " 2026, Status: " + r.status.toUpperCase() + ", Total earned you: AED " + r.earned.toFixed(2) + (r.status==="active" ? ", Currently earning AED "+(PRICE*L1_RATE).toFixed(2)+"/month" : ", No longer earning (cancelled)")}).join("\n") + "\n" +
      "Best performing L1: " + ((u.l1||[]).length > 0 ? (function(){var best=(u.l1||[]).reduce(function(a,b){return a.earned>b.earned?a:b});return best.name+" ($"+best.earned.toFixed(2)+" earned)"})() : "None") + "\n" +
      "Most recent L1: " + ((u.l1||[]).length > 0 ? u.l1[u.l1.length-1].name + " (joined " + u.l1[u.l1.length-1].date + ")" : "None") + "\n" +
      "L1 retention rate: " + ((u.l1||[]).length > 0 ? Math.round((l1active.length/(u.l1||[]).length)*100) : 0) + "% (" + l1active.length + " of " + (u.l1||[]).length + " still active)\n\n" +

      "=== LEVEL 2 REFERRALS (Indirect, 5% = AED " + (PRICE*L2_RATE).toFixed(2) + "/each/month) ===\n" +
      "Total L2: " + (u.l2||[]).length + "\n" +
      (u.l2||[]).map(function(r,i){return (i+1) + ". " + r.name + " - Referred by: " + r.from + ", Joined: " + r.date + " 2026, Earned you: $" + r.earned.toFixed(2)}).join("\n") + "\n" +
      "L2 breakdown by L1 referrer:\n" +
      (function(){var map={};(u.l2||[]).forEach(function(r){if(!map[r.from])map[r.from]=0;map[r.from]++});var keys=Object.keys(map);return keys.length>0?keys.map(function(k){return "- "+k+": "+map[k]+" L2 referral"+(map[k]>1?"s":"")}).join("\n"):"None"})() + "\n" +
      "Best L1 recruiter (most L2s): " + (function(){var map={};(u.l2||[]).forEach(function(r){if(!map[r.from])map[r.from]=0;map[r.from]++});var best="";var max=0;Object.keys(map).forEach(function(k){if(map[k]>max){max=map[k];best=k}});return best?best+" ("+max+" L2 referrals)":"None"})() + "\n\n" +

      "=== NETWORK SUMMARY ===\n" +
      "Total Network Size: " + ((u.l1||[]).length + (u.l2||[]).length) + " people (" + (u.l1||[]).length + " L1 + " + (u.l2||[]).length + " L2)\n" +
      "Active Network: " + (l1active.length + (u.l2||[]).length) + " people generating income\n" +
      "Total Earned from L1: $" + (u.l1||[]).reduce(function(s,r){return s+r.earned},0).toFixed(2) + "\n" +
      "Total Earned from L2: $" + (u.l2||[]).reduce(function(s,r){return s+r.earned},0).toFixed(2) + "\n" +
      "Average L1 has earned user: $" + ((u.l1||[]).length > 0 ? ((u.l1||[]).reduce(function(s,r){return s+r.earned},0)/(u.l1||[]).length).toFixed(2) : "0.00") + "\n" +
      "Average L2 has earned user: $" + ((u.l2||[]).length > 0 ? ((u.l2||[]).reduce(function(s,r){return s+r.earned},0)/(u.l2||[]).length).toFixed(2) : "0.00") + "\n\n" +

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
      "Q: How does the referral program work? A: Share your unique referral link. When someone subscribes through it, you earn 40% (AED " + (PRICE*L1_RATE).toFixed(2) + ") monthly as long as they stay subscribed (Level 1). You also earn 5% ($" + (PRICE*L2_RATE).toFixed(2) + ") on anyone they refer (Level 2).\n" +
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
          <button onClick={function(){ window.open("/ref/"+u.code, "_blank"); }} style={{ width:"100%", marginTop:8, padding:"8px 12px", borderRadius:8, border:"1px dashed rgba(200,180,140,0.25)", background:"transparent", color:"#71717a", fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Ico name="link" size={11} color="#71717a" /> Preview what your referral sees
          </button>
        </div>

        {tab === "overview" && <div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px", color:"#d4d4d8" }}>{"Welcome back, " + (u.name||"there").split(" ")[0]}</h2>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)", gap:mob?10:14, marginBottom:mob?16:24, alignItems:"stretch" }}>
            <StatCard icon="dollar" label="Total Earnings" value={"AED "+u.earn.total} />
            <StatCard icon="chart" label="This Month's Earnings" value={"AED "+u.earn.month} />
            <StatCard icon="users" label="My Referrals" value={(u.l1||[]).length} sub={activeL1+" active"} />
            <StatCard icon="book" label="Course Progress" value={pct+"%"} sub={doneL+"/"+totalL+" lessons"} color="#d97706" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:14, alignItems:"stretch" }}>
            <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Recent Referral Activity</h3>
              {(u.l1||[]).length === 0
                ? <div style={{ textAlign:"center", padding:"24px 0" }}><Ico name="link" size={28} color="#3f3f46" /><p style={{ fontSize:13, color:"#52525b", marginTop:10 }}>No referrals yet. Share your link to start earning.</p><span onClick={function(){gotoTab("referrals")}} style={{ fontSize:12, color:"rgb(200,180,140)", cursor:"pointer", fontWeight:600 }}>Get your referral link →</span></div>
                : (u.l1||[]).slice(0,4).map(function(r){ return (
                  <div key={r.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <div><div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{r.name}</div><div style={{ fontSize:11, color:"#52525b" }}>{r.date}</div></div>
                    <div style={{ textAlign:"right" }}><div style={{ fontSize:13, fontWeight:500, color:"#d4d4d8" }}>{"AED "+(r.earned||0).toFixed(2)}</div><Badge s={r.status} /></div>
                  </div>
                )})
              }
            </div>
            <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>Continue Where You Left Off</h3>
              {courses.filter(function(c){return c.lessons.some(function(l){return !l.done})}).length === 0
                ? <div style={{ textAlign:"center", padding:"24px 0" }}><Ico name="book" size={28} color="#3f3f46" /><p style={{ fontSize:13, color:"#52525b", marginTop:10 }}>{courses.length === 0 ? "Courses loading..." : "All lessons complete! Great work."}</p></div>
                : courses.filter(function(c){return c.lessons.some(function(l){return !l.done})}).slice(0,3).map(function(c){
                  var next = c.lessons.find(function(l){return !l.done});
                  return (
                    <div key={c.id} onClick={function(){gotoTab("courses");setOpenCourse(c.id);setActiveLesson(next)}} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
                      <span style={{ lineHeight:0 }}><Ico name={c.icon} size={20} color="rgb(200,180,140)" /></span>
                      <div><div style={{ fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{next ? next.title : ""}</div><div style={{ fontSize:11, color:"#52525b" }}>{c.module}</div></div>
                    </div>
                  );
                })
              }
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
                    <span style={{ padding:"2px 8px", borderRadius:5, background:parseFloat(u.earn.pending||0) >= 10 ? "rgba(200,180,140,0.08)" : "rgba(248,113,113,0.08)", border:"1px solid "+(parseFloat(u.earn.pending||0) >= 10 ? "rgba(200,180,140,0.12)" : "rgba(248,113,113,0.12)"), color: parseFloat(u.earn.pending||0) >= 10 ? "rgb(200,180,140)" : "#f87171", fontWeight:600 }}>{"AED "+parseFloat(u.earn.pending||0).toFixed(2)}{parseFloat(u.earn.pending||0) >= 10 ? " \u2713" : " (min AED 50)"}</span>
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
                        <span style={{ fontSize:10, color:"#71717a", padding:"2px 8px", borderRadius:5, background:"rgba(200,180,140,0.06)", border:"1px solid rgba(200,180,140,0.1)" }}>{"Earned AED "+monthlyGross.toFixed(2)}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:"rgba(248,113,113,0.4)" }} />
                        <span style={{ fontSize:10, color:"#71717a", padding:"2px 8px", borderRadius:5, background:"rgba(248,113,113,0.05)", border:"1px solid rgba(248,113,113,0.1)" }}>{"Subscription -AED "+PRICE}</span>
                      </div>
                      <div style={{ display:"inline-block", fontSize:13, fontWeight:600, color:monthlyNet>=0?"rgb(200,180,140)":"#f87171", padding:"4px 12px", borderRadius:8, background:monthlyNet>=0?"rgba(200,180,140,0.08)":"rgba(248,113,113,0.08)", border:"1px solid "+(monthlyNet>=0?"rgba(200,180,140,0.15)":"rgba(248,113,113,0.15)"), marginTop:4 }}>{"Net Profit AED "+monthlyNet.toFixed(2)}</div>
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
            <StatCard icon="dollar" label="Total Network Revenue" value={"AED "+((u.l1||[]).reduce(function(s,r){return s+r.earned},0)+(u.l2||[]).reduce(function(s,r){return s+r.earned},0)).toFixed(2)} />
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
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>{"Level 1 - Direct (40% = AED "+(PRICE*L1_RATE).toFixed(2)+" each)"}</h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Name","Joined","Status","Earned"].map(function(h){return <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#52525b", textAlign:"left", borderBottom:"2px solid rgba(255,255,255,0.08)" }}>{h}</th>})}</tr></thead>
              <tbody>{(u.l1||[]).map(function(r){return <tr key={r.name} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}><td style={{ padding:"10px", fontSize:13, fontWeight:600, color:"#d4d4d8" }}>{r.name}</td><td style={{ padding:"10px", fontSize:12, color:"#52525b" }}>{r.date}</td><td style={{ padding:"10px" }}><Badge s={r.status}/></td><td style={{ padding:"10px", fontSize:13, fontWeight:500, color:"#d4d4d8" }}>{"AED "+r.earned.toFixed(2)}</td></tr>})}</tbody>
            </table>
          </div>
          <div style={{ background:"#131315", borderRadius:14, padding:mob?14:22, border:"1px solid rgba(255,255,255,0.06)", boxSizing:"border-box" }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 14px", color:"#d4d4d8" }}>{"Level 2 - Indirect (5% = AED "+(PRICE*L2_RATE).toFixed(2)+" each)"}</h3>
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
                <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(200,180,140,0.2)",borderRadius:8,fontSize:12,color:"#d4d4d8"}} labelStyle={{color:"#a1a1aa",marginBottom:4}} itemStyle={{color:"#d4d4d8"}} formatter={function(v){return "AED "+v.toFixed(2)}} />
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
                  <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(200,180,140,0.2)",borderRadius:8,fontSize:12,color:"#d4d4d8"}} labelStyle={{color:"#a1a1aa",marginBottom:4}} itemStyle={{color:"#d4d4d8"}} formatter={function(v){return "AED "+v.toFixed(2)}} />
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
                        <span style={{ fontSize:11, fontWeight:600, color:"#f87171" }}>{"-AED "+(PRICE*12).toFixed(2)}</span>
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
                  <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(200,180,140,0.2)",borderRadius:8,fontSize:12,color:"#d4d4d8"}} labelStyle={{color:"#a1a1aa",marginBottom:4}} itemStyle={{color:"#d4d4d8"}} formatter={function(v){return ["AED "+v.toFixed(2),"Amount"]}} />
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
                  <Tooltip contentStyle={{background:"#131315",border:"1px solid rgba(200,180,140,0.2)",borderRadius:8,fontSize:12,color:"#d4d4d8"}} labelStyle={{color:"#a1a1aa",marginBottom:4}} itemStyle={{color:"#d4d4d8"}} formatter={function(v){return "AED "+v.toFixed(2)}} />
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
                      { sender: "Support Team", role: "admin", content: "Hi " + (u.name||"there").split(" ")[0] + ", thanks for reaching out. We're looking into this for you and will update you shortly.", time: viewTicket.created + ", 2:30 PM" },
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
                      <input value={ticketReply} onChange={function(e){setTicketReply(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter"&&ticketReply.trim()){setTicketMsgs(function(prev){var base=prev.length>0?prev:[{sender:u.name,role:"user",content:"Hi, I need help with: "+viewTicket.subject,time:viewTicket.created+", 10:15 AM"},{sender:"Support Team",role:"admin",content:"Hi "+(u.name||"there").split(" ")[0]+", thanks for reaching out. We're looking into this.",time:viewTicket.created+", 2:30 PM"}];return base.concat([{sender:u.name,role:"user",content:ticketReply,time:"Just now"}])});setTicketReply("")}}} placeholder="Type your reply..." style={{ flex:1, padding:"11px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"#0a0a0c", color:"#d4d4d8", fontSize:13, outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
                      <button onClick={function(){if(!ticketReply.trim())return;setTicketMsgs(function(prev){var base=prev.length>0?prev:[{sender:u.name,role:"user",content:"Hi, I need help with: "+viewTicket.subject,time:viewTicket.created+", 10:15 AM"},{sender:"Support Team",role:"admin",content:"Hi "+(u.name||"there").split(" ")[0]+", thanks for reaching out.",time:viewTicket.created+", 2:30 PM"}];return base.concat([{sender:u.name,role:"user",content:ticketReply,time:"Just now"}])});setTicketReply("")}} style={{ padding:"11px 20px", borderRadius:10, border:"none", background:"rgb(200,180,140)", color:"#0a0a0c", fontSize:13, fontWeight:600, cursor:"pointer" }}>Send</button>
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
      {showOnboard && !dashLoading && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#131315", borderRadius:20, padding:"36px 40px", maxWidth:480, width:"90%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            {onboard === 0 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="sparkle" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:500, color:"#d4d4d8", margin:"0 0 8px" }}>{"Welcome to Tutorii, "+(u.name||"there").split(" ")[0]+"!"}</h2>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:24 }}>{"Let's take a quick tour of your dashboard so you can start learning and earning right away."}</p>
            </div>}
            {onboard === 1 && <div>
              <div style={{ marginBottom:16, lineHeight:0 }}><Ico name="link" size={48} color="rgb(200,180,140)" /></div>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#d4d4d8", margin:"0 0 8px" }}>Your Referral Link</h2>
              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:14, marginBottom:12, border:"1px solid rgba(255,255,255,0.06)" }}>
                <code style={{ fontSize:14, fontWeight:700, color:"rgb(200,180,140)" }}>{"tutorii.com/ref/"+u.code}</code>
              </div>
              <p style={{ fontSize:14, color:"#71717a", lineHeight:1.7, marginBottom:16 }}>{"Share this link with friends and contacts. When they subscribe, you earn 40% (AED "+(PRICE*L1_RATE).toFixed(2)+") every month. Use the WhatsApp, SMS, and Email buttons at the top of your dashboard to share instantly."}</p>
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
                <Btn onClick={function(){localStorage.setItem("tutorii_tour_done","1");setShowOnboard(false)}} style={{ padding:"11px 28px", fontSize:13, background:"rgb(200,180,140)", color:"#0a0a0c" }}>{"Get Started"}</Btn>
              )}
            </div>
            {onboard < 4 && <div style={{ marginTop:12 }}><span onClick={function(){localStorage.setItem("tutorii_tour_done","1");setShowOnboard(false)}} style={{ fontSize:12, color:"#52525b", cursor:"pointer" }}>Skip tour</span></div>}
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

export default UserPortal;
