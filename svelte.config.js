import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  // Svelte 5 + Kit: generated `.svelte-kit/generated/root.svelte` can trip
  // `state_referenced_locally`; that's framework noise until upstream silences it.
  onwarn(warning, defaultHandler) {
    if (
      warning.code === 'state_referenced_locally' &&
      typeof warning.filename === 'string' &&
      warning.filename.includes('.svelte-kit/generated/root.svelte')
    ) {
      return;
    }
    defaultHandler(warning);
  },
  kit: {
    adapter: adapter(),
    prerender: {
      handleUnseenRoutes: 'warn',
      handleMissingId: 'warn',
      handleHttpError: 'warn'
    }
  }
};

export default config;
