import { SiteNav, SiteFooter } from "../../components/Layout";
import LegalPage from "./LegalPage";

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

export default PrivacyPage;
