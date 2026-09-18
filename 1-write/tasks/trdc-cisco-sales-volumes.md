# Cisco Sales Volume Expectations

---

## ToC

---

## Expected IDP Loads

> Expected amount of IDP documents to hit all 10 IDP codes combined

- Mean monthly volume: 100,000 per month

- Peak volume expectation: 15,000 in 10 hours

- Volume increases dramatically at the end of a quarter - causing large influxes

---

## Expected AI Calling

> LLM workflow node expectations for the run of a valid document broken down by LLM call

# Workflow LLM Call Map


| Type | Meaning |
|------|---------|
| **Single-shot node** | Exactly **1** LLM API call when that node runs |
| **Agent loop** | **1 initial call + 1 call per MCP tool turn**, capped at **max 15** (`create_request_agent`) or **max 20** (`update_request_agent`) tool calls |

Agent loops use MCP tools only (no function-call mode). Each tool turn is one sequential LLM round-trip.

---

## The 6 LLM nodes (always the same nodes; not every path hits all of them)

### 1. `AIU_03_IntentExtraction`
| | |
|--|--|
| **When** | `aiuRoute == "needs-ai"` |
| **Input** | `messages` — system prompt + user block: subject, attachments, `cleanText` |
| **Output** | `aiuIntentExtractionOutput` → parsed into `primaryIntent`, `requestRelation`, `identifiers`, `entities`, `sentiment`, `urgency`, `confidenceScores`, etc. |
| **Calls** | **1** |

### 2. `AIU_08_ThreadSummary`
| | |
|--|--|
| **When** | After AIU-03, only if `recomputeFlags.requiresRecompute == true` |
| **Input** | `messages` — prior `threadDerived.summary` + new `cleanText` (+ optional `forwardHistoryText`) |
| **Output** | `aiuThreadSummaryOutput` → `threadDerived.summary`, `actionItems`, `keyDecisions` |
| **Calls** | **1** (skipped on low-content replies that reuse existing summary) |

### 3. `cr_classify_category_llm`
| | |
|--|--|
| **When** | Passes spec-04 edge-case + security gates (normal actionable mail) |
| **Input** | `messages` — brand taxonomy cards + subject, `primaryIntent`, `requestRelation`, body |
| **Output** | `llmCategoryRaw` → `rcBrandId`, `classificationConfidence` (service code deferred to create agent) |
| **Calls** | **1** |

### 4. `n06_orchestrator_intent_llm`
| | |
|--|--|
| **When** | Orchestrator N04 passes (create/update eligible) **and** N07 confidence gate passes |
| **Input** | `messages` — allowlisted JSON: brand, `primaryIntent`, `threadSummary`, `identifiers`, `requestRelation`, etc. |
| **Output** | `orchestratorResponse` → `finalIntent`, `orchestratorConfidence` |
| **Calls** | **1** |

### 5. `create_request_agent`
| | |
|--|--|
| **When** | `agentSelected == "create-request"` and create handoff OK |
| **Input** | `createAgentMessages` — dispatch payload, brand catalog, thread people, email excerpt, search hints |
| **Output** | `requestAgentResponse` → after-script → `createAgentOutput` (`requestNo`, `noteText`, `toolCalls`) |
| **Calls** | **1–16** (1 + up to **15** MCP tool turns) |
| **Typical tools** | `customer_search` → `rcs-request-create` |

### 6. `update_request_agent`
| | |
|--|--|
| **When** | `agentSelected == "update-request"` and update handoff OK |
| **Input** | `updateAgentMessages` — identifiers, search attempts, prior ticket snapshot, action status hints |
| **Output** | `updateAgentResponse` → `updateAgentOutput` (matched `requestNo`, note/status tool results) |
| **Calls** | **1–21** (1 + up to **20** MCP tool turns) |
| **Typical tools** | `rcs-request-search` → `rcs-request-attach-note` → `rcs-action-update-status` (search miss may forward to create path) |

---

## Paths by outcome


### A. Create path — `agentSelected = create-request`

```
validate_create_handoff → create_handoff_ok
  → search_existing_request
      ├─ unique match  → rewrite_update_handoff → UPDATE agent path (see E)
      ├─ ambiguous     → review exit (0 agent LLM)
      └─ none/other    → build_create_agent_context → create_request_agent → …
```

| Sub-path | Extra agent LLM calls | Total (incl. prefix) |
|----------|----------------------|------------------------|
| **D1 — Create happy path** (no existing ticket) | **1–16** | **4–20** (or **5–21** with summary recompute) |
| **D2 — Redirect to update** (unique existing request found) | **1–21** update agent instead | Same prefix + update agent |

**Create agent expected I/O (D1):**
- **In:** reseller candidates, `rcBrandCatalog`, `allowedServiceCodes`, `canonicalRequestName`, email subject/body excerpt, thread people
- **Out:** RC ticket `requestNo`, `noteText`; MCP tool results captured in `createAgentOutput`

---

### B. Update path — `agentSelected = update-request`

```
validate_update_handoff → update_handoff_ok
  → build_update_agent_context → update_request_agent → enforce_update_result
      └─ search miss → rewrite_create_handoff → validate_create_handoff → CREATE agent (D1)
```

| Sub-path | Agent LLM calls | Total (incl. prefix) |
|----------|----------------|----------------------|
| **E1 — Update happy path** | **1–21** | **4–25** (or **5–26** with summary) |
| **E2 — Update miss → create fallback** | **1–21** update (partial search) + **1–16** create | **Prefix + up to 37 agent calls** (worst case; usually much less) |

**Update agent expected I/O (E1):**
- **In:** `identifierAttempts`, `searchDateWindow`, `knownTicketBinding` / `skipSearch`, `priorTicketSnapshot`, `actionStatusHints`
- **Out:** matched `requestNo`, note text, optional status update; `updateAgentOutput` with tool results

---

## Practical notes

1. **Longest path:** update agent with many search attempts, then create fallback — up to **~41** LLM API calls in worst case.
2. **Cheapest actionable RC path:** prefix with no summary recompute (**3**) + minimal create agent (**2**: customer search + create) = **~5 calls**.
3. **Agent loop dominates runtime/memory** — that is what the OOM fixes targeted (caps 15/20, not the single-shot nodes).
4. **Service/sub-service picking** is **not** a separate LLM node in the live graph; the create agent chooses service codes from `rcBrandCatalog` via MCP create.

---
