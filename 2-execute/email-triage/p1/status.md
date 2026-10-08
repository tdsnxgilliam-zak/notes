---
title: Status 08-04-26 of Cisco Email Triage
date: 2026-08-04
status: IP
tags:
  - cisco
  - email-triage
  - status
---

# Status 09-18-26 of Cisco Email Triage
Meeting: Friday, 2026-09-18 | Attendees: Donna March, Nicholas Ahearn, Zak Gilliam

## Zak Gilliam

### Immediate / this week
- [x] Post follow-up steps in the chat — "create like a set of just like follow-up steps
      from what we talked about today and I'll just send it in the chat... so we're all
      clear on what needs to get done and who owns it"
- [x] Draft the first comms email to the broad Cisco team (reassigned from Donna:
      "instead of me creating the first e-mail notification out, Zak, you're going to
      work on that"). Generate it from this meeting recording, send to Donna to approve.
      Content: going live in production on the bolded email boxes; set the expectation
      that a Request Central queue item is "the shell of the e-mail... not assigned to
      anyone yet," so users must verify the request has the right action, correct it if
      wrong, and send feedback back for root-cause analysis.
      Timing: NOT due Monday — "it doesn't have to be done by Monday... next week would
      be fine," but sooner is better.
- [o] Round up and stand up the ambassadors — "first step, honestly, for next week,
      would be to just round people up and get ambassadors set up"
- [ ] Attend Monday's call with Nico + broader managers (invite already accepted).
      No prep required — "You guys don't need to prepare"; attend as a fly on the wall.

### Before the week of Oct 5
- [ ] Schedule + run informational forum sessions (one late next week, one the week of
      the 28th). Not training — "more like a forum where I'd have a presentation."
      Cover: what decisions the system makes vs. what users must validate, and how the
      workflow differs in Request Central vs. Outlook.
- [ ] Set the Teams meeting to record; invite the managers of the team boxes as the
      minimum audience and have them forward to their teams; send the recording link out
      to everyone under Cisco afterward.
- [ ] Build the Copilot/SharePoint agent to replace a traditional war room.
      Knowledge source: the meeting transcript, "and tell it not to go beyond there."
      Responsibilities: "A, intake all questions, comments, concerns about the system and
      format them, and provide responses when available"; create a ticket for Zak when it
      can't answer. Rationale: avoid 100+ people in a single Teams chat getting spammed.
- [ ] Duplicate the UAT issue tracker for prod; have the agent feed standardized issues
      into it and flag repeats/escalations; share the tracker for transparency.
- [ ] Contact Anthony Lai to get the agent set up and broadly accessible
      ("we have a pretty good system in Biz Ops to get co-pilot agents set out")
- [ ] Add documentation to the existing Cisco sales email triage SharePoint (where the
      issue tracker lives) so all ambassadors have access
- [ ] Load all documents into SharePoint for Nick and make Nick an admin owner
- [ ] Set up the weekly all-ambassadors call (one group call, not individual; ~30 min).
      Agenda: issues collected, commonality, what's being done to fix them — not line by
      line. Keep it "a very structured meeting with no room for deviation."
- [ ] Send Nick the recording if he doesn't receive it by default

### Next few weeks
- [x] Work with leadership to expedite/prioritize the dev work — dev team is back on the
      7th and "they're going to be stacked." Target go-live: week of Oct 12 at the
      earliest, pending QC and the approval chain into production.
- [ ] Add SMB and MSP mailboxes to UAT in the next couple weeks and test the behavior
      before assuming they can go straight to prod (caveat: "there is some stuff that
      needs to happen with China"). Can be discussed after the 12th.
- [ ] Notify Donna as soon as SMB/MSP are in UAT so she can tell Jenn Pierce
- [ ] Trial the new process in UAT — "we should try this out with UAT, people looking at
      stuff in UAT as well"
- [ ] Move the workflow off MCP, ideally before production — every tool call requires a
      handshake in Dev Studio, and the volume "is taking down Request Central APIs...
      just like all the time." Only MCP call left is creating a new request.
- [ ] Do future-proofing architecture planning for orchestrating the other agents, then
      identify current owners — "It's not all those projects have an owner right now."
      Nabil owns CTO-to-Spare.

### Explicitly OUT of scope for Zak
- [x] PO processing pipeline in the change-management documents — Donna: "I would not
      include that in your document." Handle via a smaller group discussion first; Nick:
      keep it "on the download" and release separately a couple weeks later so PO gets
      its own visibility.

## Donna March
- [ ] Set up Monday's call with Nico and the broader managers of these teams (topics:
      timing for the email boxes, triage concerns going into Request Central, what to be
      prepared for); forward it to Lori Thompson
- [ ] Forward the Monday meeting invite to Zak and Nick as soon as it comes out
- [ ] Review/approve Zak's draft comms email — "we can get together on Monday and take a
      look at it"; confirm the narrative and approach are correct before it goes to the
      leadership team for distribution down to their teams
- [ ] Work with Bret Perry on user training documentation
- [ ] Find a Request Central request created by IDF (AI Triage) to use as the example
- [ ] Ask each team leader to identify one ambassador from their team
- [ ] Tell Jenn Pierce once SMB/MSP are in UAT
- [ ] Set up the smaller-group discussion on the PO management approach; pull Zak and
      Rodolfo into a call from Canada if the timing feels right

## Nicholas Ahearn
- [x] Forward Nicko's "Mailbox and task management tools" item to Zak — done in meeting
- [x] Send Zak the Monday meeting invite — confirmed sent and accepted
- [ ] Find out whether there's a cap on how many individuals can access a
      SharePoint-created agent — "I can find out about it for you if you're going to use
      Copilot"
- [ ] Build the first version of the agent from the transcript once Zak loads the
      documents (offered: "if you want me to do that, I'm happy to do that too")
- [ ] Configure the agent to post opening statements, closures/fixes, and ETAs so
      everyone gets updates without being pinged with constant issues
- [ ] Add Bret's documentation to the knowledge base as clickable prompt questions
      ("How do I change this or how do I change that?")
- [ ] Attend the weekly ambassador call if wanted, to help "herd the cats in"
- [ ] Discuss PO management approach with Donna while in Canada

## Bret Perry (via Donna)
- [ ] Create training documentation walking a user through Request Central: open a
      request created by IDF/AI Triage, review the emails and files, correct the action
      if wrong (e.g. created as a pricing quote but it's really an order), and assign it
      to a person — "this is also how you want to audit it and fix it within Request
      Central"

## Jenn Pierce (via Donna)
- [ ] Assign someone to review the SMB/MSP mailboxes in UAT once they're loaded

## Team leaders / ambassadors
- [ ] Each team leader: identify one ambassador from their team
- [ ] Ambassadors: join the weekly call, circle back to their core team in a weekly
      update, and bring team chatter forward
- [ ] Managers: forward the forum invite to their teams, get in front of their teams,
      watch the recording, "and make sure that everyone has the same starting point"

## Key dates
- Mon 2026-09-21 ....... Call with Nico + broader managers
- Week of 2026-09-21 ... Ambassadors identified; first informational forum (late week)
- Week of 2026-09-28 ... Second informational forum
- Wed 2026-10-07 ....... Dev team returns
- Week of 2026-10-05 ... Go-live communication sent to broad Cisco team
- Week of 2026-10-12 ... Production go-live on the bolded email boxes (earliest)
