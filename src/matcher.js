/**
 * Snippet Matching Engine
 * 
 * Finds matching snippets based on text before cursor, mode, and priority.
 */

import { FRAC_PREFIX_OPS } from './snippets';

/**
 * Check if a snippet's mode requirement is satisfied
 * @param {Object} snippet - Snippet definition
 * @param {boolean} inMathMode - Whether cursor is in math mode
 * @returns {boolean}
 */
function matchesMode(snippet, inMathMode) {
  const mode = snippet.options?.mode || "any";
  
  if (mode === "math") return inMathMode;
  if (mode === "text") return !inMathMode;
  return true; // "any" mode
}

/**
 * Attempt to match a single snippet against text
 * @param {string} textBefore - Text before cursor
 * @param {Object} snippet - Snippet definition
 * @returns {Object|null} - Match result or null
 */
function tryMatch(textBefore, snippet) {
  const { trigger, options } = snippet;
  const needsWordBoundary = options?.wordBoundary || false;
  
  // Handle regex triggers
  if (trigger instanceof RegExp) {
    // Wrap regex to match at end of string
    const regex = new RegExp('(' + trigger.source + ')$');
    const match = textBefore.match(regex);
    
    if (match) {
      return {
        matchLength: match[1].length,
        captures: match.slice(2) // Skip full match and first group
      };
    }
    return null;
  }
  
  // Handle string triggers
  if (typeof trigger === 'string') {
    if (!textBefore.endsWith(trigger)) {
      return null;
    }
    
    // Check word boundary if required
    if (needsWordBoundary) {
      const charBefore = textBefore[textBefore.length - trigger.length - 1];
      if (charBefore && /\w/.test(charBefore)) {
        return null;
      }
    }
    
    return {
      matchLength: trigger.length,
      captures: []
    };
  }
  
  return null;
}

/**
 * Check if snippet should be skipped due to potential issues
 * @param {Object} snippet - Snippet definition
 * @param {string} textBefore - Text before cursor
 * @param {string} textAfter - Text after cursor
 * @returns {boolean} - true if should skip
 */
function shouldSkipSnippet(snippet, textBefore, textAfter) {
  const { trigger, replacement, options } = snippet;
  
  // Skip snippets with unresolved variables
  const triggerStr = trigger instanceof RegExp ? trigger.source : String(trigger);
  if (triggerStr.includes('{$GREEK}') || 
      triggerStr.includes('{$SYMBOL}') || 
      triggerStr.includes('{$MORE_SYMBOLS}')) {
    return true;
  }
  
  // Skip visual mode snippets (not supported)
  if (typeof replacement === 'string' && replacement.includes('${VISUAL}')) {
    return true;
  }
  
  // Handle single-character triggers carefully
  if (typeof trigger === 'string' && trigger.length === 1) {
    // Skip problematic single chars
    if ('"\'^'.includes(trigger)) {
      return true;
    }
    
    // For bracket triggers, skip if already has matching close bracket
    const bracketPairs = { '(': ')', '[': ']', '{': '}' };
    if (bracketPairs[trigger] && textAfter.length > 0) {
      if (textAfter[0] === bracketPairs[trigger]) {
        return true;
      }
    }
  }
  
  // Prevent double backslash
  if (typeof replacement === 'string' && replacement.startsWith('\\')) {
    const charBefore = textBefore[textBefore.length - (typeof trigger === 'string' ? trigger.length : 0) - 1];
    if (charBefore === '\\') {
      return true;
    }
  }
  
  return false;
}

/**
 * Find the best matching snippet for the current context
 * 
 * @param {string} textBefore - Text before cursor
 * @param {Array} snippets - Array of snippet definitions
 * @param {boolean} inMathMode - Whether cursor is in math mode
 * @param {string} textAfter - Text after cursor (for bracket detection)
 * @returns {Object|null} - Match result with snippet and match info
 */
export function findMatch(textBefore, snippets, inMathMode, textAfter = '') {
  // Sort by priority (higher first), then by trigger length (longer first)
  const sortedSnippets = [...snippets].sort((a, b) => {
    const prioA = a.options?.priority || 0;
    const prioB = b.options?.priority || 0;
    if (prioB !== prioA) return prioB - prioA;
    
    // For string triggers, prefer longer matches
    const lenA = typeof a.trigger === 'string' ? a.trigger.length : 0;
    const lenB = typeof b.trigger === 'string' ? b.trigger.length : 0;
    return lenB - lenA;
  });
  
  for (const snippet of sortedSnippets) {
    // Check mode compatibility
    if (!matchesMode(snippet, inMathMode)) {
      continue;
    }
    
    // Check if auto-expand is required
    if (snippet.options?.auto === false) {
      continue; // Skip non-auto snippets (require Tab)
    }
    
    // Check if should skip due to special conditions
    if (shouldSkipSnippet(snippet, textBefore, textAfter)) {
      continue;
    }
    
    // Try to match
    const match = tryMatch(textBefore, snippet);
    if (match) {
      return {
        snippet,
        matchLength: match.matchLength,
        captures: match.captures
      };
    }
  }
  
  return null;
}

/**
 * Match an instant fraction trigger: "<token>/" at end of textBefore.
 * Returns the numerator token; the denominator is left empty for the
 * caller to place the cursor inside.
 * A token is one of (in order of precedence):
 *   - A parenthesised group: (...) with no nested parens
 *   - A LaTeX command with a single braced argument: \cmd{...}
 *   - A LaTeX command: \cmd
 *   - A single alphanumeric character
 *
 * For single-char numerators we additionally require that the character
 * before it is NOT an alphabetic character or backslash, to avoid matching
 * inside a word like "alpha/b".
 *
 * @param {string} textBefore - Text before cursor (the denominator's last
 *   character must be the last character of textBefore)
 * @returns {Object|null} - { matchLength, numerator, denominator } or null
 */

export function matchFraction(textBefore) {
  const s = textBefore;
  const len = s.length;
  if (len < 2) return null;

  // Trigger fires the instant '/' is typed at the end of input
  if (s[len - 1] !== '/') return null;

  // len - 1 is the slash, grab starting from prev char
  const { token: numerator, consumed, singleChar } = scanTokenLeft(s, len - 2);
  if (!numerator) return null;

  // Reject single-char numerators preceded by a letter/backslash
  // (so "alpha/" isn't read as "a/")
  if (singleChar) {
    const charBeforeNum = s[len - 3];
    if (charBeforeNum && /[a-zA-Z\\]/.test(charBeforeNum)) {
      return null;
    }
  }

  return {
    matchLength: consumed + 1, // numerator + '/'
    numerator,
  };
}


/**
 * Scan backward from position `pos` (inclusive) in string `s` to extract
 * a fraction token. Returns { token, consumed, singleChar }.
 * `consumed` is the number of characters that belong to the token.
 */
function scanTokenLeft(s, pos) {
  const atom = scanAtom(s, pos);
  if (!atom.token) return null;

  // Extend leftward through chained ^/_ scripts
  let consumed = atom.consumed;
  while (true) {
    const markerPos = pos - consumed;
    if (markerPos < 0) break;
    if (s[markerPos] !== '^' && s[markerPos] !== '_') break;

    const base = scanAtom(s, markerPos - 1);
    if (!base.token) break;
    consumed += 1 + base.consumed;
  }

  while (true) {
    const before = s.slice(0, pos - consumed + 1);
  
    // Whitelisted \cmd with optional single space (\partial x, \sin x)
    const cmdPeek = before.match(/\\([a-zA-Z]+)\s?$/);
    if (cmdPeek && FRAC_PREFIX_OPS.has(cmdPeek[1])) {
      consumed += cmdPeek[0].length;
      continue;
    }
  
    // Any \cmd directly adjacent, no space (x\alpha)
    const adjCmdPeek = before.match(/\\[a-zA-Z]+$/);
    if (adjCmdPeek) {
      consumed += adjCmdPeek[0].length;
      continue;
    }
  
    // Adjacent letters/digits (df in df(x))
    const wordPeek = before.match(/[a-zA-Z0-9]+$/);
    if (wordPeek) {
      consumed += wordPeek[0].length;
      continue;
    }
  
    break;
  }
  if (consumed > atom.consumed) {
    return { token: s.slice(pos - consumed + 1, pos + 1), consumed, singleChar: false };
  }
  return atom;
}


/**
 * Scan backward from position `pos` (inclusive) in string `s` to extract
 * a fraction token. Returns { token, consumed, singleChar }.
 * `consumed` is the number of characters that belong to the token.
 */
function scanAtom(s, pos) {
  if (pos < 0) return { token: null, consumed: 0, singleChar: false };

  // Parenthesised group: (...)
  if (s[pos] === ')') {
    const openPos = findMatchingOpenParen(s, pos, 'regular');
    if (openPos >= 0) {
      const inner = s.slice(openPos + 1, pos);
      return { token: inner, consumed: pos - openPos + 1, singleChar: false };
    }
    return { token: null, consumed: 0, singleChar: false };
  }

  if (s[pos] === '}') {
    const openBrace = findMatchingOpenParen(s, pos, 'curly');
    if (openBrace >= 0) {
      const arg = s.slice(openBrace + 1, pos);
      let cmdEnd = openBrace - 1;
      if (cmdEnd >= 0 && /[a-zA-Z]/.test(s[cmdEnd])) {
        let cmdStart = cmdEnd;
        while (cmdStart > 0 && /[a-zA-Z]/.test(s[cmdStart - 1])) cmdStart--;
        if (cmdStart > 0 && s[cmdStart - 1] === '\\') {
          const cmd = s.slice(cmdStart - 1, openBrace);
          const consumed = pos - (cmdStart - 1) + 1;
          return { token: `${cmd}{${arg}}`, consumed, singleChar: false };
        }
      }
      // Bare brace group, no command
      return { token: `{${arg}}`, consumed: pos - openBrace + 1, singleChar: false };
    }
    return { token: null, consumed: 0, singleChar: false };
  }

  // Plain LaTeX command: \cmd
  if (/[a-zA-Z]/.test(s[pos])) {
    let end = pos;
    let start = end;
    while (start > 0 && /[a-zA-Z]/.test(s[start - 1])) start--;
    if (start > 0 && s[start - 1] === '\\') {
      const cmd = s.slice(start - 1, end + 1);
      return { token: cmd, consumed: end - start + 2, singleChar: false };
    }
    // not a command
    const word = s.slice(start, end + 1);
    return { token: word, consumed: end - start + 1, singleChar: word.length === 1 };
  }

  // Single digit
  if (/[0-9]/.test(s[pos])) {
    return { token: s[pos], consumed: 1, singleChar: true };
  }

  return { token: null, consumed: 0, singleChar: false };
}

function findMatchingOpenParen(s, closePos, parenType) {
  if (parenType === 'regular') {
    rightParen = ')';
    leftParen = '(';
  } else if (parenType === 'square') {
    rightParen = ']';
    leftParen = '[';
  } else if (parenType === 'curly') {
    rightParen = '}';
    leftParen = '{';
  }
  let depth = 1;
  let i = closePos - 1;
  while (i >= 0 && depth > 0) {
    if (s[i] === rightParen) depth++;
    else if (s[i] === leftParen) depth--;
    i--;
  }
  return depth === 0 ? i + 1 : -1;
}
export default findMatch;
