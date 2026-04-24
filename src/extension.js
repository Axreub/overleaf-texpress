/**
 * Main CodeMirror 6 Extension
 * 
 * Integrates snippet matching, math mode detection, and replacement processing
 * into a CM6 inputHandler facet for clean integration with the editor.
 */

import { snippets } from './snippets.js';
import { findMatch, matchFraction } from './matcher.js';
import { isInMathMode, isDisplayMath } from './mathMode.js';
import { processReplacement, buildFractionReplacement } from './replacement.js';
import { createTabstopField, getCurrentTabstop, hasActiveTabstops } from './tabstops.js';

/**
 * Get text before cursor position from editor state
 * 
 * @param {EditorState} state - CM6 editor state
 * @param {number} pos - Cursor position
 * @param {number} maxLength - Maximum characters to retrieve
 * @returns {string}
 */
function getTextBefore(state, pos, maxLength = 500) {
  const start = Math.max(0, pos - maxLength);
  return state.doc.sliceString(start, pos);
}

/**
 * Get text after cursor position from editor state
 * 
 * @param {EditorState} state - CM6 editor state
 * @param {number} pos - Cursor position
 * @param {number} maxLength - Maximum characters to retrieve
 * @returns {string}
 */
function getTextAfter(state, pos, maxLength = 50) {
  const end = Math.min(state.doc.length, pos + maxLength);
  return state.doc.sliceString(pos, end);
}

// Closing brackets for Tab jumping
const CLOSING_BRACKETS = [')', ']', '}'];

// LaTeX commands whose presence inside brackets means the brackets need \left/\right sizing
export const TALL_CONTENT_RE = /\\(frac|dfrac|tfrac|sum|prod|int|oint|iint|iiint|lim|bigcup|bigcap|bigoplus|bigotimes|bigvee|bigwedge)/;

/**
 * Scan backward through text to find the opening bracket that matches
 * a closing bracket typed at the end.  Returns the index of the opening
 * bracket in text, or -1 if not found.
 *
 * @param {string} text - Text before the closing bracket (not including it)
 * @param {string} openChar - The opening bracket character to search for
 * @param {string} closeChar - The closing bracket character (for depth counting)
 */
export function findMatchingOpen(text, openChar, closeChar) {
  let depth = 0;
  for (let i = text.length - 1; i >= 0; i--) {
    if (text[i] === closeChar) {
      depth++;
    } else if (text[i] === openChar) {
      if (depth === 0) return i;
      depth--;
    }
  }
  return -1;
}

/**
 * Check if Tab should jump over a closing bracket
 *
 * @param {string} textAfter - Text after cursor (at least 1 char)
 * @returns {boolean} - true if should jump
 */
export function shouldJumpOverBracket(textAfter) {
  if (!textAfter || textAfter.length === 0) {
    return false;
  }
  return CLOSING_BRACKETS.includes(textAfter[0]);
}

/**
 * Create the snippet expansion input handler
 *
 * @param {Object} tabstopEffects - Effects from tabstop field creation
 * @returns {Function} - CM6 inputHandler function
 */
function createInputHandler(tabstopEffects) {
  return (view, from, to, text) => {
    // Only handle single character insertions for auto-expand
    // This prevents issues with paste, etc.
    if (text.length > 2) {
      return false;
    }

    const state = view.state;
    const pos = from; // Position where text will be inserted

    // Get context
    const existingTextBefore = getTextBefore(state, pos);
    const textBefore = existingTextBefore + text; // Include the character being typed
    const textAfter = getTextAfter(state, to);

    // Detect math mode
    const inMathMode = isInMathMode(state, pos, existingTextBefore);

    // Auto-space after bare LaTeX commands in math mode.
    // \beta followed immediately by a letter would become \betagamma (one unknown
    // command). Insert a space so the next character starts fresh.
    // Only triggers when: in math mode, typing a single letter, and the text
    // immediately before the cursor ends with \command (backslash + letters, no {).
    if (inMathMode && text.length === 1 && /[a-zA-Z]/.test(text) &&
      /\\[a-zA-Z]+$/.test(existingTextBefore)) {
      view.dispatch({
        changes: { from, to, insert: ' ' + text },
        selection: { anchor: from + 2 }
      });
      return true;
    }

    // Auto-size brackets: when ) or ] is typed in math mode, scan back for the
    // matching open bracket and check whether the enclosed content contains a
    // tall operator (frac, sum, int, …).  If so, wrap with \left/\right.
    // Handles arbitrary content — (\sum_{i=1}^N a_i) works just as well as (\sum).
    // Also consumes any duplicate closing bracket left by the auto-close snippet.
    if (inMathMode && (text === ')' || text === ']')) {
      const openChar = text === ')' ? '(' : '[';
      const leftCmd = text === ')' ? '\\left(' : '\\left[';
      const rightCmd = text === ')' ? '\\right)' : '\\right]';

      const openIdx = findMatchingOpen(existingTextBefore, openChar, text);
      if (openIdx >= 0) {
        const content = existingTextBefore.slice(openIdx + 1);
        if (TALL_CONTENT_RE.test(content)) {
          const docOpenPos = pos - existingTextBefore.length + openIdx;
          // Consume the duplicate closing bracket inserted by auto-close, if present
          const replaceTo = (textAfter.length > 0 && textAfter[0] === text) ? to + 1 : to;
          const replacement = leftCmd + content + rightCmd;
          view.dispatch({
            changes: { from: docOpenPos, to: replaceTo, insert: replacement },
            selection: { anchor: docOpenPos + replacement.length }
          });
          return true;
        }
      }
    }

    // Check for fraction shortcut first (only in math mode)
    if (inMathMode) {
      const fractionMatch = matchFraction(textBefore);
      if (fractionMatch) {
        const insertPos = pos - fractionMatch.matchLength + text.length;
        const { text: replacementText, cursorPos } = buildFractionReplacement(
          fractionMatch,
          insertPos
        );

        // Dispatch the replacement transaction
        view.dispatch({
          changes: {
            from: pos - fractionMatch.matchLength + text.length,
            to: to,
            insert: replacementText
          },
          selection: { anchor: cursorPos }
        });

        return true; // Handled - prevent default insertion
      }
    }

    // Check for regular snippet matches
    const match = findMatch(textBefore, snippets, inMathMode, textAfter);

    if (match) {
      // Calculate where the replacement starts
      const replaceFrom = pos - match.matchLength + text.length;

      // Calculate where the replacement ends
      // If the trigger ends with a closing bracket and there's already one after cursor,
      // consume the extra bracket (handles auto-close interaction)
      let replaceTo = to;
      const triggerStr = match.snippet.trigger instanceof RegExp
        ? textBefore.slice(-match.matchLength)
        : match.snippet.trigger;
      const lastTriggerChar = triggerStr[triggerStr.length - 1];

      if ((lastTriggerChar === ')' || lastTriggerChar === ']' || lastTriggerChar === '}') &&
        textAfter.length > 0 && textAfter[0] === lastTriggerChar) {
        // There's a duplicate closing bracket from auto-close, consume it
        replaceTo = to + 1;
      }

      // Process the replacement template
      const processed = processReplacement(
        match.snippet.replacement,
        match,
        replaceFrom
      );

      if (!processed) {
        return false; // Processing failed, let default happen
      }

      const { text: replacementText, tabstops } = processed;
      let { cursorPos } = processed;

      // If the replacement attaches to the previous token (starts with ^ or _),
      // absorb any auto-inserted space that precedes the replacement range.
      // e.g. \alpha + r → \alpha r, then rd → ^{…}: without this we'd get
      // "\alpha ^{…}" because the space was inserted before the 'r'.
      let adjustedFrom = replaceFrom;
      if ((replacementText.startsWith('^') || replacementText.startsWith('_')) &&
        replaceFrom > 0 &&
        state.doc.sliceString(replaceFrom - 1, replaceFrom) === ' ') {
        adjustedFrom = replaceFrom - 1;
        cursorPos -= 1;
        if (tabstops) {
          for (const ts of tabstops) { ts.from -= 1; ts.to -= 1; }
        }
      }

      // Build the transaction
      const effects = [];

      // Set tabstops if any
      if (tabstops && tabstops.length > 0 && tabstopEffects) {
        effects.push(tabstopEffects.setEffect.of(tabstops));
      }

      // Dispatch the replacement
      view.dispatch({
        changes: {
          from: adjustedFrom,
          to: replaceTo,
          insert: replacementText
        },
        selection: { anchor: cursorPos },
        effects
      });

      return true; // Handled
    }

    return false; // No match, let default insertion happen
  };
}

/**
 * Create Tab key handler for tabstop navigation and bracket jumping
 * 
 * @param {Object} tabstopField - Tabstop StateField
 * @param {Object} tabstopEffects - Effects from tabstop field creation
 * @returns {Function} - Keymap command
 */
function createTabCommand(tabstopField, tabstopEffects) {
  return (view) => {
    const state = view.state;

    // Check for active tabstops first
    const tabstopState = state.field(tabstopField, false);
    if (tabstopState && hasActiveTabstops(tabstopState)) {
      const current = getCurrentTabstop(tabstopState);
      if (current) {
        view.dispatch({
          selection: { anchor: current.to },
          effects: [tabstopEffects.advanceEffect.of(null)]
        });
        return true;
      }
    }

    // Smart forward scan: find next }, ), ] on the current line and jump past it.
    // This lets Tab navigate through nested LaTeX structures without needing
    // snippet-inserted tabstops.
    const pos = state.selection.main.head;
    const lineEnd = state.doc.lineAt(pos).to;
    const restOfLine = state.doc.sliceString(pos, lineEnd);
    const nextBracket = restOfLine.search(/[}\)\]]/);
    if (nextBracket !== -1) {
      view.dispatch({ selection: { anchor: pos + nextBracket + 1 } });
      return true;
    }

    return false; // Let default Tab behavior happen
  };
}

/**
 * Create Shift-Tab handler: scan backward on the current line for the previous
 * }, ), ] and jump to just after it — the mirror image of forward Tab scanning.
 */
function createShiftTabCommand() {
  return (view) => {
    const state = view.state;
    const pos = state.selection.main.head;
    const lineStart = state.doc.lineAt(pos).from;
    const beforeCursor = state.doc.sliceString(lineStart, pos);

    // Walk backward to find the last closing bracket before the cursor.
    // Start at length-2 to skip the character immediately left of the cursor —
    // otherwise a } right at the cursor would match itself and the cursor wouldn't move.
    for (let i = beforeCursor.length - 2; i >= 0; i--) {
      const ch = beforeCursor[i];
      if (ch === '}' || ch === ')' || ch === ']') {
        view.dispatch({ selection: { anchor: lineStart + i + 1 } });
        return true;
      }
    }

    return false; // No bracket found, let default Shift-Tab happen
  };
}

/**
 * Create Escape key handler to clear tabstops
 *
 * @param {Object} tabstopField - Tabstop StateField
 * @param {Object} tabstopEffects - Effects from tabstop field creation
 * @returns {Function} - Keymap command
 */
function createEscapeCommand(tabstopField, tabstopEffects) {
  return (view) => {
    const state = view.state;
    const tabstopState = state.field(tabstopField, false);

    if (tabstopState && hasActiveTabstops(tabstopState)) {
      view.dispatch({
        effects: [tabstopEffects.clearEffect.of(null)]
      });
      return true;
    }

    return false;
  };
}

/**
 * Create all extensions needed for the snippet system
 *
 * @param {Object} CM - CodeMirror modules (EditorView, StateField, StateEffect, keymap, Prec)
 * @returns {Array} - Array of CM6 extensions
 */
export function createSnippetExtensions(CM) {
  const { EditorView, StateField, StateEffect, keymap, Prec } = CM;

  // Create tabstop state management
  const tabstopConfig = createTabstopField(StateField, StateEffect);
  const { field: tabstopField, setEffect, clearEffect, advanceEffect } = tabstopConfig;

  const tabstopEffects = { setEffect, clearEffect, advanceEffect };

  // Create input handler
  const inputHandler = EditorView.inputHandler.of(
    createInputHandler(tabstopEffects)
  );

  // Create keymap for Tab and Escape
  // Use high precedence if available so Tab works for bracket jumping
  const keymapDef = keymap.of([
    { key: 'Tab', run: createTabCommand(tabstopField, tabstopEffects) },
    { key: 'Shift-Tab', run: createShiftTabCommand() },
    { key: 'Escape', run: createEscapeCommand(tabstopField, tabstopEffects) }
  ]);

  // Wrap in Prec.highest if available to ensure our Tab handler runs first
  const snippetKeymap = Prec?.highest ? Prec.highest(keymapDef) : keymapDef;

  return [
    tabstopField,
    inputHandler,
    snippetKeymap
  ];
}

export default createSnippetExtensions;
