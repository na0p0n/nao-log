// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://na0p0n.github.io',
  base: '/nao-log',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
