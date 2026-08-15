---
status: accepted
date: 2026-08-15
implements: [ADR-0001, ADR-0002]
---

# SPEC-0001: Documentation Site — Rendering, Theming, and Dual-Host Publishing

## Overview

The behaviour a project adopting this template is entitled to rely on: how ADRs and specifications are rendered, how the Bubbletea theme responds to a theme change, and how one build publishes to both a LAN-only Gitea Pages host and a public GitHub Pages host. Implements [ADR-0001](/decisions/ADR-0001-docusaurus-and-the-bubbletea-design-system) and constrains the vendoring trade in [ADR-0002](/decisions/ADR-0002-vendored-plugin-over-published-package).

This spec doubles as demo content: every requirement below is rendered by the very site it describes, so the RFC 2119 highlighting, requirement anchors and cross-reference chips you can see are the feature working.

## Requirements

### Requirement: Markdown Is the Source of Truth

The site MUST be generated from markdown under `docs/` on every build, and MUST NOT require a second copy of any artifact. Generated MDX MUST be written to a gitignored directory. An author MUST be able to add an ADR by adding one markdown file, with no other edit anywhere.

#### Scenario: A new ADR appears with no configuration change

- **WHEN** a file `docs/adrs/ADR-0003-example.md` is added and the site is rebuilt
- **THEN** it appears in the ADR sidebar, in the ADR index, and in the artifact graph, with no edit to `sidebars.ts` or `docusaurus.config.ts`

#### Scenario: Generated output is never committed

- **WHEN** a build completes
- **THEN** `git status` reports no new tracked files

### Requirement: Artifact Rendering

Every numbered ADR MUST render a metadata strip carrying its status, date and decision-makers. RFC 2119 keywords in specification prose MUST be visually distinguished by obligation level: `MUST`/`SHALL`/`REQUIRED` in the danger hue, `SHOULD`/`RECOMMENDED` in the warning hue, `MAY`/`OPTIONAL` in the info hue. Each requirement MUST be individually addressable by URL fragment.

Artifact filename matching MUST be case-insensitive, because `ADR-0001-x.md` and `adr-0001-x.md` are both in use across projects.

#### Scenario: Lowercase filenames render identically

- **WHEN** a repository names its files `adr-0001-example.md`
- **THEN** badges, sidebar numbering, cross-reference chips and mini-DAGs render exactly as they do for `ADR-0001-example.md`

#### Scenario: Frontmatter values are not assumed to be strings

- **WHEN** an ADR declares `decision-makers: [alice, bob]`
- **THEN** the metadata strip renders `alice, bob` and the build succeeds

### Requirement: Cross-References Resolve Under a Path Prefix

A bare `ADR-NNNN` or `SPEC-NNNN` mention in artifact prose SHOULD become a link to that artifact. Every generated link MUST be prefixed with the site's configured `baseUrl`, which MUST be read from the resolved site configuration rather than parsed out of a configuration file.

A reference that is already inside a markdown link, inline code span, or HTML tag MUST NOT be linkified again.

#### Scenario: Links are correct on a site served from a subpath

- **WHEN** the site is built with `baseUrl` of `/my-project/`
- **THEN** every internal link begins `/my-project/`, and none points at the host root

#### Scenario: An existing link is not double-wrapped

- **WHEN** prose contains `[ADR-0006](adr-0006-config.md)`
- **THEN** the rendered output contains exactly one anchor for it, and the HTML is valid

#### Scenario: A code span is left alone

- **WHEN** prose contains `` `ADR-0006` `` in a code span
- **THEN** it renders as literal text and is not turned into a link

### Requirement: Relationship Graph

Relationships declared in frontmatter (`supersedes`, `extends`, `enables`, `governs`, `implements`, `requires`, `related`) MUST be collected into a project-wide artifact graph. Each artifact page with at least one edge MUST render a mini-DAG of its immediate neighbours. Inverse edges SHOULD be derived rather than authored twice.

An artifact with no declared edges MUST NOT render an empty diagram.

#### Scenario: Declaring an edge once renders it on both artifacts

- **WHEN** ADR-0002 declares `extends: [ADR-0001]`
- **THEN** ADR-0002's mini-DAG shows the `extends` edge and ADR-0001's shows the derived `extended-by` edge

### Requirement: Theme Fidelity

The site MUST support a light and a dark theme, defaulting to dark and respecting `prefers-color-scheme`. Every colour MUST be expressed as a design token; no component may hardcode a colour value. Switching theme MUST NOT require a page reload.

The vendored token files MUST NOT be hand-edited; project-specific styling MUST live in `custom.css`.

#### Scenario: The whole surface repaints on toggle

- **WHEN** a reader toggles the theme
- **THEN** page chrome, badges, requirement boxes, cross-reference chips and mermaid panels all repaint, and no element retains the previous palette

### Requirement: Dual-Host Publishing From One Build

The site MUST publish to Gitea Pages and to GitHub Pages from a single build configuration. The two MUST differ only in the host baked into absolute URLs, supplied to the build as `DOCS_URL`. Both MUST serve under the repository name as a path prefix.

Publishing MUST occur only from the default branch. A pull request MUST build the site without publishing it.

#### Scenario: A pull request builds but does not deploy

- **WHEN** CI runs for a pull request
- **THEN** the site builds and the deploy step does not run

#### Scenario: The canonical host is correct per deploy

- **WHEN** the Gitea Pages job builds with `DOCS_URL` set to the Gitea Pages host
- **THEN** the published `og:url` and canonical tags name that host and not the GitHub one

## Requirements Table

The plugin supports a second, terser convention alongside the prose style above:
a two-column `| ID | Requirement |` table, where each row becomes an individually
anchorable requirement box. Both conventions work in the same document — use the
prose form when a requirement needs scenarios, and the table when a list of
short obligations reads better than a page of headings.

| ID | Requirement |
|----|-------------|
| REQ-001 | The site MUST build with `make docs` and exit non-zero on failure. |
| REQ-002 | The vendored token files MUST NOT be edited; project styling belongs in `custom.css`. |
| REQ-003 | Generated MDX MUST NOT be committed. |
| REQ-004 | Publishing MUST occur only from the default branch. |
| REQ-005 | Every colour MUST be a design token, so a theme change repaints the whole surface. |

### Requirement: Build Hygiene

`make docs` MUST exit non-zero on a build failure. The build SHOULD complete with no broken internal links and no deprecation warnings. `make typecheck` MUST pass.

The template MUST NOT reference artifacts that do not exist in the adopting repository.

#### Scenario: A template ships no dead links

- **WHEN** a freshly generated repository is built
- **THEN** the build reports zero broken links
