import React, {ReactElement} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Landing page.
 *
 * Owns '/' because the sdd-content plugin is configured with
 * `generateIndex: false` — see docusaurus.config.ts. With docs mounted at
 * routeBasePath '/', the generated index would otherwise claim the same route.
 *
 * Styling comes entirely from the design tokens in src/css/tokens/ via the
 * `home-*` classes in custom.css. There is no CSS module here on purpose: the
 * point of the template is that the palette lives in one place, so a page that
 * reached for its own colours would be the first thing to drift.
 */

type Card = {
  glyph: string;
  title: string;
  body: string;
  to: string;
  cta: string;
};

const CARDS: Card[] = [
  {
    glyph: '◆',
    title: 'Architecture Decisions',
    body:
      'MADR-format ADRs rendered with status, date and decision-maker badges, ' +
      'consequence keywords picked out by hue, and a mini-DAG of every ' +
      'relationship declared in frontmatter.',
    to: '/decisions',
    cta: 'browse ADRs',
  },
  {
    glyph: '●',
    title: 'Specifications',
    body:
      'Requirements with RFC 2119 keywords highlighted in place — MUST in ' +
      'coral, SHOULD in gold, MAY in cyan — each one an anchor you can link ' +
      'someone straight to.',
    to: '/specs',
    cta: 'browse specs',
  },
  {
    glyph: '⣾',
    title: 'Artifact Graph',
    body:
      'Every supersedes / extends / governs / implements edge across the whole ' +
      'project, drawn as one mermaid graph and kept honest by the build rather ' +
      'than by hand.',
    to: '/graph',
    cta: 'view the graph',
  },
  {
    glyph: '▓',
    title: 'Design System',
    body:
      'The Bubbletea TUI palette, type scale and components — every badge and ' +
      'callout this site can render, on one page, in both themes.',
    to: '/design-system',
    cta: 'see the components',
  },
];

export default function Home(): ReactElement {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <header className="home-hero">
        <div className="home-hero__inner">
          <span className="home-eyebrow">// documentation template</span>
          <h1 className="home-title">
            {siteConfig.title}
            <span className="home-cursor" aria-hidden="true" />
          </h1>
          <p className="home-tagline">{siteConfig.tagline}</p>

          <div className="home-actions">
            <Link className="home-btn home-btn--primary" to="/decisions">
              browse the docs
            </Link>
            <Link className="home-btn home-btn--ghost" to="/design-system">
              design system
            </Link>
          </div>

          {/* A prompt line rather than a code block: the design system's voice
              is a shell, and this is the one command that matters. */}
          <div className="home-prompt">
            <span className="home-prompt__glyph">❯</span>
            <code>make docs-install &amp;&amp; make docs-serve</code>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="home-grid">
          {CARDS.map((card) => (
            <Link key={card.to} to={card.to} className="home-card">
              <span className="home-card__glyph" aria-hidden="true">
                {card.glyph}
              </span>
              <h2 className="home-card__title">{card.title}</h2>
              <p className="home-card__body">{card.body}</p>
              <span className="home-card__cta">{card.cta} →</span>
            </Link>
          ))}
        </section>

        {/* The help footer is a load-bearing convention in this design system,
            not decoration — every screen ends with one. */}
        <footer className="home-keyhint">
          <span>
            <kbd>docs/adrs/</kbd> <em>decisions</em>
          </span>
          <span className="home-keyhint__sep">•</span>
          <span>
            <kbd>docs/specs/</kbd> <em>requirements</em>
          </span>
          <span className="home-keyhint__sep">•</span>
          <span>
            <kbd>make docs</kbd> <em>build</em>
          </span>
        </footer>
      </main>
    </Layout>
  );
}
