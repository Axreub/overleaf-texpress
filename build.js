/**
 * Build Script for Overleaf LaTeX Shortcuts
 * 
 * Bundles ES modules into a single IIFE userscript file
 * with the Tampermonkey header prepended.
 * 
 * Usage:
 *   node build.js          - Build once
 *   node build.js --watch  - Watch for changes and rebuild
 */

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const ENTRY_POINT = 'src/index.js';
const BUNDLE_OUTPUT = 'dist/bundle.js';
const FINAL_OUTPUT = 'dist/overleaf-latex-shortcuts.user.js';
const HEADER_FILE = 'userscript-header.js';

async function build() {
  console.log('Building Overleaf LaTeX Shortcuts...');

  // Ensure dist directory exists
  try {
    mkdirSync('dist', { recursive: true });
  } catch (e) {
    // Directory may already exist
  }

  try {
    // Bundle all modules into a single IIFE
    await esbuild.build({
      entryPoints: [ENTRY_POINT],
      bundle: true,
      format: 'iife',
      outfile: BUNDLE_OUTPUT,
      minify: false, // Keep readable for debugging
      sourcemap: false,
      target: ['es2020'],
      // Don't include any external dependencies
      external: [],
    });

    // Read the header and bundled code
    const header = readFileSync(HEADER_FILE, 'utf8');
    const bundle = readFileSync(BUNDLE_OUTPUT, 'utf8');

    // Combine header and bundle
    const finalScript = header + '\n' + bundle;

    // Write the final userscript
    writeFileSync(FINAL_OUTPUT, finalScript);

    console.log(`✓ Built successfully: ${FINAL_OUTPUT}`);
    console.log(`  Size: ${(finalScript.length / 1024).toFixed(1)} KB`);
    console.log('');
    console.log('To use:');
    console.log(`  1. Copy contents of ${FINAL_OUTPUT}`);
    console.log('  2. Paste into Tampermonkey');
    console.log('  3. Refresh Overleaf');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

async function watch() {
  console.log('Watching for changes...');
  console.log('Press Ctrl+C to stop\n');

  // Initial build
  await build();

  // Set up watch mode
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

  // Also watch header file manually
  const fs = await import('fs');
  fs.watch(HEADER_FILE, async () => {
    console.log('\nHeader changed, rebuilding...');
    await build();
  });

  // Watch for bundle changes and rebuild final output
  fs.watch(BUNDLE_OUTPUT, async () => {
    try {
      const header = readFileSync(HEADER_FILE, 'utf8');
      const bundle = readFileSync(BUNDLE_OUTPUT, 'utf8');
      writeFileSync(FINAL_OUTPUT, header + '\n' + bundle);
      console.log(`✓ Rebuilt: ${FINAL_OUTPUT}`);
    } catch (e) {
      // Ignore errors during rapid rebuilds
    }
  });
}

// Parse command line args
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watch();
} else {
  build();
}
