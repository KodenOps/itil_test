"use client";

import React, { useEffect, useRef, useState } from "react";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import thumbnailPic from "../../../../public/images/docker.webp";
import Image from "next/image";
// ─── Types ───────────────────────────────────────────────────────────────────

type TopicLesson = {
  id: string;
  title: string;
  body: string;
  takeaway: string;
  visual?:
    | "diagram-layered"
    | "diagram-cycle"
    | "code-block"
    | "checklist"
    | "table";
  visualData?: Record<string, string[]> | string[] | string | string[][];
  learningPlaylistUrl?: urlObject[];
};
type urlObject = {
  url: string;
  title: string;
};
type Category = {
  id: string;
  title: string;
  description: string;
  accent: string; // Tailwind gradient classes (same as landing page)
  accentHex: string; // raw hex for inline styles / rings
  lessons: TopicLesson[];
  learningPlaylistUrl?: urlObject[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    id: "architecture-system-thinking",
    title: "Architecture & System Thinking",
    description:
      "Shape systems that stay understandable, adaptable, and safe to change as they grow.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "system-boundaries",
        title: "System boundaries",
        body: "A system boundary is the explicit line between what a component owns and what it delegates. Without clear boundaries, change in one area silently breaks another. Good boundaries are defined by data ownership, not by convenience: a service that owns the user record is the only service that writes to it. Every caller must go through a published contract, never a side-channel.\n\nBoundaries also control blast radius. When an upstream dependency fails, a well-drawn boundary makes it possible to degrade gracefully instead of failing completely. Ask yourself for every dependency: 'If this goes away, what do we do?' The answer should be written into the design.",
        takeaway:
          "Draw boundaries around data ownership, not around team convenience.",
        visual: "diagram-layered",
        visualData: {
          "Layer 1 – Public API": [
            "versioned endpoints",
            "auth & rate limit",
            "contract tests",
          ],
          "Layer 2 – Domain": ["business logic", "domain events", "validators"],
          "Layer 3 – Storage": ["single writer rule", "migrations", "backups"],
        },
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/watch?v=8bZh5LMaSmE&list=PL9ooVrP1hQOHUKuqGuiWLQoJ-LD0c3Z2y",
            title: "Intro to System Design",
          },
          {
            url: "https://www.youtube.com/watch?v=8bZh5LMaSmE&list=PL9ooVrP1hQOHUKuqGuiWLQoJ-LD0c3Z2y",
            title: "Advanced System Design",
          },
        ],
      },
      {
        id: "api-design",
        title: "API design",
        body: "APIs are forever. Once clients depend on a field or URL structure, removing it is a breaking change. Start conservative: expose only what callers actually need, use stable nouns for resources, and keep verbs to HTTP semantics. Design for the read path first — most consumers are reading, not writing.\n\nInclude error shapes in the contract from day one. A consistent error envelope (code, message, request ID) lets clients handle failures uniformly without parsing free-form text strings. Version with intent — a path prefix like /v2/ signals to clients that a meaningful break happened, while query-string versioning is easy to overlook.",
        takeaway:
          "Expose the minimum surface, and make errors as explicit as success responses.",
        visual: "code-block",
        visualData: `// Good – stable resource noun, consistent error shape
GET /v1/orders/{id}
→ 200 { id, status, items, created_at }
→ 404 { code: "ORDER_NOT_FOUND", message: "...", request_id: "..." }
→ 422 { code: "VALIDATION_ERROR", fields: [...] }

// Avoid – verb in path, no error contract
GET /v1/getOrderDetails?orderId=123`,
      },
      {
        id: "backward-compatibility",
        title: "Backward compatibility",
        body: "Backward compatibility is a promise to every existing client that they will not need to change when you deploy. The safest approach is additive-only changes: new fields, new endpoints, new enum values. Never rename a field in place — add the new name alongside the old one and deprecate slowly.\n\nThe hardest breaks are semantic, not structural. Changing the meaning of a field (e.g. units from seconds to milliseconds) without changing its name is invisible to parsers but catastrophic at runtime. Semantic breaks must go through a versioned endpoint, full stop.",
        takeaway:
          "Make changes additive. Semantic changes always require a new version.",
        visual: "checklist",
        visualData: [
          "Add fields, never rename in place",
          "Keep old enum values even if deprecated",
          "Serve both v1 and v2 during transition windows",
          "Use deprecation headers before removal",
          "Contract-test against your oldest supported client",
          "Never change field units silently",
        ],
      },
      {
        id: "migrations",
        title: "Migrations",
        body: "Schema migrations are one of the highest-risk moments in a system's life. The pattern that causes the fewest incidents is expand-contract: first add the new shape alongside the old (expand), run both shapes in production until you're confident, then remove the old one (contract). This lets you deploy in small increments and roll back any step without losing data.\n\nMigration scripts should be idempotent — running them twice produces the same result as running them once. Store migration state in a dedicated table so the system always knows exactly which migrations have applied, and run them automatically on deploy rather than by hand.",
        takeaway:
          "Expand-contract keeps migrations reversible. Idempotency keeps them safe to re-run.",
        visual: "diagram-cycle",
        visualData: [
          "Expand schema",
          "Deploy app (reads both)",
          "Backfill data",
          "Deploy app (writes new)",
          "Contract old column",
        ],
      },
      {
        id: "long-term-maintainability",
        title: "Long-term maintainability",
        body: "Maintainability is not about clean code in isolation — it is about how fast a new engineer can safely make a change six months from now. The biggest levers are: obvious naming (code that reads like the domain it models), small functions with a single responsibility, and tests that describe behaviour rather than implementation.\n\nTechnical debt is not inherently bad — taking on debt to ship faster is a valid tradeoff. What kills teams is untracked debt. Keep a visible backlog of known debt items. Each quarter, review what is slowing you down most and schedule time to pay it back before it compounds.",
        takeaway:
          "Measure maintainability by how long it takes a new engineer to make a safe change.",
      },
      {
        id: "reducing-accidental-complexity",
        title: "Reducing accidental complexity",
        body: "Essential complexity is the irreducible difficulty of the problem you are solving. Accidental complexity is the extra difficulty introduced by your tools, abstractions, and decisions. Most codebases are weighed down by accidental complexity: indirection layers added 'for flexibility' that no one ever used, ORMs that generate ten queries when one would do, micro-services split too early.\n\nThe antidote is repeated deletion. Build the simplest thing, ship it, observe how it is used, then refactor toward the patterns that actually emerged. Abstractions earned by observed duplication are stable. Abstractions invented in anticipation usually are not.",
        takeaway:
          "Delete first, abstract second. Abstractions are earned, not invented.",
      },
      {
        id: "knowing-when-not-to-build",
        title: "Knowing when not to build",
        body: "The most underrated engineering skill is the ability to argue that something should not be built at all. Every feature is a permanent maintenance cost. Every integration is a dependency. Every abstraction must be understood by future engineers. The question before any build is: 'Does the value of this outweigh its lifetime cost?'\n\nWhen the answer is unclear, use the simplest possible solution that generates signal — a manual process, a spreadsheet, an off-the-shelf tool — before writing custom code. Custom software makes sense when you have validated that no existing solution fits, and that the problem is core to your business.",
        takeaway:
          "The cheapest system is the one you never build. Validate before you build.",
      },
      {
        id: "layered-architecture",
        title: "Layered architecture",
        body: "Layered architecture separates concerns by responsibility. The classic three layers are: presentation (HTTP handlers, serialization), domain (business rules, entities), and infrastructure (database, queues, third-party APIs). The key rule is that dependencies only point inward — infrastructure depends on domain, never the reverse. This makes the domain independently testable and portable.\n\nCommon pitfalls are fat controllers that leak business logic into the presentation layer, and domain objects that import database types. When you see an import of a DB model inside a business rule function, that is a boundary violation worth fixing.",
        takeaway:
          "Dependencies point inward. Domain code must not import infrastructure.",
      },
      {
        id: "event-driven-patterns",
        title: "Event-driven patterns",
        body: "Event-driven design decouples producers from consumers. When an order is placed, the order service emits an OrderPlaced event. The inventory service, the notification service, and the analytics service all subscribe independently. The producer does not know or care who listens.\n\nThis creates powerful extensibility — you can add a new consumer without touching the producer. The tradeoff is visibility: debugging a chain of events across services is harder than following a synchronous call stack. Invest early in event tracing (correlation IDs, event logs) so you can answer 'What happened to this order?' across the entire chain.",
        takeaway:
          "Events decouple producers from consumers — but invest in tracing from day one.",
      },
      {
        id: "modularity",
        title: "Modularity",
        body: "A modular system is made of components that can be understood, tested, and replaced independently. Modularity is not the same as micro-services — a well-structured monolith with clear internal module boundaries is often more maintainable than a poorly-designed distributed system.\n\nMeasure modularity by coupling (how many other modules must change when you change this one?) and cohesion (do all the parts of this module belong together?). High cohesion and low coupling are what you are aiming for. Refactoring toward modularity is usually safer done by identifying and hardening internal boundaries before splitting into separate processes.",
        takeaway:
          "Modularity is about coupling and cohesion, not deployment topology.",
      },
      {
        id: "design-docs",
        title: "Writing design documents",
        body: "A design document (also called an RFC or tech spec) is written before significant work begins, not after. Its primary audience is not future readers — it is the author. The act of writing forces you to confront gaps in the design, edge cases you had not considered, and assumptions that need validation.\n\nA good design doc is short. It states the problem, the constraints, the options considered, the chosen approach, and the open questions. The open questions section is the most valuable part. If you cannot articulate what you do not yet know, you are not ready to start building.",
        takeaway:
          "Write design docs to find what you do not yet know, not to justify what you have already decided.",
      },
      {
        id: "hexagonal-architecture",
        title: "Hexagonal architecture (ports & adapters)",
        body: "Hexagonal architecture, also called ports and adapters, makes the domain the center of the system and treats all I/O as interchangeable adapters. The domain defines ports — interfaces it needs (e.g. UserRepository, EmailSender). Adapters implement those ports (PostgresUserRepository, SendgridEmailSender).\n\nThe power is in testing: you can run your entire domain test suite with in-memory adapters, no database or network required, in milliseconds. The real adapters are tested in a separate, slower integration suite. This separation keeps the feedback loop tight and the domain logic honest.",
        takeaway:
          "Define ports in the domain, implement adapters outside it. Test the domain with fast in-memory adapters.",
      },
      {
        id: "strangler-fig-pattern",
        title: "Strangler fig pattern",
        body: "When migrating a legacy system, rewriting from scratch carries enormous risk — the 'second system effect' — because the old system accumulated years of edge-case handling that is not in any spec. The strangler fig pattern offers an alternative: route traffic through a facade that initially passes everything to the old system. Incrementally, route specific paths to the new system as each piece is ready. The old system 'strangled' gradually, leaving the new one standing.\n\nThe key discipline is keeping the facade simple and the migrations small. Each migration should be independently deployable and reversible. Do not attempt to migrate business logic at the same time as infrastructure — those are separate strangler steps.",
        takeaway:
          "Migrate incrementally behind a routing facade. Never rewrite and migrate simultaneously.",
      },
      {
        id: "dependency-inversion",
        title: "Dependency inversion",
        body: "Dependency inversion states that high-level modules should not depend on low-level modules; both should depend on abstractions. In practice: your order processing service should depend on a PaymentGateway interface, not on a StripeClient class. The concrete Stripe implementation is injected at startup.\n\nThis has two benefits. First, you can swap implementations without changing business logic (useful when switching vendors or in testing). Second, it makes the dependency explicit and visible — you have to deliberately wire up the concrete class, which is a forcing function for thinking about what dependencies a module actually needs.",
        takeaway:
          "Depend on interfaces, inject implementations. Make dependencies explicit.",
      },
      {
        id: "conways-law",
        title: "Conway's Law",
        body: "Conway's Law observes that systems tend to reflect the communication structure of the organizations that build them. If three teams build a compiler, they will probably produce a three-pass compiler. This is not a bug — it is a predictable pattern you can use intentionally.\n\nThe implication for architecture is the Reverse Conway Maneuver: design the team structure you want, and the architecture will follow. Want a clean boundary between your checkout flow and your inventory management? Make sure one team clearly owns each. Team boundaries become service boundaries. Communication overhead between teams becomes an API contract.",
        takeaway:
          "Team structure shapes system structure. Design your org to match the architecture you want.",
      },
    ],
  },

  {
    id: "scalability-reliability",
    title: "Scalability & Reliability",
    description:
      "Build services that keep working under pressure, recover gracefully, and fail in ways people can understand.",
    accent: "from-[#1F8A70] to-[#2CB67D]",
    accentHex: "#1F8A70",
    lessons: [
      {
        id: "caching-strategy",
        title: "Caching strategy",
        body: "Caching is a deliberate tradeoff: you accept that some reads may return stale data in exchange for lower latency and reduced load on the origin. The right caching strategy depends on your staleness tolerance. A product page can tolerate minutes of staleness; a bank balance cannot tolerate any.\n\nCommon patterns: Cache-aside (application checks cache, misses load from DB and populate cache), Write-through (every write goes to cache and DB simultaneously), and Write-behind (writes go to cache immediately, DB asynchronously). Cache-aside is the safest default because it degrades gracefully when the cache is unavailable.",
        takeaway:
          "Match staleness tolerance to the caching pattern. Cache-aside degrades safest.",
        visual: "diagram-layered",
        visualData: {
          "1. Check cache": [
            "cache hit → return immediately",
            "cache miss → go to step 2",
          ],
          "2. Read from DB": ["fetch record", "populate cache with TTL"],
          "3. On write": ["invalidate or update cache entry", "write to DB"],
        },
      },
      {
        id: "queues",
        title: "Queues and async processing",
        body: "A queue decouples the moment work is requested from the moment it is performed. This matters for reliability (a slow downstream does not block the caller), scalability (workers can be scaled independently), and retries (failed work can be retried without the caller being involved).\n\nKey design decisions: ordering guarantees (FIFO vs. priority), at-least-once vs. exactly-once delivery, visibility timeouts (how long a message is invisible while a worker processes it), and dead-letter queues (where messages go after too many failures). Most managed queues guarantee at-least-once delivery, which means your consumers must be idempotent.",
        takeaway:
          "Queues enable retry and scale — design consumers to handle at-least-once delivery.",
      },
      {
        id: "retries-idempotency",
        title: "Retries and idempotency",
        body: "Retries are necessary because networks and services fail transiently. But naive retries amplify load on an already-struggling system. Use exponential backoff with jitter (randomized delay) so retrying clients do not all hammer a recovering service at the same time.\n\nIdempotency means that performing an operation multiple times produces the same result as performing it once. Idempotent APIs let clients retry safely without fear of duplicating side effects. Implement idempotency with a client-supplied idempotency key stored server-side — if the same key appears again, return the cached result rather than processing again.",
        takeaway:
          "Retry with backoff + jitter. Design endpoints to be idempotent with a stored idempotency key.",
        visual: "code-block",
        visualData: `// Exponential backoff with jitter
async function retryWithBackoff(fn, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try { return await fn(); } catch (err) {
      if (attempt === maxAttempts - 1) throw err;
      const base = Math.min(1000 * 2 ** attempt, 30000);
      const jitter = Math.random() * base * 0.3;
      await sleep(base + jitter);
    }
  }
}`,
      },
      {
        id: "rate-limiting",
        title: "Rate limiting",
        body: "Rate limiting protects services from being overwhelmed by any single client. Common algorithms: Fixed window (count resets every N seconds — simple but allows burst at window boundary), Sliding window (smoother than fixed, counts requests in the trailing N seconds), and Token bucket (clients consume tokens at a rate; tokens refill up to a maximum — allows short bursts while enforcing a sustained rate).\n\nReturn 429 Too Many Requests with a Retry-After header when limiting. Store rate limit state in a shared cache (Redis) rather than in-process, so it works correctly across multiple service instances.",
        takeaway:
          "Token bucket allows bursts while controlling sustained rate. Always return Retry-After.",
      },
      {
        id: "graceful-degradation",
        title: "Graceful degradation",
        body: "A gracefully degrading system continues to provide partial functionality when a dependency fails. An e-commerce site whose recommendation engine is down should still complete purchases — it just shows a 'recommended products' section as empty or with a cached fallback. The user is inconvenienced, not blocked.\n\nImplement degradation with a hierarchy of fallbacks: live data → cached data → default/static response → graceful error message. Use feature flags to disable non-critical features under load. The most important distinction is between features that are essential to the core user action and features that are supplementary — only supplementary ones can be degraded safely.",
        takeaway:
          "Define your core user action. Everything else is a candidate for graceful degradation.",
      },
      {
        id: "failure-mode-analysis",
        title: "Failure mode analysis",
        body: "Failure mode analysis asks: 'What are all the ways this can fail, and what happens in each case?' For each external dependency, map: What happens if it is slow? What happens if it returns errors? What happens if it is completely unavailable? Each answer should translate to a specific handling strategy in the code.\n\nFMEA (Failure Mode and Effects Analysis) in a production context is usually done as a table: component, failure mode, likelihood, impact, current mitigation, recommended mitigation. Teams that do this regularly before launching new systems find far fewer production incidents in the first six months.",
        takeaway:
          "For every dependency, document: slow, erroring, and down failure modes and their handlers.",
        visual: "table",
        visualData: [
          ["Component", "Failure Mode", "Impact", "Mitigation"],
          [
            "Payment API",
            "Slow (>2s)",
            "Checkout timeout",
            "500ms timeout + retry",
          ],
          [
            "Payment API",
            "5xx errors",
            "Failed orders",
            "Retry 3× with backoff",
          ],
          ["Payment API", "Down", "No purchases", "Circuit breaker + alert"],
          ["Database", "High latency", "Slow pages", "Read replica + cache"],
          [
            "Database",
            "Down",
            "Complete outage",
            "Read from cache, queue writes",
          ],
        ],
      },
      {
        id: "rollback-planning",
        title: "Rollback planning",
        body: "Every deploy should have an explicit rollback plan before it ships. Rollback is not a failure — it is a designed recovery path. The rollback plan answers: what do we do if this deploy causes elevated errors in the first 15 minutes? Who decides to roll back, and what is the expected time to complete?\n\nDatabase migrations are the hardest part of rollback planning because schema changes may not be reversible. This is why expand-contract migrations are essential — they ensure the old code version can run against the new schema. Test rollback in staging, not production.",
        takeaway:
          "Define the rollback plan before the deploy, not after the incident.",
      },
      {
        id: "circuit-breakers",
        title: "Circuit breakers",
        body: "A circuit breaker wraps calls to a dependency and tracks failure rate. When failures exceed a threshold, the breaker trips to 'open' state — subsequent calls fail immediately without hitting the dependency, giving it time to recover. After a configured duration, the breaker moves to 'half-open' and allows a probe request. If that succeeds, the breaker closes; if it fails, it opens again.\n\nCircuit breakers prevent cascade failures: if service A depends on service B, and B is struggling, A's circuit breaker stops A from adding more load to B while also protecting A's own resources from being exhausted waiting for B.",
        takeaway:
          "Circuit breakers protect both caller and callee. Tune thresholds per dependency, not globally.",
        visual: "diagram-cycle",
        visualData: [
          "Closed (normal)",
          "Failure threshold exceeded",
          "Open (fail fast)",
          "After timeout → Half-open",
          "Probe succeeds → Closed",
        ],
      },
      {
        id: "load-shedding",
        title: "Load shedding",
        body: "Load shedding is the deliberate rejection of excess requests to protect a service's ability to serve its most important traffic. When a service is at capacity, it is better to reject 30% of requests quickly (503 with Retry-After) than to accept all of them and serve 100% slowly or incorrectly.\n\nPrioritize which traffic to shed: background jobs and batch operations before interactive requests, anonymous users before authenticated ones, read traffic before write traffic in some domains. Implement shedding at the ingress layer so the shed load never reaches your application servers.",
        takeaway:
          "Shed low-priority traffic early and fast. Protect your most critical user actions.",
      },
      {
        id: "horizontal-vs-vertical-scaling",
        title: "Horizontal vs vertical scaling",
        body: "Vertical scaling means giving a single machine more resources (bigger CPU, more RAM). It is simple to implement and often the right first move — there is no complexity overhead. Its ceiling is the largest available instance type, and it creates a single point of failure.\n\nHorizontal scaling means adding more machines behind a load balancer. It has a higher complexity overhead — you must handle distributed state, session stickiness, and deployment coordination — but it is theoretically unbounded and naturally fault-tolerant. Before scaling horizontally, ensure your application is stateless: no local memory that differs between instances, no local file writes that are not shared.",
        takeaway:
          "Scale vertically first. Go horizontal when you need fault tolerance or exceed vertical limits.",
      },
      {
        id: "slo-sla-sli",
        title: "SLOs, SLAs, and SLIs",
        body: "An SLI (Service Level Indicator) is a specific measurement: 'the fraction of requests served in under 200ms.' An SLO (Service Level Objective) is the target: 'SLI must be ≥ 99.5% over a rolling 28-day window.' An SLA (Service Level Agreement) is the contractual commitment with consequences: 'If SLO is missed, customers receive credit.'\n\nSLOs are the most important of the three for engineering teams. They define what 'reliable enough' means for your service, create an error budget that teams can spend on risk (deploys, experiments) or must protect, and provide a rational basis for reliability investment decisions.",
        takeaway:
          "Set SLOs before incidents happen. The error budget tells you how much risk you can take.",
      },
      {
        id: "capacity-planning",
        title: "Capacity planning",
        body: "Capacity planning answers: 'How much traffic can we handle today, and when will we need more?' Start with baseline measurements: what is the resource utilization (CPU, memory, DB connections) at current peak? Then model growth: if traffic grows 20% per month, when does utilization hit 70%? (70% is the target ceiling — headroom for traffic spikes.)\n\nCapacity planning should happen quarterly, not reactively. Use load testing to validate your model — synthetic traffic generators can simulate peak load in staging before it arrives in production.",
        takeaway:
          "Plan capacity before you need it. Keep utilization below 70% to absorb spikes.",
      },
      {
        id: "dependency-handling",
        title: "Dependency handling",
        body: "Every external dependency is a liability. Third-party APIs change, go down, rate-limit you, or are deprecated. The strategies that reduce this risk: wrap every dependency behind an interface you own (so you can swap it); pin dependency versions explicitly and upgrade deliberately; monitor dependency response times and error rates as first-class metrics; and have a documented offline-mode or fallback for every critical dependency.\n\nFor vendor dependencies, read the SLA carefully. A vendor with a 99.9% SLA is allowed to be down 8.7 hours per year. If your own SLO is tighter than your vendor's SLA, you need a mitigation strategy.",
        takeaway:
          "Wrap dependencies behind your own interface. Monitor and plan fallbacks for every one.",
      },
      {
        id: "bulkhead-pattern",
        title: "Bulkhead pattern",
        body: "The bulkhead pattern, borrowed from ship design, isolates resources (thread pools, connection pools, memory) by concern so that a failure in one area does not exhaust shared resources and bring down everything else. If your application uses one shared thread pool for all outbound calls, a slow dependency can fill all threads and starve unrelated, healthy paths.\n\nImplement bulkheads by assigning separate resource pools to separate concerns: one connection pool for the primary database, another for the analytics database, a dedicated thread pool for payment gateway calls. Size each pool based on the expected concurrency for that concern, not on a global average.",
        takeaway:
          "Separate resource pools by concern. Slow dependencies should not starve healthy paths.",
      },
      {
        id: "chaos-engineering",
        title: "Chaos engineering",
        body: "Chaos engineering is the practice of deliberately injecting failures into a system to verify that it behaves as designed under adverse conditions. The discipline was popularized by Netflix's Chaos Monkey, which randomly terminated EC2 instances in production.\n\nStart with a hypothesis: 'If service B becomes unavailable, service A will degrade gracefully and user-facing error rates will stay below 1%.' Then inject the failure (in staging, or in a blast-radius-controlled production experiment) and measure. If the hypothesis is confirmed, you have evidence-based confidence in your design. If not, you have found a real gap before a real incident did.",
        takeaway:
          "Chaos engineering converts reliability assumptions into verified facts. Start in staging.",
      },
    ],
  },

  {
    id: "data-backend-fundamentals",
    title: "Data & Backend Fundamentals",
    description:
      "Understand storage and query choices that determine correctness, performance, and evolvability.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    accentHex: "#6D2E46",
    lessons: [
      {
        id: "data-modeling",
        title: "Data modeling",
        body: "Data modeling is the process of deciding how information is structured in storage. A good model reflects the domain — tables and relationships that map naturally to the real-world concepts your system handles. A model that fights the domain (e.g. storing structured data as JSON blobs to 'be flexible') creates correctness problems and makes queries expensive.\n\nNormalization reduces data duplication and update anomalies. In an OLTP (transactional) database, start normalized (3NF) and denormalize deliberately for performance, not by default. In an OLAP (analytical) database, denormalization is often appropriate to optimize read performance across large scans.",
        takeaway:
          "Model the domain, not the convenience. Normalize first, denormalize with evidence.",
      },
      {
        id: "indexing",
        title: "Indexing",
        body: "An index is a separate data structure (usually a B-tree) that lets the database find rows matching a condition without scanning the entire table. Every index speeds reads and slows writes — the database must update the index on every insert, update, or delete. The art of indexing is choosing the right columns for the queries that matter most.\n\nComposite indexes (multiple columns) are powerful but order-sensitive: an index on (user_id, created_at) is useful for 'all orders for user X, sorted by date' but not for 'all orders from a specific date regardless of user.' Check slow query logs regularly — they tell you exactly which queries are causing full table scans.",
        takeaway:
          "Index for your actual query patterns. Composite index column order matters.",
        visual: "code-block",
        visualData: `-- Check which indexes a query uses
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE user_id = 123 
ORDER BY created_at DESC;

-- Composite index: supports (user_id), (user_id + created_at)
-- Does NOT efficiently support (created_at) alone
CREATE INDEX idx_orders_user_date 
ON orders(user_id, created_at);`,
      },
      {
        id: "transaction-behavior",
        title: "Transaction behavior",
        body: "Transactions provide ACID guarantees: Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions behave as if sequential), Durability (committed data survives crashes). Understanding what isolation level your database provides by default is critical — many databases default to READ COMMITTED, which prevents dirty reads but allows non-repeatable reads and phantom rows.\n\nHigher isolation levels (REPEATABLE READ, SERIALIZABLE) prevent more anomalies but increase contention and lock wait time. Most applications need READ COMMITTED for regular reads and SERIALIZABLE only for financial operations or inventory deduction where double-spend is catastrophic.",
        takeaway:
          "Know your database's default isolation level. Use SERIALIZABLE only where double-spend is a real risk.",
      },
      {
        id: "read-write-scaling",
        title: "Read/write scaling",
        body: "Most applications read far more than they write. The first scaling move for a database-bound service is read replicas: a primary that accepts writes, with one or more replicas that serve reads. Replication lag means replicas are slightly behind — design your application to tolerate this (do not read your own write from a replica in the same request).\n\nFor write scaling, sharding partitions data across multiple databases by a shard key (e.g. user_id % 4). This dramatically increases write throughput but adds complexity: cross-shard queries become expensive, migrations must respect shard boundaries, and the shard key choice is difficult to change later.",
        takeaway:
          "Read replicas are safe and easy. Sharding is a last resort — choose the shard key carefully.",
      },
      {
        id: "schema-evolution",
        title: "Schema evolution",
        body: "Schemas change as requirements change. The challenge is that the old schema and old code must continue to work while the new schema and new code are being deployed. The expand-contract pattern applied to schemas: first add the new column (nullable, with a default), deploy the code that writes to both old and new columns, backfill existing rows, then make the column non-nullable, then finally drop the old column.\n\nMigration tooling (Flyway, Liquibase, Alembic) tracks which migrations have run in a dedicated schema version table. Always run migrations before deploying new application code — the new code may depend on the new schema, but the new schema should be compatible with the old code.",
        takeaway:
          "Migrate schema before code. Keep migrations additive until backfill is complete.",
      },
      {
        id: "backup-restore",
        title: "Backup and restore",
        body: "A backup you have never restored is an assumption, not a backup. Test restores regularly — monthly at minimum, weekly for critical systems. Know your RTO (Recovery Time Objective: how long can we be down?) and RPO (Recovery Point Objective: how much data can we lose?) before an incident, because those targets determine your backup frequency and restoration procedure.\n\nCombine full backups with point-in-time recovery (PITR) using WAL (write-ahead log) archiving. Full backups are expensive to restore from; PITR lets you restore to any moment between full backups. Store backups in a separate region from your primary data — a regional outage should not destroy both.",
        takeaway:
          "Test restores regularly. Know your RTO and RPO. Keep backups in a separate region.",
      },
      {
        id: "correctness-bad-data",
        title: "Correctness under bad data",
        body: "Production data is always messier than development data. Users provide incorrect formats, duplicates appear, partial writes happen. Defensive backend design means validating inputs early (at the API boundary), using database constraints as a second line of defense (NOT NULL, UNIQUE, CHECK constraints), and writing code that handles nulls, empty arrays, and unexpected values without panicking.\n\nNever trust that an upstream service has validated the data it sends you. Validate at every boundary. Log validation failures with enough context to trace the source. When data is invalid, fail loudly with a clear error rather than silently writing corrupt state.",
        takeaway:
          "Validate at every boundary. Database constraints are your last line of defense.",
      },
      {
        id: "connection-pooling",
        title: "Connection pooling",
        body: "Opening a new database connection is expensive — it involves a TCP handshake, authentication, and session setup. Connection pools maintain a set of pre-opened connections and lend them to application threads for the duration of a query. Without pooling, a service handling 1,000 concurrent requests would attempt to open 1,000 simultaneous connections, which quickly overwhelms the database.\n\nPool sizing is non-trivial: too small and requests queue waiting for a connection; too large and the database is overwhelmed. The formula (2 × core_count + spindle_count) is a useful starting point. Monitor pool wait time as a metric — growing wait time signals either pool exhaustion or slow queries.",
        takeaway:
          "Pool connections; never open one per request. Monitor pool wait time.",
      },
      {
        id: "query-optimization",
        title: "Query optimization",
        body: "Start optimization with EXPLAIN (or EXPLAIN ANALYZE in PostgreSQL) to understand what the database actually does with a query. Look for Seq Scan (full table scan — often a missing index), high row estimates that differ wildly from actual rows (stale statistics — run ANALYZE), and Sort operations that could be eliminated by an index.\n\nThe most common optimizations: adding the right index, rewriting subqueries as joins (subqueries can prevent index use), moving filtering before joining (filter early to reduce rows), and selecting only needed columns instead of SELECT *.",
        takeaway:
          "EXPLAIN before optimizing. Index, filter early, and avoid SELECT * in hot paths.",
      },
      {
        id: "nosql-choices",
        title: "NoSQL choices",
        body: "NoSQL is not a single thing — it is a family of tradeoffs. Document stores (MongoDB, Firestore) fit flexible, nested objects well but make cross-document transactions difficult. Key-value stores (Redis, DynamoDB) offer extremely low latency for known-key lookups but struggle with range queries or complex filtering. Column-family stores (Cassandra, Bigtable) excel at time-series and high-write workloads but require careful data modeling around known access patterns.\n\nChoose NoSQL when a specific access pattern makes a relational model genuinely awkward or when scale requirements exceed what a single relational database can handle. Do not choose NoSQL to avoid learning SQL — the tradeoffs are real and switching later is painful.",
        takeaway:
          "Choose NoSQL for a specific access pattern advantage, not to avoid SQL.",
      },
      {
        id: "database-transactions-distributed",
        title: "Distributed transactions",
        body: "In a single database, transactions are cheap and reliable. Across multiple databases or services, coordinating a transaction becomes dramatically harder. Two-phase commit (2PC) achieves strong consistency but requires all participants to be available and introduces blocking locks.\n\nThe practical alternative in most microservice architectures is the Saga pattern: break the operation into a sequence of local transactions, each of which publishes an event triggering the next step. If a step fails, compensating transactions undo previous steps. Sagas are eventually consistent and more complex to reason about, but far more resilient to partial failures than 2PC.",
        takeaway:
          "Prefer Sagas over 2PC for cross-service transactions. Design compensating actions from the start.",
      },
      {
        id: "data-pipelines",
        title: "Data pipelines",
        body: "A data pipeline moves and transforms data from one system to another — from operational databases to data warehouses, from raw event streams to aggregated tables. ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform — transforming in the warehouse) are the two main patterns. ELT has become dominant because modern warehouses are cheap to compute in, and loading raw data first preserves optionality for future transformations.\n\nReliable pipelines need idempotent processing (so reruns do not duplicate data), monitoring on row counts and data freshness, and alerts when source schemas change. Schema changes in source systems are the most common cause of silent data quality failures in pipelines.",
        takeaway:
          "Load raw data first (ELT). Monitor row counts, freshness, and source schema changes.",
      },
      {
        id: "cdc-change-data-capture",
        title: "Change data capture (CDC)",
        body: "Change Data Capture reads the database's own change log (the WAL in PostgreSQL, the binlog in MySQL) to capture every insert, update, and delete as an event stream. Unlike polling-based sync, CDC is low-latency (sub-second) and does not add query load to the source database.\n\nCDC powers use cases like: real-time search index updates (Elasticsearch sync), cache invalidation, audit logging, and streaming analytics. Tools like Debezium make CDC relatively straightforward to set up. The main operational concern is keeping up with the change log — a slow consumer can cause the log to grow and eventually be truncated.",
        takeaway:
          "CDC gives low-latency, low-impact change streaming. Keep consumers fast to avoid log pressure.",
      },
      {
        id: "eventual-consistency",
        title: "Eventual consistency",
        body: "Eventual consistency means that if no new updates are made to a piece of data, all reads will eventually return the same value. The key word is 'eventually' — in the interim, different nodes or caches may return different values. Most distributed systems are eventually consistent in some parts because strong consistency requires coordination, which increases latency and reduces availability.\n\nWhen designing with eventual consistency: make convergence time visible to stakeholders (not 'eventually' but 'typically within 100ms'), design UIs that handle stale reads gracefully (optimistic updates, loading indicators), and identify which operations genuinely require strong consistency and ensure those paths have it.",
        takeaway:
          "Know which operations need strong consistency. For the rest, quantify 'eventually.'",
      },
      {
        id: "database-observability",
        title: "Database observability",
        body: "The metrics that matter most for a relational database: query latency (p50, p95, p99), slow query count, active connections, connection pool wait time, replication lag (if using replicas), and table/index size growth. Set alerts on p99 latency, not p50 — the slowest queries are what users experience during load.\n\nEnable slow query logging with a threshold that catches queries taking longer than your SLO allows (e.g. 500ms). Review the slow query log weekly. Most performance regressions appear in the slow query log days before they become user-visible incidents.",
        takeaway:
          "Alert on p99 latency. Review slow query logs weekly before incidents find you.",
      },
    ],
  },

  {
    id: "execution-influence",
    title: "Execution & Influence",
    description:
      "Turn technical judgment into alignment by documenting decisions, exposing tradeoffs, and helping others move faster.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "writing-design-docs",
        title: "Writing design documents",
        body: "A design document is a thinking tool first and a communication tool second. Write it before you have all the answers, not after. The best design docs surface open questions, list considered alternatives with their tradeoffs, and explain why the chosen approach is better — not just what it is.\n\nKeep design docs short. If a doc cannot be read in 15 minutes, it will not be read carefully. Use headers: Problem, Constraints, Options Considered, Recommended Approach, Open Questions. The Open Questions section is what separates a useful doc from a post-hoc rationalization.",
        takeaway:
          "Write design docs to discover gaps, not to justify decisions already made.",
      },
      {
        id: "explaining-tradeoffs",
        title: "Explaining tradeoffs simply",
        body: "Every engineering decision involves tradeoffs. The skill is surfacing them in terms non-engineers care about: risk, cost, time, and user experience — not technical implementation details. 'This approach is faster to build but harder to change later' is more useful to a product manager than 'this approach uses a monolithic architecture instead of microservices.'\n\nThe best format for communicating tradeoffs is a comparison table with the evaluation criteria explicit. This prevents the conversation from being about which option you personally prefer and makes it about which option scores better on the criteria the team has agreed matter.",
        takeaway:
          "Translate tradeoffs into business terms: time, cost, risk, user impact.",
      },
      {
        id: "getting-alignment",
        title: "Getting alignment",
        body: "Alignment does not mean everyone agrees — it means everyone understands the decision and has had a genuine opportunity to raise concerns. The disagree-and-commit model is healthy: after concerns are heard and considered, the team moves forward even if some members would have made a different call.\n\nAlignment breaks down when decisions happen in small groups and are communicated as done deals, when concerns are dismissed rather than addressed, or when the 'why' behind a decision is never shared. Proactive communication — posting a decision and its rationale before it is final, giving stakeholders a window to respond — builds alignment more reliably than meetings.",
        takeaway:
          "Alignment is 'understood and heard,' not 'unanimous.' Communicate decisions before they're final.",
      },
      {
        id: "code-review",
        title: "Reviewing code well",
        body: "A good code review improves the code and the author. The most impactful reviews catch correctness issues, not style preferences. Style disputes belong in a linter, not in review comments. Focus on: does this handle edge cases correctly? Is the error handling appropriate? Is there a simpler approach? Will this be easy to change later?\n\nLabel the severity of your comments: blocking (must fix before merge), suggested (recommended change with rationale), and optional (take it or leave it). Authors should not have to guess whether a comment is a blocker. Approve code that is good enough even if you would have written it differently.",
        takeaway:
          "Label comment severity. Focus on correctness and edge cases, not style.",
      },
      {
        id: "mentoring-juniors",
        title: "Mentoring juniors",
        body: "Effective mentoring transfers judgment, not just knowledge. Knowledge (what a B-tree index is) can be Googled; judgment (when to add an index and when not to) comes from seeing patterns across many decisions. Create opportunities for juniors to make decisions — with a safety net — rather than making all decisions for them.\n\nGive feedback on thinking process, not just output. 'Walk me through how you decided on this approach' reveals more about gaps than reviewing the resulting code. When a junior's approach is wrong, ask questions that lead them to discover the issue rather than telling them the answer directly — the discovery sticks longer.",
        takeaway:
          "Teach judgment by creating safe decisions, not by giving all the answers.",
      },
      {
        id: "unblocking-peers",
        title: "Unblocking peers",
        body: "Being good at unblocking others is a force multiplier — one hour of your time can unlock a week of someone else's work. The first step is recognizing blockers before they are escalated: in standups, look for 'waiting on' or 'need input from' as early signals.\n\nWhen someone is blocked, distinguish between blockers you can resolve directly (answering a question, making a decision, writing a code review) and blockers you need to route to someone else. Routing clearly — 'you need to talk to X, tell them Y, and ask for Z' — is almost as valuable as resolving directly.",
        takeaway:
          "Spot blockers early in standups. Resolve directly or route with clear instructions.",
      },
      {
        id: "making-risks-visible",
        title: "Making hidden risks visible",
        body: "Hidden risks are the ones that cause incidents. Visible risks can be mitigated, tracked, or accepted consciously. The habit of making risks visible is more valuable than the habit of eliminating risks — you cannot eliminate what you do not see.\n\nUse concrete language: 'This migration has no rollback path' is actionable; 'this is a bit risky' is not. Document risks in the places where decisions are made: design docs, PR descriptions, sprint planning items. When you notice a risk and say nothing, you are implicitly accepting it on behalf of the whole team.",
        takeaway:
          "Name risks concretely, in the places where decisions happen.",
      },
      {
        id: "technical-roadmap",
        title: "Technical roadmap",
        body: "A technical roadmap communicates what the engineering organization will work on, why, and in what sequence. Unlike a product roadmap, it includes work that users do not directly experience: platform improvements, debt repayment, reliability investments, developer experience. Without a technical roadmap, this work is invisible to leadership and consistently deprioritized.\n\nA good technical roadmap is honest about sequencing: some things cannot be done until other things are done first. Make dependencies explicit. Quarterly updates are usually right — frequent enough to stay relevant, infrequent enough to avoid spending more time planning than building.",
        takeaway:
          "Make technical work visible via a roadmap. Show sequencing and dependencies.",
      },
      {
        id: "incident-communication",
        title: "Incident communication",
        body: "During an incident, communicate early and often, even when you do not have full information. 'We are investigating elevated error rates, no ETA yet' is better than silence. Update every 15-30 minutes. When the incident is resolved, post a brief summary of impact and what was done — this closes the loop for stakeholders who were waiting.\n\nUse a consistent communication channel (a dedicated Slack channel or status page) so stakeholders know where to look. Separate the 'what is happening' channel (stakeholders) from the 'how are we fixing it' channel (responders) to avoid information overload on both sides.",
        takeaway:
          "Communicate early with incomplete information. Update every 15-30 minutes.",
      },
      {
        id: "postmortems",
        title: "Writing postmortems",
        body: "A blameless postmortem answers: what happened, why it happened, what we did to recover, and what we will do to prevent recurrence. Blameless means the focus is on system failures, not on the actions of individuals — individuals acted rationally given the information and tools they had at the time.\n\nThe most important section is action items, because without them a postmortem is an explanation, not a commitment. Every action item should have a single owner and a due date. Track completion the same way you track engineering work — in your project tracker, in sprint planning, with status updates.",
        takeaway:
          "Postmortems without action items are just stories. Assign owners and due dates.",
      },
      {
        id: "stakeholder-updates",
        title: "Stakeholder updates",
        body: "Regular stakeholder updates reduce anxiety, build trust, and prevent engineering decisions from being made without engineering input. The best cadence is weekly for active projects, monthly for ongoing platform work. Keep updates short: what was accomplished, what is next, what decisions or input are needed.\n\nThe 'decisions or input needed' section is the most important — it turns updates from one-way broadcasts into collaborative conversations. Frame asks specifically: 'We need a decision on whether to delay launch by one week to complete load testing. Risk if we do not: we may not meet our reliability SLO on day one.'",
        takeaway:
          "End every update with a specific ask. Updates without asks are broadcasts.",
      },
      {
        id: "technical-debt-communication",
        title: "Communicating technical debt",
        body: "Technical debt is invisible to everyone who does not write code. Communicating it effectively requires translation: not 'we have a lot of legacy code' but 'our deployment time has grown to 45 minutes, which means we deploy less often and bugs stay in production longer.' Concrete, measurable impact lands where abstract descriptions do not.\n\nFrame debt reduction as investment, not maintenance. 'If we spend three weeks on X, deploy time drops to 5 minutes and we reduce incident frequency by ~30%' is a proposal leadership can evaluate against alternatives.",
        takeaway:
          "Translate debt into measured impact: time, error rates, developer velocity.",
      },
      {
        id: "on-call-handoff",
        title: "On-call handoff",
        body: "A clean on-call handoff ensures the incoming responder knows the current state of production: active incidents, elevated alerts, recent deploys, and anything that was 'almost a problem' but stabilized. Without a structured handoff, the incoming engineer discovers context reactively, usually during an incident.\n\nUse a standard handoff template: active alerts and their status, recent deploys in the last 24 hours, ongoing investigations not yet resolved, and any known toil or flakiness that needs attention. The outgoing engineer writes it; the incoming engineer reads it before the handoff is complete.",
        takeaway:
          "Handoff is a document, not a verbal summary. Write it; do not narrate it.",
      },
      {
        id: "estimation",
        title: "Engineering estimation",
        body: "Estimation is not about predicting the future precisely — it is about giving decision-makers enough information to plan. A wide range with explicit uncertainty ('2-4 weeks, depending on whether the API turns out to have the endpoints we expect') is more useful than false precision ('10 days').\n\nBreak work down before estimating. Estimates on poorly understood tasks are not estimates — they are guesses. If you cannot break a task into sub-tasks of a few days each, the task is not well-understood enough to estimate. Spend time clarifying before committing to a number.",
        takeaway:
          "Break down before estimating. Communicate uncertainty explicitly — wide ranges beat false precision.",
      },
      {
        id: "feedback-culture",
        title: "Feedback culture",
        body: "A team with a strong feedback culture surfaces problems earlier and learns faster. Feedback is most effective when it is specific (not 'you communicate poorly' but 'in yesterday's meeting you made a technical decision before hearing from the backend team, which meant we had to revisit it'), timely (close to the event), and focused on behaviour rather than character.\n\nReceiving feedback well is as much a skill as giving it. The response that builds a feedback culture is 'thank you, let me think about that' rather than a defensive explanation. Leaders who respond to feedback with curiosity create teams that give feedback freely.",
        takeaway:
          "Specific and timely beats vague and delayed. Respond to feedback with curiosity.",
      },
    ],
  },

  {
    id: "operations-production-sense",
    title: "Operations & Production Sense",
    description:
      "Make systems observable, supportable, and calmer to run in production every day.",
    accent: "from-[#F97316] to-[#F59E0B]",
    accentHex: "#F97316",
    lessons: [
      {
        id: "logging",
        title: "Logging",
        body: "Good logs are written for the engineer debugging at 2am, not for the engineer writing the code. Every log line should answer: what happened, in what context (user ID, request ID, trace ID), and what was the result. Log at the right level: DEBUG for development details, INFO for key business events (order placed, payment processed), WARN for recoverable issues, ERROR for failures requiring attention.\n\nStructured logging (JSON lines) is preferred over free-text strings because log aggregation platforms can filter, aggregate, and alert on structured fields without text parsing. Always include a correlation ID that links logs across services for the same request.",
        takeaway:
          "Log for the 2am debugger. Use structured logging with correlation IDs.",
        visual: "code-block",
        visualData: `// Structured log — queryable, correlatable
logger.info("order.placed", {
  orderId: "ord_123",
  userId: "usr_456",
  total: 4999,
  requestId: ctx.requestId,
  traceId: ctx.traceId,
});

// Avoid — unstructured, unsearchable
console.log(\`Order \${id} placed for user \${uid}\`);`,
      },
      {
        id: "monitoring",
        title: "Monitoring",
        body: "Monitoring tells you what your system is doing right now. The four golden signals (from the Google SRE book) are: Latency (how long requests take), Traffic (how many requests per second), Errors (what fraction of requests fail), and Saturation (how full your resources are — CPU, memory, DB connections). Dashboards built around these four signals answer the question 'is the system healthy?' for any service.\n\nAvoid dashboard sprawl — a dashboard with 50 panels provides less clarity than one with 6. Start with the four golden signals plus your most business-critical metrics, and add panels only when an incident reveals a gap.",
        takeaway:
          "Build dashboards around the four golden signals first, then add only what incidents reveal.",
      },
      {
        id: "tracing",
        title: "Distributed tracing",
        body: "In a distributed system, a single user request may touch 10 services. A trace represents the full journey of that request, with each service's work as a 'span' within the trace. When a request is slow or fails, distributed tracing lets you see exactly which service and which operation is responsible — something logs alone cannot answer.\n\nImplement tracing by propagating a trace context (W3C TraceContext headers) across all service calls. OpenTelemetry is the standard SDK for instrumentation across languages. Even basic automatic instrumentation (HTTP calls, database queries) provides most of the value with minimal code change.",
        takeaway:
          "Propagate trace context across all service calls. OpenTelemetry is the standard.",
      },
      {
        id: "alert-quality",
        title: "Alert quality",
        body: "An alert should be actionable: it fires when a human needs to do something, and is silent otherwise. Alerts that fire and require no action train engineers to ignore alerts — including real ones. Every alert should have a clear title, a description of why it fired, a link to the relevant dashboard, and a link to a runbook that describes what to do.\n\nAlert on symptoms (elevated error rate, slow p99) rather than causes (high CPU). Users experience symptoms, not causes. Cause-based alerts fire too early and too often. Symptom-based alerts fire when something a user would notice is wrong.",
        takeaway:
          "Every alert must be actionable and link to a runbook. Alert on symptoms, not causes.",
      },
      {
        id: "incident-response",
        title: "Incident response",
        body: "A well-run incident has clear roles: an Incident Commander (IC) who owns coordination and communication, and one or more engineers who investigate and remediate. The IC's job is to keep the responders focused, manage stakeholder communication, and make the call to escalate or roll back — not to investigate themselves.\n\nThe first priority in any incident is customer impact mitigation — not root cause analysis. Roll back the suspect deploy, failover to a replica, enable a feature flag to disable the broken feature — whatever stops the bleeding fastest. Root cause analysis comes after the service is restored.",
        takeaway:
          "Mitigate impact first, diagnose second. The IC manages communication, not investigation.",
      },
      {
        id: "runbooks",
        title: "Runbooks",
        body: "A runbook is a step-by-step guide for a specific operational scenario — what to do when alert X fires, how to scale up service Y, how to roll back deploy Z. Runbooks are most valuable written well before an incident, when there is time to think clearly. Updated runbooks are worth far more than accurate ones that are six months stale.\n\nA good runbook is short enough to follow under stress. If it is longer than one scrollable page, it is too long for incident response — break it into smaller, specific scenarios. Link runbooks directly from alert definitions so engineers can find them in seconds, not minutes.",
        takeaway:
          "Link runbooks from alerts. Short and current beats long and comprehensive.",
      },
      {
        id: "postmortem-process",
        title: "Postmortem process",
        body: "Run a postmortem for every incident that required customer-facing communication or paged an engineer outside business hours. The postmortem should happen within 48 hours of resolution, while context is fresh. Assign a facilitator (distinct from the IC) who keeps the conversation blameless and focused on systemic factors.\n\nThe five-whys technique iterates from symptom to root cause: 'The service went down because the deployment failed. Why? The health check timed out. Why? The new endpoint queried a table without an index. Why? The migration was not included in the deploy. Why? The migration checklist was not followed.' Each 'why' is a layer of the system that could be improved.",
        takeaway:
          "Run postmortems within 48 hours. Use five-whys to reach systemic causes.",
      },
      {
        id: "on-call-health",
        title: "On-call health",
        body: "On-call work that regularly pages engineers at night or interrupts focus time is a retention risk and a reliability risk — exhausted engineers make more mistakes. Measure on-call load: pages per week, out-of-hours pages, time-to-mitigate. If the numbers are high, the solution is systemic (fewer alerts, more automation, better runbooks), not asking engineers to tolerate more.\n\nRotations should be sized so that no engineer is on-call more than once every four to six weeks for primary on-call. Set explicit off-call hours after a night page — an engineer who responded to an incident at 3am should not be expected to be fully productive at 9am.",
        takeaway:
          "Measure on-call load. Fix systemic causes, not human tolerance.",
      },
      {
        id: "feature-flags",
        title: "Feature flags",
        body: "Feature flags separate deployment from release. Code can be deployed to production but inactive until a flag is enabled. This makes deployments safer (revert a bad feature without a code rollback), enables gradual rollouts (enable for 1%, then 10%, then 100% of users), and decouples engineering deploys from product launch timing.\n\nKeep flag lifecycles short. A flag that has been on for 100% of users for three months is dead code that should be removed. Accumulating flags adds cognitive overhead and testing surface area. Assign every flag a review date when it is created.",
        takeaway:
          "Flags decouple deploy from release. Assign review dates and remove old flags aggressively.",
      },
      {
        id: "deployment-strategies",
        title: "Deployment strategies",
        body: "Blue-green deployment runs two identical environments (blue = current, green = new). Traffic is switched from blue to green atomically. Rollback is instant — switch back to blue. The cost is running two full environments simultaneously.\n\nCanary deployment routes a small percentage of traffic to the new version. Metrics are compared between the canary and the stable version. If the canary is healthy, the rollout percentage increases. If not, traffic is pulled back with minimal impact. Canary deployments catch regressions with much less blast radius than blue-green.",
        takeaway:
          "Canary is safer for catching regressions; blue-green is simpler to operate. Choose based on your risk profile.",
      },
      {
        id: "observability-vs-monitoring",
        title: "Observability vs monitoring",
        body: "Monitoring answers predefined questions: 'Is error rate above 1%?' Observability lets you answer arbitrary questions about a system's internal state from its external outputs, without deploying new code. The difference matters when debugging novel failures — monitoring tells you something is wrong, observability tells you why.\n\nThe three pillars of observability are logs, metrics, and traces. These are not alternatives — they complement each other. Metrics alert you to a problem, logs give context for a specific event, and traces show how the problem propagated across services. Systems with all three can be debugged without guesswork.",
        takeaway:
          "Monitoring tells you something is wrong. Observability tells you why — without new code.",
      },
      {
        id: "capacity-management",
        title: "Capacity management",
        body: "Capacity management is the discipline of knowing what resources you have, what you are using, and when you will need more. Track headroom — the gap between current utilization and the point where performance degrades. Set alerts when headroom drops below a threshold (e.g. CPU headroom < 30%) so you provision more capacity before users experience degradation.\n\nAuto-scaling handles many capacity decisions automatically for compute, but databases, message queues, and CDNs often require manual scaling decisions. Know which of your components auto-scale and which do not, and plan accordingly.",
        takeaway:
          "Track headroom, not just utilization. Know what auto-scales and what does not.",
      },
      {
        id: "configuration-management",
        title: "Configuration management",
        body: "Configuration that differs between environments (development, staging, production) should be stored outside the codebase — in environment variables, a secrets manager, or a configuration service. Never commit secrets or environment-specific configuration to source control.\n\nUse a configuration hierarchy: defaults in code (safe, non-sensitive values), overrides from environment variables, sensitive values from a secrets manager (AWS Secrets Manager, Vault). Changes to configuration should be audited — who changed what, when, and why — especially for production.",
        takeaway:
          "Config goes in environment variables or a secrets manager. Never in source control.",
      },
      {
        id: "toil-reduction",
        title: "Toil reduction",
        body: "Toil is repetitive, manual operational work that does not permanently improve the system — restarting a service, manually promoting a deployment, running a script that could be automated. SRE teams aim to keep toil below 50% of on-call engineer time. Above that, engineers spend their time managing the system rather than improving it.\n\nTrack toil explicitly. Each time an engineer performs a manual operational task, log it with time spent and frequency. After a quarter, prioritize automation by (time spent × frequency). The highest-impact items to automate are usually obvious — they are the things everyone complains about.",
        takeaway:
          "Track toil explicitly. Automate by (time × frequency) — the obvious wins are usually real.",
      },
      {
        id: "sre-principles",
        title: "SRE principles",
        body: "Site Reliability Engineering (SRE) applies software engineering practices to operations. Core principles: manage reliability with error budgets (if the error budget is spent, no more risk-taking until reliability is restored), eliminate toil through automation, share ownership between development and SRE (developers are on-call for services they own), and treat operational problems as engineering problems to be solved, not conditions to be tolerated.\n\nThe error budget is the most operationally powerful concept: it makes reliability a concrete number (e.g. 0.1% of requests can fail per month) that both product and engineering teams can reason about when making tradeoff decisions.",
        takeaway:
          "Error budgets make reliability a concrete number that enables rational tradeoff decisions.",
      },
    ],
  },

  {
    id: "hands-on-labs",
    title: "Hands-on & Labs",
    description:
      "Apply concepts through realistic engineering exercises that mirror production challenges.",
    accent: "from-[#003D5B] to-[#30638E]",
    accentHex: "#003D5B",
    lessons: [
      {
        id: "system-design-workshop",
        title: "System design workshop",
        body: "A system design workshop is a structured session where participants design a real system end-to-end within a time constraint (usually 45-60 minutes). The goal is not a perfect design — it is practicing the process: gathering requirements, estimating scale, choosing components, identifying failure modes, and communicating tradeoffs.\n\nStart every system design session by clarifying requirements before touching components. What is the read/write ratio? What is the scale (requests per second, data volume)? What are the latency requirements? What are the consistency requirements? Teams that skip requirements gathering consistently produce over-engineered or under-specified designs.",
        takeaway:
          "Clarify requirements before components. The process matters more than the design.",
        visual: "checklist",
        visualData: [
          "Step 1 – Clarify requirements (functional and non-functional)",
          "Step 2 – Estimate scale (QPS, storage, bandwidth)",
          "Step 3 – Define the API surface",
          "Step 4 – Sketch the high-level components",
          "Step 5 – Design the data model",
          "Step 6 – Identify bottlenecks and failure modes",
          "Step 7 – Discuss tradeoffs of your choices",
        ],
      },
      {
        id: "incident-simulation",
        title: "Incident simulation",
        body: "Incident simulations (also called game days or fire drills) inject a fictional incident into a real environment to practice response skills without real customer impact. A facilitator introduces a scenario ('CPU on the web tier is at 95% and climbing'), and the team goes through detection, diagnosis, communication, and remediation as they would in a real incident.\n\nThe most valuable outcome is not surviving the simulation — it is discovering the gaps: missing runbooks, alerts that do not fire when expected, escalation paths no one has memorized, tools that responders do not know how to use under pressure. Document every gap found and assign remediation owners.",
        takeaway:
          "Simulations are gap-finding exercises. Document every gap with a remediation owner.",
      },
      {
        id: "architecture-review",
        title: "Architecture review exercise",
        body: "In an architecture review exercise, participants evaluate a provided design (a fictional company's architecture diagram and description) for problems: single points of failure, missing fallbacks, over-engineered components, missing observability, security gaps. The exercise builds the habit of critical reading that makes design reviews in real work more effective.\n\nUse a structured critique framework: for each component, ask 'What happens when this fails?' and 'What does monitoring look like for this?' These two questions surface most reliability and operability gaps that architects miss when they are too close to their own design.",
        takeaway:
          "For every component: 'What happens when it fails?' and 'How do we observe it?'",
      },
      {
        id: "performance-tuning",
        title: "Performance tuning exercise",
        body: "A performance tuning exercise starts with a system under artificial load and a set of performance targets it is not meeting. Participants must identify the bottleneck (is it CPU? DB latency? network? lock contention?), propose and implement a fix, and measure the result. The measurement discipline is the most important part — guessing at bottlenecks and implementing fixes without measuring is cargo-cult optimization.\n\nCommon bottleneck categories to investigate in order: 1) Database (slow queries, missing indexes, N+1 query patterns), 2) Compute (algorithmic complexity, unnecessary work in the hot path), 3) Network (chatty APIs, large payloads, missing compression), 4) Concurrency (lock contention, thread pool exhaustion).",
        takeaway:
          "Measure before and after every optimization. Never guess the bottleneck.",
      },
      {
        id: "debugging-failures",
        title: "Debugging real-world failures",
        body: "Production debugging is a skill developed through practice. The systematic approach: first establish the timeline (when did this start? what changed around that time?), then form a hypothesis (the most likely cause based on what changed), then gather evidence (check logs, metrics, traces for that hypothesis), then confirm or refute and repeat.\n\nThe most common debugging mistakes: jumping to a fix before understanding the cause (treating symptoms), assuming the last deploy is always the cause (confirmation bias), and debugging alone when a second pair of eyes would find the issue in minutes. Always check the deployment log and the change log first.",
        takeaway:
          "Timeline → Hypothesis → Evidence → Confirm. Check deploys and changes first.",
      },
      {
        id: "database-optimization-lab",
        title: "Database optimization lab",
        body: "In a database optimization lab, participants are given a schema, a dataset, and a set of slow queries to fix. The exercise covers: reading EXPLAIN output, adding appropriate indexes, rewriting inefficient queries, and understanding the cost model the query planner uses.\n\nCommon patterns found in these labs: SELECT * on large tables, missing indexes on foreign keys (PostgreSQL does not create these automatically), correlated subqueries that could be joins, and large OFFSET-based pagination (inefficient at scale — use cursor-based pagination instead).",
        takeaway:
          "Read EXPLAIN. Check foreign key indexes. Replace OFFSET pagination with cursor-based.",
        visual: "code-block",
        visualData: `-- Inefficient: full scan + large offset
SELECT * FROM events ORDER BY id LIMIT 20 OFFSET 100000;

-- Efficient: cursor-based pagination (no scan of prior rows)
SELECT * FROM events WHERE id > :last_seen_id ORDER BY id LIMIT 20;

-- Check for missing FK indexes
SELECT table_name, constraint_name FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY';`,
      },
      {
        id: "deployment-rollback-drills",
        title: "Deployment and rollback drills",
        body: "A rollback drill practices the exact steps needed to revert a bad deployment — not in a theoretical walkthrough, but as a timed exercise in a production-like environment. Teams that have done rollback drills complete actual rollbacks in under five minutes. Teams that have not done them take 20-40 minutes and make mistakes under pressure.\n\nDrill the full sequence: detect the problem (via dashboards or alerts), make the call to roll back, execute the rollback procedure, verify that the system has recovered. Measure time at each step. Use the drill results to improve runbooks and tooling rather than just congratulating yourselves on completion.",
        takeaway:
          "Practice rollbacks under time pressure. Measure time per step and improve.",
      },
      {
        id: "observability-troubleshooting",
        title: "Observability and troubleshooting lab",
        body: "This lab puts participants in front of a system with a live problem visible in its telemetry but no other context. Using only logs, metrics, and traces, they must identify: which service is affected, when the problem started, what the root cause is, and whether the problem is getting worse or better.\n\nThe exercise builds the muscle of reading telemetry systematically rather than scanning for something that looks wrong. The most effective sequence: start with the high-level dashboard (which service is unhealthy?), drill into that service's metrics (which signal is degraded?), find a trace for a failing request, find the span where the failure originated, then check logs around that timestamp.",
        takeaway:
          "Dashboard → service metrics → trace → span → logs. Read telemetry in order.",
      },
      {
        id: "load-testing",
        title: "Load testing exercise",
        body: "Load testing generates synthetic traffic to find the point where a system's performance degrades. A load test should establish: the current throughput ceiling (what RPS before error rate rises?), the latency profile under various loads, which component hits its limit first (the bottleneck), and how the system recovers when load drops back to normal.\n\nTools: k6, Locust, and Apache JMeter are common. A load test that only ramps up and stops does not answer recovery behaviour — always include a ramp-down phase. Run load tests against a staging environment that mirrors production infrastructure.",
        takeaway:
          "Load tests must include ramp-down to test recovery. Run against production-mirrored staging.",
      },
      {
        id: "chaos-engineering-lab",
        title: "Chaos engineering lab",
        body: "In this lab, participants run controlled chaos experiments: killing a service instance, introducing artificial latency to a database call, filling a disk. Before each experiment, they write a hypothesis with expected system behaviour. After the experiment, they compare observed behaviour against the hypothesis and document gaps.\n\nStart with the steadiest part of the system — what you know is reliable — and confirm your confidence. Then move toward dependencies and failure paths that have not been tested. Chaos engineering on an already-struggling system is not chaos engineering — it is just making things worse. Establish a stable baseline first.",
        takeaway:
          "Write the hypothesis before injecting failure. Start with known-stable areas.",
      },
      {
        id: "security-review",
        title: "Security review exercise",
        body: "A security review exercise gives participants a codebase or design to review for vulnerabilities. Common patterns to find: SQL injection (parameters concatenated into queries instead of parameterized), improper authentication (checking the wrong value, missing checks on certain endpoints), insecure direct object reference (using a user-supplied ID to access a record without checking ownership), and missing rate limiting on sensitive endpoints (password reset, OTP verification).\n\nUse OWASP Top 10 as a checklist framework — it covers the most commonly exploited vulnerability categories. The goal is building the habit of security-conscious review, not becoming a penetration tester.",
        takeaway:
          "Use OWASP Top 10 as a review checklist. Check auth, parameterization, and ownership at every endpoint.",
      },
      {
        id: "api-design-workshop",
        title: "API design workshop",
        body: "In an API design workshop, participants design the full API for a fictional service: resource naming, endpoint structure, request/response schemas, error shapes, authentication, pagination, versioning, and backward compatibility strategy. The design is then peer-reviewed against a set of criteria before any implementation.\n\nThe most common mistakes in API design workshops: verbs in resource URLs, inconsistent naming conventions, missing error shapes, no consideration of pagination for list endpoints, and no versioning strategy. Reviewing designs against real clients (other teams' frontend or mobile code) produces better APIs than reviewing in the abstract.",
        takeaway:
          "Stable nouns, consistent shapes, explicit errors. Review against real client needs.",
      },
      {
        id: "dr-exercise",
        title: "Disaster recovery exercise",
        body: "A disaster recovery (DR) exercise simulates a catastrophic event — a regional data centre failure, accidental data deletion, a corrupted primary database — and measures whether the team can recover to within their RTO and RPO targets. DR exercises almost always reveal gaps that were not visible in planning: out-of-date documentation, broken restore procedures, or recovery time that far exceeds the target.\n\nRun DR exercises at least annually for production systems. Each exercise should be followed by a postmortem and a list of improvements to the DR plan. The DR plan is only trustworthy if it has been tested under pressure.",
        takeaway:
          "DR plans are only trustworthy if tested. Run exercises annually and postmortem every gap.",
      },
      {
        id: "code-review-workshop",
        title: "Code review workshop",
        body: "A code review workshop gives participants the same pull request to review independently, then compares what they found. This reveals: issues that everyone missed (systematic gaps), issues that only some found (skill differences to address), and false positives (style preferences masquerading as engineering concerns).\n\nThe best PR to use for a code review workshop is a past PR that caused a production incident. Participants experience the feeling of 'I would have caught this' or 'I would have missed this too' which builds more genuine learning than reviewing a synthetic example.",
        takeaway:
          "Use real PRs that caused incidents. Compare reviews to find systematic gaps.",
      },
      {
        id: "oncall-simulation",
        title: "On-call simulation",
        body: "An on-call simulation gives a participant a pager (a staging environment with seeded problems) and observes how they: locate the problem in monitoring, find relevant context in logs and traces, use runbooks, make decisions about escalation and rollback, and communicate status to stakeholders.\n\nObserve without intervening — the point is to see where the engineer gets stuck, not to help them. After the simulation, debrief on what helped, what was missing, and what parts of the tooling or documentation were confusing. This is particularly valuable onboarding for engineers new to a system.",
        takeaway:
          "Observe without intervening. Debrief on tooling gaps, not just engineer gaps.",
      },
    ],
  },
];

// ─── Visual renderers ─────────────────────────────────────────────────────────

function DiagramLayered({
  data,
  accentHex,
}: {
  data: Record<string, string[]>;
  accentHex: string;
}) {
  return (
    <div className='mt-5 space-y-2'>
      {Object.entries(data).map(([layer, items], i) => (
        <div
          key={layer}
          className='rounded-xl border border-slate-200 bg-white p-4'
        >
          <p
            className='text-xs font-bold uppercase tracking-widest mb-2'
            style={{ color: accentHex }}
          >
            {layer}
          </p>
          <div className='flex flex-wrap gap-2'>
            {items.map((item) => (
              <span
                key={item}
                className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700'
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiagramCycle({
  data,
  accentHex,
}: {
  data: string[];
  accentHex: string;
}) {
  return (
    <div className='mt-5 flex flex-wrap items-center gap-2'>
      {data.map((step, i) => (
        <React.Fragment key={step}>
          <span
            className='rounded-full px-4 py-2 text-xs font-semibold text-white'
            style={{ backgroundColor: accentHex }}
          >
            {step}
          </span>
          {i < data.length - 1 && (
            <span className='text-slate-400 font-bold'>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CodeBlock({ data }: { data: string }) {
  return (
    <pre className='mt-5 overflow-x-auto rounded-2xl bg-slate-900 p-5 text-xs leading-6 text-slate-200 font-mono'>
      {data}
    </pre>
  );
}

function Checklist({ data }: { data: string[] }) {
  return (
    <ul className='mt-5 space-y-2'>
      {data.map((item) => (
        <li key={item} className='flex items-start gap-3'>
          <span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
            ✓
          </span>
          <span className='text-sm text-slate-700'>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DataTable({ data }: { data: string[][] }) {
  const [header, ...rows] = data;
  return (
    <div className='mt-5 overflow-x-auto rounded-2xl border border-slate-200'>
      <table className='min-w-full text-sm'>
        <thead className='bg-slate-50'>
          <tr>
            {header.map((h) => (
              <th
                key={h}
                className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-100 bg-white'>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className='px-4 py-3 text-slate-700'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Lesson card component ─────────────────────────────────────────────────────

function LessonCard({
  lesson,
  accentHex,
}: {
  lesson: TopicLesson;
  accentHex: string;
}) {
  return (
    <article id={lesson.id} className='scroll-mt-32 mb-12'>
      <div
        className='mb-1 h-1 w-10 rounded-full'
        style={{ backgroundColor: accentHex }}
      />
      <h3 className='text-xl font-bold text-slate-900 mb-4'>{lesson.title}</h3>
      <div className='space-y-4'>
        {lesson.body.split("\n\n").map((para, i) => (
          <p key={i} className='text-base leading-8 text-slate-600'>
            {para}
          </p>
        ))}
      </div>

      {/* Visuals */}
      {lesson.visual === "diagram-layered" && lesson.visualData && (
        <DiagramLayered
          data={lesson.visualData as Record<string, string[]>}
          accentHex={accentHex}
        />
      )}
      {lesson.visual === "diagram-cycle" && lesson.visualData && (
        <DiagramCycle
          data={lesson.visualData as string[]}
          accentHex={accentHex}
        />
      )}
      {lesson.visual === "code-block" && lesson.visualData && (
        <CodeBlock data={lesson.visualData as string} />
      )}
      {lesson.visual === "checklist" && lesson.visualData && (
        <Checklist data={lesson.visualData as string[]} />
      )}
      {lesson.visual === "table" && lesson.visualData && (
        <DataTable data={lesson.visualData as string[][]} />
      )}

      {/* Takeaway */}
      <div
        className='mt-6 rounded-2xl px-5 py-4'
        style={{
          backgroundColor: `${accentHex}10`,
          borderLeft: `3px solid ${accentHex}`,
        }}
      >
        <p
          className='text-xs font-bold uppercase tracking-widest mb-1'
          style={{ color: accentHex }}
        >
          Key takeaway
        </p>
        <p className='text-sm font-medium text-slate-800'>{lesson.takeaway}</p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId)!;

  // Track active lesson via IntersectionObserver
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLessonId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    observerRef.current = observer;
    activeCategory.lessons.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeCategoryId]);

  const switchCategory = (id: string) => {
    setActiveCategoryId(id);
    setIsMobileTocOpen(false);
    setActiveLessonId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToLesson = (id: string) => {
    setIsMobileTocOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />

      {/* ── Category selector bar ── */}
      <div className='sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto max-w-7xl px-4 md:px-8'>
          <div className='flex items-center gap-1 overflow-x-auto py-3 scrollbar-none'>
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type='button'
                  onClick={() => switchCategory(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  style={
                    isActive ? { backgroundColor: cat.accentHex } : undefined
                  }
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className='mx-auto max-w-7xl px-4 md:px-8'>
        {/* ── Hero area for active category ── */}
        <div className='relative overflow-hidden rounded-3xl my-8 p-8 md:p-12'>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${activeCategory.accent} opacity-10`}
          />
          <div
            className='absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl opacity-20'
            style={{ backgroundColor: activeCategory.accentHex }}
          />
          <div className='relative'>
            <div
              className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white mb-4'
              style={{ backgroundColor: activeCategory.accentHex }}
            >
              Learning path
            </div>
            <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl'>
              {activeCategory.title}
            </h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
              {activeCategory.description}
            </p>
            <p className='mt-4 text-sm text-slate-500'>
              {activeCategory.lessons.length} topics in this path
            </p>
          </div>
        </div>

        {/* ── Mobile TOC toggle ── */}
        <div className='lg:hidden mb-6'>
          <button
            type='button'
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-sm'
          >
            <span>Table of contents</span>
            <span className='text-slate-400 text-lg'>
              {isMobileTocOpen ? "↑" : "↓"}
            </span>
          </button>
          {isMobileTocOpen && (
            <div className='mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg'>
              <nav className='space-y-1'>
                {activeCategory.lessons.map((lesson, i) => (
                  <button
                    key={lesson.id}
                    type='button'
                    onClick={() => scrollToLesson(lesson.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      activeLessonId === lesson.id
                        ? "font-semibold text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    style={
                      activeLessonId === lesson.id
                        ? { backgroundColor: activeCategory.accentHex }
                        : undefined
                    }
                  >
                    <span className='text-xs opacity-50'>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {lesson.title}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div className='flex gap-10 pb-4'>
          {/* Lessons content */}
          <div className='min-w-0 flex-1'>
            {activeCategory.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                accentHex={activeCategory.accentHex}
              />
            ))}
          </div>

          {/* Sticky Table of Contents */}
          <aside className='hidden lg:block w-64 xl:w-72 shrink-0'>
            <div className='sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
                In this path
              </p>
              <nav className='space-y-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1'>
                {activeCategory.lessons.map((lesson, i) => {
                  const isActive = activeLessonId === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      type='button'
                      onClick={() => scrollToLesson(lesson.id)}
                      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                        isActive
                          ? "font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                      style={
                        isActive
                          ? { color: activeCategory.accentHex }
                          : undefined
                      }
                    >
                      <span
                        className='mt-0.5 text-xs font-mono shrink-0 opacity-40'
                        style={
                          isActive
                            ? { opacity: 1, color: activeCategory.accentHex }
                            : undefined
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className='leading-snug'>{lesson.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
        {/* ── Playlists ── */}
        {(() => {
          const playlistUrls = activeCategory.lessons.flatMap(
            (l) => l.learningPlaylistUrl ?? [],
          );
          if (playlistUrls.length === 0) return null;
          return (
            <div className='border-t border-slate-200 pt-10 pb-16'>
              <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
                Learn More: Playlists
              </p>
              <div className='flex flex-wrap gap-3'>
                {playlistUrls.map((url, i) => (
                  <Link
                    key={i}
                    href={url.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors'
                  >
                    <span className='text-base'>▶</span>
                    {url.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </main>

      <Footer />
    </div>
  );
}
