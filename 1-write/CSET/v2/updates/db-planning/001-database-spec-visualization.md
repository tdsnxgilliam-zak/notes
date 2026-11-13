---
tags:
  - cisco
  - email-triage
FY: "27"
quarter: Q1
---

## Overview
---
To move towards true autonomous distribution orchestrators need access to shared data across pipelines and platforms. This should be codesigned by both developers and the business.

A **database** with a standardized schema should be introduced to allow for agents to use data from multiple workflows and data sources in their decisioning and reasoning processes.

**Example 1**:

*Agent A*: email traige agent that calls a PO to Quote workflow
*Agent B*: agent that turns customer POs into CIS quotes

*Example Data Connection*:
Agent A can call from previously processed data from Agent B to give more context, deduplicate, or lower reasoning costs for agent B.


![[001-database-spec-visualization 2026-11-12 14.55.24.excalidraw]]

