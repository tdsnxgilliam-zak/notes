# Hotfix self-test plan

Neither plan has been run yet. Both are drafted from the report.

## Self-test in UAT with logs

### 1. Closed action gets a new action (Case C)

> **Run this first.** Live UAT is still outstanding.

**Happy path**

Follow-up on a request whose only action is `COMP`

**Edge cases**

One open matching action plus one `COMP`, which should be Case A, not C. Two matching open actions, which should go to Review. Re-entering after an uncertain add-service response

**What to check**

`terminal_action` / `aligned` / `multiple_matching_open_actions`. **Only one new service. Notes go on the new action.**

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 2. Keep assignee

**Happy path**

Status update on an action assigned to a named user

**Edge cases**

Action with no `userId` on its active status row

**What to check**

**Assignee doesn't change.** `operatorSource=specifiedOperator` on the happy path, `current_user_fallback` on the edge case with no error

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 3. Needs Review notes

**Happy path**

Vague mail with no product, so brand confidence is low

**Edge cases**

Review for another reason, such as several matching open actions

**What to check**

**First case gets the "could not confidently determine…" text.** Second keeps `Needs review: <reason>`

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 4. Filenames over 200 characters

**Happy path**

Attachment with a 250-character name

**Edge cases**

Name of exactly 200 characters. Extension longer than 20 characters. No extension

**What to check**

**Upload succeeds and the name is ≤200 with the extension kept.** A 200-character name is left as is

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 5. Reseller + owner

**Happy path**

Forwarded mail from a known reseller contact's exact email

**Edge cases**

Gmail sender not in MDM: exact-email search only, no domain search, created as `NEDRVW` with no owner. Thread with internal people only. Lookalike domain (datacomm.com vs easterndatacomm.com)

**What to check**

**reseller, owner and `specifiedActionCreator` are set** in the create payload

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 6. Forward parsing

**Happy path**

Outlook forward with `Last, First <email>`

**Edge cases**

;-separated lists, nested `<a@b.com<mailto:a@b.com>>`, ServiceDesk icon links

**What to check**

**The original sender is the first candidate**

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 7. One RC search per run

**Happy path**

Update mail for an existing request

**Edge cases**

No match: create path, ≤9 searches, nothing searched before the POST. Ambiguous match goes to Review. RC returns an error. Mail with no quote

**What to check**

**Unique match is 1 search, 1 GET, Case A.** Errors end as failed, not "not found". Needs Review doesn't re-attach existing files

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

### 8. Denylist and vote

**Happy path**

Domain where one account name contains the domain's root word

**Edge cases**

Domain whose only rows are on 110486/794191: denied, logged in `customerSearchDenied`, treated as a miss. No name match: `domain_vote` picks the account with the most rows

**What to check**

**`domain_name_match` / `domain_vote`.** Tally in `customerSearchVotes`

**Screenshots**

<!-- Paste screenshots here in Obsidian. -->

**Description**

<!-- Record the scenario, observed result, and any discrepancy. -->

## Before handing off

Also run `dryrun-single-rc-lookup.mjs` and the unit tests (expect the **same 5 failures** that are already on `main`).

## What to curate for QC

QC tests what they can see in Request Central, not log names. Give them:

1. Test data, set up ahead of time:
   - Request numbers in specific states: COMP-only, one open action, two matching open actions
   - An action assigned to a named user
   - Known reseller contact emails
   - A gmail sender not in MDM
   - A domain whose only matches are demo accounts
   - A domain like birdi-inc.com
   - A file with a name over 200 characters
   - A real Outlook forward
2. A scenario sheet: one row per mail to send. Each row says which data to use and the expected result in RC: new action vs. updated action, assignee unchanged, reseller/owner filled vs. NEDRVW, note wording, file name and file count.
3. Pass criteria in RC terms only. For example, "assignee still Jane", not specifiedOperator.
4. Out of scope: IDP Failed move, ECExpress, request ID in subject. These are backlog, so they don't log them as bugs.
5. **Called-out checks**: **Case C live** and **`Action not found : 0`**. Neither has been confirmed in UAT yet.

If you want, I can turn the QC part into a shareable scenario sheet page.
