import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: !production,
    name: 'app',
    file: 'public/dist/index.js',
  },
  plugins: [
    svelte({
      dev: !production,
      // Tell the compiler to output a custom element.
      customElement: true,
      preprocess: sveltePreprocess()
    }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),

    typescript({ sourceMap: !production }),

    // Enable live reloading in development mode
    !production && livereload('public'),

    // Minify the production build (npm run build)
    production && terser(),
  ],
};
