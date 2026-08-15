# docusaurus-template

A Docusaurus documentation template styled with the **Bubbletea TUI design
system** — a terminal-native visual language of rounded Lip Gloss borders,
monospace type, and ANSI neon on blue-black.

It renders ADRs and specifications as first-class artifacts rather than as
generic pages, and publishes from one build to both a LAN-only Gitea Pages host
and a public GitHub Pages host.

**Live:** https://stump-wtf.github.io/docusaurus-template/ (public) ·
https://stump-wtf.pages.stump.rocks/docusaurus-template/ (LAN)

This repository is its own demo: the ADRs and the specification it publishes are
the real decisions behind the template.

## What you get

| | |
|---|---|
| **ADR rendering** | MADR format with status / date / decision-maker badges, consequence bullets colour-coded by keyword, and a mini-DAG of every relationship declared in frontmatter |
| **Spec rendering** | RFC 2119 keywords highlighted by obligation — `MUST` coral, `SHOULD` gold, `MAY` cyan — with every requirement individually anchorable |
| **Cross-references** | A bare `ADR-0001` in prose becomes a chip linking to it, without double-linking anything already in a link or code span |
| **Artifact graph** | A project-wide mermaid graph of every `supersedes` / `extends` / `governs` / `implements` edge, with inverses derived |
| **Landing page** | A real landing page, not a generated index |
| **Design gallery** | Every token, badge and component on one page, in both themes — see `/design-system` |
| **Dual publishing** | Gitea Pages and GitHub Pages from one build; only `url` differs |
| **Light and dark** | Dark by default, respecting `prefers-color-scheme`; every colour is a token, so the toggle repaints everything |

## Using it

### 1. Generate a repository

This is a Gitea template repository — use **Use this template** on
https://gitea.stump.rocks/stump.wtf/docusaurus-template, or:

```sh
git clone https://gitea.stump.rocks/stump.wtf/docusaurus-template.git my-project
cd my-project && rm -rf .git && git init
```

### 2. Rename four constants

Everything project-specific lives in one block at the top of
`docs-site/docusaurus.config.ts`:

```ts
const PROJECT_TITLE   = 'My Project';
const PROJECT_TAGLINE = 'What it does, in one line';
const GITEA_URL       = 'https://gitea.stump.rocks/stump.wtf/my-project';
const REPO_NAME       = 'my-project';
```

That is the whole "make it mine" step. `baseUrl` derives from `REPO_NAME`, and
both Pages hosts serve under it.

### 3. Replace the content

```
docs/adrs/ADR-0001-*.md            your decisions
docs/specs/<domain>/spec.md        your requirements
docs/specs/<domain>/design.md      how you built it
```

Delete the two ADRs and the spec that ship here. Nothing references them by name
— sidebars, indexes and the graph are all generated from whatever is present.

### 4. Get Pages credentials provisioned

The Gitea Pages deploy needs `PAGES_ACCESS_KEY_ID` and
`PAGES_SECRET_ACCESS_KEY` in the repo's Actions secrets. They come from the
`pages.users` list in the infrastructure inventory — add the repo there and run
the pages playbook.

Skip this and the site still builds green on every push; only the deploy step
fails, with `Garage does not support anonymous access yet`. That 403 is rclone
falling back to anonymous — it names the symptom, not the missing secret.

GitHub Pages needs no credentials, but Pages must be enabled on the mirror with
**Source: GitHub Actions**.

## Local development

```sh
make docs-install    # npm ci
make docs-serve      # dev server, hot reload on docs/ changes
make docs            # production build into docs-site/build
make check           # typecheck + build — what CI gates on
```

Node 20+ required. Node 23 does **not** work: Docusaurus fails on ProgressPlugin
validation, which is why CI pins 22.

## How it fits together

```
docs/                        source of truth — plain markdown, readable on the forge
  adrs/                      MADR-format decisions
  specs/<domain>/            spec.md + design.md
docs-generated/              MDX generated on every build — gitignored, never committed
docs-site/
  docusaurus.config.ts       the four constants, and nothing else you need to touch
  plugins/sdd-content/       frontmatter → MDX: badges, RFC 2119, graph, mini-DAGs
  src/css/tokens/            vendored design tokens — DO NOT EDIT
  src/css/custom.css         the Infima bridge + page styles — edit this instead
  src/components/            badge and layout components used from MDX
  src/pages/                 landing page and design-system gallery
.gitea/workflows/            the real CI: secret scan, build, Gitea Pages
.github/workflows/           public GitHub Pages twin only
```

Two rules keep this maintainable:

- **Never edit `src/css/tokens/`.** They are vendored verbatim from the design
  system export. Project styling goes in `custom.css`, so a token refresh is a
  clean re-copy rather than a merge.
- **Never commit `docs-generated/`.** `docs/` is the source of truth; the
  generated MDX is a build artifact.

For the design rationale, read
[ADR-0001](docs/adrs/ADR-0001-docusaurus-and-the-bubbletea-design-system.md) and
[ADR-0002](docs/adrs/ADR-0002-vendored-plugin-over-published-package.md); for how
the pieces fit, [the design doc](docs/specs/documentation-site/design.md).

## Canonical repo

Gitea (`stump.wtf/docusaurus-template`) is the source of truth — branch, push,
PR and file issues there. The GitHub copy under `stump-wtf/docusaurus-template`
is a read-only push mirror whose history is force-replaced on every sync; a PR
opened against it targets a branch that will be overwritten.

## Credits

The Bubbletea TUI design system is original work inspired by the open-source
[Charm](https://charm.sh) ecosystem — Bubble Tea, Bubbles, Lip Gloss, Gum, Glow.
It is not the official Charm brand and reproduces neither Charm's logo nor its
commercial typefaces; the type is the closest free substitute (JetBrains Mono,
Space Mono, Silkscreen).
