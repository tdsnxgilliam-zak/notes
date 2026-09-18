# Current Logic Issues
---

## Precedence error

Receiving the following precedence error:

```text
2026-08-26T15:54:08.987680857Z
2026-08-26T08:54:08.986-0700
TL_requestid
MS_requestid
MS_traceid
MS_spanid
detail
fca-us
uat-mycis-us
workflow-sync-executor
karbon-fca-uat-f6a23e-k8s-worker-41
workflow-sync-executor-5b8b7d5cf9-mnkxl
01m0zc82bm6ryezvbk8z1eevqh
01m0zc9fbjwjfmh7rzn39v4v7c
01m0zcekakaqeg1243t43skgg5
01m0zcenbtsphf9vkztrwkqesh
idp_request_central
bizDev.email-triage.flow.cisco_sales_test_workflow
ep02_route_precedence_config_error
{"bizName":"inbox-301","recordId":"37aef7847b304f0ea7e3b5e7bebc8daf","systemNo":100}
120
ep02_route_precedence_config_error: recordId=37aef7847b304f0ea7e3b5e7bebc8daf -> FAILED_RETRYABLE reasonCode=MISSING_MAP
```
Where is this `MISSING_MAP` coming from?

---

## Errors reported from the business

Read all 7 items in UAT Testing Issue Tracker (I see you added the duplicate-thread one as item 7 — the attachment-split one isn't in yet, and it folds into cluster 1 below anyway).

What's actually the same issue
Cluster 1 — Attachment handling (items 4, 5, 6) All three report the same failure in different shades: files missing entirely, files corrupted, or files landing on the wrong request. Item 4: "corrupted files are attached to the RC. The quote cannot be processed without the required documentation." Item 5: "Without the required file attachments, the request cannot be processed." Item 6: "the attached file is corrupted." 14 distinct RCs are named across the three. Two of them — RC#7504726 and RC#7505046 — are cited in both item 4 and item 5, which is the strongest evidence you have that this is one root cause, not two.

Cluster 2 — Reseller/contact resolution (items 4, 5, 6) Identical wording in all three: reseller missing, or an incorrect reseller contact attached. Same RC population as cluster 1 — every RC with a file problem also has a contact problem. Likely the same upstream extraction step feeding both.

Cluster 3 — "New request vs. update to existing" (items 1, 6, 7) Item 1 (Blocker) is shipping-status emails opening new requests instead of updating: "Changing logic to determine if this can be an update to an existing request. If it is, it will attach the .eml and then update the notes section." Items 6 and 7 are the same defect from the other direction — one thread producing several requests. Item 1's fix already contains the fix for 6 and 7, and note that its remedy is attach the .eml to the existing request — which is also why attachments end up split across request IDs. Cluster 3 and cluster 1 are probably the same bug.

Cluster 4 — Routing (item 3) — "all requests are going to the sales operations brand", with a stated timeline of "Expect to be fixed early next week (08-24)". That date passed Monday; it's still marked In Progress today.

No action — item 2 is Closed: "Required a short configuration change."

Fix list for today (Wed, Aug 26)
Thread-to-request matching logic (items 1, 6, 7 — Blocker). Ship the "update existing request vs. create new" determination already designed in item 1. This is the highest-leverage fix on the board: it closes the Blocker and collapses two Major items with it. Item 1 still has two open decisions blocking it — the deterministic sender allowlist + shipping-pattern match, and the confirmed ignore/miss cases. Those need answers today or the code can't land.
Attachment integrity + attach-to-correct-request (items 4, 5, 6 — 14 RCs). Split into the two things that are actually different: files arriving corrupted, and files attaching to the wrong or a duplicate request. The second one resolves with fix #1; the first is independent and needs its own owner. Start reproduction with RC#7504726 and RC#7505046 — they appear in two separate reports.
Reseller contact extraction (items 4, 5, 6). Same RC set, currently unowned. Worth confirming today whether contact and attachment failures share an upstream step — if they do, this is one fix, not two.
Sales Ops brand routing (item 3). Two days past its committed date with no status change. Needs either a landed fix or a revised date today.
Housekeeping: items 4, 5, 6, and 7 are all still New with no Owner and no severity review — none have been triaged, though your SOP calls for a triage pass each morning. Items 4 and 5 are also filed as Major while item 1 (a narrower version of the same family) is a Blocker; with 14 RCs unprocessable, Major is probably understating them.

## Create vs. Update Logic

**Each email thread should only be one request.** <-- **This is a critical issue and must be fixed immediately.**

Avenues that are in the logic right now:

    - Supposed to use mongo db API call to find similar records, this does not always work and should be the first thing to check but not the last.
    - No other logic to check a requests previous threads.

**AVENUE TO FIX IT**:

*Normalize the request name deterministically.*

    - Create: Script-set requestName with a shared normalizer (strip RE:/FW:/[EXTERNAL], collapse whitespace). Prefer {normalizedSubject} | {order|quote|PO} when a commercial id exists; do not let the model invent a paraphrase. Keep it under 200 characters.

    - Create identifiers: Put a real quote on quoteNo when you have one. Put order/PO/deal into the stored title as the same token you will search later.

    - Update search: Always send createFrom and createTo (required). Use a multi-year window (for example 3–5 years back, createTo = now + 1 day), not 180 days. Search requestNo or quoteNo first, then requestName using the same normalized subject and id-only commercial tokens — not the raw subject, not a new LLM title.

    - Dates: Pass only createFrom/createTo. Do not send createDate/updateDate. Tighten the window only if a wide search returns too many rows.

---

