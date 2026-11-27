# Portfolio — vision

*Approved by the owner on 8 November 2026 (#4); last changed by the owner on 27 November 2026 (#30). This is the contract: agents may not change it, and every issue and PR is judged against it.*

## What it is

The owner's public portfolio site: six projects, each shown working, with its code and an honest case study of how it was built. One of the six is the AI development system that built the others.

The site is itself the first piece of evidence. It should be fast, accessible and quietly inventive, so a visitor has already formed a view of the owner's craft before reading a word.

## Who it's for

- **First:** a hiring manager, recruiter or senior engineer deciding whether to talk to the owner. They have two minutes, often on a phone, and want proof, not adjectives.
- **Second:** a peer or collaborator who wants to go deeper: how the data work was done, how the agents are kept safe, what went wrong and what was learned.

## The core journey (what "working" means)

1. **Land:** in five seconds, who the owner is and what kind of work this is (data, product and AI-assisted engineering).
2. **Scan:** six project cards, each with a one-line promise, a visual and a status.
3. **Try:** open a project and use it straight away: a live embed or a short recording, never a dead link.
4. **Understand:** a case study that answers "what was hard, what did you decide, and how do you know it works?" in under five minutes, with links to code.
5. **Reach out:** a clear, low-friction way to get in touch.

## Principles

1. **Show, don't claim.** Every claim has a working demo, a number or a link behind it. No skill bars, no buzzword clouds.
2. **Performance is a feature.** Budgets are requirements and checked in CI: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, on a mid-range phone.
3. **Motion with purpose.** Interaction and animation explain something (how data flows, how an app reveals results); they never block reading. Everything respects `prefers-reduced-motion`, with a visible motion toggle.
4. **Honest case studies.** Each one names the trade-offs, the dead ends and what's still missing, as well as the wins.
5. **Public by design.** This repo is public: no private data, no unpublished details of the private apps, no secrets. Anything sensitive is described, not shown.

## Done for 2026 (the `done-2026` milestone)

The site is **done** when all of these are true:

- [ ] **Live** on a custom domain (Astro + MDX on Cloudflare), with the performance and accessibility budgets enforced in CI.
- [ ] **Information architecture and visual concept** agreed (spec plus a design-critique pass) before the case studies are written.
- [ ] **Six project pages**, each with a live demo or recording, code links (where the repo is public) and a case study: London Living, The Island, Goals Assistant, Kindle Daily, Clear80, and the development system.
- [ ] **London Living embedded live** as the centrepiece demo.
- [ ] **"How this was built":** a case study of the agent development system, drawn from its system reviews and metrics: what it automated, where people stayed in the loop, what broke.
- [ ] **Project status fetched at build time** (for example last update, milestone progress) so the site never goes stale.
- [ ] **Quality bar:** Lighthouse ≥ 90 on mobile for performance, accessibility and best practice; zero axe violations; no layout overflow at 375 px.
- [ ] **Polish:** the interactive touches go in last, once the content is solid.

## Not in 2026

A blog or CMS; comments; analytics beyond privacy-friendly page counts; a CV generator; multiple languages; showing private repositories' code.

## Decisions

Answered by the owner on 26 and 27 November 2026 (#21, #30).

1. **Domain:** one personal domain, with apps on subdomains. The site goes live on Cloudflare's free address first and the domain is attached when the owner has chosen it; "live" in the done list still means the owner's own domain.
2. **How personal:** a short about section with no photo. A placeholder stands in until the owner supplies the text.
3. **Contact:** an email link with a LinkedIn link beside it. The email address is one on the portfolio's own domain, so until the domain exists the page carries the LinkedIn link only.
4. **Private apps:** recordings and case studies, with no code links; the owner approves each recording before it is published.
5. **Case studies:** an agent drafts each one from that project's decisions, reviews and numbers, and the owner edits and approves it. "How this was built" can start now; each app's study starts once the app is about 70% through its milestone.
6. **Project status:** read when the site builds from a small public file that holds each project's percentage and last update and nothing else ([`specs/build-time-status.md`](../specs/build-time-status.md)).

## Order of work

1. **Foundations (weeks 1–2):** scaffold Astro + MDX, `.ops.yml`, CI with the performance budgets, a preview deploy.
2. **Concept (weeks 2–3):** information architecture, visual concept and the design critique.
3. **Content (weeks 4–6):** the six project pages and case studies; a case study only starts once its app is about 70% through its milestone.
4. **Polish (weeks 6–7):** interactivity, the London Living embed, final quality pass, custom domain.
