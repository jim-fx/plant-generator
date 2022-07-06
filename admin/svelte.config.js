import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

let { BASE_PATH = '', IS_GH_PAGES = false } = process.env;
if (IS_GH_PAGES) {
  BASE_PATH = '/admin';
}
/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    // target: '#svelte',
    //
    prerender: { default: true, enabled: true, crawl: true },

    paths: {
      base: BASE_PATH,
    },

  },
};

export default config;
