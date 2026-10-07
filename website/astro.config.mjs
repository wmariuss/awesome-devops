import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://awesome-devops.xyz',
  trailingSlash: 'always',
  integrations: [preact(), mdx(), sitemap()],
  // Old MkDocs URLs.
  redirects: {
    '/list': '/',
  },
});
