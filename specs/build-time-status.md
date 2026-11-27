# Project status, read when the site builds

**Status:** approved by the owner, 27 November 2026 (#30)
**Vision:** "Project status fetched at build time (for example last update, milestone progress) so the site never goes stale"; principle 5 (public by design: no private data, no secrets).
**Decision (the owner, 27 November):** the development system publishes a small public file with each project's percentage done and last update, and the site reads it when it builds.
**Checklist item:** `live-project-status`

## The problem

This repo is public and three of the six projects are private. The site cannot hold a token to read them, and it must not publish anything about them beyond what the owner has agreed to show.

## The file

One JSON file, `project-status.json`, on a branch of this repo named `status` that holds nothing else. The development system writes it; nothing in this repo's build writes it.

```json
{
  "version": 1,
  "generated": "2026-11-27",
  "projects": [
    { "id": "the-island", "percent": 20, "updated": "2026-11-26" }
  ]
}
```

- `id` is one of the six project ids in the site's project data file.
- `percent` is a whole number from 0 to 100: the share of that project's 2026 checklist that is done. It is left out for a project with no checklist.
- `updated` is the date of the newest change merged to that project's main branch.
- **Nothing else is allowed.** No titles, issue numbers, names, links or text from any repository. The site ignores any other field.

## What the visitor sees

On each project card and at the top of each project page, one line of text: "72% of its 2026 scope · updated 26 November". When a project has no percentage, only the date. The line is text, never colour alone.

## When the file cannot be used

If the file is missing, cannot be read, does not match the shape above, or its `generated` date is more than 14 days old, the build still succeeds. The cards then show the fixed status written in the project data file, and the build prints a warning. A visitor never sees an error or an empty space.

## How fresh it is

The file changes at most once a day. The site shows whatever the file held when the site was last built. Rebuilding the site on a schedule is not part of this spec; it needs a deploy step that is the owner's to set up.

## Not in this spec

Anything fetched in the visitor's browser; charts; history; status for anything other than the six projects.

## Acceptance criteria

1. The build reads the file over plain HTTPS with no token and no secret in this repo.
2. Only `id`, `percent` and `updated` ever reach a page.
3. The four bad cases (missing, unreadable, wrong shape, stale) each fall back to the fixed status and are covered by tests that use fixtures, not the network.
4. The line appears on all six cards and all six project pages.

## Choices made in drafting

The owner chose the approach. These points were chosen here and are approved with this spec: the file lives on a `status` branch of this repo; it holds a percentage and a date only; and it is treated as stale after 14 days.

## Build

Publishing the file is an issue in the development system's repo. Reading and showing it is #33.
