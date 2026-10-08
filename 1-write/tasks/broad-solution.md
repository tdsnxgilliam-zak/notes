# Broad Solution Investigation & Findings

## Background

I was tasked with investigating what it would take to implement digital transformation initiatives broadly across the organization. 

I started with email triage since it has the largest and most immediate impact on the organization.

All information was collected via meetings with stakeholders and technical experts, as well as reviewing existing documentation and code. 

---

## Should we begin with a broad solution in Q4?

No.


## Findings
---

> Below is a summary of the findings broken down by the specific application or service.

### Request Central

**Request Central** is a web application that allows users to submit requests and track the status of those requests.

Request central is not ready to be used for a broad solution. Already, we see issues with the application not being able to handle the volume of requests and APIs going down for extended periods of time. 

Request central is built on a monolothic architecture with a single database and a single application. This makes it difficult to scale and update the application, especially across multiple teams, vendors, and regions.

Updating critical components inside the application can cause cascading effects that leak into other vendors and teams withing the application. This is a major limitation to the scalability and maintainability of the application and will make automating onboarding processes difficult.

The application currently only has one TPM for all of the application, which is not enough to support the volume of onboarding we would expect for a broad solution.

Overall, request central is not ready in its current state to be used for a broad solution.

---

## Dev/TPM Team and Workflows

***Developer Count***
For email triage, we have one developer that is responsible for each instance of the service. This is not going to work as we begin to onboard more teams with the current workflow of developing and deploying new instances of the service.

We need to add additional developers to the team to support the volume of onboarding we would expect for a broad solution. 

***Workflows***

We currently have a workflow that allows for the development and deployment of new instances of the service at a greater rate than the surrounding governance structure allows.


We also have multiple codebases that are dissimilar in their architecture and development processes. This makes it difficult to scale and update the application, especially across multiple teams, vendors, and regions.

***Tech Debt***

We are currently accruing technical debt at an alarming rate. We need to address standardized processes for the following (which are just examples):
    1. Monitoring of costs associated with the service.
    2. Monitoring of LLM depracation and cost-saving opportunities.
    3. Monitoring of application performance and scalability.
    4. Monitoring of API uptime.
    5. Streamlined post-deployment processes for all instances of the service.

***Priorities***

Currently, we are overworking the team. We need to allocate development and TPM hours *realistically* given the current workflow and structure of deployment plans.

***Reliance***

There are two main points of reliance for the team:
    1. Request Central and its owners.
    2. The development team and its ability to scale and update the application.

We need to reduce our reliance on these points by:
    1. Implementing the necessary improvements to request central defined below. This will allow for teams to be onboarding autonomously.
    2. Automating specific areas of the development and deployment process.

---

## Solutions
---

### Request Central

Request central needs major rework to be able to support a broad solution.

1. Split the application into multiple services for each vendor, team, or group of teams.
2. Update API endpoints to support the new services.

---

### Dev/TPM Team and Workflows

We need more developer and TPMs to support the volume of onboarding and development we expect.

We need three things in order to improve the workflow (aside from more manpower):
    1. A way to automate the creation of test mailboxes and P1 approval processes for each newly deployed mailbox.
    2. Automatic Kafka registration of each newly deployed event component.
    3. NDP creation and Jira ownership in NA.

We also need to finish our current phases and develop a more strict management of scope.

---

## Overall Recommendations

1. Do not begin with a broad solution in Q4.
2. Document and standardize the development and deployment process for all instances of the service.
3. Add additional developers and TPMs to the team to support the volume of onboarding and development we expect.
4. Implement the necessary improvements to request central and align with TRDC.

***Overall, we need a quarter to regroup and develop a more structured approach to the development and deployment process.***

The one slide that actually decides it
Before the findings, executives need a single comparison:

Cost of delaying one quarter vs. expected cost of a Q4 broad launch that degrades.

Delay cost: quantified as deferred savings (X hours/month saved per onboarded team × teams that would have onb52oarded in Q4).
Failure cost: expected rework hours + SLA/escalation exposure + the credibility cost of pulling a live team back off the service.
If failure cost > delay cost, the recommendation writes itself. If you can't populate both sides, the rest of the deck is a debate.


Delay Cost Calculation:

((600,000 request per year * 8 mins per request) / 12 months) * $25 per hour

= ~$166,667 per month

Failure Cost Calculation:

Assuming $52 per hour for developers and TPMs

Developer hours for Request Central rework: 100 hours
TPM hours for Request Central rework: 100 hours
Developer hours for Dev/TPM Team and Workflows: 30 hours
TPM hours for Dev/TPM Team and Workflows: 30 hours

= $13,750 for the quarter

SLA/escalation exposure: 

Assuming $50 per hour for SLA/escalation exposure
Assuming an increase to 10mins per request and 20% of requests are SLA/escalation incidents:

600000 x 20% x 10mins = 1,200,000 mins

20,000 hours * $50 per hour = $1,000,000

Credibility Cost: 
Teams will be slow to onboard. Pulling of a live team back off the service will damage the credibility of the team and the service.
This will also cause major increases in SLA for moving back to the service.
Outages may disrupt our reputation with customers and partners.


Built correctly, this model doesn't need to be rigged — **your original $500K delay cost was the thing working against you**, and it was wrong. Fixing it does most of the work.

One caveat worth internalizing before you collect anything: build it so it *can* fail. If the numbers come back and the model says go broad, you need to know that before a VP's analyst finds it. The version below has an explicit tripwire section for exactly that reason — and having it in your back pocket is what makes the recommendation read as rigorous rather than motivated.

---

# Part 1 — Numbers to solidify

### Group A · Value per request
| # | Input | Symbol | Where to get it |
|---|---|---|---|
| A1 | Annual in-scope request volume | `R` | Request Central reporting | 600,000 requests per year
| A2 | **Measured** minutes saved per request | `M_saved` | Live email triage instances — before/after handling time. Your 8 min needs a source | 8 minutes per request
| A3 | Fully-loaded hourly cost of a request handler | `C_handler` | Finance/HR — burdened, not base. Your $25 is likely base | $40
| A4 | Deflection/accuracy rate | `D` | Triage telemetry — if only 85% of requests are fully handled, savings scale down | 85%

### Group B · Capacity — this is the decisive group
| # | Input | Symbol | Where to get it |
|---|---|---|---|
| B1 | Dev hours to onboard one instance | `H_dev` | Time tracking / Jira on past onboards | 0
| B2 | TPM hours to onboard one instance | `H_tpm` | Same | 80 hours
| B3 | Governance elapsed days per instance | `G_days` | Mailbox + P1 approval + Kafka + NDP gate timestamps | 15 days
| B4 | Net available dev hours in Q4 | `Cap_dev` | FTE × ~480 hrs/quarter, **minus** current run/support load | 240 hours
| B5 | Net available TPM hours in Q4 | `Cap_tpm` | Same | 240 hours
| B6 | Run/support hours per live instance per quarter | `H_run` | The metric that shows each onboard permanently eats future capacity | 
| B7 | Live instance count today | `N_live` | Known | 5
| B8 | Annual request volume per team | `V_team` | `R ÷ teams in scope` — **you must define "broad" to get this** | 600,000 / 20 = 30,000 requests per team

### Group C · Request Central reliability
| # | Input | Symbol | Where to get it |
|---|---|---|---|
| C1 | Change failure rate | `CFR` | Deploy → incident/rollback history. **This is what grounds `P_fail`** | ?
| C2 | Incident count + total downtime hours, last 3 quarters | `I_n`, `I_hrs` | Incident log | (50% per team - 8 min * 20 teams * 15,000 request) / 60
| C3 | Baseline escalation rate today | `E_base` | Request Central error/escalation data | 5%
| C4 | Projected escalation rate at broad load | `E_broad` | Extrapolate from load-vs-error trend | 50% (included load degradation)
| C5 | Incremental escalation handling minutes | `T_esc` | **Degraded minus baseline** — not total handling time | 
| C6 | Fully-loaded escalation labor rate | `C_esc` | Should exceed `C_eng` — escalations pull senior time |


Hi team, 

I noticed that IDP for all cisco sales mailboxes have been deactivated. Talking with Varshil I see it is because the volume of requests are too high and the runtime is too long for the workflow.

I have done some optimizations for the following:
1. Minimize the number of toolcalls LLMs are able to run (most significant in reducing runtime)
2. Cut the total number of nodes in half
3. Removed unused shared libs

If you are still receiving OOM errors, then the memory heap size for that service needs to be increased. We are expecting >1.2 million emails to go through this service each year, meaning the `workflow-sync-executor` needs to be able to handle many concurrent requests.

Right now, the Cisco teams are reporting that they are at 10-15% of the expected volume. In the near future (1-2 months) we will be expecting a much greater volume.

Let me know what I can do to help.

Best,
Zak

### Group D · Cost of proceeding
| # | Input | Symbol | Where to get it |
|---|---|---|---|
| D1 | Migration hours to re-onboard one instance post-split | `H_migrate` | Architecture estimate — the "pay twice" number |
| D2 | Rollback hours to pull one team off | `H_rollback` | Estimate |
| D3 | Probability of material degradation at broad scale | `P_fail` | Derive from `CFR`; present as low/base/high |
| D4 | Program pause length if failure occurs (quarters) | `Q_pause` | Judgment — 1 to 3 |
| D5 | Fully-loaded dev/TPM rate | `C_eng` | Verify $52 is burdened |

---

# Part 2 — The formulas, in order

**1 · Value per request**
```
V_req = (M_saved ÷ 60) × C_handler × D
```

**2 · Q4 onboarding ceiling** ← the number that wins the argument
```
N_dev = Cap_dev ÷ (H_dev + H_run_dev ÷ 2)
N_tpm = Cap_tpm ÷ (H_tpm + H_run_tpm ÷ 2)
N_gov = 90 ÷ G_days × (parallel gate capacity)

N_max = MIN(N_dev, N_tpm, N_gov)
```
The `÷ 2` accounts for instances onboarded mid-quarter carrying only partial run load.

**3 · Volume actually realizable in Q4**
```
Vol_Q4 = N_max × (V_team ÷ 4) × 0.5
```
The 0.5 is ramp — instances land throughout the quarter, so average coverage ≈ half of exit coverage.

**4 · True delay cost**
```
DelayCost = Vol_Q4 × V_req
```

**5 · Cost of proceeding** — three components
```
MigrationDebt = N_max × H_migrate × C_eng
EscCost       = Vol_Q4 × (E_broad − E_base) × (T_esc ÷ 60) × C_esc
FailCost      = P_fail × [ (N_max × H_rollback × C_eng) + (Q_pause × DelayCost) ]

ProceedCost = MigrationDebt + EscCost + FailCost
```

**6 · Decision**
```
NET = ProceedCost − DelayCost        →  NET > 0 means do not go broad
```

**7 · Breakeven failure probability** ← your strongest slide
```
P_breakeven = (DelayCost − MigrationDebt − EscCost)
              ÷ (N_max × H_rollback × C_eng + Q_pause × DelayCost)
```

Note that Request Central rework hours appear **nowhere** — you pay those on either path, so including them was the category error from before.

---

# Part 3 — Illustrative run

Using your real figures where you have them and clearly-marked placeholders elsewhere (40 teams, 80 dev hrs, 60 TPM hrs, 240 net hrs each, `P_fail` 35%, 2-quarter pause):

```
V_req              $3.33
N_dev 2.67 | N_tpm 3.69 | N_gov 3.00  →  N_max 2.67 instances

Vol_Q4             5,000 requests
DelayCost          $16,667      ← vs. your $500,000
MigrationDebt      $8,320
EscCost            $2,167
FailCost           $13,608
ProceedCost        $24,095

NET                +$7,428      →  DO NOT go broad
P_breakeven        15.9%
```

The delay cost fell from $500,000 to **$16,667** — a 30x correction — for one reason: **you cannot capture $500K/quarter because you don't have the people to onboard the teams that would generate it.** Capacity is the binding constraint, not the go/no-go decision. That single correction inverts the entire model.

---

# Part 4 — The argument this sets up

Don't fight over estimates. Put the breakeven on the slide:

> *"Proceeding in Q4 is the right call only if Request Central's probability of material degradation under 6x load is below **16%**. Our observed change failure rate is **[CFR]%.**"*

If your measured `CFR` exceeds the breakeven, the recommendation holds without anyone having to accept your dollar assumptions. That's a much harder position to attack than a stack of estimates.

---

# Part 5 — Tripwires

The model flips toward "go broad" if:

- **`N_max` comes back high** (>6–8). If onboarding is cheaper than assumed or you have more slack, delay cost rises fast and the case weakens.
- **`CFR` is low** (<10%). If Request Central's deploys are actually stable, `P_fail` collapses and so does `FailCost`.
- **`H_migrate` is near zero.** If instances onboarded on the monolith carry over cleanly post-split, migration debt vanishes — that's a third of your proceed cost.
- **`E_broad ≈ E_base`.** If load doesn't degrade escalation rates, the SLA argument disappears entirely.

`N_max` and `CFR` are the two that matter most. Collect those first — if both land where you expect, you have your answer and can stop measuring.

---