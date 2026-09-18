---
title: Status 08-04-26 of Cisco Email Triage
date: 2026-08-04
status: IP
tags:
  - cisco
  - email-triage
  - status
---

# Status 08-04-26 of Cisco Email Triage

## Work in Progress

**TOP PRIORITY**
- [ ] Get all three major components in UAT
- [ ] E2E Testing
- [ ] Update BRD
- [ ] Update TDD 
- [x] Finalize intake logic
- [x] Build deduplication logic
- [x] Build POST logic for data model into MongoDB
- [ ] Finish taxonomy stuff - Nimra
  - [ ] Note the human review service number to put into the code
  - [ ] Note all other action // service numbers to put into the code.

**OTHER**
- [ ] Work on documentation consolidation

## E2E Testing

- [x] Find out who needs to figure out the taxonomy logic.
- [x] Ingestion logic still needs testing.
- [x] Need to give raw eml data to the AI models as it's not yet hydrated.
- [x] Need to ensure all forward nodes are actually pointing to something.
- [ ] Add visibility into the AI nodes
- [ ] Add visibility into most other gates - why decisions are there

## BRD Updates

- [ ] Remove references of human-review mailbox (movement back to RC)
- [ ] Finalize taxonomy in BRD (needs Nimra first)

## Next Week

- [ ] Put in IDP codes for all mailboxes
- [ ] Finalize e2e testing by Tuesday
- [ ] Push for SME review by Wednesday 
- [ ] Push for go-live by Friday



Write results back to IDP -> Fix some prompts for the agents -> Test the update agent -> Test customer lookup -> test on real data -> test the reading of idp results for updates

## What's left for e2e

- [ ] Persistence, reading, and upsertion of data model from/into MongoDB
- [ ] Update agent logic
- [ ] 


## Everything That Needs to Be Done Before Production

- [ ] Finish E2E Testing (Tuesday)
- [ ] Start testing on sales mailboxes (Wednesday)
  - [ ] At least 100 emails from 101 - use for cost calculation
  - [ ] Slowly add in more mailboxes
- [ ] SME Review (Friday)
- [ ] Work with Varshil on Production (Next Week)

## Tasks
**Nimra**
- [x] Reach out to Nicholas to schedule SME reviews
- [x] Reach out Varshil for path to production
- [x] Work on Forward logic & Gather examples from Cisco Sales
- [-] Consolidate documentation using Github Copilot
- [ ] Either create or add to war room

**Zak**
- [x] Finalize persistence logic
- [x] Reach out to Darla for UAT testing plan advice
- [ ] Gather examples from Cisco Sales for Forward logic
- [ ] Build UAT testing plan for e2e to show SMEs

**Ron**
- [ ] Mailbox and IDP readiness
- [ ] Video for SME review



*Are we storing the ticket no. in the data model?*

*Set up Redirect with mailbox owners*

## Notes from Varshil Meeting
# Cisco Email Triage - Production Readiness Checklist
Based on Meeting with Varshil Shah

## 🚨 Highest Priority Items

### AI / LLM Production Approval
- [ ] Confirm AI workflow nodes are approved for Production
- [ ] Request AI budget/cost estimation template from Varshil
- [ ] Estimate expected LLM usage and costs
- [ ] Complete required template
- [ ] Create EasyVista ticket for AI/LLM access
- [ ] Submit to Cloud Engineering for review
- [ ] Verify Azure account/provisioning is completed
- [ ] Obtain production API key / model access
- [ ] Validate AI nodes can run in Production environment

> Varshil specifically noted that previous projects have successfully deployed but failed because AI access was never provisioned in Production. 【1-3bdcf9】

---

## Production Dependency Validation

### MCP Verification
- [ ] Create inventory of all MCPs used by workflow
- [ ] Verify each MCP exists in UAT
- [ ] Verify each MCP exists in Production
- [ ] Verify Production authentication works
- [ ] Verify Production permissions are granted
- [ ] Test MCP connectivity from Production environment

> If a workflow reaches Production before its MCP dependencies are available, the workflow will fail. 【1-3bdcf9】

---

### API Verification
For EVERY API used:

- [ ] List API name
- [ ] Confirm endpoint exists in UAT
- [ ] Confirm endpoint exists in Production
- [ ] Verify Production credentials
- [ ] Verify Production authentication
- [ ] Verify Production permissions
- [ ] Perform end-to-end testing

Potential APIs:
- [ ] Request Central APIs
- [ ] Microsoft Graph APIs
- [ ] Internal TD SYNNEX APIs
- [ ] MCP endpoints
- [ ] Any workflow integrations

> Varshil stressed validating that every API used in UAT is also available and approved in Production. 【1-3bdcf9】

---

# Mailbox & IDP Readiness

### Mailbox Validation
- [ ] Confirm all 10 Cisco Sales UAT mailboxes exist
- [ ] Confirm all corresponding Production mailboxes exist
- [ ] Confirm mailbox names match expected configuration
- [ ] Verify mailboxes are linked correctly in IDP
- [ ] Verify mailbox permissions are assigned

---

### P1 Approval Verification
For every mailbox:

- [ ] Confirm P1 approval status
- [ ] Verify IDP allows mailbox selection
- [ ] Verify component saves successfully
- [ ] Verify no IDP validation errors remain

> Varshil noted that IDP validates P1 approval before allowing mailbox configuration. 【1-3bdcf9】

---

# UAT Evidence Package

## Test Case Documentation

For every workflow path:

### Input
- [ ] Sample email
- [ ] Request type
- [ ] Expected classification

### Expected Results
- [ ] Classification outcome
- [ ] Routing outcome
- [ ] Request Central creation
- [ ] Human review decision
- [ ] Folder movement

### Actual Results
- [ ] Actual classification
- [ ] Actual routing
- [ ] Actual RC ticket created
- [ ] Actual review outcome

### Supporting Evidence
- [ ] Screenshots
- [ ] Workflow logs
- [ ] Request Central ticket evidence
- [ ] Folder movement evidence
- [ ] Confidence score evidence
- [ ] Review queue evidence

> QC approval will require evidence demonstrating that the workflow behaved as expected. 【1-3bdcf9】

---

# Deployment Approvals

### Deployment Workflow
- [ ] Submit deployment package
- [ ] Obtain Marvin approval
- [ ] Obtain IT Leader approval
- [ ] Obtain QC approval
- [ ] Schedule Production deployment
- [ ] Complete activation

> Varshil outlined a formal approval path prior to Production deployment. 【1-3bdcf9】

---

# Deployment Planning

### Blackout Window Check
- [ ] Review deployment calendar
- [ ] Identify blackout periods
- [ ] Confirm deployment timing is allowed
- [ ] Obtain any additional approvals if necessary

> Deployment restrictions may apply during blackout periods. 【1-3bdcf9】

---

# Production Rollout Strategy

### Activation Plan
- [ ] Deploy workflow
- [ ] Validate mailbox ingestion
- [ ] Validate classification
- [ ] Validate routing
- [ ] Monitor first production requests
- [ ] Track error logs
- [ ] Confirm RC ticket creation

### Rollback / Safety Strategy
- [ ] Document IDP deactivation procedure
- [ ] Verify activation/deactivation process
- [ ] Confirm monitoring ownership
- [ ] Define escalation path

> IDP can be enabled or disabled as a safety mechanism without removing the deployment entirely. 【1-3bdcf9】

---

# Immediate Action Items (This Week)

## Priority 1
- [ ] Confirm AI approval process status
- [ ] Get LLM cost estimation template
- [ ] Submit EasyVista request
- [ ] Validate Azure provisioning requirements

## Priority 2
- [ ] Inventory all MCP dependencies
- [ ] Inventory all APIs
- [ ] Confirm Production availability for each dependency

## Priority 3
- [ ] Complete UAT evidence package
- [ ] Gather screenshots
- [ ] Gather workflow logs
- [ ] Gather Request Central evidence

## Priority 4
- [ ] Verify mailbox setup
- [ ] Verify P1 approvals
- [ ] Verify IDP configuration

## Priority 5
- [ ] Begin deployment approval process
- [ ] Coordinate deployment timing
- [ ] Validate blackout windows