# Claude.md — Project Guidelines

Guidelines for Claude Code when working in this repo. Keep this updated as the project evolves.

## Project Overview
<!-- What is this? Who is it for? -->
Personal design portfolio site (static HTML/CSS/JS), built to match a Figma design at:
https://www.figma.com/design/4o7TY4ea66bwpObwC3VAbl/Portfolio-Design

## Tech Stack
- HTML
- CSS (`styles/colors.css`, `styles/type.css`, `styles/styles.css`)
- JS (`nav.js`)
- No build tooling / framework yet

## Commands
<!-- Add real commands once they exist (build, serve, lint, deploy) -->
- Dev server: TBD
- Lint/format: TBD
- Deploy: TBD

## Design System
- Source of truth for design is Figma (link above) — match spacing, type, and color tokens from there.
- Colors live in `styles/colors.css` as CSS custom properties on `:root`. Add new tokens there, don't hardcode hex values in component/page CSS.
- Typography tokens belong in `styles/type.css`.
- Keep `styles.css` for layout/component styles that consume the tokens above.

## Code Style
- No inline styles — use the CSS files.
- Use CSS custom properties (variables) for anything that repeats (colors, spacing, font sizes) instead of magic values.
- Keep HTML semantic (use `<section>`, `<nav>`, `<header>`, etc. over generic `<div>` soup where reasonable).
- Keep CSS semantic and mirroring HTML structure whenever possible over unnested CSS class soup

## Conventions
- File naming: kebab-case
- Commit style: TBD

## Do
- Ask before restructuring the file/folder layout.
- Keep changes scoped to what's asked — don't refactor unrelated files.
- Use existing tokens when possible when writing new code, especially when pulling from Figma

## Don't
- Don't add a JS framework or build tool without asking first.
- Don't commit design assets (exported images, etc.) without checking file size/optimization.

## Notes
<!-- Anything else Claude should know: quirks, decisions, things to avoid repeating -->
