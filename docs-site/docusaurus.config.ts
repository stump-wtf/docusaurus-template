import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ============================================================================
// CONFIGURE THESE FOUR VALUES, THEN DELETE THIS COMMENT
//
// Everything below this block is template machinery you should not need to
// touch. Renaming these four is the whole "make it mine" step.
// ============================================================================
const PROJECT_TITLE = 'Docusaurus Template';
const PROJECT_TAGLINE =
  'A documentation site styled with the Bubbletea TUI design system — ADRs, specifications, and a dual Gitea + GitHub Pages deploy';
const GITEA_URL = 'https://gitea.stump.rocks/stump.wtf/docusaurus-template';
const REPO_NAME = 'docusaurus-template';
// ============================================================================

// The same build ships to two hosts and only `url` differs, so CI supplies it.
//
// `||`, not `??`: the shared stump.wtf/ci static-site workflow exports DOCS_URL
// as an empty string when its site_url input is unset, and an empty `url` fails
// the Docusaurus build. `??` would let the empty string win.
//
// The default is the GitHub Pages host because that is the public canonical —
// the Gitea Pages twin resolves to a private address and is LAN-only.
const SITE_URL = process.env.DOCS_URL || 'https://stump-wtf.github.io';

// Both hosts serve under the repo name: GitHub Pages at /<repo>/ and
// Garage-backed Gitea Pages at <owner>.pages.stump.rocks/<repo>/. One value
// covers both, so only `url` has to vary per host.
const BASE_URL = process.env.DOCS_BASE_URL || `/${REPO_NAME}/`;

const config: Config = {
  title: PROJECT_TITLE,
  tagline: PROJECT_TAGLINE,
  favicon: 'img/favicon.svg',

  future: {
    // Opts into the rspack bundler, which is what @docusaurus/faster provides.
    // Removing that dependency as "unused" breaks the build — it is required,
    // not optional, while this flag is on.
    v4: true,
  },

  url: SITE_URL,
  baseUrl: BASE_URL,

  onBrokenLinks: 'warn',

  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      // Lives here rather than at the top level: the top-level option is
      // deprecated and prints a migration warning on every build.
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      './plugins/sdd-content',
      {
        adrsDir: '../docs/adrs',
        specsDir: '../docs/specs',
        outputDir: '../docs-generated',
        // Suppress the plugin's generated landing page so src/pages/index.tsx
        // can own '/'. With routeBasePath '/' below, both would claim the same
        // route. Set this back to true (or drop it) and delete
        // src/pages/index.tsx if you would rather have the generated index.
        generateIndex: false,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs-generated',
          sidebarPath: './sidebars.ts',
          // Docs at the root. The plugin builds cross-reference links as
          // `${baseUrl}/decisions/...`, which assumes this; moving the docs
          // under a prefix means teaching the plugin about routeBasePath too.
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      // The design system's native habitat is the dark "void" theme.
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: PROJECT_TITLE,
      items: [
        {type: 'docSidebar', sidebarId: 'decisionsSidebar', position: 'left', label: 'ADRs'},
        {type: 'docSidebar', sidebarId: 'specsSidebar', position: 'left', label: 'Specifications'},
        {to: '/graph', label: 'Graph', position: 'left'},
        {to: '/design-system', label: 'Design System', position: 'left'},
        {href: GITEA_URL, label: 'Gitea', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Architecture Decisions', to: '/decisions'},
            {label: 'Specifications', to: '/specs'},
            {label: 'Artifact Graph', to: '/graph'},
          ],
        },
        {
          title: 'Template',
          items: [
            {label: 'Design System', to: '/design-system'},
            {label: 'Source', href: GITEA_URL},
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()}. Built with Docusaurus, styled with the Bubbletea TUI design system.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
