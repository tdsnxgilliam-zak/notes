# Cisco CSET V2: co-design kickoff

**Participants:** Donna, Nicholas, and me  
**Length:** 60 minutes  
**Working context:** Email triage, a critical dependency for this work, is moving into production now. V2 is my main priority for the end of Q4 and Q1.

## Purpose

Start designing together how we will understand and improve the process once email triage is running. Align on the decisions the business needs to make, what evidence would support them, and how we will turn that into a practical reporting, SLA, and tracking build spec for Nicko.

This is a working conversation with people who already know the project and each other. The aim is to leave with a direction and a way to work together, not a finished dashboard or a fixed list of metrics.

### Outcomes for this hour

- A shared description of the most important business decisions and unanswered questions.
- A short, **provisional** set of measures to investigate, including what production triage needs us to observe now.
- An understanding of what existing reporting already provides and where a new view could add value.
- Agreement on the next 1–2 working sessions, near-term owners, and how we will validate success criteria with Nicko.

## Before the meeting

- Bring a brief, current update on the triage production transition: what is going live, known unknowns, and any information already captured. Avoid implying a release date or capabilities that have not been confirmed.
- Bring a simple example of an email progressing through triage and Request Central, if available, and any existing reports or screenshots readily at hand. No prework is required from Donna or Nicholas.
- Have a shared note open with the capture table below. Use the questions as prompts, not a checklist.

## 60-minute agenda

### 0–5 min | Reconnect and frame the work

> “With email triage moving into production, I want us to start shaping what comes next together. This is my main focus through the end of Q4 and Q1. I'd love your perspective on what the business needs to see and decide, what already exists, and how we can build something useful together. Today is about setting direction; we can get more detailed over the next couple of sessions.”

- Is there anything important about the current transition or your priorities that should shape this conversation?
	- Nothing particularly important - they are takign 10 mailboxes live now and have a longer list ready to go in the next iteration.
- Confirm the intended outcome and invite them to adjust the agenda.

### 5–15 min | Start with the decisions

Ask each person for their perspective before converging:

- Once triage is running, what will you and the business most need to know? What decision or action would that information enable?
- Where is visibility missing today? Who feels that gap: operational teams, business leaders, or someone else?
- Looking toward new mailboxes, what would you need to see before deciding what to improve or expand next?

**Capture:** Two or three priority questions, the people making the decisions, and what they would do differently with better information.

### 15–30 min | Follow one example and identify signals

Walk through one representative email from arrival and triage into the Request Central process, using an actual example if one is available. Ask where the team can see what happened, where a handoff or exception might be missed, and what they would want to know if something went wrong.

- Which signals would show whether triage is working and where human follow-up is needed?
- What would help explain workload, timeliness or SLA performance, and business value? Which of those matter most now?
- What would make a measure trustworthy: its definition, comparison period, exclusions, or a baseline?
- What should we start capturing as production begins, even if the reporting comes later? What can be learned later?

Possible starting points to discuss—not agreed requirements: volume and disposition, exceptions or corrections, elapsed time against an agreed SLA, and a defensible estimate of time saved. Separate system activity from business outcomes; don't assume time saved or FTE impact without a baseline and validation.

**Capture:** Choose 2–3 candidate measures or signals and the decision each supports. Mark definitions, baselines, feasibility, and targets as open until verified.

### 30–42 min | Existing tools and audiences

- What reports or tracking tools do you already rely on? What do they answer well, and where do they fall short?
- Where should we reuse or extend an existing capability? What would a new capability need to add to justify itself?
- What would business or executive users need at a glance, and what detail would help me investigate, improve the system, and guide the next features?
- Are there examples or owners of existing reports we should speak with?

**Capture:** Existing assets and gaps, plus an initial distinction between business and developer views. Treat executive needs as a question to validate, not a settled design.

### 42–52 min | Scope and co-design path

- Of the questions and measures we listed, which are essential for an initial useful version and which can wait?
- What decisions or dependencies could change that scope? What needs to be learned while triage enters production?
- Who else needs to inform the design, and when should we bring Nicko in to verify the metrics and success criteria?
- Does the proposed sequence below fit your availability and how you like to work?

**Capture:** A tentative first-version focus, deferred ideas, key dependencies, and agreement on the next session's purpose.

### 52–60 min | Reflect and commit

Read back the priority questions, candidate measures, and first-version focus. Ask Donna and Nicholas what is missing or misrepresented. Agree on owners and dates for the next actions, and book or identify a window for the next session. Explicitly flag unresolved items for follow-up.

## Working capture

| Decision or question | Audience / action | Candidate signal or existing report | Definition, baseline or data question | Priority / next step |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |
| | | | | |

**First-version focus:**  
**Ideas to revisit:**  
**Open questions / assumptions:**  
**Agreements and actions (owner + date):**

## Proposed path after kickoff

1. **Session 2 — define and explore.** Refine the priority measures, definitions and baselines; review existing reporting and sketch the business and developer views around real decisions. Check data feasibility and access findings.
2. **Session 3, if needed — converge.** Review a lightweight draft, resolve priorities and open questions, and agree what belongs in the initial build spec.
3. **Validate with Nicko.** Review the proposed metrics, success criteria, scope and outstanding tradeoffs; incorporate feedback before treating them as agreed.
4. **Prepare the build spec.** Capture audiences and decisions, prioritized requirements, metric definitions and data sources, access needs, acceptance criteria, dependencies, and unresolved decisions. Set timing with stakeholders rather than assuming dates.

In parallel, I will follow up with Megan Marckel about reporting access and Travis about existing reporting and available data, as identified in the [V2 goals](../v2-goals.md). Explore whether data can be available locally or in a protected environment, with access appropriate to each audience. These conversations inform feasibility; they do not need to hold up the co-design discussion.
