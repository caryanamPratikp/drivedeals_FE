# 09 — Open Questions & Architectural Clarifications

## 1. Business Model & Platform Monetization
The frontend demonstrates lead delivery and dealer verification but leaves the exact financial monetization mechanics unspecified in the state machine (`src/store/index.ts`).

1. **Lead Monetization Mechanism**:
   - **Model A: Pay-per-Unlocked-Lead**: Dealerships maintain a prepaid digital wallet or are invoiced ₹1,500–₹3,000 per unlocked verified buyer lead upon explicit consent.
   - **Model B: SaaS Subscription**: Dealerships pay a monthly/annual recurring subscription fee (e.g., ₹25,000/month) for unlimited or tiered bidding access within their city.
   - **Model C: Transaction Success Fee**: Dealership pays a commission percentage (e.g., 0.5%–1.0% of vehicle value) upon vehicle delivery. *Note*: This creates heavy manual offline tracking and enforcement challenges.
   - *Recommendation*: **Model A (Pay-per-Lead)** with instant dispute refund credits represents the cleanest, lowest-friction model for automotive retail in India.

2. **Pre-Payment vs Invoicing**:
   - Should dealers be required to maintain a positive wallet balance before viewing consented leads? If a dealer's balance is zero when a buyer grants consent, does the lead stall in a pending state?

---

## 2. Regulatory & DPDP Act 2023 Compliance Questions

1. **Data Retention & Right to Erasure (Section 12 DPDP Act)**:
   - If a buyer requests complete account erasure ("Right to be Forgotten"), what happens to historical records where that buyer was delivered as a lead to a dealership?
   - *Legal/Technical Implication*: Tax and statutory audit regulations (e.g., GST Act, Income Tax Act) require transactional and lead records to be retained for up to 8 years.
   - *Recommendation*: Anonymize user profile data in `users`, but preserve cryptographic hash of transaction and consent in `consents` with PII scrubbed.

2. **Dealer Call Recording & Compliance Verification**:
   - In lead disputes where the dealer claims "Buyer Unresponsive" or "Invalid Phone", does MOTORCIRCLE integrate with a cloud telephony mask (e.g. Exotel / Knowlarity / Twilio) to automatically log call attempts and recordings, eliminating subjective manual evidence review?

---

## 3. Automotive Retail & Commercial Edge Cases

1. **Bharat (BH) Series Registration**:
   - In India, central government and eligible private sector employees (companies with offices in 4+ states) can opt for BH series registration, which has a 2-year recurring tax structure instead of 15-year upfront state RTO.
   - Should the dealer quotation builder permit a BH-series pricing toggle, or assume standard state registration?

2. **Cross-City / Outstation Group Participation**:
   - Can a buyer living in Mysuru join a Bengaluru group if they are willing to travel to Bengaluru for delivery?
   - Does RTO registration get computed for the buyer’s home city or the dealer’s showroom city?

3. **Multi-Variant / Color Availability & Stock Volatility**:
   - If a group forms around a popular variant (e.g. Creta Turbo DCT), but dealership inventory runs out during the bidding window, can the dealer quote with a longer delivery timeline (e.g. 12 weeks), or will that invalidate the quotation?

4. **Dealership Organization Hierarchy**:
   - In the mock data (`src/types/index.ts:1-12`), a dealer is represented by a single `User` and `Dealer` entity.
   - In production, dealerships have General Managers, Sales Managers, and multiple Sales Consultants.
   - Should the backend implement Dealership Team Management (Store Manager invites Sales Executives) in Phase 1 or defer to a later release?
