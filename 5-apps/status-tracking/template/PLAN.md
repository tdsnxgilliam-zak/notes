Step 3: Map Your Slide Structure
Here's your current node map — these are the IDs the app will target:

Card	Node ID	Content
Project Goal	2:40	Goal + success criteria
In-Scope / OOS	2:44	IN items / OUT items
Key Stakeholders	2:49	Names, roles
Timeline Summary	2:53	Date-based milestones
DRAFT Badge	2:32 (child)	Status indicator
Slide Frame	2:32	Parent overview slide

```txt
project-plan-app/
├── server.js          # Express server that calls Figma API
├── src/
│   ├── App.jsx        # Form UI
│   └── figmaClient.js # Figma REST API wrapper
├── config.json        # File key + node ID map
└── package.json
```

```json
{
  "fileKey": "6RWV822G6eneHwsBKK5y9V",
  "nodes": {
    "slideFrame": "2:32",
    "goalCard": "2:40",
    "scopeCard": "2:44",
    "stakeholdersCard": "2:49",
    "timelineCard": "2:53"
  },
  "defaults": {
    "status": "DRAFT",
    "statusColor": { "r": 0.95, "g": 0.3, "b": 0.2 }
  }
}
```

## User Interaction

**Title Slide**
- Allow for changing of all names/fields and removal of fields with pixel-perfect code and reordering.

**Project Overview**
- Each card should be resizeable based on how many items are there
- Goal & Objective cards should be modifiable with different tiers of importance related to visual and typographic weight.
- In Scope Out of Scope directly modifiable for items (add item with type modal?)
- Key Stakeholders should have contact cards and roles
- Timeline summary should be automatically date orderd with 
    - DATE
    - ONE-WORD TITLE (where text like "Blackout" is)
    - SHORT DESC
All directly modifiable from in the application

**Goal Slides**

Goals are cards that you can click on with desc, and some metadata presentation (status, contacts, importance, etc.) only title and short desc is required

Tasks and deliverables relate to a goal - they are checkboxes
    - each task may have an owner not required
Ownership is a contact card 

Status is tracked directly in the weekly goals and percentage is derived from tasks // deliverables.

ignore summary for now
