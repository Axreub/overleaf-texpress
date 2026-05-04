/**
 * Overleaf LaTeX Shortcuts - Entry Point
 *
 * CM6-native only. No DOM key listeners.
 *
 * Initialization strategy:
 *   Path A (preferred): UNSTABLE_editor:extensions event — push extensions
 *                        at editor creation time.
 *   Path B (fallback):  Poll for a running .cm-editor, extract the EditorView
 *                        from the DOM node, then use StateEffect.appendConfig
 *                        to inject extensions into the live editor.
 */

import { createSnippetExtensions } from './extension.js';

let registered = false;

// ========================================
// CM6 MODULE EXTRACTION
// ========================================

function pickIsolateHistory(o) {
  if (!o) return null;
  if (o.isolateHistory && typeof o.isolateHistory.of === 'function') return o.isolateHistory;
  if (o.commands?.isolateHistory && typeof o.commands.isolateHistory.of === 'function') {
    return o.commands.isolateHistory;
  }
  return null;
}

/**
 * @param {Record<string, unknown>} detail - UNSTABLE_editor event.detail or {}
 */
function resolveIsolateHistory(detail = {}) {
  return (
    pickIsolateHistory(detail)
    || pickIsolateHistory(detail.CodeMirror)
    || pickIsolateHistory(detail.commands)
    || pickIsolateHistory(window.CodeMirror)
    || pickIsolateHistory(window.CM?.commands)
    || pickIsolateHistory(window.CM)
    || null
  );
}

/**
 * Try to find CM6 modules from the event detail or window globals.
 * Returns an object with { EditorView, StateField, StateEffect, keymap, Prec, isolateHistory? }
 * or null if the required modules cannot be found.
 */
function extractCodeMirrorModules(detail = {}) {
  const isolateHistory = resolveIsolateHistory(detail);
  const attach = (CMOrPartial) => {
    if (!CMOrPartial) return null;
    const ih =
      isolateHistory
      || pickIsolateHistory(CMOrPartial)
      || null;
    return ih ? { ...CMOrPartial, isolateHistory: ih } : { ...CMOrPartial };
  };

  if (detail.CodeMirror && detail.CodeMirror.EditorView) {
    return attach(detail.CodeMirror);
  }
  if (window.CodeMirror && window.CodeMirror.EditorView) {
    return attach(window.CodeMirror);
  }

  const EditorView  = detail.EditorView  || window.EditorView  || window.CM?.view?.EditorView;
  const StateField  = detail.StateField  || window.StateField  || window.CM?.state?.StateField;
  const StateEffect = detail.StateEffect || window.StateEffect || window.CM?.state?.StateEffect;
  const keymap      = detail.keymap      || window.keymap      || window.CM?.view?.keymap;
  const Prec        = detail.Prec        || window.Prec        || window.CM?.state?.Prec;

  if (EditorView && StateField && StateEffect && keymap) {
    const CM = { EditorView, StateField, StateEffect, keymap, Prec };
    const ih = isolateHistory || pickIsolateHistory(CM) || null;
    if (ih) CM.isolateHistory = ih;
    return CM;
  }

  return null;
}

/**
 * Extract the EditorView instance stored on a .cm-editor DOM element.
 * CodeMirror 6 attaches the view to the element under a key like `__cm6view`
 * or similar. We look for any own-key that starts with `__cm` and holds an
 * object with a `dispatch` method (i.e. an EditorView).
 */
function getEditorViewFromElement(el) {
  for (const key of Object.keys(el)) {
    if (!key.startsWith('__cm')) continue;
    const val = el[key];
    if (val && typeof val.dispatch === 'function') return val;
    if (val && val.view && typeof val.view.dispatch === 'function') return val.view;
  }
  return null;
}

/**
 * Once we have a live EditorView, attempt to find StateEffect so we can call
 * StateEffect.appendConfig. Try the view's constructor namespace first, then
 * fall back to window globals.
 */
function getStateEffectFromView(view) {
  // EditorView.updateListener etc. live on view.constructor; StateEffect is
  // accessible via view.state.constructor (EditorState) in some builds, or
  // directly from global scope.
  const SE = window.StateEffect || window.CM?.state?.StateEffect;
  if (SE?.appendConfig) return SE;

  // Attempt to reach it through the editor's own update mechanism
  try {
    const state = view.state;
    const facetVal = Object.values(state).find(
      v => v && typeof v === 'object' && typeof v.appendConfig !== 'undefined'
    );
    if (facetVal) return facetVal;
  } catch (_) { /* ignore */ }

  return null;
}

// ========================================
// PATH A — UNSTABLE_editor:extensions
// ========================================

window.addEventListener('UNSTABLE_editor:extensions', (event) => {
  if (registered) return;
  try {
    const CM = extractCodeMirrorModules(event.detail);
    if (!CM) {
      console.warn('Overleaf LaTeX Shortcuts: CM6 modules not found in event detail');
      return;
    }
    const exts = createSnippetExtensions(CM);
    event.detail.extensions.push(...exts);
    registered = true;
    console.log('Overleaf LaTeX Shortcuts: registered via UNSTABLE_editor:extensions');
  } catch (err) {
    console.error('Overleaf LaTeX Shortcuts: Path A failed:', err);
  }
});

// ========================================
// PATH B — appendConfig on running editor
// ========================================

const checkInterval = setInterval(() => {
  if (registered) {
    clearInterval(checkInterval);
    return;
  }

  const cmEditor = document.querySelector('.cm-editor');
  if (!cmEditor) return;

  const view = getEditorViewFromElement(cmEditor);
  if (!view) return;

  const StateEffect = getStateEffectFromView(view);
  if (!StateEffect?.appendConfig) {
    // Modules not available yet — keep polling
    return;
  }

  // Build CM object from the view so createSnippetExtensions has what it needs
  const CM = extractCodeMirrorModules();
  if (!CM) {
    console.warn('Overleaf LaTeX Shortcuts: CM6 modules not found for Path B');
    clearInterval(checkInterval);
    return;
  }

  try {
    const exts = createSnippetExtensions(CM);
    view.dispatch({ effects: StateEffect.appendConfig.of(exts) });
    registered = true;
    console.log('Overleaf LaTeX Shortcuts: registered via appendConfig');
  } catch (err) {
    console.error('Overleaf LaTeX Shortcuts: Path B failed:', err);
  }

  clearInterval(checkInterval);
}, 500);

// Stop polling after 30 s regardless
setTimeout(() => clearInterval(checkInterval), 30000);

// ========================================
// DEBUG HELPER
// ========================================

window.debugSnippets = function () {
  const cmEditor = document.querySelector('.cm-editor');
  if (!cmEditor) { console.log('No .cm-editor found'); return; }

  const view = getEditorViewFromElement(cmEditor);
  if (!view) { console.log('Could not find EditorView on .cm-editor element'); return; }

  const state = view.state;
  const pos   = state.selection.main.head;
  const start = Math.max(0, pos - 500);
  const textBefore = state.doc.sliceString(start, pos);
  const textAfter  = state.doc.sliceString(pos, Math.min(state.doc.length, pos + 50));

  // Lazy import to avoid circular dep issues at top level
  import('./mathMode.js').then(({ detectMathModeFromText }) => {
    import('./matcher.js').then(({ findMatch, matchFraction }) => {
      import('./snippets.js').then(({ snippets }) => {
        const inMathMode = detectMathModeFromText(textBefore);
        const fractionMatch = inMathMode ? matchFraction(textBefore) : null;
        const match = findMatch(textBefore, snippets, inMathMode, textAfter);

        console.log('=== debugSnippets ===');
        console.log('Text before (last 50):', textBefore.slice(-50));
        console.log('Text after:', textAfter.slice(0, 20));
        console.log('In math mode:', inMathMode);
        console.log('Fraction match:', fractionMatch);
        console.log('Snippet match:', match ? {
          trigger: match.snippet.trigger.toString(),
          matchLength: match.matchLength,
          captures: match.captures,
          replacement: typeof match.snippet.replacement === 'function'
            ? '[function]'
            : match.snippet.replacement,
        } : null);
      });
    });
  });
};
