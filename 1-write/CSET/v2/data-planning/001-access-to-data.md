---
tags:
  - cisco
  - request-central
quarter: Q1
FY: "27"
contacts:
  - Marckel, Megan
  - Atkinson, Travis
---
# Cisco Request Central: data access and discovery

## Purpose

Work with Megan, Travis and the appropriate data owners to find a practical, approved way to understand Request Central (RC) data and use it for CSET V2. This supports the [V2 goals](../v2-goals.md): show business value, measure success, and use evidence to guide future features, with suitable business and developer views.

Two needs may require different access:

1. **Discovery now:** During meetings, quickly understand the schema, ask questions in natural language, have an AI assistant help draft SQL, and—with appropriate permission—run small, read-only queries and interpret results.
2. **Application later:** Build and operate reporting or other software using dependable, appropriately governed data access. Local development is desirable, including possible ML work, but an approved protected environment may be the workable path.

Local access to a remote database, permission to copy data onto a laptop, permission to send information to an AI service, and permission to operate a production application are separate questions. A DBeaver login alone does not answer all of them.

## 30-minute meeting plan: Request Central data access

**Participants:** Megan and Travis  
**Purpose:** Identify the data sources and tables needed for CSET V2, and agree on a practical path to read-only access for discovery and eventual application development.

### 0–3 min | Frame the request

> “I'm starting discovery for the next phase of the Cisco work. I want to understand where the Request Central data lives, which tables are relevant, and how I can get access to explore it and eventually build on it.”

### 3–13 min | Identify the right data

- What database or reporting source does the RC DBeaver connection reach? Is it production, a replica, a warehouse, or something else?
- Which systems and tables or views contain RC requests, actions, statuses, timestamps, SLAs and mailbox information? Where do triage events live, and can they be connected to RC records?
- Can we look at the relevant schema together? What does a row represent, and where are history and exceptions recorded?
- Are there important limitations in history, freshness or completeness that would affect discovery or the application?

**Capture:** Source and environment, candidate tables or views, how records connect, and questions to verify. We do not need a complete schema map in this meeting.

### 13–22 min | Agree on an access path

- Who grants access to the relevant schema and tables or views? What access tiers and approval steps apply, and how long might they take?
- Is there a read-only reporting source, curated view or sandbox suitable for exploration? Can database permissions enforce read-only access?
- Can I connect from my managed laptop, or must I work in a protected environment? What can be viewed or stored locally?
- For a future application, what integration path and development environment should we investigate?

**Capture:** The proposed discovery access, its owner and next step; record the application path as a separate question if it needs another conversation.

### 22–26 min | Briefly check AI-assisted querying

- What DBeaver edition and build are installed? Is **Preferences → AI → MCP Server** and per-connection MCP access available?
- If AI-assisted access is permitted, can queries be reviewed before execution, with limits on returned rows and runtime? How should sensitive or unexpectedly large results be handled?

**Capture:** What can be checked now and who can follow up. Confirming table access remains the priority.

### 26–30 min | Agree on next steps

Read back the likely sources, the access path and outstanding questions. Assign owners and target dates.

| Follow-up | Owner | Target date | Result |
| --- | --- | --- | --- |
| Identify relevant sources, tables and joins | | | |
| Arrange read-only discovery access and environment | | | |
| Identify the future application integration path | | | |
| Verify DBeaver MCP availability and query controls | | | |

---

## What I want to leave the first conversation knowing

- Who owns RC data, access decisions, reporting, security review and application integration.
- What database or reporting source DBeaver connects to and whether it is appropriate for discovery and eventual application use.
- The fastest approved way to inspect the schema and run limited read-only queries, including whether AI-assisted exploration is allowed.
- Which environment and access pattern could support a future application, and what we must do to qualify for it.
- The next action, owner and expected timing for each unresolved access path.

## Questions for Megan, Travis and the right owners

### 1. What data and reporting already exist?

- What system and database does the RC DBeaver connection actually reach? Is it production, a replica, warehouse, reporting database, or another source? What database engine and version is it?
- Which systems contain the relevant email triage events, RC requests and actions, SLAs, status changes, user activity and mailbox information? Can these records be linked reliably, and by what identifier?
- ~~What existing reports, semantic models, dashboards, APIs, data dictionaries, entity relationship diagrams or queries should I start with? Who owns them and which definitions are trusted?~~
- Which tables or views represent the process from incoming email through triage and RC work? What does each row represent, and where are timestamps, status history, handoffs and exceptions recorded?
- What history is retained? How fresh, complete and accurate is each source? Are there known gaps or changes in definitions across mailboxes?
- ~~What is captured before and after triage goes live? Can we establish a baseline for business value and SLA outcomes? Avoid assuming an FTE or time-saved figure is already supported.~~

### 2. Discovery access and working environment

- Who can grant access to schema metadata, read-only views and the specific data needed? What are the access tiers, approval process and expected lead times?
- Can I connect from my managed laptop through VPN or another approved route, or only from a virtual desktop, internal server or protected workspace? Does the connection require SSO, MFA, a tunnel or special drivers?
- Is a read-only reporting replica, curated schema or sandbox available so exploration does not disrupt operational workloads? ~~What row limits, query timeouts, concurrency or business-hour restrictions apply?~~
- What is permitted to be viewed, exported, cached or saved locally? Are schema names, SQL text, logs, screenshots, sample rows and aggregated results treated differently?
	- If local database connectivity or local data storage is not allowed, can an approved developer environment run inside the network? Can I access a sanitized dataset or approved metadata and examples for discovery instead?
- Can I use a limited read-only identity with access only to the needed schemas or views? Who approves and periodically reviews it?

### 3. AI-assisted exploration during meetings

- Is Codex, or another named AI tool and deployment, approved for this data and environment? Does approval differ for metadata, SQL, error messages, sample rows, aggregate results or email content?
- ~~What information is sent to the model provider, retained or logged, and where is it processed? What redaction, classification, residency and confidentiality rules apply? Who can confirm the applicable organizational agreement and settings?~~
- Is a local MCP server or database connector allowed on the managed machine or inside the protected environment? Can the Codex process reach it there, and may it use the selected database identity?
- What exact DBeaver **edition and build** do we have? Does it expose **Preferences → AI → MCP Server** and per-connection MCP access? ~~If not, is an approved upgrade, another connector, or an existing managed service available?~~
- Which tools would be exposed: list schemas, inspect tables and relationships, read sample data, open an editor, and/or execute arbitrary SQL? Can access be constrained and audited? Does opening an editor also insert or execute SQL, or only open it?
- **Can we enforce read-only permissions at the database, limit returned rows and query runtime, and require review before execution? What process handles sensitive or unexpectedly large results?**
- ~~For meetings, would a workflow where AI drafts SQL and I review and run it in DBeaver be acceptable if direct AI tool access is not approved? Can we provide the model with a sanitized schema or synthetic examples?~~

### 4. Application and longer-term integration

- What is the approved integration surface for a new application: direct database access, read-only replica, governed views, an existing API, warehouse, scheduled extract or another service?
- Can the application run locally for development? If not, where can code, tests, logs and the deployed service run? How do developers access that environment?
- ~~Can the application use a separate service identity, and who provisions its permissions and manages credentials, rotation and secrets? Are there separate development, test and production environments?~~
- ~~What access, availability, freshness, throughput, query-cost and change-notification expectations can the source support? What happens if schemas or source systems change?~~
- ~~Which business and developer views are allowed, and how are user authentication, authorization, row/column restrictions and audit handled?~~
- ~~What reviews, data agreements, ownership, support and production deployment requirements apply? Who owns the integration after launch?~~
- ~~If the intended future use includes ML, which data, environments, model providers and training or inference uses are permitted? What additional approval is needed?~~


## Candidate approaches to validate

| Approach                                                           | Discovery use                                                    | Future application                                                                | Key dependency                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Codex drafts SQL from approved schema context; I run it in DBeaver | Quick starting point, including during meetings                  | Does not itself provide application access                                        | Permission to share the selected metadata and query context with the AI tool             |
| DBeaver local MCP server + Codex                                   | Potential access to tools for the selected connection            | Useful for exploration; application integration still needs its own approved path | Supported edition/build, enabled connection and permitted tools; AI and network approval |
| Approved database connector or MCP in a protected environment      | Schema inspection and possibly controlled SQL execution          | Can inform a separate service integration                                         | Database permissions, deployment and model/data approvals                                |
| Governed database view, replica, warehouse or API                  | Read-only discovery and repeatable queries                       | Potential application data source                                                 | Owner, access, freshness and support agreement                                           |
| Sanitized metadata or synthetic/sample data                        | Understand schema and draft queries if live access is restricted | Insufficient by itself for a live application                                     | Owner provides approved material and confirms how representative it is                   |

**DBeaver version caveat:** Current [DBeaver MCP documentation](https://dbeaver.com/docs/dbeaver/Model-Context-Protocol-Server/) describes a localhost MCP server for Lite, Enterprise and Ultimate, with access enabled per connection. It names Codex as a client. The documentation does not establish that this exact desktop feature exists in version 26.1.4, or that every installation exposes arbitrary SQL execution. Verify the installed build and actual tool list before relying on it. [Codex supports configured MCP servers](https://developers.openai.com/codex/mcp/). The selected tools may send metadata, query text or results into the AI session; organizational approval and database permissions still apply.

CloudBeaver is a separate server product with a [GraphQL SQL execution API](https://dbeaver.com/docs/cloudbeaver/graphql-api-reference/service.sql/). It is another possible integration to investigate, not a requirement to use DBeaver desktop, and its edition, authentication and deployment must be confirmed.

## Working notes and actions

**Source / environment:**  
**Data and reporting owners:**  
**Access and AI approval owners:**  
**DBeaver edition and exact build:**  
**Approved discovery path and restrictions:**  
**Candidate application path:**  
**Unknowns / risks:**

| Action | Owner | Target date | Status / decision |
| --- | --- | --- | --- |
| Confirm source, schema documentation and existing reports | | | |
| Confirm read-only discovery access and environment | | | |
| Confirm AI, metadata and result-sharing permissions | | | |
| Check MCP feature and exposed tools in installed edition | | | |
| Identify future application integration owner and path | | | |
