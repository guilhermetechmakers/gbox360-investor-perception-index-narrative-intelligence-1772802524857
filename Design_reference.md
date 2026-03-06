# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# Gbox360 — Development Blueprint

## Project Concept
Gbox360 is an explainable narrative intelligence platform that converts external signals (news, social, earnings transcripts) into an Investor Perception Index (IPI). The application’s purpose is to give investors, corporate executives, and analysts a single auditable metric showing how market perception of a company is changing and why. The vision is a board‑credible, traceable system that preserves raw payloads, models narrative persistence and credibility, and surfaces the events behind movements so users can act with confidence.

Core app description (MVP): secure web app where users log in, select a company and time window, see a current IPI score, directional change, and the top 3 narratives driving movement, with drill-downs to canonical NarrativeEvents and preserved raw payloads. Ingestion is constrained to one licensed news source, one social (read-only) source, and batch earnings transcripts. The system uses an append-only NarrativeEvent model, lightweight topic classification, time-decayed narrative persistence, crude authority weighting, a basic credibility proxy, and a provisional IPI composition (40% Narrative / 40% Credibility / 20% Risk).

## Problem Statement
- Core problems:
  - Market perception is diffuse across news, social, and transcripts; existing dashboards show sentiment but lack provenance, narrative structure, and explainability.
  - Investors and executives need concise, auditable signals that explain "why" perception moved, not just "what".
  - Teams require immutable preservation of raw sources for regulatory, audit, and board uses.
- Who experiences these problems:
  - Institutional investors, portfolio managers, corporate executives, investor relations, sell‑side analysts, and data engineers/operators.
- Why these problems matter:
  - Decisions and disclosures require explainable, traceable evidence; opaque sentiment metrics lead to mistrust and poor actionability.
- Current state / gaps without solution:
  - Fragmented sources, no canonical event schema, limited audit-ready exports, and sentiment dashboards lacking narrative and credibility context.

## Solution
- How application addresses problems:
  - Ingest constrained, licensed sources and preserve raw payloads immutable for audit.
  - Canonicalize each ingestion into an append-only NarrativeEvent schema capturing speaker heuristics, audience class, raw text, timestamps and metadata.
  - Compute a transparent IPI combining narrative persistence, credibility proxy, and a risk proxy with provisional weights.
  - Provide a UX that surfaces top narratives, the delta in IPI, and a “Why did this move?” drill-down mapping contributions to underlying raw payloads.
- Approach & methodology:
  - Cloud-native event-driven ingestion → store raw payloads (S3) → index metadata → produce NarrativeEvents → lightweight topic/classification and heuristic credibility scoring → time-decayed aggregation → compute IPI time series.
  - Keep early algorithms simple, explicitly label provisional weights, and surface raw payloads for auditability.
- Key differentiators:
  - Narrative-first, canonical event model (append-only) with raw payload preservation.
  - Explainable IPI with explicit contribution breakdown and exportable audit artifacts.
  - Designed for enterprise auditing and future extension (authority weighting, governance signals, benchmarking).
- Value for users:
  - Fast, explainable signals to inform investment decisions and investor relations actions; auditable exports for boards and compliance.

## Requirements

### 1. Pages (UI Screens)
List of pages with purpose, key components, and contribution to problem solving.

- Login / Signup
  - Purpose: Authentication entry, trial signup.
  - Key sections: Email/password form, SSO placeholders, remember-me, links (create account, forgot password), field-level validation, error area.
  - Contribution: Secure onboarding and gated access to IPI tools.

- Password Reset
  - Purpose: Request and complete password resets.
  - Key sections: Request form (email), reset token form (new password, confirm), strength meter, validation, back-to-login.
  - Contribution: Secure credential recovery to maintain access continuity.

- Email Verification
  - Purpose: Confirm new accounts and guide next steps.
  - Key sections: Status (pending/success/expired), resend verification, CTA to dashboard.
  - Contribution: Ensures verified identities for audit trails.

- User Profile
  - Purpose: Account settings and preferences.
  - Key sections: Personal details, notification toggles, team seats, linked integrations placeholder, security actions (change password), delete account.
  - Contribution: Control over notifications, identity, and enterprise seat management.

- Dashboard (Primary workspace)
  - Purpose: Entry point for queries and quick IPI overview.
  - Key sections: Global top bar (company selector, time window, search), IPI Overview card (score, delta, sparkline), Top 3 Narratives list, Recent Events feed, Export/Audit button, empty-state guidance.
  - Contribution: Rapid decisioning surface showing current perception and top narratives.

- Company Detail & IPI
  - Purpose: Focused IPI breakdown and audit access per company.
  - Key sections: Company header, IPI Breakdown (Narrative/Credibility/Risk with values), Timeline (time-decayed persistence), Narrative list with expanders, Raw Payload viewer modal, time window/comparison picker, export CTA.
  - Contribution: Transparent decomposition and direct raw evidence for each IPI value.

- Narrative Drill-down
  - Purpose: Explain why a narrative contributed to IPI movement.
  - Key sections: Narrative summary, contributing events list (impact sorted), event detail panel (raw text, link), authority & credibility panel, replay/timeline slider, export artifact.
  - Contribution: Maps narrative-level signal to specific events and raw sources for traceability.

- Raw Payload Viewer
  - Purpose: Audit view for preserved raw sources.
  - Key sections: Payload header (source, ingest timestamp, job id), syntax-highlighted payload, metadata panel, download JSON/TXT.
  - Contribution: Immutable provenance for audits and regulatory review.

- Ingestion Monitor
  - Purpose: Operational monitoring for data engineers/admins.
  - Key sections: Source status cards, retry queue viewer, idempotency log, raw payload quick links, manual re-run.
  - Contribution: Ensures ingestion health, reliability and recoverability.

- Admin Dashboard
  - Purpose: Platform health, user and billing controls.
  - Key sections: System health overview, events log, quick links to user management, billing, analytics.
  - Contribution: Operational visibility and admin controls.

- User Management (Admin)
  - Purpose: Manage users, roles and seats.
  - Key sections: User list, invite modal, edit user modal, audit log viewer.
  - Contribution: Enterprise access control and audit of admin actions.

- Analytics & Reports (Admin)
  - Purpose: Business & platform metrics and exports.
  - Key sections: Key metric cards, report builder, scheduled reports management.
  - Contribution: Track adoption and operational SLAs.

- Historical Comparison
  - Purpose: Compare IPI and narrative persistence across windows/peers (MVP placeholder).
  - Key sections: Selection controls, side-by-side IPI charts, persistence heatmaps, cross-window persistent narratives list.
  - Contribution: Contextual historical insights for decision-making.

- Settings & Preferences
  - Purpose: Account-level and (admin) weighting controls.
  - Key sections: Notification settings, data retention, weighting overrides (admin-only, provisional), integrations.
  - Contribution: Control over data and provisional model parameters.

- Checkout / Payment
  - Purpose: Subscription purchase and billing management.
  - Key sections: Plan selector, secure payment form (PCI via provider), invoice history.
  - Contribution: Monetization and seat management.

- Landing Page
  - Purpose: Marketing, conversion and onboarding.
  - Key sections: Hero, features, how it works, use cases, CTA.
  - Contribution: Acquisition and trial conversion.

- About & Help
  - Purpose: Methodology, FAQ, glossary and support.
  - Key sections: Methodology explainer, FAQ, glossary, contact form, legal links.
  - Contribution: Trust-building and user education on IPI methodology.

- Loading / Success / Error States (Shared)
  - Purpose: Communicate operation status across app.
  - Key sections: Spinner, progress bar, success message, error fallback with retry.
  - Contribution: UX clarity for long-running ingestion/export tasks.

- 404 / 500 Error Pages
  - Purpose: Friendly error handling and navigation.
  - Key sections: Explanatory text, CTAs back to landing/dashboard, contact support.
  - Contribution: Smooth recovery from routing or server errors.

### 2. Features
Core features with technical detail and implementation notes.

- User Authentication
  - JWT access + refresh tokens, bcrypt/Argon2 password hashing, email verification flow, brute-force rate limiting, RBAC scaffold (admin vs standard), secure cookies & CSRF protections.

- Password Management
  - One-time expiring reset tokens, strength meter, audit logs for resets, transactional email integration.

- Email Verification & Notifications
  - Transactional templates with retry, resend limits, analytics hooks, integration with Resend or equivalent.

- Session Management & Security
  - Short-lived access tokens, long-lived refresh tokens, token revocation, logout-all endpoint, login audit trail.

- Constrained Data Ingestion
  - Connectors for News API and Social API (rate-limited), batch transcripts ingestion, raw payload persistence to S3, idempotent ingestion with dedupe keys, ingestion metadata indexing.

- Ingestion Resilience & Idempotency
  - Exactly-once semantics via dedupe keys/idempotency tokens, persistent retry queue (e.g., task queue like Celery/Resque or serverless queue), exponential backoff, poison queue handling, metrics & alerts.

- Append-only Raw Payload Store
  - S3 with versioning & SSE, index metadata in DB (Postgres) or search index, partial retrieval/streaming support, RBAC on payload access, download audit logs.

- Canonical NarrativeEvent Model
  - Immutable schema: event_id, source, platform, speaker_entity, speaker_role, audience_class, raw_text, timestamps (published, ingested), canonical_topics, ingestion_metadata; write-once constraints; NER + heuristic role mapping.

- Topic Classification (Lightweight)
  - Rule-based keyword mapping with embeddings fallback via OpenAI or local model; store canonical_topics; admin topic taxonomy later.

- Narrative Persistence & Time-decay
  - Exponential decay (configurable half-life), windowed counts and persistence score, pre-aggregated daily buckets for efficient queries, ability to recompute history.

- Crude Authority Weighting
  - Static weight table (Analyst > Media > Retail) configurable in admin; mapping heuristics for speaker->class; used in impact calculations.

- Basic Credibility Proxy
  - Heuristic detectors: management forward-looking/hedging language, repetition/consistency across sources, normalized credibility score combined with authority weight.

- Simplified IPI Calculation
  - Normalize components, compute IPI as weighted sum (40/40/20), store time series per company, log weights (provisional), expose breakdown API and UI.

- IPI Explainability & Drill-down UI
  - Top narratives with contribution %, event lists with impact scoring, direct links to raw payloads, downloadable audit artifacts (CSV/PDF/JSON) including provenance.

- Search & Filter
  - Full-text search (Elasticsearch or managed), filters for source / speaker_role / topic / time window, autocomplete suggestions.

- Export & Audit Artifacts
  - Export manifest (weights, timestamps, event refs, raw payload IDs), streaming exports for large sets, RBAC enforcement for full raw payload exports.

- Admin Controls & Monitoring
  - Admin APIs for ingestion replay, rate-limit adjustments, user and billing management, integration with monitoring tools (CloudWatch/Datadog).

- Billing & Subscriptions
  - Stripe integration for plans, webhooks to reconcile subscription state, seat management, invoice history.

### 3. User Journeys
Step-by-step flows for each user type.

- Visitor → Signup Trial
  1. Landing page: user clicks “Start free trial”.
  2. Signup: email, password → email verification sent.
  3. Email verify → redirected to onboarding / Dashboard with trial limits applied.

- Registered User (Standard) → View IPI
  1. Login.
  2. Dashboard: select company (autocomplete) and time window.
  3. System computes/loads IPI time series and displays IPI card (score, delta, sparkline) and Top 3 narratives.
  4. Click narrative “Why did this move?” → Narrative Drill-down with events and raw payload links.
  5. Export audit artifact if needed (CSV/PDF).

- Power User / Analyst → Deep Audit
  1. Login → Company Detail.
  2. Use timeline to zoom on window of interest.
  3. Open Narrative list → expand a narrative → inspect contributing events and open Raw Payload Viewer.
  4. Download raw payloads or export audit artifact for board package.

- Admin / Operator → Ingestion Recovery
  1. Login → Admin Dashboard → Ingestion Monitor.
  2. View failed jobs → inspect idempotency log → manually re-run ingestion for selected date/range.
  3. Verify raw payloads stored in raw store; replay events if needed.

- Billing Admin → Manage Subscriptions
  1. Login → Admin Dashboard → Billing.
  2. Add seats, manage plan, process payment via Stripe, view invoice history.

- New Team Invite Flow (Admin)
  1. Admin → User Management → Invite user modal.
  2. Invitee receives email → signs up → organization association created; admin can assign role and seats.

- Support / Help Flow
  1. User clicks Help → reads methodology / glossary.
  2. Submits ticket via contact form if issue persists.

## UI Guide
---

## Visual Style

### Color Palette:
- Page Background: #F6EFE0
- Card Surfaces / Pastel Tiles: #FFFFFF, #FBD8C5, #E8DED3, #C8D4C0, #D8C9B0, #E6C9C2
- Primary Text: #1A1A1A
- Muted Text / Subtitles: #5A5A5A
- Accent / UI Highlights: #2B2B2B → #111111
- Primary CTA Button: #111111
- CTA Text: #FFFFFF
- Subtle Borders / Dividers: rgba(0,0,0,0.08)

### Typography & Layout:
- Headings: Playfair Display (serif). H1 48–56px (700–800).
- Body/UI text: Inter (sans-serif). Body 14–16px; UI labels 12–14px.
- Subheads: 20–28px (serif or paired sans).
- Layout: centered container max-width ~1200px; responsive grid (2–3 columns desktop, 1–2 tablet/phone); spacious vertical rhythm.

### Key Design Elements
Card Design
- Rounded corners 20–28px, soft shadows, hierarchy: image/tint area → bold title → supporting copy, hover subtle lift.

Navigation
- Top nav bar: left logo/name, center/left links, right action (Get started), persistent slim header, accessible hover/focus states.

Data Visualization
- Narrative tiles and content blocks prioritized; if graphs used follow pastel palette and simple micro-visuals.

Interactive Elements
- Primary CTAs: deep charcoal rounded pills (#111111) with white text.
- Secondary/ghost: pale pastel or bordered.
- Form elements: rounded corners, soft borders, accessible focus outlines.
- Micro-interactions: gentle hover lift, color shift, shadow intensify.

### Design Philosophy
- Professional, calm, human-centered.
- Narrative-first, audit-friendly, and minimal.
- Responsive, readable and action-oriented.

---

**Implementation Notes:**
- Apply the design system consistently across pages.
- Ensure accessible contrast for text and controls.
- Use component library (UI Kit & Component Library asset) for consistency.

## Instructions to AI Development Tool
1. Refer to the Project Concept, Problem Statement, and Solution sections to preserve the "why".
2. Ensure every page and feature links back to solving identified problems: explainability, auditability, and reliability.
3. Build features per the Requirements and verify each before marking complete; include unit and integration tests.
4. Strictly follow the UI Guide (colors, typography, spacing, visual elements).
5. Maintain consistency in provisional weights visibility and audit trails; include metadata for every IPI computation and export.
6. For ingestion, preserve raw payloads immutable with metadata; all ingestion jobs must be idempotent and observable.
7. Expose admin operational controls and RBAC for payload access and exports.
8. For MVP, keep algorithms simple and transparent; label provisional rules and weights in UI and exports.
9. Produce API documentation for external connectors and internal APIs (ingestion, narrative, IPI time series, exports).
10. Provide a data pipeline & architecture diagram asset and sample raw payload dataset to enable development and QA.

---

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
