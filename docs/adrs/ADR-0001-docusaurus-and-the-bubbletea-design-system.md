---
status: accepted
date: 2026-08-15
decision-makers: [joestump]
governs: [SPEC-0001]
related: [ADR-0002]
---

# ADR-0001: Docusaurus, styled with the Bubbletea TUI design system

## Context and Problem Statement

Every project accumulates architecture decisions and specifications, and every
project publishes them differently — or not at all. The result is that the
artifacts exist in `docs/` but nobody reads them, because reading them means
cloning the repo and opening raw markdown with unrendered mermaid diagrams.

We want one documentation site that any project can adopt in an afternoon, that
renders ADRs and specs as first-class artifacts rather than as generic pages,
and that looks like it belongs to the rest of the estate rather than like a
default theme. What generator, and what visual language?

## Decision Drivers

* Adopting it must be closer to renaming four constants than to a migration.
* ADRs and specs need artifact-aware rendering: status badges, RFC 2119
  highlighting, cross-references between artifacts, relationship diagrams.
* The sites must be visually of a piece — a reader should recognise two of them
  as siblings.
* Publishing to a LAN-only Gitea Pages host **and** a public GitHub Pages host,
  from one build, without maintaining two configurations.
* Markdown authored in `docs/` stays the source of truth; the site is a view
  over it, never a second copy to keep in sync.

## Considered Options

* Docusaurus + a repo-owned content plugin, styled with the Bubbletea TUI design system
* MkDocs Material
* mdBook
* Raw markdown on the forge, no site at all

## Decision Outcome

Chosen option: **Docusaurus with the Bubbletea TUI design system**, because
Docusaurus's plugin API is what makes artifact-aware rendering possible at all —
the ADR and spec transforms are a build-time plugin rather than a pile of
pre-processing scripts — and because MDX lets a spec embed a real React
component (a requirement box, a badge) instead of approximating one in HTML.

The design system supplies the second half: a terminal-native visual language
(rounded Lip Gloss borders, monospace type, ANSI neon on blue-black) expressed
entirely as CSS custom properties. Because it is tokens rather than a theme
fork, the Infima bridge is one stylesheet, and Docusaurus upgrades do not
collide with it.

### Consequences

* Good, because ADRs and specs render as artifacts: status/date/decision-maker
  badges, RFC 2119 keywords picked out by obligation, cross-reference chips, and
  a per-artifact mini-DAG built from frontmatter.
* Good, because the whole palette is CSS custom properties, so the light/dark
  toggle repaints everything and no component knows which theme it is in.
* Good, because one build serves both hosts — only `url` differs, supplied by CI
  as `DOCS_URL`, so there is no second config to drift.
* Good, because markdown in `docs/` stays authoritative; the plugin generates
  MDX into a gitignored directory on every build.
* Neutral, because the site is a Node build. That is a toolchain a Go or Gren
  repo would not otherwise carry, though CI needs Node for nothing else here.
* Bad, because the content plugin is vendored per repo rather than published as
  a package, so a fix has to be ported to each consumer by hand. See
  [ADR-0002](ADR-0002-vendored-plugin-over-published-package.md) — this is a
  deliberate trade, and its cost is real.
* Bad, because Docusaurus is version-sensitive: node 23 fails outright on
  ProgressPlugin validation, so the node version is pinned in CI rather than
  inherited.

## Confirmation

`make docs` builds clean with zero warnings and zero broken links; `make
typecheck` passes; the published site renders badges, RFC 2119 keywords and
mermaid diagrams on both hosts.

## Pros and Cons of the Options

### Docusaurus + repo-owned plugin (chosen)

* Good, because the plugin API turns artifact rendering into a supported
  extension point rather than a pre-processing hack.
* Good, because MDX means a spec can embed real components.
* Good, because versioning, search and i18n are there if a project grows into
  them.
* Bad, because it is the heaviest of the options — a full React toolchain to
  render a folder of markdown.

### MkDocs Material (rejected)

* Good, because it is a single Python dependency and its default theme is
  genuinely excellent out of the box.
* Good, because builds are fast and the config is one YAML file.
* Bad, because artifact-aware rendering means writing Python hooks against a
  less expressive extension model, and there is no MDX equivalent — a
  requirement box would be a raw HTML block in the markdown source.
* Bad, because reskinning it to a bespoke design system means fighting a very
  opinionated theme.

### mdBook (rejected)

* Good, because it is a single static binary and the fastest option by a wide
  margin.
* Bad, because preprocessors are external programs communicating over JSON, so
  the transforms would be a separate tool to build and maintain.
* Bad, because the theming story is template overrides, not tokens.

### Raw markdown on the forge (rejected)

* Good, because it is free and the source is always current.
* Bad, because mermaid renders inconsistently, there is no cross-artifact
  navigation, and nothing is discoverable without knowing the repo already —
  which is the problem this ADR exists to solve.
