# Vault Guide

This repository is an Obsidian knowledge and work vault. Preserve its
human-authored Markdown and its folder conventions; make focused additions
instead of reorganizing existing material unless explicitly asked.

## Top-level layout

- `0-read/` — reference material and things to read.
- `1-write/` — authored working notes, organized by topic. Daily notes live
  in `1-write/daily/`.
- `2-execute/` — operational work and execution artifacts.
- `3-share/` — notes intended to be shared with other people.
- `4-configure/` — vault configuration, documentation, and helper scripts.
- `5-apps/` — app-specific projects and templates.
- `.obsidian/` — local Obsidian configuration. Treat it as user-managed and
  do not change it unless asked.

## Daily notes

Daily notes follow this path pattern:

```text
1-write/daily/MM-DD-YYYY/MM-DD-YYYY.md
```

The directory date is the Monday beginning that note's week, while the file
date is the actual day. For example, a Thursday note on October 1, 2026 is
stored at `1-write/daily/09-28-2026/10-01-2026.md`. A week folder may also
contain `week.md` for a weekly note.

Use the established template and heading order:

```markdown
---
tags:
  - daily
date: YYYY-MM-DD
---

# Daily Note

## Meets

## TODO

## Notes
```

Use `4-configure/new-daily-note.sh` to create a missing daily note. It uses
today when no date is supplied, accepts a date argument for backfills or
planning, calculates the correct Monday folder, and will not overwrite a
note that already exists. New notes also receive a `date` field for the
actual note date.

## Writing conventions

- Keep notes in plain Markdown. Daily notes use YAML front matter for the
  `daily` tag and actual note date.
- Preserve existing headings, links, and task state when editing a note.
- Prefer clear descriptive filenames, typically lowercase with hyphens, except
  for daily-note dates and established project naming.
- Do not delete, rename, or mass-format notes without explicit approval.
