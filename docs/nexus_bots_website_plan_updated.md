# Nexus Bots Website Plan – Updated (Post-Audit Revisions)

---

## 1. Target Audience & Design Priorities

### Primary Users & Journeys

- **Creator Mode:** Quick onboarding via instant sandbox bot and ready-to-use templates. Access to baseline nodes only.
- **Power Mode:** Unlock advanced nodes, analytics, and integrations after completing guided onboarding.
- **Developer Mode:** Access to Git-based Dev Console, plugin SDK, and advanced customization tools.

### UX Principles

- **Time to First Value (TTFV):** Achieve a working bot within two minutes using a shared demo bot and pre-provisioned templates.
- **Visual Clarity:** Color-coded node types (Trigger, Action, Logic, AI, Persistence).
- **Non-Blocking Errors:** Inline validation with live feedback.
- **Progressive Complexity:** Beginner-friendly defaults with optional advanced settings.

---

## 2. Public Website (Pre-Login)

### 2.1 Persistent Header

- Logo linking to home.
- Navigation: Features, Templates, Pricing, Marketplace, Docs, Login/Sign-up.
- Primary CTA: **Start Building Free** → Sign-up.

### 2.2 Home Page

- Hero section: Headline, subtext, primary CTA (Start Building), secondary CTA (Watch Demo).
- 3-Step Onboarding Banner: Connect → Build → Deploy.
- Feature highlights with icons and deep links.
- Template showcase carousel.
- Testimonials.
- Footer: Links to Docs, **ToS**, **Privacy Policy**, **Data Processing Addendum**, **Acceptable Use Policy**, **Security Overview**, and contact.

### 2.3 Features Page

- Tabbed sections: Core Platform, Visual Builder, AI, Plugins, Analytics.
- Visual media (screenshots, GIFs).

### 2.4 Templates Page

- Filterable grid with category tags.
- Preview modal → Use Template → Redirect to sign-up/editor.

### 2.5 Marketplace Page

- Searchable plugin/node pack list.
- Cards with ratings, compatibility, and install buttons.
- Policy links: refund policy, dispute resolution, DMCA process.
- Publisher verification badge.

### 2.6 Pricing Page

- Tier cards with feature checklists.
- Monthly/annual toggle.

### 2.7 Docs & Blog

- Docs: Sidebar navigation, markdown rendering, code samples.
- Blog: Tutorials, updates, changelogs.

---

## 3. App Interface (Post-Login)

### 3.1 Main Dashboard

- Top Nav: Logo, bot selector, account menu.
- Bot List: Cards showing name, platform, status, quick actions.
- Create Bot → provisioning modal.

### 3.2 Bot Overview Page

- Status & uptime card.
- Traffic graph.
- Error summary with log links.

### 3.3 Flows Page (Visual Builder)

- Left Sidebar: Node library with color-coded categories.
- Main Canvas: React Flow editor.
- Right Sidebar: Node configuration.
- Top Bar: Save, Test Mode, Version history.

### 3.4 Logs Page

- Searchable event list.
- Expandable entries with variable data.
- Per-tenant log partitioning.

### 3.5 Analytics Page

- Usage stats, execution times, AI usage.
- CSV export.
- Opt-in/opt-out controls for analytics tracking.

### 3.6 Settings Page

- Platform tokens (KMS-encrypted) with rotation UI and last-rotated timestamp.
- Rate limits, alerts.
- Team invites & roles.

---

## 4. Build Timeline (Revised)

**Phase 1 – MVP (Weeks 1–6)**

1. Marketing site skeleton.
2. Sign-up/Login with OAuth.
3. Dashboard with bot list & provisioning.
4. Basic Flow Editor with baseline nodes.
5. Responsive UI foundation.
6. First-run sandbox bot & pre-provisioned templates.

**Phase 2 – Enhanced Builder (Weeks 7–12)** 7. Advanced Nodes (HTTP, AI, If/Else). 8. Logs & Analytics with opt-in controls. 9. Version Control in Editor. 10. Docs site.

**Phase 3 – Expansion & Monetization (Weeks 13–18)** 11. Marketplace Alpha with moderation, refund/dispute/DMCA policies. 12. Pricing tiers & payment integration. 13. Collaboration tools.

**Phase 4 – Optimization (Weeks 19–24)** 14. Discord Integration (excluding voice features). 15. Mobile dashboard. 16. Developer Console with Git integration. 17. Accessibility audits and WCAG compliance verification.

---

## 5. Additional Crucial Elements

### 5.1 User Onboarding Flow

- Interactive editor tutorial.
- Guided template setup.
- Setup progress checklist.

### 5.2 Performance & Scalability

- Managed ECS/App Engine scaling before Kubernetes.
- Load testing and DR drills.
- Database snapshot/restore testing.

### 5.3 Security Measures

- Managed KMS encryption for tokens.
- RBAC enforcement.
- Vulnerability scanning.

### 5.4 Analytics & Feedback

- Feature usage tracking (opt-in).
- NPS surveys.
- Bug reporting linked to logs.

### 5.5 Accessibility Standards

- WCAG 2.1 AA compliance with automated (axe-core) and manual audits.
- Keyboard shortcuts and focus state testing.
- VPAT documentation.

### 5.6 CI/CD Practices

- Automated testing.
- Preview environments.
- Rollback capabilities.

### 5.7 Community & Ecosystem

- Developer portal.
- API documentation.
- Community forum & Discord server.

---

## 6. Monetization Plan

### Pricing Tiers

- **Free Tier**: 1 bot, limited nodes, capped executions.
- **Pro Tier**: Unlimited bots, AI nodes, advanced actions, priority support.
- **Business Tier**: Team collaboration, plugin authoring, admin controls.

### Marketplace Revenue

- Commission on sales of templates and node packs.
- Featured placement fees for plugins.

### Enterprise & Partnerships

- Custom SLAs for large teams.
- White-label solutions.
- Partnerships with bot service providers.

### Long-Term Opportunities

- AI usage-based billing.
- Premium analytics packages.
- Optional in-app advertising for free tier.

---

**Summary:** This updated plan addresses audit findings by introducing persona-based journeys, instant sandbox onboarding, legal and compliance readiness, realistic phasing, security hardening, marketplace governance, and accessibility enforcement.

---

AI Prompt

Immediate Next Steps
Phase 1: Foundation (Weeks 1-4)
Set up database schema with multi-tenant architecture
Add tRPC API layer for type-safe backend communication
Implement authentication with NextAuth.js
Create basic dashboard with bot CRUD operations
Set up Redis for session management
Phase 2: Core Features (Weeks 5-12)
Build visual flow editor with ReactFlow
Implement bot runtime engine for executing flows
Add basic node types (triggers, actions, conditions)
Create webhook handling system
Build template system
Phase 3: Advanced Features (Weeks 13-24)
Plugin SDK development
AI integration nodes
Analytics dashboard
Marketplace functionality
Advanced security features
Would you like me to start implementing any specific part of this architecture? I'd recommend beginning with:

Setting up the database schema
Adding tRPC for API layer
Implementing basic authentication
Creating the dashboard structure
Which area would you like to tackle first?
