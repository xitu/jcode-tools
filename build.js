const {version} = require('./package.json');
const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/jcode-tools.js',
  // bundle: true,
  loader: {
    '.png': 'base64',
    '.svg': 'base64',
    '.woff': 'file',
    '.ttf': 'file',
    '.woff2': 'file',
  },
  define: {
    VERSION: `"${version}"`,
  },
};

if(process.env.mode === 'production') {
  require('esbuild').buildSync({minify: true, ...options});
} else {
  require('esbuild').serve({
    servedir: '.',
  }, options).then((server) => {
    console.log(`Server is running at ${server.host}:${server.port}`);
    const scriptURL = `http://localhost:${server.port}/${options.outfile}`;
    console.log(`打开 https://code.juejin.cn
设置 ${scriptURL} 到 script 依赖资源，进行调试。`);
  });
}