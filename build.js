/**
 * Build Script for TeXpress
 *
 * Bundles ES modules into a single IIFE and distributes it to:
 *   - dist/texpress.user.js       (Tampermonkey userscript)
 *   - chrome-extension/bundle.js  (Chrome extension content script)
 *   - mozilla-addon/content.js    (Firefox addon content script)
 *
 * Usage:
 *   node build.js          - Build once
 *   node build.js --watch  - Watch for changes and rebuild
 */

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';

const ENTRY_POINT = 'src/index.js';
const BUNDLE_OUTPUT = 'dist/bundle.js';
const USERSCRIPT_OUTPUT = 'dist/texpress.user.js';
const HEADER_FILE = 'userscript-header.js';
const CHROME_CONTENT = 'chrome-extension/bundle.js';
const FIREFOX_CONTENT = 'mozilla-addon/content.js';

function writeOutputs() {
  const header = readFileSync(HEADER_FILE, 'utf8');
  const bundle = readFileSync(BUNDLE_OUTPUT, 'utf8');

  writeFileSync(USERSCRIPT_OUTPUT, header + '\n' + bundle);
  copyFileSync(BUNDLE_OUTPUT, CHROME_CONTENT);
  copyFileSync(BUNDLE_OUTPUT, FIREFOX_CONTENT);

  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  console.log(`✓ Built successfully:`);
  console.log(`  ${USERSCRIPT_OUTPUT} (Tampermonkey, ${kb(header.length + bundle.length)})`);
  console.log(`  ${CHROME_CONTENT} (Chrome extension, ${kb(bundle.length)})`);
  console.log(`  ${FIREFOX_CONTENT} (Firefox addon, ${kb(bundle.length)})`);
}

async function build() {
  console.log('Building TeXpress...');

  mkdirSync('dist', { recursive: true });
  mkdirSync('chrome-extension', { recursive: true });
  mkdirSync('mozilla-addon', { recursive: true });

  try {
    await esbuild.build({
      entryPoints: [ENTRY_POINT],
      bundle: true,
      format: 'iife',
      outfile: BUNDLE_OUTPUT,
      minify: false,
      sourcemap: false,
      target: ['es2020'],
      external: [],
    });

    writeOutputs();

    console.log('');
    console.log('To use as Tampermonkey userscript:');
    console.log(`  Copy ${USERSCRIPT_OUTPUT} into Tampermonkey and refresh Overleaf`);
    console.log('');
    console.log('To use as Chrome extension:');
    console.log('  Go to chrome://extensions, enable Developer mode,');
    console.log('  click "Load unpacked", and select the chrome-extension/ folder');
    console.log('');
    console.log('To use as Firefox addon:');
    console.log('  Go to about:debugging > This Firefox > Load Temporary Add-on,');
    console.log('  and select mozilla-addon/manifest.json');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

async function watch() {
  console.log('Watching for changes...');
  console.log('Press Ctrl+C to stop\n');

  await build();

  const ctx = await esbuild.context({
    entryPoints: [ENTRY_POINT],
    bundle: true,
    format: 'iife',
    outfile: BUNDLE_OUTPUT,
    minify: false,
    sourcemap: false,
    target: ['es2020'],
    external: [],
  });

  await ctx.watch();

  const fs = await import('fs');

  fs.watch(HEADER_FILE, async () => {
    console.log('\nHeader changed, rebuilding...');
    await build();
  });

  fs.watch(BUNDLE_OUTPUT, () => {
    try {
      writeOutputs();
    } catch (e) {
      // Ignore errors during rapid rebuilds
    }
  });
}

const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watch();
} else {
  build();
}
