# Cisco Sales Email Triage Workflow Hotfixes

## Action Assigned To
---
Originally, when updating action status using API - the `Assigned To` field would change to the Application Account.

Now, it uses the originally assigned account from the action - with the application as fallback for failures or if there was no other account.

**Evidence**:
![[Pasted image 20261117151019.png]]

## New Action When One is Closed
---
Originally, when an action was set to `COMPLETED` - the workflow would update the same `COMPLETED` action. This made it impossible to see when new emails occured from a completed action. 

Request Central does not allow moving from a terminal status back to an open status. So we need to create another action.

Now, it will create a new action so the business has visibility into the new emails.

New Action when Closed:
![[Pasted image 20261117151226.png]]

