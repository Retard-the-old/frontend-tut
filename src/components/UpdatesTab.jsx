import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api";

function formatDate(rfc2822) {
  if (!rfc2822) return "";
  try {
    return new Date(rfc2822).toLocaleDateString("en-AE", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return rfc2822.split(" ").slice(1, 4).join(" ");
  }
}

function ArticleCard({ article, featured, mob }) {
  var gold = "rgb(200,180,140)";
  if (featured) {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: mob ? "flex" : "grid",
          flexDirection: mob ? "column" : undefined,
          gridTemplateColumns: mob ? undefined : "1fr 2fr",
          background: "#201f1f",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
          textDecoration: "none",
          transition: "border-color 0.2s, transform 0.2s",
          gridColumn: "1 / -1",
        }}
        onMouseEnter={function(e){ e.currentTarget.style.borderColor = "rgba(200,180,140,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={function(e){ e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ background: "linear-gradient(135deg, rgba(200,180,140,0.15) 0%, rgba(200,180,140,0.04) 100%)", minHeight: mob ? 140 : 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16H9V8h2v10zm4 0h-2V8h2v10z" fill="rgba(200,180,140,0.3)"/>
          </svg>
        </div>
        <div style={{ padding: mob ? "20px 20px" : "28px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ padding: "3px 8px", background: "rgba(200,180,140,0.12)", color: gold, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 4 }}>Latest</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#71717a", letterSpacing: "0.05em", textTransform: "uppercase" }}>{formatDate(article.pub_date)}</span>
            </div>
            <h3 style={{ fontSize: mob ? 16 : 20, fontWeight: 700, color: "#e5e2e1", margin: "0 0 10px", lineHeight: 1.4 }}>{article.title}</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7, margin: 0 }}>{article.description}</p>
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: gold, fontSize: 13, fontWeight: 700 }}>
            Read full article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#201f1f",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "20px 22px",
        textDecoration: "none",
        transition: "background 0.2s, border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={function(e){ e.currentTarget.style.background = "#2a2a2a"; e.currentTarget.style.borderColor = "rgba(200,180,140,0.2)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={function(e){ e.currentTarget.style.background = "#201f1f"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, color: "#71717a", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, display: "block" }}>{formatDate(article.pub_date)}</span>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#e5e2e1", margin: "0 0 8px", lineHeight: 1.45, flex: 1 }}>{article.title}</h4>
      <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.65, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.description}</p>
      <span style={{ fontSize: 12, fontWeight: 700, color: gold, display: "inline-flex", alignItems: "center", gap: 4 }}>
        Read more
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </span>
    </a>
  );
}

export default function UpdatesTab({ mob }) {
  var _data = useState(null); var data = _data[0]; var setData = _data[1];
  var _loading = useState(true); var loading = _loading[0]; var setLoading = _loading[1];
  var _error = useState(""); var error = _error[0]; var setError = _error[1];

  useEffect(function() {
    setLoading(true);
    fetch(API_BASE_URL + "/news/feed")
      .then(function(r) { return r.json(); })
      .then(function(d) { setData(d); setLoading(false); })
      .catch(function() { setError("Could not load news feed."); setLoading(false); });
  }, []);

  var articles = (data && data.articles) || [];
  var featured = articles[0] || null;
  var rest = articles.slice(1);

  return (
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
      <div style={{ marginBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontSize: mob ? 20 : 24, fontWeight: 700, margin: "0 0 6px", color: "#e5e2e1" }}>Updates &amp; News</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Stay informed about UAE visa laws, labour regulations, and platform updates.</p>
      </div>

      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {[0,1,2,3].map(function(i){ return (
            <div key={i} style={{ background: "#201f1f", borderRadius: 12, padding: 22, border: "1px solid rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }}>
              <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 4, width: "30%", marginBottom: 12 }} />
              <div style={{ height: 16, background: "rgba(255,255,255,0.07)", borderRadius: 4, width: "80%", marginBottom: 8 }} />
              <div style={{ height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "60%" }} />
            </div>
          ); })}
        </div>
      )}

      {!loading && error && (
        <div style={{ padding: "20px 24px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 12, color: "#f87171", fontSize: 14 }}>
          {error} Check back shortly — feeds may be temporarily unavailable.
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div style={{ padding: "40px 24px", textAlign: "center", color: "#52525b", fontSize: 14 }}>
          No articles available right now. Check back soon.
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: mob ? 12 : 16 }}>
          {featured && <ArticleCard article={featured} featured mob={mob} />}
          {rest.map(function(a, i){ return <ArticleCard key={i} article={a} mob={mob} />; })}
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#52525b", letterSpacing: "0.05em", textTransform: "uppercase" }}>Showing {articles.length} articles</span>
          <span style={{ fontSize: 11, color: "#52525b" }}>Sourced from Google News · UAE Edition</span>
        </div>
      )}
    </div>
  );
}
