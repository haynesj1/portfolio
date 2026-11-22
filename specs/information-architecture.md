# Information architecture and visual concept

*Draft for the owner's review. Status: **not approved**. Judged against `docs/vision.md`. No page templates or case-study content exist yet; this spec must be approved before either is built.*

## 1. Goals

Turn the vision's core journey (land, scan, try, understand, reach out) into a concrete site map, page anatomy and visual direction, so templates and case studies can be built without guessing. Where the vision does not decide something, it appears in section 8 as an owner choice, not a decision.

## 2. Site map

| Route | Purpose | Journey step |
|---|---|---|
| `/` | Landing: who, what kind of work, six project cards, route to contact | Land, Scan |
| `/projects/london-living/` | Project page, centrepiece live demo | Try, Understand |
| `/projects/the-island/` | Project page | Try, Understand |
| `/projects/goals-assistant/` | Project page (private repo) | Try, Understand |
| `/projects/kindle-daily/` | Project page | Try, Understand |
| `/projects/clear80/` | Project page (private repo) | Try, Understand |
| `/projects/development-system/` | "How this was built" | Understand |
| `/about/` | Short about (depth depends on choice B) | Land, Reach out |
| `/contact/` | Contact route (depends on choice A); also a footer link on every page | Reach out |

Case studies live on each project page (one scrolling page per project, with an in-page contents list), not on separate routes. One page per project keeps the journey short and avoids a second navigation level. Navigation is one row: Projects (jumps to the cards on `/`), How this was built, About, Contact. It must fit at 375 px without a hamburger menu.

## 3. The journey, step by step

1. **Land (first 5 seconds).** Above the fold at 375 px: name, one sentence on the kind of work (data, product and AI-assisted engineering), and the first card row peeking in. No carousel, no hero video.
2. **Scan.** Six cards in a fixed order: London Living (largest, featured), The Island, Goals Assistant, Kindle Daily, Clear80, Development system. Each card: title, one-line promise, a still visual, a status chip (for example "Live", "Recording", "In build") and last-updated date from build-time data. The whole card is one link.
3. **Try.** Each project page opens with the demo before any prose: a live embed or a short recording. Never a dead link. If a live embed cannot load, the recording poster and a text description show instead.
4. **Understand.** Case study directly below the demo, readable in under five minutes, with code links where the repo is public.
5. **Reach out.** Closing block on every project page plus the footer link; one action, no choice overload.

## 4. The six project pages

All six share one template (section 5). What differs is the demo and the evidence available.

| Project | Demo | Code link | Notes |
|---|---|---|---|
| London Living | Live embed of the discovery app (centrepiece) | Public repo, if public at launch | Embed is lazy-loaded behind a "Start the demo" button so it cannot hurt LCP. Poster and recording as fallback. |
| The Island | Short recording of a session screen plus a playable audio excerpt, if the owner approves one | Public repo | Wording is "relaxation", never treatment claims. |
| Goals Assistant | Recording only | None (private) | Recording must use synthetic data; see choice C. |
| Kindle Daily | Short recording of a generated issue being opened on a Kindle or reader, with a screenshot and sample EPUB excerpt as supplementary material | Public or none, per repo status | Sample must not expose personal preferences. |
| Clear80 | Recording only | None (private) | Synthetic data only; see choice C. |
| Development system | Short recording walking one issue through to merge, with the annotated diagram and live build-time numbers as supplementary material | Public ops repo only if the owner chooses | Centrepiece of "how this was built". |

## 5. Page anatomy

### Project page (top to bottom)
1. Title, one-line promise, status chip, links (code, if any).
2. **Demo** block (section 6).
3. **Case study** block (section 7).
4. Facts strip: stack, dates, milestone progress (build-time fetched).
5. Contact block, then "next project" link.

### Landing page
Intro, six cards, short "how I work" line linking to the development system page, contact block.

## 6. Demo layout

- Full content width, 16:10 on desktop; on 375 px full-bleed with a taller 4:5 frame for phone apps.
- Default state is a poster image with an obvious "Try it" or "Play recording" button. Nothing loads or plays until the visitor asks, which protects LCP and INP and respects motion preferences.
- Recordings: short (under 60 seconds), captioned, no autoplay, a visible pause control, and a text transcript beneath in a collapsed section.
- Live embed: an iframe with a title, a visible "Open full screen" link as the keyboard and small-screen escape, and a failure message with the recording as fallback.
- Fixed aspect ratio reserved up front, so the swap from poster to demo cannot shift layout (CLS ≤ 0.1).

## 7. Case-study layout

A fixed spine, so readers learn it once. Each section is a heading plus short prose, with evidence beside the claim:

1. **What it is and who it's for** (3 sentences).
2. **What was hard.**
3. **What I decided and why**, with the alternatives rejected.
4. **How I know it works**: a number, a test result, a screenshot or a link. No claim without one (vision principle 1).
5. **What went wrong or is still missing** (vision principle 4; required, not optional).
6. **Code and links.**

Reading width about 65 characters, base text 18 px at 375 px, headings in a logical h2/h3 order, in-page contents list at the top that collapses to a single line on a phone. A case study only starts once its app is about 70% through its milestone, as the vision says.

## 8. Open owner choices

None of these is decided here. Each has a recommendation, matching the vision's open questions where they overlap.

### A. Contact route
- **Option 1: email link (`mailto:`).** No backend, no spam handling, works everywhere. Exposes the address to scrapers unless lightly obfuscated.
- **Option 2: contact form.** Hides the address but needs a backend or third-party service, adds privacy and accessibility work.
- **Option 3: LinkedIn only.** Zero build, but excludes people without an account and depends on a third party.
- **Recommendation: option 1**, with a LinkedIn link beside it. Matches the vision's recommendation.

### B. How personal the about section is
- **Option 1: work only.** A few lines on the kind of work, no personal detail.
- **Option 2: short about, no photo.** Two or three paragraphs on background and approach.
- **Option 3: short about with a photo.** Most human, but adds a personal image to a public repo.
- **Recommendation: option 2.** Gives a hiring manager context without publishing personal data. Matches the vision's recommendation.

### C. Evidence for private apps (Goals Assistant, Clear80)
- **Option 1: recordings and case study, no code links.** Safe; the demo uses synthetic data only.
- **Option 2: add redacted code excerpts in the case study.** More proof, but each excerpt needs review for private details.
- **Option 3: describe only, no recording.** Safest, weakest "show, don't claim".
- **Recommendation: option 1.** Matches the vision's recommendation. the owner should approve each recording before it is published.

(Domain, the vision's first open question, is a deployment matter, not an IA matter, and is left to that issue.)

## 9. Visual concept

Direction, not a final design. All colours and fonts are placeholders until the owner approves a direction.

- **Tone:** quiet, editorial and exact: lots of space, one strong typographic voice, restrained colour. The projects supply the colour through their own screenshots; the site frame stays neutral.
- **Type:** one variable sans for text, optionally one display face for headings, self-hosted, `font-display: swap`, under about 100 KB total.
- **Colour:** neutral light and dark schemes following `prefers-color-scheme`, one accent used for links and focus. Contrast at least 4.5:1 for text.
- **Layout:** a single column on phones; at 1280 px a 12-column grid with the cards in a 2-by-3 layout, London Living spanning two columns.
- **The "quietly inventive" touch (polish phase only):** on the development system page, an interactive diagram that steps through issue, branch, review and merge, with the live numbers behind it. On cards, a subtle hover or focus lift. Nothing is built until the polish phase, per the vision.

## 10. Critique against the vision's principles

### 375 px (phone)
| Principle | Plan | Risk and mitigation |
|---|---|---|
| Performance: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | Text-first landing, one optimised image above the fold, demos load on request, fixed aspect ratios, no client JS for navigation | Six card images could slow LCP: lazy-load all below the fold, serve AVIF/WebP with explicit dimensions. London Living iframe is the heaviest item: only loads on tap. |
| Accessibility: zero axe violations, no overflow | Single column, 44 px touch targets, one-row nav without a menu, visible focus, alt text on all visuals, captions on recordings | Four nav items plus the name may overflow at 320 to 375 px: check in the existing quality script; fall back to wrapping onto two lines. Long code and URLs in case studies must wrap. |
| Motion: purposeful, reduced-motion respected, visible toggle | No motion in the base design; toggle sits in the footer and header | The toggle must be reachable without scrolling a long page: keep it in the header. |
| Honest, public by design | Required "what went wrong" section; synthetic-data recordings | Recordings can leak private data: owner approves each before publishing. |

### 1280 px (desktop)
| Principle | Plan | Risk and mitigation |
|---|---|---|
| Performance | Same budgets; larger images only via `srcset` | Wide hero images tempt oversize assets: cap at the displayed size. |
| Accessibility | 65-character reading width, skip link, landmarks, logical heading order | A 2-by-3 card grid can make reading order differ from visual order: keep DOM order equal to the visual order. |
| Motion | Hover and focus states only until the polish phase | Hover-only affordances must also exist on focus and touch. |
| Scan in two minutes | All six cards visible without scrolling past one screen and a half | If the featured London Living card pushes others below the fold, shrink it rather than add a carousel. |

## 11. Not covered here

Page templates, case-study content, the domain choice, the build-time status fetch and the London Living embed mechanics. Each is its own issue once this spec is approved. `docs/vision.md` is not changed by this spec.
