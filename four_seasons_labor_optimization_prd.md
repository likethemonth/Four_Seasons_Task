# Product Requirements Document
## Guest-Informed Labor Optimization for Four Seasons Hotels & Resorts

**Document Version:** 1.0  
**Date:** January 30, 2026  
**Author:** Brain Co  
**Stakeholders:** Four Seasons Corporate, Cascade Investment, Kingdom Holding, Property Owners

---

## Executive Summary

This PRD outlines a Guest-Informed Labor Optimization system that transforms how Four Seasons properties schedule and deploy staff. By connecting existing guest data (Oracle OPERA PMS + Four Seasons Chat) to workforce scheduling, properties can move from occupancy-based staffing to guest-informed staffing — knowing not just how many guests are arriving, but who they are and what they'll need.

**Target Outcome:** 5-7% reduction in labor costs across the Four Seasons portfolio, translating to $100-140M in annual savings for property owners.

---

## 1. Business Context

### 1.1 Four Seasons Business Model

| Aspect | Detail |
|--------|--------|
| Model | Pure management company (owns 0% of properties) |
| Portfolio | 133 hotels and resorts across 47 countries |
| Rooms | ~30,000 |
| Corporate Revenue | ~$400-500M annually |
| Revenue Sources | 3% base management fee + 8-10% of GOP + marketing/reservations fees |
| Ownership | Cascade Investment (71.25%), Kingdom Holding (23.75%), Triples Holdings (5%) |

### 1.2 Labor Cost Structure (System-Wide)

| Category | % of Labor | Annual Cost | Optimization Potential |
|----------|-----------|-------------|------------------------|
| Housekeeping | 30% | $600M | High |
| Food & Beverage | 25% | $500M | High |
| Front Office | 12% | $240M | Medium |
| Spa/Recreation | 6% | $120M | Medium |
| Concierge | 5% | $100M | Medium |
| Admin/Management | 10% | $200M | Low |
| Engineering | 7% | $140M | Low |
| Security | 5% | $100M | Low |
| **Total** | **100%** | **$2B** | — |

### 1.3 The Problem

**Current State (documented in Four Seasons Park Lane case study):**

> "The iconic Four Seasons Hotel, Park Lane, London, operated with a traditional labour model, hiring core team members on 40 hours contracts to ensure maximum coverage... adoption of this traditional labour model meant that department heads didn't have the flexibility to adjust labour scheduling to actual customer demand, resulting in wasted labour costs or under-staffing during quieter periods and peak season."
> 
> — Fourth Case Study, Four Seasons Hotel

**Key Pain Points:**

1. **Static Scheduling:** 40-hour contracts regardless of actual demand
2. **Manual Processes:** Schedules built on spreadsheets, time-consuming to adjust
3. **Occupancy-Only Forecasting:** Current tools predict HOW MANY guests, not WHO they are
4. **Department Silos:** No cross-departmental view of guest needs
5. **Reactive Staffing:** Staff deployed based on historical averages, not guest-specific demand

### 1.4 Why Four Seasons is Uniquely Positioned

| Advantage | Detail |
|-----------|--------|
| Rich Guest Data | Oracle OPERA PMS with cross-property guest history |
| Preference Capture | Four Seasons Chat (human-powered) generates continuous preference data |
| High Repeat Rate | 35% repeat guests with predictable patterns |
| High Staff Ratios | 1.5-2.0 staff per room (vs industry 0.5) — more to optimize |
| Premium Service Model | Not trying to cut service, just deploy smarter |
| Global Network | 133 properties means cross-property guest intelligence |

---

## 2. Solution Overview

### 2.1 Core Concept

**From:** Scheduling based on occupancy forecast + historical patterns  
**To:** Scheduling based on guest profiles + preferences + cross-property history

```
┌─────────────────────────────────────────────────────────────────┐
│                     CURRENT STATE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Inputs:                                                        │
│  • Occupancy forecast (70% tomorrow)                            │
│  • Day of week (Saturday)                                       │
│  • Historical patterns (usually busy)                           │
│  • Local events (convention in town)                            │
│                                                                 │
│  Output: "Staff for a busy Saturday"                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PROPOSED STATE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Inputs (all of the above PLUS):                                │
│  • 200 guests arriving — here's who they are:                   │
│    - 60% historically use F&B heavily                           │
│    - 25% have spa bookings in past stays                        │
│    - 40 are early checkout patterns (6am flights)               │
│    - 15 VIPs requiring GM/management touchpoints                │
│    - 30 traveling with children (pool/kids club)                │
│    - 20 have dietary restrictions (kitchen prep)                │
│                                                                 │
│  Output: "Staff F&B fully, spa moderate, housekeeping           │
│           shift earlier, kids club covered, GM schedule         │
│           includes arrival windows for VIPs"                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Differentiation from Existing Solutions

| Capability | Current Tools (Fourth, Unifocus) | Brain Co Solution |
|------------|----------------------------------|-------------------|
| Occupancy forecasting | ✓ | ✓ |
| Historical demand patterns | ✓ | ✓ |
| Event/weather integration | ✓ | ✓ |
| Individual guest preferences | ✗ | ✓ |
| Cross-property guest history | ✗ | ✓ |
| Pre-arrival request analysis | ✗ | ✓ |
| Guest behavior prediction | ✗ | ✓ |
| Service demand by guest type | ✗ | ✓ |

**Core Insight:** Existing tools optimize for volume. We optimize for the specific guests who are actually arriving.

### 2.3 What This Is NOT

| We Are NOT | Why |
|------------|-----|
| Automating Four Seasons Chat | Luxury guests expect human interaction; Chat is a brand differentiator |
| Replacing guest-facing staff | Four Seasons competes on service, not efficiency |
| Cutting headcount | Goal is smarter deployment, not fewer people |
| Building a guest-facing product | This is back-of-house, staff-facing only |
| Replacing OPERA or existing PMS | We integrate with existing systems |

---

## 3. Functional Requirements

### 3.1 Data Integration Layer

**3.1.1 Oracle OPERA Cloud Integration**

| Data Point | Use Case |
|------------|----------|
| Reservation details | Arrival/departure times, room type, rate code |
| Guest profile | Name, contact, loyalty status, VIP codes |
| Stay history | Past properties, room preferences, complaints |
| Preferences | Pillow type, floor preference, dietary restrictions |
| Billing history | F&B spend patterns, spa usage, minibar |
| Special requests | Accessibility needs, celebrations, business needs |

**Integration Method:** OHIP (Oracle Hospitality Integration Platform) REST APIs

**3.1.2 Four Seasons Chat Integration**

| Data Point | Use Case |
|------------|----------|
| Pre-arrival requests | Spa bookings, restaurant reservations, transport |
| In-stay requests | Room service patterns, concierge asks |
| Preference expressions | "I prefer..." statements captured in conversation |
| Complaint history | Service recovery needs, sensitivity flags |
| Communication style | Response time expectations, formality level |

**Integration Method:** Chat platform API (to be defined with FS IT)

**3.1.3 Workforce Management Integration**

| System | Integration |
|--------|-------------|
| Fourth / HotSchedules | Schedule output, labor cost tracking |
| Payroll systems | Hours worked, overtime tracking |
| Time & attendance | Actual vs scheduled variance |

### 3.2 Guest Intelligence Engine

**3.2.1 Guest Profile Enrichment**

For each arriving guest, generate a composite profile:

```
Guest: John Chen
Loyalty: FS Preferred (12 stays across 8 properties)
Stay Pattern: Business traveler, typically Mon-Thu
─────────────────────────────────────────────────
SERVICE PREDICTIONS:
• F&B: Heavy user (ordered room service 80% of stays)
• Spa: Non-user (0 spa bookings in history)  
• Gym: Morning user (badge-ins 6-7am)
• Checkout: Early pattern (avg 6:30am departure)
• Concierge: Low usage
• Special: Dairy-free dietary requirement
─────────────────────────────────────────────────
STAFFING IMPLICATIONS:
• Room service: Include in evening demand forecast
• Housekeeping: Early turnover likely
• Kitchen: Dairy-free prep required
• Gym: Morning attendant coverage
```

**3.2.2 Aggregate Demand Forecasting**

Roll up individual guest profiles to department-level demand:

```
PROPERTY: Four Seasons Park Lane
DATE: Saturday, February 15, 2026
OCCUPANCY: 85% (320 guests)
─────────────────────────────────────────────────
DEPARTMENT DEMAND FORECAST:

HOUSEKEEPING
• Early checkouts (before 9am): 45 rooms
• Late checkouts (after 2pm): 28 rooms
• DND patterns expected: 15 rooms
• Recommendation: Shift 2 staff to early AM, reduce afternoon by 1

F&B
• High F&B users arriving: 180 guests (56%)
• Restaurant reservations: 120 covers
• Room service likelihood: 85 orders (based on guest patterns)
• Recommendation: Full restaurant staffing, +1 room service runner

SPA
• Guests with spa history: 95 (30%)
• Pre-booked appointments: 40
• Walk-in likelihood: 15-20
• Recommendation: Standard staffing, prep for walk-ins PM

CONCIERGE
• High-touch guests: 25
• Theater/restaurant requests likely: 35
• Transport arrangements: 18
• Recommendation: Standard staffing

KIDS CLUB / POOL
• Families with children: 12
• Pool users (historical): 45
• Recommendation: Kids club staffed, lifeguard coverage 10am-6pm
```

### 3.3 Schedule Optimization Engine

**3.3.1 Inputs**

| Input | Source |
|-------|--------|
| Guest demand forecast | Guest Intelligence Engine |
| Labor standards | Four Seasons brand standards (rooms/hour, covers/server) |
| Staff availability | Existing WFM system |
| Labor rules | Union agreements, break requirements, max hours |
| Budget constraints | Property-level labor budget |
| Skill requirements | Language skills, certifications, VIP handling |

**3.3.2 Outputs**

| Output | Format |
|--------|--------|
| Recommended schedule | Export to Fourth/HotSchedules |
| Variance report | Recommended vs current schedule |
| Cost projection | Projected labor cost vs budget |
| Risk flags | Understaffing risks, compliance issues |
| Department briefs | Summary for department heads |

**3.3.3 Optimization Logic**

```
FOR each department:
  1. Calculate base staffing from occupancy
  2. Adjust UP for high-demand guest segments
  3. Adjust DOWN for low-demand guest segments
  4. Apply time-of-day shifts based on guest patterns
  5. Validate against labor rules and budget
  6. Flag exceptions for manager review
```

### 3.4 Manager Interface

**3.4.1 Dashboard Views**

| View | Purpose |
|------|---------|
| Daily Demand Overview | See guest-informed demand by department |
| Schedule Recommendations | Review and approve optimized schedules |
| Guest Arrival Brief | Key guests, VIPs, special needs for the day |
| Variance Tracking | Actual vs predicted demand (for model training) |
| Labor Cost Tracker | Real-time labor cost vs budget |

**3.4.2 Key Interactions**

| Action | Description |
|--------|-------------|
| Review recommendation | See AI-generated schedule with rationale |
| Approve / modify | Accept or adjust before publishing |
| Override with reason | Manual override with logged justification |
| Flag guest insight | Correct or add guest preference data |

### 3.5 Staff-Facing Features

**3.5.1 Shift Notifications**

- Push notification of schedule via existing app (Fourth/HotSchedules)
- No new staff-facing app required

**3.5.2 Guest Brief at Shift Start (Optional Enhancement)**

| Content | Purpose |
|---------|---------|
| VIP arrivals on your shift | Who to watch for |
| Special requests | Dietary, accessibility, celebrations |
| Returning guests | "Welcome back" opportunities |
| Service recovery alerts | Guests with past complaints |

*Note: This is the "push info to staff" concept discussed — surfacing existing data at the right moment. Does NOT automate guest interaction.*

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Requirement | Target |
|-------------|--------|
| Schedule generation | < 2 minutes for 7-day forecast |
| Dashboard load time | < 3 seconds |
| Data sync frequency | Every 15 minutes from PMS |
| API response time | < 500ms p95 |

### 4.2 Security & Privacy

| Requirement | Implementation |
|-------------|----------------|
| Data encryption | AES-256 at rest, TLS 1.3 in transit |
| Access control | Role-based, property-level isolation |
| PII handling | Guest data anonymized in analytics, retained per FS policy |
| Compliance | GDPR, CCPA, SOC 2 Type II |
| Audit logging | All access and changes logged |

### 4.3 Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.9% availability |
| Failover | If system unavailable, properties revert to standard scheduling |
| Data backup | Daily backups, 30-day retention |

### 4.4 Scalability

| Phase | Properties | Infrastructure |
|-------|------------|----------------|
| Pilot | 5 properties | Single region deployment |
| Phase 1 | 30 properties | Multi-region |
| Full rollout | 133 properties | Global deployment |

---

## 5. Implementation Plan

### 5.1 Phased Rollout

```
PHASE 0: Discovery & Design (Months 1-2)
├── Deep dive with Four Seasons IT on OPERA/Chat data
├── Document current scheduling workflows at 3 properties
├── Define integration specifications
├── Finalize labor standards by department
└── Identify pilot properties

PHASE 1: Pilot (Months 3-6)
├── Deploy at 5 properties (mix of urban/resort)
├── Run in "shadow mode" — recommendations without action
├── Validate accuracy of guest demand predictions
├── Measure theoretical savings vs actual scheduling
└── Iterate on model and UX

PHASE 2: Controlled Rollout (Months 7-12)
├── Expand to 30 properties
├── Enable live schedule optimization
├── A/B test: optimized vs traditional scheduling
├── Measure actual labor cost savings
└── Refine by property type and region

PHASE 3: Global Deployment (Months 13-24)
├── Roll out to remaining 100+ properties
├── Regional customization (labor laws, union rules)
├── Advanced features (predictive hiring, seasonal planning)
└── Integration with Four Seasons corporate reporting
```

### 5.2 Pilot Property Selection Criteria

| Criterion | Rationale |
|-----------|-----------|
| Mix of urban and resort | Different demand patterns |
| High repeat guest rate | More historical data for predictions |
| Cooperative GM and ownership | Change management matters |
| Currently using Fourth or similar | Easier WFM integration |
| Representative labor mix | All major departments present |

**Suggested Pilot Properties:**
1. Four Seasons Park Lane, London (has Fourth, case study exists)
2. Four Seasons New York Downtown (urban, high business travel)
3. Four Seasons Maui (resort, high leisure, seasonal)
4. Four Seasons Singapore (Asia hub, mixed travel)
5. Four Seasons Dubai (high VIP concentration)

### 5.3 Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Labor cost % of revenue | 35-40% | 33-37% | Payroll / Revenue |
| Schedule accuracy | N/A | 90%+ demand prediction accuracy | Predicted vs actual covers, requests |
| Manager time on scheduling | 5-8 hrs/week | 1-2 hrs/week | Time study |
| Overtime hours | Current baseline | -20% | Payroll data |
| Guest satisfaction (NPS) | Current baseline | No decline | Guest surveys |
| Staff satisfaction | Current baseline | No decline | Employee surveys |

---

## 6. Financial Model

### 6.1 Value Creation

| Source | Calculation | Annual Value |
|--------|-------------|--------------|
| Labor cost reduction (5%) | $2B × 5% | $100M |
| Labor cost reduction (7%) | $2B × 7% | $140M |
| Overtime reduction | $50M overtime × 20% reduction | $10M |
| Manager productivity | 133 properties × 4 hrs/week × $50/hr × 52 weeks | $1.4M |
| **Total (Conservative)** | | **$111M** |
| **Total (Optimistic)** | | **$151M** |

### 6.2 Implementation Investment

| Phase | Cost |
|-------|------|
| Phase 0: Discovery | $500K |
| Phase 1: Pilot (5 properties) | $2M |
| Phase 2: Rollout (30 properties) | $4M |
| Phase 3: Global (133 properties) | $8M |
| **Total Implementation** | **$14.5M** |
| Annual Operations (post-rollout) | $3M |

### 6.3 ROI Summary

| Metric | Value |
|--------|-------|
| Total 3-year investment | ~$20M |
| Annual value (conservative) | $111M |
| 3-year net value | $313M |
| ROI | 15.6x |
| Payback period | ~2 months post-full-deployment |

### 6.4 Value Distribution

| Stakeholder | Value Captured | Mechanism |
|-------------|----------------|-----------|
| Property Owners | ~$100M | Direct labor cost savings |
| Four Seasons Corporate | ~$9-10M | 8-10% incentive fee on improved GOP |
| Cascade/Kingdom (as FS shareholders) | ~$9-10M | Through FS corporate revenue |
| Cascade/Kingdom (as property owners) | Additional | On properties they own directly (e.g., George V) |

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OPERA integration complexity | Medium | High | Early technical discovery; dedicated FS IT partnership |
| Resistance from property GMs | Medium | High | Pilot with supportive GMs; prove value before mandating |
| Union pushback on flexible scheduling | Medium | Medium | Position as "smarter deployment" not "fewer jobs"; involve unions early |
| Guest data quality issues | Medium | Medium | Data cleaning phase; feedback loops for corrections |
| Model accuracy in early stages | High | Medium | Shadow mode before live; human oversight always |
| Privacy concerns (guest data use) | Low | High | Clear data governance; no guest-facing AI; comply with GDPR/CCPA |
| Service quality decline | Low | High | Monitor NPS closely; maintain staffing floors; easy override for managers |

---

## 8. Open Questions

| Question | Owner | Target Resolution |
|----------|-------|-------------------|
| Exact OPERA data fields available via OHIP? | FS IT | Phase 0 |
| Four Seasons Chat API access and data structure? | FS IT | Phase 0 |
| Current WFM systems in use across portfolio? | FS Operations | Phase 0 |
| Labor standards documentation by department? | FS Operations | Phase 0 |
| Union agreements that constrain scheduling flexibility? | FS HR/Legal | Phase 0 |
| Property owner approval process for new systems? | FS Corporate | Phase 0 |
| Pilot property selection and GM buy-in? | FS Corporate | Phase 0 |

---

## 9. Appendix

### 9.1 Competitive Landscape

| Vendor | Focus | Gap vs Brain Co Solution |
|--------|-------|--------------------------|
| Fourth | WFM, scheduling, inventory | No guest-level intelligence |
| Unifocus | Labor management, forecasting | Occupancy-based only |
| HotSchedules | Staff scheduling, communication | No predictive guest insights |
| Oracle Labor Management | Enterprise WFM | Generic, not hospitality-optimized |

### 9.2 Industry Benchmarks

| Metric | Source | Value |
|--------|--------|-------|
| Labor savings from AI scheduling | Multiple studies | 3-12% |
| Four Seasons-specific case (Fourth) | Fourth case study | "Improved flexibility and productivity" (unquantified) |
| Boutique hotel AI scheduling | HFTP | 12% labor cost reduction |
| Typical hotel labor optimization | Hotel Tech Report | 3-5% savings |

### 9.3 Reference: Four Seasons Finance Director Quote

> "Labour is a big cost in our business. Probably the biggest cost. It is essential we show a return on the business. I have been using the solution to show our owners that these are the tools we are using to improve awareness; to improve flexibility; to be more productive and drive productivity."
>
> — Mathias Cocuron, Regional Director of Finance, Four Seasons Park Lane

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 30, 2026 | Brain Co | Initial PRD |

---

*This document is confidential and intended for Four Seasons Hotels & Resorts and its ownership group.*
