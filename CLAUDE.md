# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Overleaf LaTeX Shortcuts is a browser userscript that adds LaTeX Suite-style snippet expansion to Overleaf. It intercepts keystrokes in Overleaf's CodeMirror 6 editor and expands short triggers into LaTeX commands (e.g., `@a` → `\alpha`, `x/y` → `\frac{x}{y}`).

## Build Commands

```bash
npm run build   # Build userscript to dist/overleaf-latex-shortcuts.user.js
npm run watch   # Watch mode - rebuild on file changes
npm test        # Run tests with Node.js native test runner
```

## Architecture

### Entry Point & Initialization (`src/index.js`)
- Listens for Overleaf's `UNSTABLE_editor:extensions` event to inject extensions
- Extracts CodeMirror modules from event detail, window object, or DOM
- Multiple fallback mechanisms ensure initialization succeeds

### CodeMirror 6 Extensions (`src/extension.js`)
Returns three CM6 extensions:
1. **tabstopField** - StateField tracking cursor positions for tabstop navigation
2. **inputHandler** - Intercepts text input, detects triggers, expands snippets
3. **snippetKeymap** - Tab (advance tabstop/jump brackets) and Escape (clear tabstops) handlers

### Snippet Definitions (`src/snippets.js`)
150+ snippets with structure:
```javascript
{
  trigger: "sr" | /regex/,           // String or regex pattern
  replacement: "^{2}" | function(),  // Template or function
  options: {
    mode: "math" | "text" | "any",   // When to trigger
    auto: true,                       // Auto-expand vs require Tab
    priority: 0,                      // Higher wins conflicts
    wordBoundary: false               // Require boundary before trigger
  }
}
```

### Matching Engine (`src/matcher.js`)
- `findMatch()` - Sorts by priority then trigger length, validates mode/boundaries
- `matchFraction()` - Detects patterns like `x/y`, `\pi/2`, `(a+b)/(c+d)`

### Math Mode Detection (`src/mathMode.js`)
- Primary: `detectMathModeFromTree()` - uses CM6 syntax tree
- Fallback: `detectMathModeFromText()` - counts delimiters (`$`, `$$`, `\[...\]`)
- `isInMathMode()` tries tree first, falls back to text

### Tabstop Management (`src/tabstops.js`)
- CM6 StateField with effects for set/clear/advance
- `mapTabstopsThroughChanges()` adjusts positions on document edits

### Replacement Processing (`src/replacement.js`)
- `applyCaptures()` - substitutes `[[0]]`, `[[1]]` with regex groups
- `processTabstops()` - handles `$0`, `$1`, `${0:default}` markers

## Key Patterns

- **Regex captures in replacements**: Use `[[0]]`, `[[1]]` syntax
- **Tabstops**: `$0` = final cursor, `$1`/`$2` = sequential, `${0:default}` = with default text
- **Function replacements**: Return string for dynamic content (see `iden` matrix snippets)
- **Auto-close brackets**: In math mode, `(`, `[`, `{` auto-insert closing pair
- **Tab key**: Advances tabstops, then jumps over `)`, `]`, `}` if no tabstops active
- **Big operator sizing**: `(\sum)` → `\left(\sum\right)` (works with `\prod`, `\int`, etc.)

## Build System

`build.js` uses esbuild to:
1. Bundle ES modules into single IIFE
2. Prepend Tampermonkey header from `userscript-header.js`
3. Output readable (non-minified) userscript to `dist/`
