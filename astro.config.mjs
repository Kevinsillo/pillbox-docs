// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNext from 'starlight-theme-next';
import rehypeExternalLinks from 'rehype-external-links';

const isCI = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
	site: 'https://Kevinsillo.github.io',
	base: isCI ? '/pillbox' : '/',
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
			logo: {
				light: './src/assets/pillbox-logo-dark.png',
				dark: './src/assets/pillbox-logo.png',
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
					items: [
						{ slug: 'getting-started/introduction' },
						{ slug: 'getting-started/installation' },
						{ slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Concepts',
					items: [{ slug: 'concepts/overview' }],
				},
				{
					label: 'Guides',
					items: [
						{
							label: 'MCP',
							items: [
								{ slug: 'guides/mcp-setup' },
								{ slug: 'guides/mcp-setup/claude-code' },
								{ slug: 'guides/mcp-setup/claude-desktop' },
								{ slug: 'guides/mcp-setup/opencode' },
								{ slug: 'guides/mcp-setup/cursor' },
								{ slug: 'guides/mcp-setup/windsurf' },
								{ slug: 'guides/mcp-setup/zed' },
							],
						},
						{ slug: 'guides/web-interface' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ slug: 'reference/cli' },
						{ slug: 'reference/mcp-tools' },
						{ slug: 'reference/http-api' },
					],
				},
			],
		}),
	],
});
