# New Packages Structure for Nexus Bots

packages/
├── api/ # tRPC API layer
├── auth/ # Authentication utilities
├── bot-runtime/ # Bot execution engine
├── database/ # Database schemas & migrations
├── plugin-sdk/ # Plugin development SDK
├── flow-engine/ # Visual flow execution logic
├── webhook-handler/ # Webhook processing
├── ai-services/ # AI integration layer
├── templates/ # Bot templates system
├── analytics/ # Usage analytics & monitoring
├── marketplace/ # Plugin marketplace logic
└── security/ # Security utilities & validation

apps/
├── web/ # Main dashboard (Next.js)
├── api-server/ # Backend API server (Express/Fastify)
├── worker/ # Background job processor
├── webhook-service/ # Webhook handling service
└── plugin-runtime/ # Sandboxed plugin execution
