# Accountable Platform - Implementation Plan

## Executive Summary

This document provides a detailed implementation plan for completing the Accountable tax platform prototype. After auditing the current `index.html` against the target information architecture, I've identified gaps, inconsistencies, and specific changes needed for each page.

---

## Current State Audit

### Existing Pages

| Page | ID | Status | Notes |
|------|-----|--------|-------|
| File | `page-file` | Complete | Celebration/completion state with timeline, confetti animation |
| Tax History | `page-record` | Needs Refactoring | Currently titled "Your Taxes" - contains benefits that should move to Money You're Owed |
| Where It Goes | `page-taxes` | Partial | Federal spending only - missing state and city breakdowns |
| Your Voice | `page-voice` | Complete | Policy impact, representatives, voting records, actions |

### Missing Components

| Component | Priority | Impact |
|-----------|----------|--------|
| **Money You're Owed page** | P0 - Critical | Core pillar of value proposition - "Nothing Left on the Table" |
| **State spending breakdown** | P1 - High | Completes "Where It Goes" experience |
| **City spending breakdown** | P1 - High | Completes "Where It Goes" experience |
| **Cross-page navigation links** | P2 - Medium | Improves user journey flow |
| **Mobile responsiveness audit** | P2 - Medium | Essential for target users |

---

## Detailed Page Analysis & Recommendations

### 1. File Page (`page-file`) - Status: Complete

**Current Implementation:**
- Animated checkmark with celebration state
- Filing summary card showing Federal refund (+$2,847) and State refund (+$412)
- Timeline: Submitted → IRS Accepted → Refund Processing
- CTAs: "See Where It Goes" and "View Tax History"
- Confetti animation on page load

**Recommendation:** No changes needed. Well-implemented celebration state.

**Potential Enhancement (Phase 2):**
- Add link to "Money You're Owed" to encourage benefit discovery
- Show "You may be missing $3,200/year" teaser

---

### 2. Tax History Page (`page-record`) - Status: Needs Refactoring

**Current Title:** "Your Taxes"
**Target Title:** "Tax History" (per IA spec)

**Current Content:**
1. Lifetime Summary (Total taxes paid: $127,842, Benefits claimed: $18,340, Net contribution: $109,502)
2. This Year section with year selector (2019-2024)
3. What You Paid breakdown (Federal/State/City)
4. **Benefits We Found for You section** ← This should move to "Money You're Owed"

**Issues Identified:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Wrong focus | High | Page mixes "receipt" concept with benefits discovery |
| Benefits section | High | Should be in dedicated "Money You're Owed" page |
| Section title | Medium | "Benefits We Found for You" implies discovery, not history |
| Link to Where It Goes | Low | Only links to federal spending |

**Recommended Changes:**

```
REMOVE from page-record:
- Entire "Benefits We Found for You" section (lines 2552-2612)
- The "highlight" card about unclaimed benefits

KEEP:
- Lifetime Summary (taxes paid, net contribution)
- This Year section with breakdown
- Year selector functionality

ADD:
- Rename page title to "Tax History"
- Add "Filing History" section showing past filings with dates/confirmation numbers
- Add prominent link to "Money You're Owed" ("See benefits you've claimed and may be missing →")
- Update "Benefits & credits claimed" in summary to link to Money You're Owed page
```

**Updated Page Structure:**
```
Tax History
├── Lifetime Summary
│   ├── Total taxes paid ($127,842)
│   ├── Net contribution ($109,502)
│   └── Link: "See your benefits & credits →" (to Money You're Owed)
├── Year-by-Year View
│   ├── Year selector (2019-2024)
│   └── What You Paid breakdown (Federal/State/City bars)
├── Filing History (NEW)
│   ├── 2024: Filed Jan 18, 2025 - Accepted - #ACT-2024-847291
│   ├── 2023: Filed Apr 10, 2024 - Accepted - #ACT-2023-651842
│   └── etc.
└── Navigation Card: "Money You're Owed" teaser
```

---

### 3. Money You're Owed Page (`page-owed`) - Status: NOT IMPLEMENTED

**This is the critical missing piece.** Per the spec, this page embodies "Nothing Left on the Table" pillar.

**Target Structure:**

```
Money You're Owed (2024)
├── Summary Cards (Side-by-side)
│   ├── What You Claimed: $6,759
│   │   └── Badge: "Confirmed"
│   └── Money You May Be Missing: ~$3,200/yr
│       └── Badge: "Estimate"
│
├── What You Claimed (Expandable Rows)
│   ├── Tax Credits: $3,500
│   │   ├── Child Tax Credit: $2,000
│   │   ├── Earned Income Tax Credit: $1,200
│   │   ├── Empire State Child Credit: $200
│   │   └── NYC School Tax Credit: $100
│   │
│   └── Refunds: $3,259
│       ├── Federal Refund: $2,847
│       └── NY State Refund: $412
│
├── Benefits You May Be Missing
│   ├── Callout Card: "You could be leaving ~$3,200/year on the table"
│   │
│   ├── Federal Benefits
│   │   ├── Saver's Credit (est. $400/yr)
│   │   │   └── Eligibility: High confidence
│   │   └── Dependent Care FSA (est. $1,200/yr)
│   │       └── Eligibility: Medium confidence
│   │
│   ├── NY State Benefits
│   │   ├── NY 529 Deduction (est. $500/yr)
│   │   │   └── Eligibility: High confidence
│   │   └── Property Tax Credit (est. $350/yr)
│   │       └── Eligibility: Medium confidence
│   │
│   └── NYC Benefits
│       └── IDNYC Benefits Package (est. $750/yr)
│           └── Eligibility: High confidence
│
└── Phase 3: Enrollment Assistant (Future)
    ├── Eligibility Quiz
    ├── Document Checklist
    ├── Direct Application Links
    └── Deadline Reminders
```

**Design Specifications:**

- Summary cards: Use existing `.summary-grid` pattern but with 2 columns
- Claimed card: Green confirmed badge, serif numbers
- Missing card: Gold estimate badge with "~" prefix
- Expandable rows: Use existing `.policy-card` expand pattern
- Benefit cards: White background, jurisdiction color-coded left border
- Eligibility dots: Green (high), Gold (medium), Gray (low)
- CTA buttons: "Check Eligibility" → external links or future enrollment flow

**Tone Guidance:**
- Claimed section: Satisfaction, validation ("You maximized these benefits")
- Missing section: Motivation without anxiety ("Here's what you may qualify for")
- Avoid: Alarmist language, pressure tactics
- Use: "May qualify", "Could be eligible", "Worth exploring"

---

### 4. Where It Goes Page (`page-taxes`) - Status: Partial

**Current Implementation:**
- Federal spending breakdown only
- 9 categories with drill-down to agencies and programs
- Interactive allocation bar
- Year selector (2019-2024)
- Trend visualization per category

**Missing:**
- State spending breakdown (NY State)
- City spending breakdown (NYC)

**Recommended Structure:**

```
Where Your Taxes Go
├── Jurisdiction Tabs: Federal | NY State | NYC
│
├── [EXISTING] Federal Tab (default)
│   ├── Context card explaining federal-only focus
│   ├── Summary: $24,180 total
│   ├── Allocation bar visualization
│   └── Category breakdown with drill-down
│
├── [NEW] NY State Tab
│   ├── Context card: "Your $11,420 in state taxes"
│   ├── Summary breakdown
│   └── Category breakdown:
│       ├── Education (K-12, SUNY/CUNY): ~35%
│       ├── Health & Human Services: ~25%
│       ├── Transportation (MTA, highways): ~12%
│       ├── Public Safety: ~8%
│       ├── Economic Development: ~6%
│       ├── Environment & Parks: ~4%
│       └── All Other: ~10%
│
└── [NEW] NYC Tab
    ├── Context card: "Your $1,690 in city taxes"
    ├── Summary breakdown
    └── Category breakdown:
        ├── Education (DOE): ~35%
        ├── Public Safety (NYPD, FDNY): ~18%
        ├── Health & Social Services: ~15%
        ├── Infrastructure & Transportation: ~10%
        ├── Housing & Development: ~8%
        ├── Parks & Recreation: ~4%
        └── All Other: ~10%
```

**Implementation Approach:**
1. Add tab navigation above the federal context card
2. Create `view-state` and `view-city` divs with similar structure to federal
3. Use existing CSS patterns for consistency
4. Add data objects for state/city spending in JavaScript

---

### 5. Your Voice Page (`page-voice`) - Status: Complete

**Current Implementation:**
- Policy Impact section with 5 policy cards
- Spending Allocation section with appropriations bills
- Your Representatives section (Federal, State, City)
- Take Action section
- Methodology footer

**Recommendation:** No changes needed. Well-implemented.

**Potential Enhancement (Phase 2):**
- Add notification preferences for policy updates
- Link to upcoming votes that could affect user

---

## Cross-Page Navigation Flow

### Current Flow Issues

```
File → Where It Goes (good)
File → Tax History (good)
Tax History → Where It Goes (good)
Tax History → Your Voice (good)
Where It Goes → Tax History (good)

MISSING:
- No navigation to "Money You're Owed" from anywhere
- No contextual links between related content
```

### Recommended Navigation Updates

| From Page | Add Link To | Context |
|-----------|-------------|---------|
| File | Money You're Owed | "See benefits you qualify for" |
| Tax History | Money You're Owed | "View your benefits and credits" |
| Money You're Owed | Tax History | "See your complete tax history" |
| Money You're Owed | Your Voice | "Who decided these policies?" |
| Where It Goes | Money You're Owed | "Some spending comes back as benefits" |

### Updated Navigation Bar

```html
<nav class="nav-items">
    <a class="nav-link" id="nav-file" onclick="navigateTo('file')">File</a>
    <a class="nav-link" id="nav-record" onclick="navigateTo('record')">Tax History</a>
    <a class="nav-link" id="nav-owed" onclick="navigateTo('owed')">Money You're Owed</a>
    <a class="nav-link" id="nav-taxes" onclick="navigateTo('taxes')">Where It Goes</a>
    <a class="nav-link" id="nav-voice" onclick="navigateTo('voice')">Your Voice</a>
</nav>
```

---

## Implementation Priority

### Phase 1: Critical Path (Recommended First)

| Task | Effort | Impact | Notes |
|------|--------|--------|-------|
| 1.1 Create Money You're Owed page | High | Critical | Core value proposition |
| 1.2 Refactor Tax History page | Medium | High | Remove benefits, add filing history |
| 1.3 Update navigation | Low | High | Add new nav item, update links |

### Phase 2: Complete Experience

| Task | Effort | Impact | Notes |
|------|--------|--------|-------|
| 2.1 Add NY State spending breakdown | Medium | High | New tab in Where It Goes |
| 2.2 Add NYC spending breakdown | Medium | High | New tab in Where It Goes |
| 2.3 Cross-page contextual links | Low | Medium | Improve user journey |
| 2.4 Mobile responsiveness audit | Medium | Medium | Test all new components |

### Phase 3: Enrollment & Actions (Future)

| Task | Effort | Impact | Notes |
|------|--------|--------|-------|
| 3.1 Eligibility quiz for benefits | High | High | In Money You're Owed |
| 3.2 Document checklist generator | Medium | Medium | Help users prepare |
| 3.3 Direct enrollment links | Low | Medium | External integrations |
| 3.4 Deadline reminder system | Medium | Medium | Notifications |

---

## Technical Specifications

### New CSS Classes Needed

```css
/* Money You're Owed Page */
.owed-summary-grid { /* 2-column summary cards */ }
.claimed-card { /* Green-themed for confirmed benefits */ }
.missing-card { /* Gold-themed for potential benefits */ }
.benefit-row { /* Expandable row for individual benefits */ }
.benefit-card { /* Card for potential benefits */ }
.eligibility-indicator { /* Colored dot system */ }
.jurisdiction-section { /* Section grouping by federal/state/city */ }

/* Where It Goes - Tabs */
.jurisdiction-tabs { /* Tab navigation container */ }
.jurisdiction-tab { /* Individual tab button */ }
.jurisdiction-tab.active { /* Active tab state */ }
```

### New JavaScript Functions Needed

```javascript
// Money You're Owed
function toggleBenefitRow(element) { /* Expand/collapse benefit details */ }
function calculateTotalClaimed() { /* Sum confirmed benefits */ }
function calculatePotentialBenefits() { /* Sum estimated benefits */ }

// Where It Goes - Tabs
function switchJurisdiction(jurisdiction) { /* federal | state | city */ }
function renderStateSpending() { /* Populate NY State data */ }
function renderCitySpending() { /* Populate NYC data */ }

// Navigation
function navigateTo(page) { /* Add 'owed' case */ }
```

### Data Objects Needed

```javascript
// State spending allocation (2023)
const stateSpendingData = {
    total: 11420,
    categories: [
        { id: 'education', name: 'Education', amount: 3997, percent: 35 },
        { id: 'health', name: 'Health & Human Services', amount: 2855, percent: 25 },
        // ... etc
    ]
};

// City spending allocation (2023)
const citySpendingData = {
    total: 1690,
    categories: [
        { id: 'education', name: 'Education (DOE)', amount: 592, percent: 35 },
        { id: 'public-safety', name: 'Public Safety', amount: 304, percent: 18 },
        // ... etc
    ]
};

// Benefits data
const benefitsData = {
    claimed: {
        taxCredits: [
            { name: 'Child Tax Credit', amount: 2000, type: 'federal' },
            // ... etc
        ],
        refunds: [
            { name: 'Federal Refund', amount: 2847, type: 'federal' },
            // ... etc
        ]
    },
    potential: [
        {
            name: "Saver's Credit",
            estimatedValue: 400,
            eligibility: 'high',
            jurisdiction: 'federal',
            description: 'Tax credit for retirement contributions'
        },
        // ... etc
    ]
};
```

---

## User Journey Considerations

### Primary User Journey (Post-Filing)

```
1. File page (celebration)
   ↓ "Where does my money go?"
2. Where It Goes (federal breakdown)
   ↓ "What about state/city?" (new tabs)
3. Where It Goes (state/city views)
   ↓ "What did I get back?"
4. Money You're Owed (claimed benefits)
   ↓ "Am I missing anything?"
5. Money You're Owed (potential benefits)
   ↓ "Who decided this?"
6. Your Voice (policy impact, representatives)
```

### Secondary Journey (Benefit Discovery)

```
1. Tax History (see lifetime picture)
   ↓ "View your benefits"
2. Money You're Owed (claimed vs potential)
   ↓ "Check eligibility"
3. Enrollment flow (Phase 3)
```

### Mobile Considerations

- Tab navigation should be scrollable on mobile
- Expandable rows should have clear tap targets (44px minimum)
- Summary cards should stack vertically on mobile
- Allocation bar should remain readable at smaller widths

---

## Acceptance Criteria

### Money You're Owed Page
- [ ] Summary shows claimed total and potential total side-by-side
- [ ] Claimed section has expandable rows for tax credits and refunds
- [ ] Potential section groups benefits by jurisdiction
- [ ] Each potential benefit shows name, estimated value, eligibility indicator
- [ ] Navigation includes "Money You're Owed" tab
- [ ] Cross-links from Tax History and File pages work

### Tax History Refactoring
- [ ] Page title updated to "Tax History"
- [ ] Benefits section removed (moved to Money You're Owed)
- [ ] Filing History section added showing past filings
- [ ] Link to Money You're Owed page added
- [ ] Lifetime summary updated to remove "Benefits claimed" or link to new page

### Where It Goes - State/City
- [ ] Tab navigation added (Federal | NY State | NYC)
- [ ] NY State spending breakdown implemented with 7+ categories
- [ ] NYC spending breakdown implemented with 7+ categories
- [ ] Data accurate to prototype persona's $11,420 state and $1,690 city taxes
- [ ] Visual consistency with federal breakdown maintained

---

## Appendix: Prototype Persona Reference

For implementation accuracy, all numbers should reflect:

- **Household income:** ~$100-120k
- **Filing status:** Married filing jointly
- **Location:** NYC (Upper West Side)
- **Children:** Yes (qualifies for CTC, EITC)
- **Total 2024 taxes:** ~$37k
  - Federal: $24,180
  - NY State: $11,420
  - NYC: $1,690
- **2024 refund:** $3,259
  - Federal: $2,847
  - NY State: $412
- **Claimed benefits:** $6,759 (credits + refunds)
- **Potential unclaimed:** ~$3,200/year
