# MOTORCIRCLE — Group Car-Buying Platform (Frontend MVP)

> **“Buy smarter, together.”**

MOTORCIRCLE is a group car-buying platform for individual car buyers in India (initially piloted in Pune, Maharashtra). Individual buyers interested in the same exact car variant join demand groups. Verified authorized franchise dealerships compete by submitting structured, comparable quotations with group purchase incentives. Buyers evaluate offers independently, select a preferred dealer, and grant explicit consent before their contact information is shared.

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Execution
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Access local preview at http://localhost:3000

# Run automated tests
npm run test

# Typecheck TypeScript code
npm run typecheck

# Production build
npm run build
```

---

## 2. Demo Account Personas

A persistent **Demo Toolbar** at the top of the interface provides one-click switching between demo roles without losing state:

| Persona | Role | Display Name | Details |
|---|---|---|---|
| **Buyer** | Buyer | **Priya Sharma** | Individual car buyer in Pune looking for Tata Nexon Creative Plus |
| **Dealer 1** | Dealer | **Pune Auto Motors** | Verified authorized Tata & Hyundai dealer (Rajesh Shinde) |
| **Dealer 2** | Dealer | **Deccan Car Gallery** | Verified authorized Maruti Suzuki & Kia dealer (Sameer Patil) |
| **Admin** | Administrator | **MOTORCIRCLE Ops** | Platform governance, verification, and audit operations |

### Demo Sign-In Simulation
- Phone input: Any 10-digit Indian mobile number (e.g., `98230 12345`)
- Disclosed Test OTP: `123456`

### Reset Demo State
A **"Reset Demo"** button on the top toolbar restores all original seed cars, groups, competing quotes, consents, and audit logs at any time.

---

## 3. Core Business Rules & Calculations

### A. Itemized Price Calculation
All dealer quotations calculate on-road price dynamically using the platform formula. Dealers cannot manually enter an arbitrary total:

$$\text{onRoadPrice} = \text{exShowroom} + \text{RTO} + \text{Insurance} + \text{Accessories} + \text{Other} - \text{Discount}$$

#### Demonstration Test Case (₹11,62,000 On-Road):
- **Ex-Showroom Price**: ₹10,00,000
- **Registration / RTO (Pune)**: ₹1,00,000
- **Comprehensive Insurance**: ₹80,000
- **Accessories Package**: ₹12,000
- **Other Charges**: ₹0
- **MOTORCIRCLE Group Discount**: -₹30,000
- **Calculated On-Road Price**: **₹11,62,000**

### B. Immutable Quotation Versions
Published quotations represent formal business records and are never edited in place. When a dealer revises an offer:
- The previous published version is archived as `SUPERSEDED` while retaining its original itemized figures and timestamps.
- A new version record is generated (e.g., `Version 2`) referencing the parent version ID.
- Buyers can toggle between versions to audit how prices and inclusions changed over time.

### C. Explicit Consent & Lead Isolation
- **Unchecked by Default**: The authorization checkbox starts unchecked and requires explicit user action.
- **Specific Dealership Authorization**: Contact details are shared strictly with the single selected dealer.
- **Dealer Lead Scoping**: Dealers can only access and update leads explicitly assigned to their dealership. Dealer A cannot access Dealer B's customer leads.
- **Withdrawal**: Buyers can withdraw consent at any time, halting future platform processing.

---

## 4. Implemented Routes

### Public Routes
- `/`: High-converting landing page with Trust principles, How It Works, car discovery, active groups preview, and dealer CTA.
- `/how-it-works`: Step-by-step walkthrough of group demand, structured quotation comparison, and consent handoff.
- `/cars`: Searchable car catalogue with multi-variant filtering by fuel, transmission, and budget.
- `/cars/:carId`: Model specifications, exact variant selector, and matching active groups in Pune.
- `/groups`: Browse active demand groups with status filters.
- `/groups/:groupId`: Public group detail view.
- `/signin`: Simulated OTP verification screen (`123456`).
- `/privacy`: Privacy Policy detailing the explicit consent framework.
- `/terms`: Terms of Participation and platform disclosures.

### Buyer Workspace
- `/buyer/dashboard`: Welcome summary, active groups, received offers, and dealer follow-ups.
- `/buyer/cars`: Explore vehicle catalogue from the buyer view.
- `/buyer/groups`: Active joined groups & guided 5-step group creation flow.
- `/buyer/groups/:groupId`: 4 Interactive Tabs (Overview, Structured Buyer Signals with aggregate insights, Dealer Offers, and My Activity).
- `/buyer/offers`: Side-by-side comparison table (desktop) / stacked cards (mobile) with on-road price sorting.
- `/buyer/offers/:offerId`: Itemized quotation breakdown, immutable version history, and dealer selection.
- `/buyer/leads`: Active dealer leads tracker with milestone progress bar.
- `/buyer/leads/:leadId`: Individual lead status progression timeline.
- `/buyer/consents`: Active consent audit & one-click withdrawal.
- `/buyer/profile`: Buyer identity details and preferences.

### Dealer Workspace
- `/dealer/dashboard`: Quote requests, open leads, published quotes, and performance metrics.
- `/dealer/quote-requests`: Open buyer group quote requests.
- `/dealer/quote-requests/:requestId`: Detailed buyer demand with response options (Quotation Composer, Request Clarification, Confirm Availability).
- `/dealer/offers`: Dealership's published quotations and version history.
- `/dealer/offers/:offerId`: Offer inspection and "Revise Offer" action.
- `/dealer/leads`: Lead pipeline isolated to the logged-in dealership.
- `/dealer/leads/:leadId`: Lead management with permitted status transitions, private notes, and dispute filing.
- `/dealer/profile`: Dealership franchise credentials and showroom details.

### Admin Workspace
- `/admin/dashboard`: Real-time KPI metrics derived directly from state.
- `/admin/dealers`: Dealership verification queue (Approve / Reject / Suspend).
- `/admin/groups`: Group lifecycle management with quotation existence enforcement.
- `/admin/moderation`: Content moderation queue for buyer and dealer notes.
- `/admin/leads`: Leads overview and dispute resolution center.
- `/admin/audit`: Real-time audit event stream for all business operations.
- `/admin/catalogue`: Vehicle and variant catalogue editor (add/deactivate).

---

## 5. Technology Stack

- **React 18** with **TypeScript (Strict Mode)**
- **Vite** for fast bundling
- **React Router v6** with nested layouts
- **Tailwind CSS** with a dark graphite navy, warm neutral, and teal accent palette
- **Zustand** with `persist` middleware (`motorcircle_demo_state_v1` in localStorage)
- **Lucide React** icons
- **date-fns** for date calculations
- **Vitest & React Testing Library** for automated business logic testing

---

## 6. Spring Boot Backend Integration Roadmap

When connecting this React frontend to a Spring Boot production backend:
1. Replace `src/store/index.ts` mock action handlers with API client services (`fetch` / `axios`).
2. Map domain entities to Spring Boot JPA Entities (`Car`, `CarVariant`, `BuyerGroup`, `Quotation`, `QuotationVersion`, `Consent`, `Lead`, `AuditEvent`).
3. Enforce backend security via Spring Security & JWT tokens:
   - Dealer role authorizations (`@PreAuthorize("hasRole('DEALER') and #dealerId == authentication.principal.dealerId")`).
   - Immutable version inserts (preventing `UPDATE` queries on published quotation records).
   - Rate limiting and SMS OTP gateway integration (Twilio / Gupshup).
