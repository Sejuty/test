import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import css from 'rollup-plugin-css-porter';

export default {
  input: './src/components/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    css({
        raw: 'dist/css/allspark.css',
        minified: 'dist/css/allspark.min.css',
    }),
    external(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ]
};
