## Self-test in UAT

### 1. Closed action gets a new action (Case C)

> **Run this first.** Live UAT is still outstanding.

**Happy path**

Follow-up on a request whose only action is `COMP`

**What to check**

`terminal_action` / `aligned` / `multiple_matching_open_actions`. **Only one new service. Notes go on the new action.**

**Screenshots**

![[Pasted image 20261119115019.png]]
> Happy path successful


**Description**

Completed an action, then sent a new message under the same action. This created a new action as expected.

**QC test**

- **Steps:** Pick a request whose only action is Completed. Reply on that email thread with a new ask.
- **Pass:** The same request number now has a second, open action. The completed action is unchanged. The email and its attachments are on the new action. Exactly one new action, no duplicates.
- **Edge:** Pick a request with one open action and one completed action. Reply on the thread. Pass if the open action is updated and no new action is created.

### 2. Keep assignee

**Happy path**

Status update on an action assigned to a named user

**Edge cases**

Action with `userId` already with Application Account on its active status row

**What to check**

**Assignee doesn't change `assigned.Operator` on the happypath, `current_user_fallback` on the edge case with no error

**Screenshots**
![[Pasted image 20261119120905.png]]
> Successful retainment of original assigned user


![[Screenshot 2026-11-19 at 12.08.28 PM.png]]
> Edge case performs as expected - requests are not assigned without a user.

**Description**

Sent an email, which automatically assigned it to Application Account (expected).

Set the status to `WORK` wount.

Sent another email - AI updated action - retained my account being assigned.

**QC test**

- **Steps:** Send a new email so a request is created. In RC, set the action to Work so it's assigned to you. Reply on the same thread.
- **Pass:** The action is updated and is still assigned to you, not Application Account.
- **Edge:** Reply on a request still assigned to Application Account. Pass if it updates with no error and the assignee stays Application Account.

### 3. Needs Review notes

**Happy path**
 no product, so brand confidence is low

**What to check**

**First case gets the "could not confidently determine…" text.** Second keeps `Needs review: <reason>`

**Screenshots**
![[Screenshot 2026-11-19 at 12.12.15 PM.png]]
> Invalid brand successfully returns more informative notes

**Description**

A vague email was sent and the model could not determine request brand.

Moved to "Needs Review" (expected) - appended a message with actionable next steps and a summary

**QC test**

- **Steps:** Send a new email that names no product or brand (e.g. "Can you process quote?").
- **Pass:** The request lands in Needs Review. The note opens with a plain-language instruction ("could not confidently determine the product/brand… confirm… and process manually") plus a summary, not a raw code.

### 4. Reseller + owner

**Happy path**

Forwarded mail from a known reseller contact's exact email

**Edge Case**
Someone not in MDM sends a new email - sets their `firstName`, `lastName`, and `email`

**What to check**

**reseller and owner are set** in the create payload

**Screenshots**

![[Screenshot 2026-11-19 at 12.43.36 PM.png]]
> Reseller and reseller contact are named
![[Screenshot 2026-11-19 at 1.26.30 PM.png]]
> If they don't exist, they get attached by name/email ~ Bobby Pumpernickel **is not real**

**Description**

Reseller and reseller contact are in the email

If they are not in MDM - the behavior is: set their first name, last name, and email

**QC test**

- **Steps:** Forward an email from a reseller contact whose exact email is in MDM.
- **Pass:** The new request shows the reseller (name and address) and that
contact as owner.
- **Edge 1:** Use a sender at a known reseller's company domain whose own email isn't in MDM. Pass if the reseller is set and the contact is named from their email.
- **Edge 2:** Use a gmail sender not in MDM. Pass if the request is created in Needs Review with no reseller and no owner.

### 5. One RC search per run

**Happy path**

Update mail for an existing request

**Edge cases**

No match: create path, ≤9 searches, nothing searched before the POST. Ambiguous match goes to Review. RC returns an error. Mail with no quote

**What to check**

**Unique match is 1 search, 1 GET, Case A.** Errors end as failed, not "not found". Needs Review doesn't re-attach existing files

**Screenshots**

![[Screenshot 2026-11-19 at 12.46.33 PM.png]]
> Unique found - only 1 search occured

![[Screenshot 2026-11-19 at 12.47.35 PM.png]]
> No request found - only 2 searches

**Description**

If a request is found it typically only takes 1 search.

If a request isn't found it is typically only 2 searches - however, in the most extreme case, can be 9 (not all by `requestName` - by `requestId` or `orderNo`).

**QC test**

- **Steps:** Reply on the thread of an existing request, or send a new email that cites its request number or PO.
- **Pass:** The existing request is created.
- **Edge 1:** Send a brand-new email with no matching identifiers. Pass if exactly one new request is created.
- **Edge 2:** When a request ends up in Needs Review, pass if files already on it aren't attached a second time.
