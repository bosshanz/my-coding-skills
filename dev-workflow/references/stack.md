# Stack Preferences

## Core Stack

- Prefer Python for APIs, automation, data processing, backend services, and pragmatic tooling.
- Prefer Node for frontend applications, BFF layers, TypeScript-heavy services, and JavaScript ecosystem integrations.
- Prefer Go for high-concurrency services, infrastructure tooling, CLIs, and latency-sensitive backend components.

## Web Development Bias

- Optimize for maintainable web delivery over unnecessary abstraction.
- Reuse established project patterns before adding a new architectural style.
- Keep interfaces explicit: request/response contracts, persistence boundaries, cache usage, and queue responsibilities.

## Middleware Guidance

- Use MySQL or PostgreSQL deliberately.
  - Prefer PostgreSQL for stronger relational features, advanced querying, and complex transactional models.
  - Prefer MySQL when the existing system already standardizes on it or operational simplicity matters more than advanced features.
- Use Redis for caching, ephemeral coordination, rate limiting, and lightweight state with explicit TTL or invalidation strategy.
- Use RocketMQ for asynchronous workflows, retries, delayed processing, and decoupled service communication. Define message contract, idempotency, retry policy, and dead-letter behavior up front.

## Selection Heuristics

- Match the dominant language of the repository first.
- Prefer the simplest design that meets reliability and scalability needs.
- Avoid cross-language splits unless there is a strong operational reason.
- Choose storage and middleware by access pattern, consistency needs, failure mode, and observability requirements.
