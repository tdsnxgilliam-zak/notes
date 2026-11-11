---
tags:
  - fde
  - operating-model
date: 2026-11-06
---

# FDE Operating Model: Open Questions

Sources: [[11-06-2026]] daily notes (Reyna meeting), `003-reyna-intake-presentation.pptx` (slides 03, 04, A7, A8, A6, A9), and [[001-quick-discussion-nate|discussion with Nate]].

What the deck already commits to (so I don't re-ask it):
- Rhythm: Market signal → Shape a solution → Build & test → Review → Hand off. Steps 1–4 repeat until the build is proven.
- Principles: "NA leads; we scale globally." "Pods decide. Sponsors confirm. Go tell, don't ask."
- Four keys: Autonomy + sponsors, Tools (Foundry + CIS, TBC), Data ("give us access; cleaning it is our job"), Deploy (own the sandbox, fast track to prod; IT and architecture still approve go-live).
- Intake: one door, L0–L1 sponsors only, no side-door requests.
- Scoring: Value, Criticality, Feasibility, Scale, Time to proof. T-shirt sizes S–XL, thresholds TBD.
- Funding: $1.75M annualized to FDEs. Results by mid-January.

What Reyna's feedback says is missing: a *more defined* operating model, one that drives success criteria forward without eroding what's already built, with a stronger scope, defined success measures and reporting.

Nate's discussion broadens the frame: the operating model should describe how our group works alongside the rest of the organization and acts as a catalyst for change, as well as how FDE pods deliver missions. That includes the relationship between exploring new profit pools and strengthening the core, enabling digital transformation with sales, and making existing capabilities more widely usable. These are directions to develop and validate, not settled commitments.

---

## 1. Scope and mission

- [ ] What is in scope for an FDE pod, and what is explicitly out? (Net-new builds only? Fixes to existing platforms? Data work? Process redesign?)
- [ ] Is "Agentic Digital / micro-SMB" the pod's scope, or one example of a mission type?
- [ ] What are the key IT outcomes we are trying to drive (Reyna's "beginning")? Which 3–5, in priority order?
- [ ] How does a pod's scope get set, narrowed and frozen once a mission is committed? Who can change it mid-flight?
- [ ] How does the scope relate to the existing roadmap? Does FDE work replace, add to, or compete with it?
- [ ] What is the definition of "done" for a mission, and for the whole pod?

## Organizational role and change

- [ ] What changes should our group catalyze across the organization, beyond delivering individual FDE missions? How will we know those changes have taken hold?
- [ ] How do we work alongside core teams and the wider organization to explore new profit pools while strengthening the core? Where do responsibilities and decision rights meet?
- [ ] How do we connect with Reyna's digital enablement work and the sales organization to make the selling experience more seamless and enable that transformation?
- [ ] If CIS is the core, how do digital, ERP and CDP fit into that ecosystem? What value and new possibilities could come from bringing them closer together, and what must be protected?
- [ ] How do we carry successful changes into existing teams' processes, ownership and ways of working, and how do we measure adoption and impact after hand-off?

## 2. Core: what we preserve and protect

- [ ] What is "the core"? Name the systems, data and processes (Q2C, PartnerFirst, ERP, quoting, ordering, escalation).
- [ ] What must not be touched or degraded (SLAs, revenue flows, compliance, partner experience)?
- [ ] What are the non-negotiable guardrails for building next to the core (change freezes, blast-radius limits, rollback requirements)?
- [ ] Who owns the core, and who signs off that a pod's work did not erode it?
- [ ] How do we document the core today? Does that documentation exist, and where is it?
- [ ] What gets pulled back or paused to create capacity (Reyna: "what are we going to pull back")? Who decides, and what is the trade-off?

## 3. Integration versus standalone

- [ ] Rule check: "no point solutions, integrate existing solutions wherever possible." How is that enforced, and what does a legitimate exception look like?
- [ ] What gets integrated into the core, and what stands alone? What is the decision test?
- [ ] What does "seamless" mean for the partner, access and selling experience, and how do we test it?
- [ ] Which existing solutions should a pod check before building? Is there an inventory (including Foundry and CIS)?
- [ ] How does the autonomous and end-user-direct distribution work connect to the existing partner-led model without channel conflict?
- [ ] What is the "environment as the source of truth" statement? (Notes cut off. Which environment, and the source of truth for what?)

## 4. Platform decision

- [ ] Deck says "Leaning: integrate"; the notes frame it as "is it worth the cost structure?" What is the actual cost comparison across Parallel / Integrate / Replace?
- [ ] What questions are still open that would change the decision, if technically every question has an answer?
- [ ] Who is the decision maker? Who is responsible for informing them, and with what evidence?
- [ ] What is the decision deadline, and what does the pod do in the meantime?
- [ ] What triggers a move from Prove → Decide → Scale?

## 5. Roles, decision rights, governance

- [ ] Who are the sponsors (L0–L1), by name? How many can a pod have?
- [ ] "Pods decide. Sponsors confirm." What decisions are the pod's alone, and which need confirmation? Is there a RACI?
- [ ] Where do IT and architecture sit? What exactly do they approve at go-live, and what is the SLA for it?
- [ ] "Go tell, don't ask": what limits apply (budget, data, customer-facing, legal)?
- [ ] Who is the "core team" that receives the hand-off? Are they named, staffed and willing before a build starts?
- [ ] What is the pod makeup (roles, headcount, skills)? How does $1.75M map to people, tools and spend?
- [ ] Who arbitrates conflicts between sponsors, or between a sponsor and a core team?

## 6. Intake and prioritization

- [ ] What is the intake artifact (form, one-pager, meeting)? What fields are required?
- [ ] How do requests from outside L0–L1 get routed, and who closes the loop with the requester?
- [ ] How is the 5-criterion score weighted? Who scores, and who breaks ties?
- [ ] What are the S/M/L/XL dollar thresholds? How many concurrent missions can a pod carry?
- [ ] What happens to candidates that don't get picked (backlog, decline, route to the core team)?
- [ ] How are the NDP issues I'm working through related to this intake path, or do they sit outside it?

## 7. Delivery lifecycle and cadence

- [ ] Review cadence is "TBD": what rhythm (weekly, biweekly) and who attends?
- [ ] What are the stage gates between Shape → Build → Review → Hand off, and what are the exit criteria for each?
- [ ] What is a "small pilot with eyes on scale"? Size, duration, user count, kill criteria?
- [ ] What does the sandbox look like (environment, data, access), and how fast is the "fast track to prod" in days?
- [ ] What is the hand-off package (docs, runbook, support model, training)? When does the pod "move on," and is there an acceptance step?
- [ ] How does the global scale-out work ("NA leads; we scale globally") for regions with different systems, rules and languages?

## 8. Data, tools and access

- [ ] What data access do pods get on day one, and who grants it? Which sources are blocked today?
- [ ] "Governed data is an output": who owns the governance outcome, and where does cleaned data live?
- [ ] Are Foundry and CIS confirmed? What is the status and what are the gaps?
- [ ] Which shared APIs and data definitions exist, and which need to be built?
- [ ] What security, privacy and compliance reviews apply to agent work, and how long do they take?

## 9. Guardrails and risk (agents)

- [ ] Who owns the rules agents operate within (disclosure, pricing bands, escalation, legal)?
- [ ] Who approves pricing bands, and where are they stored?
- [ ] What is the escalation path and SLA when an agent hands off to a person?
- [ ] What is the legal sign-off process and lead time before customers see anything?
- [ ] What is the incident process if an agent misbehaves in production?

## 10. Success measures and reporting

- [ ] What are the pod-level success criteria versus per-mission success criteria?
- [ ] Deck metrics are "TBD": is the primary metric zero-touch share vs a control group? What baseline and target?
- [ ] How do we build the control group, and is it feasible for micro-SMB?
- [ ] Cost to serve forecast (0.72% → 0.19%, ~$223K flat cost base): who owns it, and is it what we report against?
- [ ] What is the reporting mechanism (dashboard, monthly review, exec readout), who consumes it, and where does the data come from?
- [ ] What counts as success *by mid-January*, and what counts as failure?
- [ ] How do we show we did not erode the core? Which health metrics are tracked alongside?
- [ ] What is the return story for the $1.75M, and how is it tracked?

## 11. Vendor angle

- [ ] What is the vendor ally model (via Sergio's team)? What's the co-invest ask?
- [ ] What conditions must hold before we monetize the FDE capability with vendors?
- [ ] How do vendor-specific add-ons fit in without turning into point solutions?

---

## Priority for the Reyna follow-up

Smallest set that unblocks a "more defined" operating model:
1. Scope in/out and the key IT outcomes (§1).
2. Core inventory, protections and who signs off (§2).
3. Integrate-vs-standalone test and the platform decision owner (§3, §4).
4. Decision rights and the hand-off owner (§5).
5. Success metrics, baseline, reporting path (§10).
6. The group's role in organizational change, its connections to core teams and sales, and how change is adopted (Organizational role and change).

---
## Notes / answers

***Section 1: Scope & Mission***

*What is in scope for an FDE pod?*
All types of builds. Only high criticality issues. (Navy SEAL analogy here)

*Agentic-Digital the scope or example?*
Agentic digital is an **example** of a mission type.

*What are the key IT outcomes?*
The key IT outcomes are:
1. Rapid production of high-criticality solutions
2. Integration of existing processes, builds, and tools into holistic solutions
3. Solutions co-designed and built from the source of the problem
4. Solutions that are easily integrated into existing IT architecture

*How does a pod's scope get set?*
A pods scope is set **once the pod correctly defines the problem**. Pods are expected to define the problem in its entirety and figure out the solution with the highest value at the lowest effort.


*How does the scope relate to existing IT roadmap?*
FDEs are **NOT** expected to compete, replace, or add to IT roadmap solutions that are already being built by traditional teams. They are expected to find problems that are either:
1. New territory that is high-criticality and high value
2. Territory where there are various point solutions with no cohesion between them

*What is the definition of "Done" for a mission?*
"Done", for an FDE pod, is when the problem has been correctly defined and there is a solution built to transform the business process that is successfully tested. Once this happens - the FDE pod hands off the solution to the TPM/SE team in that space (which the solution has been codesigned* with) and tackles the next mission.
\* Codesign: 90% us 10% them → As SME and for change management

---

***Section !: Organizational Role & Change***

**Core Teams**: 
- Business users (e.g. mid-market sales)
- SMEs 
- Related TPM/SE/IT teams for changed CIS areas (whoever is going to maintain it afterwards)

**Wider Organization**:
- Broader organization that we touch (e.g. All sales vs. mid-market sales)
- IT (NA Dev and China)

*What changes should our group catalyze across the organization, beyond delivering individual FDE missions? How will we know those changes have taken hold?*
- Who/what?
	- Traditional TPM/SE positions
	- Platforms - Tracks to production - 
-  **Leaving this one as there are so many things that we can catalyze - work with POD leads to identify priority**

*How do we work alongside core teams and the wider organization while strengthening the core?*
- Keep a mind on scale from the start - don't build something that wouldn't be transferrable to the larger business or existing processes
- Keeping the SE/TPM teams involved (not in terms of solutioning or decisioning)

*Where do responsibilities and decision rights meet?*
- We make the decision if it is justified (removing any resistence to change)
- Otherwise:
	- Exists with the business users
	- Relevant partners/vendors
	- Exists with the relevant TPM/SE teams
- 

***Section 2: "The Core" -- what we are preserving and protecting***

*What is "the core"?*
The core consists of the following:
**Systems**:
- CIS monolithic architecture
- PFC
**Data**:
- All CIS monolithic data & architecture



















