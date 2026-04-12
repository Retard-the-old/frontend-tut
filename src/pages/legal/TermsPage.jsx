import { SiteNav, SiteFooter } from "../../components/Layout";

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

export default TermsPage;
