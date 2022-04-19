#!/usr/bin/env node

const default_dir = './docs';
const fs = require('fs');
const path = require('path');
const template_dir = path.join(__dirname, 'template');

function makeFile(dir, file, checkExists = false) {
  if(!checkExists || !fs.existsSync(path.join(dir, file))) {
    const htmlFile = fs.readFileSync(path.join(template_dir, file));
    fs.writeFileSync(path.join(dir, file), htmlFile);
    console.log(`create ${dir}/${file}`);
  }
}

function buildDocs(dir = default_dir) {
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  ['index.html', 'style.css', 'index.js', '.docrc.js'].forEach((file) => {
    makeFile(dir, file, true);
  });
  console.log('Done! Enjoy jcode pen~');
}

const doc_dir = process.argv[2];
buildDocs(doc_dir);