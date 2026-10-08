---
title: Cisco Options for Service
date: 2026-08-04
updated: 2026-08-06
status: draft
owner: Zak Gilliam
tags:
    - cisco
    - email-triage
    - request-central
    - taxonomy
    - blocked
---

# Cisco Options for Service

## Purpose

Document how Cisco service/product options are configured so that automated email
triage can create requests in Request Central with the correct routing values.
The immediate goal is to obtain the **Cisco Sales** mapping/config equivalent to the
**Cisco Cloud** version Darla already shared.

---

## Taxonomy
- Service(s)
    -  Product(s)
        - Category
            - Sub-category
                - Sub-service

**Key insight:** Configuring both service and product is all we need to do — queues are
automatically assigned.* We do not need to specify a queue, owner, or routing team
directly; queue assignment is derived from the service + product combination.

### Fields that carry the mapping

| Field | Role in triage | Source |
|---|---|---|
| `productBrandNo` | Identifies the product/brand being requested | Cisco Cloud config (Darla) |
| `serviceTypes` | Identifies the service being requested | Cisco Cloud config (Darla) |
| `productBrandSubServiceNo` | Narrows to the sub-service leaf of the taxonomy | Cisco Cloud config (Darla) |

Each **request type** maps to a combination of these three values. The sales equivalent
of this mapping is the missing piece.

---

## Human-Review Configuration

- Human review location is attached to the **human review task code**.
- Implication: the review destination is not chosen separately at request-creation time —
  it travels with the task code, so selecting the correct task code implicitly selects
  where the request lands for review.
- Open item: confirm whether Cisco Sales uses the same human-review task codes as
  Cisco Cloud, or a separate set.

---

## Current State

| Item | Status |
|---|---|
| Cisco **Cloud** mapping (request type → productBrandNo / serviceTypes / productBrandSubServiceNo) | ✅ Received from Darla |
| Cisco **Sales** mapping (same structure) | ❌ Outstanding — blocking |
| Queue assignment logic | ✅ Understood — automatic from service + product |
| Human-review routing | ⚠️ Partially understood — tied to task code; sales-side codes unconfirmed |

**Blocker:** Without the sales mapping, the system cannot populate the required fields when
it creates a request, so Cisco sales inbox triage cannot be enabled or tested.

---

## Communique with Lori

**Nimra — last communication:**
> Hi Thompson, Lori— quick ask. For the Cisco sales inboxes, could you send us the
> mapping/config that's currently used to triage requests into Request Central? Darla shared
> the version her team has for Cisco Cloud — it maps each request type to productBrandNo,
> serviceTypes, and productBrandSubServiceNo. We're looking for the sales equivalent so our
> system knows what to send when it creates a request.

*Response:* Lori did not respond. She **read** the Teams message but did not reply.

**Next communication (me):** Teams message with Lori, Nimra, and Darla — group thread so
Darla can point to the Cloud version as the template and reduce ambiguity about what is
being asked for.

### Draft Teams message (do not send yet)

> **Hi all — following up on the Cisco Sales triage mapping (time-sensitive).**
>
> Nimra asked last week for the mapping/config currently used to triage requests into
> Request Central for the Cisco **sales** inboxes. Darla already shared her team's **Cisco
> Cloud** version, which maps each request type to `productBrandNo`, `serviceTypes`, and
> `productBrandSubServiceNo` — we're looking for the sales equivalent in that same format so
> our system knows what to send when it creates a request.
>
> **Why this is urgent:** this is the last open dependency before we can turn on and test
> automated triage for the Cisco sales inboxes. Until we have the sales mapping, every
> request our system would create is missing required routing values, so the build is
> stopped — not slowed. Each day this sits, it pushes the testing window and the go-live
> date out one-for-one, and sales email volume keeps queueing up for manual handling in the
> meantime.
>
> **What we need:** the request type → `productBrandNo` / `serviceTypes` /
> `productBrandSubServiceNo` mapping for Cisco Sales, in whatever form it exists today
> (spreadsheet, export, or screenshot is fine — it does not need to be cleaned up).
> Also useful if you have it: the human-review task codes used on the sales side, since the
> review location is attached to the task code.
>
> **Ask:** could you drop it in this chat **today**? If it doesn't exist in one place, even a
> partial list or a pointer to who owns it gets us unblocked. If it's easier to walk through
> live, I'm happy to grab 15 minutes today or tomorrow morning.
>
> Thanks — happy to take the assembly work off your plate if you can point me at the source.

---

## Next Steps

1. Send the group Teams message to Lori, Nimra, and Darla with a **today** deadline.
2. If no response by end of day, offer a 15-minute call and copy in the mapping owner
   Lori identifies.
3. If still no response by 2026-08-07, escalate — the delay is now on the critical path.
4. Once received: diff the Cisco Sales mapping against the Cisco Cloud version to confirm
   field structure matches before wiring it into request creation.
5. Confirm whether human-review task codes differ between Cloud and Sales.

## Open Questions

- Does a Cisco Sales mapping already exist in a maintained form, or does it need to be built?
- Who owns/maintains it if not Lori?
- Are sales request types a superset, subset, or entirely separate list from Cloud's?
- Do any sales request types map to more than one sub-service (ambiguous routing)?
