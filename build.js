const fs = require('fs');
const {version} = require('./package.json');
const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/jcode-tools.js',
  bundle: true,
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

function injectStyle(cssFile = './dist/jcode-tools.css') {
  const css = fs.readFileSync(cssFile, 'utf8');
  const destFile = './dist/jcode-tools.esm.css.js';
  fs.writeFileSync(destFile, `function __eds__injectStyle(css) {
  const headEl = document.head || document.getElementsByTagName('head')[0];
  const styleEl = document.createElement('style');
  if (styleEl.styleSheet) {
    styleEl.styleSheet.cssText = css;
  } else {
    styleEl.appendChild(document.createTextNode(css));
  }
  headEl.appendChild(styleEl);
} 
__eds__injectStyle(${JSON.stringify(css)});
export default null;`);
  const esm = fs.readFileSync('./dist/jcode-tools.esm.js');
  fs.writeFileSync('./dist/jcode-tools.esm.js',
    `import './jcode-tools.esm.css.js';
${esm}`);
}

if(process.env.mode === 'production') {
  require('esbuild').buildSync({minify: true, ...options});
  require('esbuild').buildSync({
    ...options,
    format: 'esm',
    entryPoints: ['src/jcode-tools.js'],
    outfile: 'dist/jcode-tools.esm.js',
  });
  injectStyle();
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