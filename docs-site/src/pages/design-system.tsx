import React, {ReactElement} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import StatusBadge from '@site/src/components/StatusBadge';
import SeverityBadge from '@site/src/components/SeverityBadge';
import PriorityBadge from '@site/src/components/PriorityBadge';
import DomainBadge from '@site/src/components/DomainBadge';
import DateBadge from '@site/src/components/DateBadge';
import RFCLevelBadge from '@site/src/components/RFCLevelBadge';
import Field from '@site/src/components/Field';
import FieldGroup from '@site/src/components/FieldGroup';
import RequirementBox from '@site/src/components/RequirementBox';

/**
 * The design-system gallery.
 *
 * Every component and token this site can render, on one page. It is not
 * decoration — it does three jobs:
 *
 *   1. Documents the system for whoever writes the next ADR.
 *   2. Acts as the visual regression surface: one page to look at after a token
 *      change, instead of hunting for a doc that happens to use the component.
 *   3. Proves the palette works in BOTH themes. Toggle the navbar switch; every
 *      swatch below is a token reference, so nothing here is hardcoded and
 *      anything that fails to flip is a real bug.
 */

const SWATCHES: {group: string; tokens: {name: string; varName: string}[]}[] = [
  {
    group: 'Brand',
    tokens: [
      {name: 'charm purple', varName: '--charm-purple'},
      {name: 'charm pink', varName: '--charm-pink'},
      {name: 'fuchsia', varName: '--charm-fuchsia'},
      {name: 'lilac', varName: '--neon-lilac'},
    ],
  },
  {
    group: 'Neon / status',
    tokens: [
      {name: 'cyan — info', varName: '--neon-cyan'},
      {name: 'mint — success', varName: '--neon-mint'},
      {name: 'gold — warning', varName: '--neon-gold'},
      {name: 'coral — danger', varName: '--neon-coral'},
    ],
  },
  {
    group: 'Surfaces',
    tokens: [
      {name: 'void', varName: '--bg-void'},
      {name: 'terminal', varName: '--bg-terminal'},
      {name: 'surface', varName: '--bg-surface'},
      {name: 'raised', varName: '--bg-surface-2'},
    ],
  },
  {
    group: 'Text',
    tokens: [
      {name: 'bright', varName: '--text-bright'},
      {name: 'body', varName: '--text-body'},
      {name: 'muted', varName: '--text-muted'},
      {name: 'dim', varName: '--text-dim'},
    ],
  },
];

const TYPE_SCALE: {label: string; varName: string; sample: string}[] = [
  {label: '--text-3xl', varName: '--text-3xl', sample: 'Display'},
  {label: '--text-xl', varName: '--text-xl', sample: 'Title'},
  {label: '--text-md', varName: '--text-md', sample: 'Heading'},
  {label: '--text-base', varName: '--text-base', sample: 'Body copy'},
  {label: '--text-sm', varName: '--text-sm', sample: 'UI label'},
  {label: '--text-xs', varName: '--text-xs', sample: 'Hint text'},
];

function Section({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}): ReactElement {
  return (
    <section className="ds-section">
      <h2 className="ds-section__title">{title}</h2>
      <p className="ds-section__blurb">{blurb}</p>
      {children}
    </section>
  );
}

export default function DesignSystem(): ReactElement {
  return (
    <Layout
      title="Design System"
      description="The Bubbletea TUI design system as rendered by this documentation template.">
      <main className="ds-page">
        <header className="ds-header">
          <span className="home-eyebrow">// design system</span>
          <h1 className="ds-title">Bubbletea TUI</h1>
          <p className="ds-lede">
            A terminal-native design system: rounded Lip Gloss borders, monospace
            type, and ANSI neon on blue-black. Every value below is a CSS custom
            property, so the navbar theme toggle repaints the whole page without a
            single component knowing which theme it is in.
          </p>
        </header>

        <Section
          title="Colour"
          blurb="Deep blue-black surfaces carrying neon foreground. Purple and hot pink anchor the brand; cyan and mint supply the Tron edge; gold and coral cover warning and danger.">
          {SWATCHES.map((row) => (
            <div key={row.group} className="ds-swatch-row">
              <h3 className="ds-swatch-row__label">{row.group}</h3>
              <div className="ds-swatches">
                {row.tokens.map((t) => (
                  <div key={t.varName} className="ds-swatch">
                    <div
                      className="ds-swatch__chip"
                      style={{background: `var(${t.varName})`}}
                    />
                    <span className="ds-swatch__name">{t.name}</span>
                    <code className="ds-swatch__var">{t.varName}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section
          title="Type"
          blurb="Monospace throughout — that is the brand, not a code-block choice. JetBrains Mono is the workhorse, Space Mono the display voice, Silkscreen the pixel accent. Hierarchy comes from weight, size and colour, never from switching to a proportional face.">
          <div className="ds-type">
            {TYPE_SCALE.map((t) => (
              <div key={t.varName} className="ds-type__row">
                <code className="ds-type__token">{t.label}</code>
                <span style={{fontSize: `var(${t.varName})`}}>{t.sample}</span>
              </div>
            ))}
            <div className="ds-type__row">
              <code className="ds-type__token">--font-pixel</code>
              <span className="home-eyebrow">// PIXEL EYEBROW</span>
            </div>
          </div>
        </Section>

        <Section
          title="Badges"
          blurb="The chip recipe is the same everywhere: a low-alpha wash of the hue, the hue itself as text, and a hairline border at partial alpha — mixed with color-mix so one definition tracks the base colour through a theme flip.">
          <div className="ds-badges">
            <div className="ds-badges__group">
              <h3 className="ds-swatch-row__label">Status</h3>
              <div className="ds-badges__row">
                <StatusBadge status="ACCEPTED" />
                <StatusBadge status="PROPOSED" />
                <StatusBadge status="DEPRECATED" />
                <StatusBadge status="SUPERSEDED" />
                <StatusBadge status="REJECTED" />
              </div>
            </div>
            <div className="ds-badges__group">
              <h3 className="ds-swatch-row__label">Severity</h3>
              <div className="ds-badges__row">
                <SeverityBadge severity="CRITICAL" />
                <SeverityBadge severity="HIGH" />
                <SeverityBadge severity="MEDIUM" />
                <SeverityBadge severity="LOW" />
                <SeverityBadge severity="INFO" />
              </div>
            </div>
            <div className="ds-badges__group">
              <h3 className="ds-swatch-row__label">Priority</h3>
              <div className="ds-badges__row">
                <PriorityBadge priority="P0" />
                <PriorityBadge priority="P1" />
                <PriorityBadge priority="P2" />
                <PriorityBadge priority="P3" />
              </div>
            </div>
            <div className="ds-badges__group">
              <h3 className="ds-swatch-row__label">RFC 2119 level / domain / date</h3>
              <div className="ds-badges__row">
                <RFCLevelBadge level="CRITICAL" />
                <RFCLevelBadge level="HIGH" />
                <RFCLevelBadge level="OPTIONAL" />
                <DomainBadge domain="platform" />
                <DateBadge date="2026-08-15" />
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="RFC 2119 keywords"
          blurb="Highlighted in place inside spec prose, so obligation is visible while scanning rather than only when reading. Coral for the absolute, gold for the strong default, cyan for the genuinely optional.">
          <p className="ds-rfc-sample">
            The daemon <span className="rfc-keyword must">MUST</span> reject an
            unauthenticated attach,{' '}
            <span className="rfc-keyword should">SHOULD</span> log the attempt
            with its source address, and{' '}
            <span className="rfc-keyword may">MAY</span> rate-limit repeat
            offenders.
          </p>
        </Section>

        <Section
          title="Metadata strip and requirements"
          blurb="FieldGroup is the readout strip at the top of every ADR. RequirementBox is a Lip Gloss rounded panel that turns cyan and glows when you link straight to it — the :target state below is what a shared anchor lands on.">
          <FieldGroup>
            <Field label="Status">
              <StatusBadge status="ACCEPTED" />
            </Field>
            <Field label="Date">
              <DateBadge date="2026-08-15" />
            </Field>
            <Field label="Decision Makers">joestump</Field>
          </FieldGroup>

          <RequirementBox id="req-example" rfcLevel="CRITICAL">
            The template <span className="rfc-keyword must">MUST</span> render
            identically on Gitea Pages and GitHub Pages, differing only in the
            host baked into canonical and og:url tags.
          </RequirementBox>
        </Section>

        <Section
          title="Cross-references"
          blurb="Bare ADR-0001 / SPEC-0001 mentions in prose become chips automatically, with the artifact's emoji. Text already inside a link or inline code is left alone, so nothing gets double-linked.">
          <p className="ds-rfc-sample">
            Supersedes{' '}
            {/* Link, not a bare <a>: a raw href bypasses baseUrl and would
                point at the host root on a site served from a subpath — the
                exact defect SPEC-0001 requires this template to avoid. */}
            <Link to="/decisions" className="rfc-ref">
              📝 ADR-0001
            </Link>{' '}
            and implements{' '}
            <Link to="/specs" className="rfc-ref">
              SPEC-0001
            </Link>
            .
          </p>
        </Section>

        <Section
          title="Consequence keywords"
          blurb="MADR consequence bullets are colour-coded by their leading word, so the shape of a decision's trade-offs is legible before you read any of them.">
          <ul className="ds-consequences">
            <li>
              <span className="consequence-keyword good">Good</span>, because one
              language end-to-end means the wire contract is defined once.
            </li>
            <li>
              <span className="consequence-keyword neutral">Neutral</span>,
              because the browser stack is community packages rather than core.
            </li>
            <li>
              <span className="consequence-keyword bad">Bad</span>, because the
              ecosystem is small and the tooling is thin.
            </li>
          </ul>
        </Section>
      </main>
    </Layout>
  );
}
