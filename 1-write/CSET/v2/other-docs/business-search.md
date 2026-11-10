# Search: business rules and success conditions

This document describes the Cisco email triage workflow's two business searches: finding an existing Request Central (RC) request, and finding the customer/reseller account for a new request. It records the behavior in the current `src/spec-06` sources. A successful API call, a successful business match, and a successful RC write are separate events.

## 1. What “successful search” means

| Search              | Successful business result                                                                                                                      | Valid miss                                                         | Failure or unsafe result                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Existing RC request | A usable `requestNo` is selected and the workflow records `unique`; the update path can bind to that request.                                   | The search completes with no usable request.                       | Transport/service error, unavailable search, ambiguous candidates, or a response without a usable request number. |
| Customer/reseller   | An external customer domain and company context identify a returned account, with a usable `masterCustomerAcct` or permitted `custNo` fallback. | No returned company passes the domain and business-context checks. | An unrelated company, a longer domain that merely contains the searched domain, or an empty/zero account number.  |

**A search match alone does not mean the email was processed successfully.** A request update still needs its note/files/status work and terminal gates; a new request still needs its create and persistence work.

## 2. Existing RC request search

### Business purpose and entry points

- **Before creating:** `search_existing_request` checks for an existing ticket. A `unique` result rewrites the handoff to update that ticket and sets `skipSearch`; a `not_found` result lets the create path continue. `ambiguous` sets `request_ambiguous` and needs review.
- **On an update:** `rc_search_request` checks the dispatched identifiers. A `unique` result passes the unique gate. `none` means no candidate; `ambiguous` means multiple candidates; `failed` sets `submitFailReason=search_failed`.
- **In the update agent:** when no ticket is already bound, the agent is instructed to search request names in order, read the returned request fields, and stop after all attempts miss. A known binding (`skipSearch`) suppresses another search.
- **After a create agent search:** a unique RC hit may redirect to update if creation has not already succeeded. If creation already succeeded, the workflow keeps the created ticket.

### Search scope and inputs

Script calls use `POST /api/rcs/internal/request/search` through the `request-central` service. They add `vendorNos=[64956]` and `productBrandNos=[6,7,8,24]`. The tool contract exposes `requestNo`, `quoteNo`, `resellerNo`, `requestName`, `createFrom`, and `createTo`. Search needs a meaningful identifier; dates and scope alone do not establish ticket identity.

The script converts PO, order, and deal numbers to `requestName` searches. `quoteId` can map to `quoteNo`. A direct `requestNo` attempt is searched as a number when numeric. The name-search request body strips unsupported identifier/date aliases (`quoteNo`, `resellerNo`, `createDate`, `updateDate`, `updateFrom`, `updateTo`); direct request-number search is a separate call. The update **agent** prompt is narrower: it says to send only `requestName`, `createFrom`, and `createTo` and never send request number, quote number, or reseller number.

Name searches use a now-relative inclusive window from **20 days before execution through one day after execution**. The optional email timestamp does not move that window. Direct request-number calls in `executeRcRequestSearchByNo` send the number and fixed scope without the date window, despite the broader comment in `match-priority.js` saying all searches have dates. This distinction matters when a ticket is older than 20 days.

### Attempt order

| Path | Order actually built |
| --- | --- |
| Create pre-search | Sanitized `requestId` as `requestNo`; then extracted `requestName` (plain and `SECURITY WARNING:` forms); then stripped subject in those forms if different. |
| Update script gate | The same preferred attempts, followed by ordered identifiers: `requestId`/`requestNo`, PO, quote, deal, order, thread. Quote may get an additional `requestName` attempt; PO/deal/order can get additional name attempts. Attempts without usable search arguments are skipped. |
| Update agent | Canonical request name and `SECURITY WARNING:` form are built first; the context may merge additional distinct attempts. Its prompt says to use the supplied attempts in order. |

`threadId` is in the priority list but `mapIdentifierToSearchArgs` has no direct mapping for it, so it is not an independent RC query. Search terms are candidates, not proof that the returned ticket is the right business request.

### Exact result decisions

1. **Call level:** HTTP status `>=400`, a recognized error payload, an exception, `responseError`, missing `restCall`, or an empty REST result is a failed call in the script wrapper. An ordinary response with `found:false` or no rows is a completed search with no match. The MCP tool contract separately describes 404 as `{found:false}`; the script wrapper treats HTTP 404 as an error. These are different surfaces.
2. **Row level:** Search accepts arrays or `data`, `list`, `records`, or `candidates` arrays, plus a nested `request`. A row must supply a usable `requestNo`/`requestId` to become a match. `found:true` without a usable number does not become `unique`.
3. **Name result with several rows:** the script sorts by newest `createdOn`, then newest `lastUpdatedOn`, then highest numeric request number. It chooses the first sorted row and records other request numbers in `relatedRequestNos`. Thus multiple name-search rows can produce `unique`; they are **not** automatically sent to review.
4. **Create pre-search:** the first usable non-name unique match wins. Name matches can be collected across attempts and the newest selected. A true `ambiguity:true` result is `ambiguous`. If no match resolves, the node records `not_found`.
5. **Update script gate:** `runSearchGate` stops at the first unique attempt. More than one distinct request number within one attempt is `ambiguous`; with `stopOnUnique`, later attempts are not checked once a unique result is found. A failed attempted call returns `failed` immediately. With no candidate it returns `none`.
6. **Bound ticket:** a prior `unique` plus nonblank `matchedRequestNo`, or `skipSearch`, can bypass re-entry search. The update result handler can also use a dispatched `requestId`/`requestNo` when tool history is absent, unless the agent explicitly reported not found. This is a binding fallback, not evidence of a successful fresh search.

The create pre-search resolver maps failed lookup payloads to `not_found`, and its node records that status after the attempts. Operators must inspect the logged search error and HTTP status before treating such a result as a confirmed business miss. Also, the script REST normalizer selects one newest row before the update gate sees the result, so the gate's ambiguity check does not by itself expose every multi-row name response.

**Business consequence:** `unique` means the workflow selected one request number according to these rules. It does not prove semantic identity of the ticket, nor does it prove the RC update succeeded. The agent instructions require reading returned fields and content matching before writing; the script's newest-row selection and dispatched-ID fallback do not independently prove that semantic match.

### Outcomes after search

| Outcome | Workflow action |
| --- | --- |
| `unique` | Bind `requestNo`, preserve `matchedOn` and related numbers where available, and continue the update path. |
| Create pre-search `not_found` | Continue toward create. |
| Update `none` / confirmed miss | The downstream update flow may forward to create and review, subject to shipping-status exceptions. |
| `ambiguous` | Human review; do not arbitrarily choose an RC candidate. |
| `failed` | Record `search_failed`; investigate the service/transport result. |

A shipping-status email from the configured allowlist with the shipped/Event-ID pattern is an exception: unique continues update; a confirmed miss or absent usable PO/order is ignored; ambiguity still goes to review.

## 3. Customer/reseller search

### Business purpose and domain selection

The create agent uses the external `customer_search` MCP service to find a reseller account. The workflow prefers a non-internal thread contact email's domain, then an eligible domain hint; a forwarded external sender can override the selected domain. Generic domains (`gmail.com`, `yahoo.com`, `outlook.com`, `hotmail.com`) and internal/partner domains (`tdsynnex.com`, `synnex.com`, `techdata.com`, `cisco.com`) are excluded from domain-based account resolution. An internal sender is not the customer identity.

### Allowed search sequence and success test

1. Search `emailAddress="@" + customerDomain`, `fuzzySearch="Y"`, `returnMasterAccount="Y"`, `pageSize=5`. The leading `@` reduces false contains matches.
2. Compare every returned row's email domain to `customerDomain` **for equality**, then compare `custName` and account data with the sender, thread, and business context. Identical `custNo` rows are contact rows for one company. A contact email or a `MASTER CUSTOMER` terms label alone is insufficient.
3. If a domain-equal, context-fitting row has a usable `masterCustomerAcct`, select that master account and stop. Copy `custName` from the same chosen row.
4. Only if a domain-equal company lacks a usable master account, make **one** more fuzzy `@customerDomain` search with `pageSize=5` and omit `returnMasterAccount`. A context-fitting row's `custNo` may then be used as the account, even if it is a subaccount.
5. If no domain-equal row appeared, make one final exact (`fuzzySearch="N"`) search with a full external thread/contact email whose domain equals `customerDomain`, `returnMasterAccount="Y"`, `pageSize=5`. Do not use an internal email. If no suitable company is found, return null account/name.

The agent returns only `noteText`, `masterCustomerAcct`, `custName`, and `customerSearchDebug`. The debug list contains up to five rows from the search that supplied the chosen account and only `custNo`, `custName`, `emailAddress`, `masterCustomerAcct`; it is `[]` when no rows were returned.

### Payload consequence and enforcement limit

A chosen account is placed in the create payload's `reseller.custNo` and `reseller.masterCustomerAcct`. Blank or zero master account values do not map to a reseller. Without a usable reseller, the payload omits `reseller` rather than sending null; the workflow reports the missing reseller for review handling. A contact row is preferred when its email exactly matches a non-internal thread person; otherwise the helper can use the first returned contact row.

The exact-domain and company-context test is an **agent instruction**. `first-account.js` maps the agent's selected account and applies only structural checks such as nonblank/nonzero account number; it does not independently verify domain equality or company relevance. Its first-row contact fallback must not be interpreted as permission to choose the first company from a raw customer search.

## 4. Operational checks for a successful run

- For RC, record the search term, date bounds, HTTP/error state, `matchedOn`, row count, selected `requestNo`, `relatedRequestNos`, and final `searchOutcome` or `existingRequestMatchStatus`. Verify the selected request's content before any update write.
- For customer search, record the chosen external `customerDomain`, each allowed attempt, the exact returned email domain, selected `custName`, and the account number source (`masterCustomerAcct` or permitted `custNo` fallback). Check that both account and name came from the same company row.
- Check the downstream create/update terminal state separately from the search decision. A found account or request is not proof that a note, attachment, status change, or create was completed.

## Source of truth

RC search: `src/spec-06/shared/lib/{match-priority,search-date-window,script-request-search,search-gate}.js`, `src/spec-06/shared/node-glue/{search_existing_request,rc_search_request,build_update_agent_context,enforce_update_result}.glue.js`, and `src/spec-07/mcp-integration/tools/rcs_request_search/{schema,runtime}.md`.

Customer search: `src/spec-06/shared/node-glue/build_create_agent_context.glue.js`, `src/spec-06/create-request/handoff/handoff_ok/ifCondition/create_agent/prompts.md`, and `src/spec-06/shared/lib/{first-account,capture-agent-tool-results}.js`.
