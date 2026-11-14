# Portfolio

A personal software-engineering portfolio: six projects, each with a live demo or recording, its code, and a case study on how it was built.

Planned stack: Astro + MDX on Cloudflare, with performance and accessibility budgets enforced in CI. Work in progress (November 2026).

## Commands

- Install (clean, locked): `npm ci`
- Build: `npm run build`
- Smoke check (run after build; checks generated routes and the MDX fixture page): `npm run smoke`
- Dev server: `npm run dev`

Requires Node 22 or later. `src/pages/example-project.mdx` is a synthetic fixture with placeholder content only.
