// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNext from 'starlight-theme-next';
import rehypeExternalLinks from 'rehype-external-links';

const isCI = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
	site: 'https://kevinsillo.github.io',
	base: isCI ? '/pillbox-docs' : '/',
	markdown: {
		rehypePlugins: [
			[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
		],
	},
	integrations: [
		starlight({
			plugins: [starlightThemeNext()],
			customCss: ['./src/styles/custom.css'],
			title: 'Pillbox',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				es: {
					label: 'Español',
					lang: 'es',
				},
			},
			logo: {
				light: './src/assets/pillbox-logo-dark.png',
				dark: './src/assets/pillbox-logo-light.png',
				replacesTitle: true,
			},
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Kevinsillo/pillbox' },
			],
			head: [
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://kevinsillo.github.io/pillbox-docs/og-image.png',
					},
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					translations: { es: 'Primeros pasos' },
					items: [
						{ slug: 'getting-started/introduction' },
						{
							label: 'Installation',
							translations: { es: 'Instalación' },
							items: [
								{ slug: 'getting-started/installation/quick' },
								{ slug: 'getting-started/installation/manual' },
							],
						},
						{ slug: 'getting-started/quick-start' },
						{ slug: 'getting-started/configuration' },
					],
				},
				{
					label: 'Concepts',
					translations: { es: 'Conceptos' },
					items: [
						{ slug: 'concepts/overview' },
						{ slug: 'concepts/philosophy' },
					],
				},
				{
					label: 'Guides',
					translations: { es: 'Guías' },
					items: [
						{
							label: 'MCP',
							items: [
								{ slug: 'guides/mcp-setup' },
								{ slug: 'guides/mcp-setup/claude-code' },
								{ slug: 'guides/mcp-setup/opencode' },
							],
						},
						{ slug: 'guides/web-interface' },
						{ slug: 'guides/author-identity' },
					],
				},
				{
					label: 'Reference',
					translations: { es: 'Referencia' },
					items: [
						{ slug: 'reference/cli' },
						{ slug: 'reference/mcp-tools' },
						{ slug: 'reference/http-api' },
{ slug: 'reference/credits' },
					],
				},
			],
		}),
	],
});
