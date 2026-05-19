import { useEffect, useMemo, useState } from "react";
import { getRefreshToken, refreshAccessToken, subscriptions } from "../api";
import { useAuth } from "../AuthContext";

const PRICE_LABEL = "AED 95.00";
const MAX_ATTEMPTS = 6;
const RETRY_DELAY_MS = 3000;

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeConfirmedState(params, user, data) {
  const fullName = params.get("name") || (user && user.full_name) || "";
  const firstName = fullName ? fullName.split(" ")[0] : "";
  return {
    status: "confirmed",
    eyebrow: "Subscription confirmed",
    title: "Your Tutorii plan is now active",
    copy: firstName
      ? "Welcome, " + firstName + "! Your account is live and your courses are waiting."
      : "Your account is live and your courses are waiting.",
    badge: "Payment confirmed",
    order: params.get("order") || (data && data.order_number) || "",
    amount: params.get("amount") || PRICE_LABEL,
    date: params.get("date") || todayLabel(),
    primaryLabel: "Go to your dashboard",
    primaryTarget: "userPortal",
  };
}

function checkingState(message) {
  return {
    status: "checking",
    eyebrow: "Payment check in progress",
    title: "We are confirming your Tutorii payment",
    copy: message || "Hold on while we check your payment status.",
    badge: "Checking payment",
    order: "",
    amount: PRICE_LABEL,
    date: "",
    primaryLabel: "Open Tutorii dashboard",
    primaryTarget: "userPortal",
  };
}

function pendingState(message) {
  return {
    status: "pending",
    eyebrow: "Payment pending",
    title: "Your Tutorii payment is still processing",
    copy: message || "Your payment has not been confirmed yet. Please return to Tutorii and check again in a moment.",
    badge: "Awaiting payment confirmation",
    order: "",
    amount: PRICE_LABEL,
    date: "",
    primaryLabel: "Return to Tutorii",
    primaryTarget: "userPortal",
  };
}

function failedState() {
  return {
    status: "failed",
    eyebrow: "Payment failed",
    title: "Your Tutorii payment was not completed",
    copy: "MamoPay reported that this payment failed. Please return to Tutorii and try checkout again.",
    badge: "Payment failed",
    order: "",
    amount: PRICE_LABEL,
    date: "",
    primaryLabel: "Try checkout again",
    primaryTarget: "subscribe",
  };
}

function loginRequiredState() {
  return {
    status: "login",
    eyebrow: "Login required",
    title: "Log in to check your payment",
    copy: "We could not find a saved Tutorii session in this browser. Log in, then check your payment status from the subscription screen.",
    badge: "Not verified",
    order: "",
    amount: PRICE_LABEL,
    date: "",
    primaryLabel: "Log in to Tutorii",
    primaryTarget: "login",
  };
}

export default function ConfirmationPage({ go }) {
  const { user, loading: authLoading } = useAuth();
  const params = useMemo(function () {
    return new URLSearchParams(window.location.search);
  }, []);
  const [view, setView] = useState(function () {
    if (params.get("order")) return makeConfirmedState(params, null, null);
    if ((params.get("status") || "").toLowerCase() === "failed") return failedState();
    return checkingState();
  });

  useEffect(function () {
    if (params.get("order")) {
      setView(makeConfirmedState(params, user, null));
      return;
    }
    if ((params.get("status") || "").toLowerCase() === "failed") {
      setView(failedState());
      return;
    }
    if (authLoading) {
      setView(checkingState("Restoring your Tutorii session..."));
      return;
    }
    if (!getRefreshToken()) {
      setView(loginRequiredState());
      return;
    }

    let cancelled = false;
    let timer = null;

    async function verify(attempt) {
      setView(checkingState(attempt > 0 ? "Payment not confirmed yet. Checking again in a moment..." : "Verifying your payment with Tutorii..."));
      try {
        await refreshAccessToken();
        const data = await subscriptions.verifyPayment();
        if (cancelled) return;
        if (data && data.activated) {
          setView(makeConfirmedState(params, user, data));
          return;
        }
        if (attempt < MAX_ATTEMPTS - 1) {
          timer = window.setTimeout(function () { verify(attempt + 1); }, RETRY_DELAY_MS);
          return;
        }
        setView(pendingState((data && data.message) || ""));
      } catch (err) {
        if (cancelled) return;
        if ((err && err.message) === "Session expired" || (err && err.message) === "No refresh token") {
          setView(loginRequiredState());
          return;
        }
        if (attempt < MAX_ATTEMPTS - 1) {
          timer = window.setTimeout(function () { verify(attempt + 1); }, RETRY_DELAY_MS);
          return;
        }
        setView(pendingState("We could not reach Tutorii payment verification. Please return to Tutorii and check again in a moment."));
      }
    }

    verify(0);
    return function () {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [authLoading, params, user]);

  function handlePrimary() {
    go(view.primaryTarget);
  }

  const isConfirmed = view.status === "confirmed";
  const isChecking = view.status === "checking";
  const isBadState = view.status === "failed" || view.status === "login";

  return (
    <main style={styles.page}>
      <style>{CONFIRMATION_CSS}</style>
      <section style={styles.shell}>
        <a style={styles.brand} href="/" onClick={function (e) { e.preventDefault(); go("landing"); }}>
          <span style={styles.brandMark}>T</span>
          <span>Tutorii</span>
        </a>

        <div className="confirmation-grid" style={styles.grid}>
          <div style={styles.hero}>
            <div style={styles.eyebrow}>{view.eyebrow}</div>
            <h1 style={styles.title}>{view.title}</h1>
            <p style={styles.copy}>{view.copy}</p>
            <div className="confirmation-actions" style={styles.actions}>
              <button type="button" style={styles.primaryButton} onClick={handlePrimary}>
                {view.primaryLabel}
              </button>
              <a style={styles.secondaryButton} href="mailto:support@tutorii.com">
                Contact support
              </a>
            </div>
          </div>

          <article style={styles.summary}>
            <div style={styles.badgeRow}>
              <span style={{
                ...styles.badge,
                ...(isConfirmed ? styles.badgeSuccess : {}),
                ...(isBadState ? styles.badgeWarning : {}),
              }}>
                {isChecking ? "Checking" : view.badge}
              </span>
              {isChecking && <span style={styles.spinner} aria-hidden="true" />}
            </div>

            <div style={styles.details}>
              <div style={styles.detailBox}>
                <span style={styles.label}>Package</span>
                <strong style={styles.value}>Tutorii Monthly</strong>
              </div>
              <div style={styles.detailBox}>
                <span style={styles.label}>Billing status</span>
                <strong style={styles.value}>{view.badge}</strong>
              </div>
              <div style={styles.detailBox}>
                <span style={styles.label}>Order no.</span>
                <strong style={styles.value}>{view.order ? "#" + view.order : "-"}</strong>
              </div>
              <div style={styles.detailBox}>
                <span style={styles.label}>Date</span>
                <strong style={styles.value}>{view.date || "-"}</strong>
              </div>
            </div>

            <div style={styles.totalRow}>
              <span>Total charged</span>
              <strong>{view.amount}</strong>
            </div>
          </article>
        </div>

        <section className="confirmation-next" style={styles.nextPanel}>
          <div style={styles.nextItem}>
            <strong>{isConfirmed ? "Access your courses" : "Access unlocks after confirmation"}</strong>
            <span>{isConfirmed ? "Head to your dashboard and start learning." : "Tutorii will unlock courses once payment is confirmed."}</span>
          </div>
          <div style={styles.nextItem}>
            <strong>{isConfirmed ? "Referral link active" : "Referral tools pending"}</strong>
            <span>{isConfirmed ? "Your referral dashboard is ready." : "Referral tools become available after activation."}</span>
          </div>
          <div style={styles.nextItem}>
            <strong>Need help?</strong>
            <span>Contact support with your MamoPay receipt if anything looks wrong.</span>
          </div>
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0c",
    color: "#f7f4ec",
    padding: "28px",
  },
  shell: {
    maxWidth: 1120,
    margin: "0 auto",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: "#f7f4ec",
    textDecoration: "none",
    fontWeight: 800,
    marginBottom: 58,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    color: "#0a0a0c",
    background: "rgb(200,180,140)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
    gap: 28,
    alignItems: "center",
  },
  hero: {
    minWidth: 0,
  },
  eyebrow: {
    color: "rgb(200,180,140)",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: "clamp(40px, 7vw, 76px)",
    lineHeight: 0.96,
    letterSpacing: 0,
    marginBottom: 22,
  },
  copy: {
    maxWidth: 640,
    color: "#c7c2b8",
    fontSize: 18,
    lineHeight: 1.7,
    marginBottom: 28,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    border: 0,
    borderRadius: 8,
    background: "rgb(200,180,140)",
    color: "#0a0a0c",
    fontWeight: 800,
    padding: "14px 20px",
    cursor: "pointer",
  },
  secondaryButton: {
    borderRadius: 8,
    border: "1px solid rgba(247,244,236,0.18)",
    color: "#f7f4ec",
    textDecoration: "none",
    fontWeight: 800,
    padding: "14px 20px",
  },
  summary: {
    borderRadius: 8,
    border: "1px solid rgba(247,244,236,0.12)",
    background: "#121214",
    padding: 24,
    boxShadow: "0 22px 70px rgba(0,0,0,0.36)",
  },
  badgeRow: {
    minHeight: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 30,
    padding: "6px 10px",
    borderRadius: 8,
    background: "rgba(200,180,140,0.12)",
    color: "rgb(200,180,140)",
    fontSize: 12,
    fontWeight: 800,
  },
  badgeSuccess: {
    background: "rgba(74,222,128,0.12)",
    color: "#86efac",
  },
  badgeWarning: {
    background: "rgba(248,113,113,0.12)",
    color: "#fca5a5",
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid rgba(200,180,140,0.24)",
    borderTopColor: "rgb(200,180,140)",
    animation: "spin 0.8s linear infinite",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  detailBox: {
    minHeight: 88,
    borderRadius: 8,
    border: "1px solid rgba(247,244,236,0.1)",
    background: "#171719",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  label: {
    color: "#8d887f",
    fontSize: 12,
    fontWeight: 700,
  },
  value: {
    color: "#f7f4ec",
    fontSize: 15,
    overflowWrap: "anywhere",
  },
  totalRow: {
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid rgba(247,244,236,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    fontSize: 16,
  },
  nextPanel: {
    marginTop: 42,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },
  nextItem: {
    minHeight: 116,
    borderRadius: 8,
    border: "1px solid rgba(247,244,236,0.1)",
    padding: 18,
    background: "#111113",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    color: "#b9b3a8",
    lineHeight: 1.5,
  },
};

const CONFIRMATION_CSS = `
@media (max-width: 760px) {
  .confirmation-grid {
    grid-template-columns: 1fr !important;
  }
  .confirmation-next {
    grid-template-columns: 1fr !important;
  }
  .confirmation-actions {
    flex-direction: column !important;
  }
  .confirmation-actions > * {
    width: 100% !important;
    text-align: center !important;
  }
}
`;
