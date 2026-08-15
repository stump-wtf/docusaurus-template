---
status: accepted
date: 2026-08-15
decision-makers: [joestump]
extends: [ADR-0001]
related: [ADR-0001]
---

# ADR-0002: Vendor the content plugin rather than publish it

## Context and Problem Statement

[ADR-0001](ADR-0001-docusaurus-and-the-bubbletea-design-system.md) commits to a
Docusaurus plugin that transforms ADRs and specs into MDX. That plugin is ~1200
lines and the design tokens are four CSS files. Both have to reach every project
that adopts this template.

There are two ways to do that, and they trade the same cost in opposite
directions: copy the code into each repo, or publish it and depend on it.

## Decision Drivers

* A repo that generates from this template must build immediately, with no
  private registry to authenticate against.
* A project must be able to diverge — different artifact directories, an extra
  sidebar, a tweaked palette — without asking permission.
* Fixes should not be trapped in one repo, because they will not be.
* We are a very small number of maintainers; a release process nobody runs is
  worse than no release process.

## Considered Options

* Vendor the plugin and tokens into each repo (copy on generate)
* Publish `@stump-wtf/docusaurus-plugin-sdd` + a theme package to a registry
* Git submodule pointing at this repo

## Decision Outcome

Chosen option: **vendor**, because a generated repo has to build on the first
`npm ci` with nothing but the public npm registry, and because the projects
adopting this differ enough that some divergence is expected rather than
pathological — one has `docs/specs/`, another `docs/openspec/specs/`, a third
names its ADRs lowercase.

This is chosen with clear eyes about the cost, because we have already paid it
once. Six defects were found in this plugin in August 2026 — a `baseUrl` that
silently resolved to `''` and put 94 links at the host root, six case-sensitive
filename regexes that suppressed every ADR badge and mini-DAG, an
`escapeJsxAttr` that assumed strings, nested anchors from unguarded
auto-linkifying, dead hardcoded cross-references, and `JSX.Element` after React
19 removed the namespace. Every one of them had to be fixed in more than one
place. **That is the tax this decision charges.**

We accept it for now because the alternative charges a release, a registry and a
version-bump PR for every one of those fixes too, and with this few maintainers
the publish step is the one most likely to be skipped.

### Consequences

* Good, because a generated repo builds offline against the public registry with
  no auth and no private tooling.
* Good, because a project can edit the plugin in place the day it needs to,
  rather than filing an upstream issue and waiting.
* Good, because there is no release process to run, and therefore none to forget.
* Bad, because a fix must be ported by hand to every consumer, and nothing
  detects that a consumer is stale. The six defects above are the worked example.
* Bad, because the copies drift, so "the plugin" is really N slightly different
  plugins and a bug report has to say which repo it came from.
* Neutral, because the tokens drift far less than the plugin does — they are
  vendored verbatim and hand-editing them is already forbidden.

Revisit this when a third project adopts the template, or the next time one bug
has to be fixed in more than two places. Either is a reasonable trigger to pay
for the packaging.

## Pros and Cons of the Options

### Vendor (chosen)

* Good, because zero install friction and total local freedom.
* Bad, because fixes do not propagate and drift is invisible.

### Publish to a registry (rejected, for now)

* Good, because one fix reaches every consumer with a version bump, and the
  version pins make it obvious which sites are stale.
* Good, because it forces the plugin to have an actual API, which would have
  caught at least the `baseUrl` bug — a published package cannot scrape its
  consumer's config file.
* Bad, because it needs a registry, credentials in CI, and a release process
  that a two-maintainer project will run irregularly at best.
* Bad, because per-repo divergence becomes an options matrix to design up front,
  and we do not yet know which axes actually vary.

### Git submodule (rejected)

* Good, because it is a real pointer at a real commit, so staleness is visible
  in the diff.
* Bad, because submodules are a footgun for casual contributors — a clone
  without `--recursive` produces a confusing build failure.
* Bad, because it gives the coupling of a package with none of the versioning
  ergonomics.
