# Nexus Bots: Developer-Focused Specifications & Architecture (Post-Audit, Polished Edition)

---

## 1. User Personas & Positioning

To resolve the **no-code vs. developer-centric** gap, three distinct user personas are defined, each with tailored feature access:

- **Creator**: Relies on no-code templates and baseline nodes; minimal configuration.
- **Power User**: Utilizes advanced nodes, platform integrations, and conditional logic.
- **Developer**: Builds custom plugins with the SDK and manages flows through the Git-based Dev Console.

Advanced capabilities (SDK, Git workflows, advanced AI nodes) are gated under an **"Advanced"** toggle or **"Dev Console"** interface.

---

## 2. Plugin SDK Specification

### Purpose

Provide a safe, extensible system for developers to create custom functionality, supported by a capability-based sandbox.

### Architecture

- **Language:** TypeScript (Node.js)
- **Plugin Manifest (Extended):**
  - Unique node `id`
  - Category and icon metadata
  - Input/Output types (JSON Schema with auto-generated TypeScript types)
  - Configuration schema with UI controls
  - Permissions and capabilities (network/FS)
  - Resource quotas (CPU/memory/time)
  - Version compatibility (`engines`, `compat`)
  - Privacy declarations
  - `run()` method (async, stateless)

#### Example Manifest (`plugin.json`)

```json
{
  "name": "discord-games",
  "version": "1.0.0",
  "nodes": ["TriviaNode", "TicTacToeNode"],
  "dependencies": [],
  "platformSupport": ["discord"],
  "permissions": ["http:api.example.com"],
  "capabilities": { "network": true },
  "resources": { "cpuMs": 500, "memoryMb": 128 },
  "compat": { "engines": ">=1.0.0" },
  "privacy": { "sharesUserContent": false }
}
```

### Safety Model

- **Sandbox:** Default isolation; opt-in network/FS via allow-list and proxy.
- **Resource Quotas:** CPU, memory, and execution time limits enforced.
- **Security Review:** Includes static analysis, SBOM generation, and license compliance before marketplace approval.

---

## 3. Git-Based Dev Console Specification

### Purpose

Allow advanced teams to manage bot logic via Git while maintaining integrity and protecting secrets.

### Enhancements

- **Canonical Flow Serialization:** JSON schema v1 with a canonical formatter and migration framework.
- **Merge Conflict Resolution:** Visual conflict resolver.
- **Secrets Management:** References only; pre-commit secret scanning; encrypted `.env` files with KMS decryption in CI.
- **Testing DSL:** `.flowtest.json` extended with fixtures, mock events, and clock control.

---

## 4. Bot Building Blocks: Core Node Library

### Baseline Cross-Platform Nodes (Day 1)

- Trigger (Command, Message)
- Send Text Message
- Set/Get Variable
- HTTP Request
- If/Else Condition
- Delay/Timer
- JSON Parse

### Platform-Specific Extensions

- **Telegram:** Show Keyboard, Wait for Reply, Get User Info, etc.
- **Discord:** On Slash Command, Assign Role, Send Embed (no voice nodes in MVP).

### AI-Powered Nodes (with Safety)

- Prompt library with versioning
- Tenant-level quotas and cost tracking
- Moderation filters to prevent PII egress

---

## 5. Execution Engine (Hardened)

- Deterministic step runner with unique step IDs (exactly-once execution)
- Transactional variable updates
- Per-node timeouts and cancellation tokens
- Compensation hooks for rollback scenarios
- Ingress pipeline with queuing, idempotency store, DLQ, and backoff strategies

---

## 6. Security, Compliance & Observability

### Secrets & Tokens

- Managed KMS (AWS/GCP)
- Envelope encryption with per-tenant vaulting
- Token rotation and last-rotated timestamp display
- Scoped, short-lived tokens for plugins/webhooks

### RBAC

- Subjects: user, team, service
- Resources: bot, flow, plugin, logs
- Actions: read/write/deploy
- Conditions: environment-based rules

### Data Privacy

- PII inventory and retention matrix
- PII redaction in logs
- Configurable retention policies by tier
- GDPR/CCPA compliance workflows

### Observability

- RED/USE metrics
- Per-tenant log partitions
- Structured logging with PII masking
- Sampling on high-traffic paths

---

## 7. Marketplace Governance

- Publisher verification and signed artifacts
- Security review checklist prior to publishing
- License and dependency scans
- Clear refund, dispute, and DMCA policy

---

## 8. Roadmap (Re-Sequenced)

### Phase A (Weeks 1–8)

- Telegram MVP with baseline nodes
- Logging and basic test runner
- Single-region managed hosting (ECS/App Engine)
- Basic audit logs and RBAC

### Phase B (Weeks 9–16)

- Multi-tenant isolation
- Observability enhancements
- Marketplace Alpha with security review

### Phase C (Weeks 17–24)

- Discord (excluding voice features)
- Billing system
- Advanced AI features for paid tiers

---

## 9. Acceptance Criteria Snapshot

- All tokens encrypted with KMS; rotation UI implemented
- Ingress idempotency and DLQ; 99.9% event processing SLO
- Atomic variable updates with per-node timeout support
- Plugin IO validated against JSON Schema
- Test DSL with fixtures integrated into PR checks
- Prompt registry with quotas and safety filters
