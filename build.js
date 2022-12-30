const esbuild = require('esbuild');

const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/jcode-tools.js',
  format: 'esm',
  bundle: true,
};

if(process.env.mode === 'production') {
  esbuild.buildSync({
    ...options,
    format: 'iife',
    globalName: 'JCode',
    minify: true,
    inject: ['./src/inject-iife.js'],
  });
  esbuild.buildSync({
    ...options,
    outfile: 'dist/jcode-tools.esm.js',
    inject: ['./src/inject-esm.js'],
    loader: {
      '.css': 'text',
    },
  });
} else {
  esbuild.serve({
    servedir: './example',
  }, {
    ...options,
    outfile: 'example/dist/jcode-tools.esm.js',
    inject: ['./src/inject-esm.js'],
    loader: {
      '.css': 'text',
    },
  }).then((server) => {
    console.log(`Server is running at ${server.host}:${server.port}`);
  });
}