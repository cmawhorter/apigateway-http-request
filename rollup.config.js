import rollup from 'rollup';

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry:              'src/main.js',
  sourceMap:          true,
  plugins: [
    nodeResolve({
      jsnext:         true,
      main:           true,
      browser:        false,
    }),
    commonjs(),
    babel({
      exclude:        'node_modules/**',
      babelrc:        false,
      presets:        [ [ 'es2015', { modules: false } ] ],
      plugins:        [ 'external-helpers' ],
    }),
  ],
  targets: [
    { dest: 'dist/apigateway-http-request.cjs.js',      format: 'cjs' },
    { dest: 'dist/apigateway-http-request.es2015.js',   format: 'es' },
    { dest: 'dist/apigateway-http-request.js',          format: 'iife',  moduleName: 'Bondo' },
  ],
}
