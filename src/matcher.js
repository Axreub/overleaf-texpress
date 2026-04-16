/**
 * Snippet Matching Engine
 * 
 * Finds matching snippets based on text before cursor, mode, and priority.
 */

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
  if (triggerStr.includes('${GREEK}') || 
      triggerStr.includes('${SYMBOL}') || 
      triggerStr.includes('${MORE_SYMBOLS}')) {
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
 * Match fraction patterns like x/y, (a+b)/c, \pi/2, \hat{H}/\hbar.
 *
 * Uses a single backward-scanning pass:
 *   1. Find the '/' that must be the last or second-to-last character.
 *   2. Scan backward from '/' to classify the numerator token.
 *   3. Scan forward from '/' to classify the denominator token.
 *
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
  if (len < 3) return null;

  // Scan the denominator (right of '/')
  const { token: denominator, consumed: denomConsumed } = scanTokenRight(s, len - 1);
  if (!denominator) return null;

  // The '/' must be immediately before the denominator
  const slashPos = len - 1 - denomConsumed;
  if (slashPos < 0 || s[slashPos] !== '/') return null;

  // Scan the numerator (left of '/')
  const { token: numerator, consumed: numConsumed, singleChar } = scanTokenLeft(s, slashPos - 1);
  if (!numerator) return null;

  // For single-char numerators, reject if preceded by a letter or backslash
  // (avoids matching "alpha/b" as "a/b" when the 'a' is part of "alpha")
  if (singleChar) {
    const charBeforeNum = s[slashPos - 1 - 1]; // one before the single char
    if (charBeforeNum && /[a-zA-Z\\]/.test(charBeforeNum)) {
      return null;
    }
  }

  const matchLength = numConsumed + 1 /* slash */ + denomConsumed;
  return { matchLength, numerator, denominator };
}

/**
 * Scan backward from position `pos` (inclusive) in string `s` to extract
 * a fraction token. Returns { token, consumed, singleChar }.
 * `consumed` is the number of characters that belong to the token.
 */
function scanTokenLeft(s, pos) {
  if (pos < 0) return { token: null, consumed: 0, singleChar: false };

  // Parenthesised group: (...) — no nested parens allowed
  if (s[pos] === ')') {
    const openPos = s.lastIndexOf('(', pos - 1);
    if (openPos >= 0 && !s.slice(openPos + 1, pos).includes('(') && !s.slice(openPos + 1, pos).includes(')')) {
      const inner = s.slice(openPos + 1, pos);
      return { token: inner, consumed: pos - openPos + 1, singleChar: false };
    }
    return { token: null, consumed: 0, singleChar: false };
  }

  // LaTeX command with braced arg: \cmd{...} or just \cmd
  if (s[pos] === '}') {
    const openBrace = s.lastIndexOf('{', pos - 1);
    if (openBrace >= 0) {
      const arg = s.slice(openBrace + 1, pos);
      // Find the \command before the brace
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
    // Single alphanumeric character
    return { token: s[pos], consumed: 1, singleChar: true };
  }

  // Single digit
  if (/[0-9]/.test(s[pos])) {
    return { token: s[pos], consumed: 1, singleChar: true };
  }

  return { token: null, consumed: 0, singleChar: false };
}

/**
 * Scan forward from position `pos` (inclusive, which must be the first char
 * after the '/') in string `s` to extract a fraction token.
 * Returns { token, consumed }.
 */
function scanTokenRight(s, endPos) {
  // endPos is the index of the last char we have (end of textBefore).
  // We scan rightward from after the slash — but since we only have textBefore
  // we read from endPos backward to find the slash, then the denominator is
  // whatever follows the slash up to endPos.
  //
  // Reframe: the denominator ends at s[endPos]. Walk backward from endPos.
  const pos = endPos;
  if (pos < 0) return { token: null, consumed: 0 };

  // Parenthesised group ending at pos
  if (s[pos] === ')') {
    const openPos = s.lastIndexOf('(', pos - 1);
    if (openPos >= 0 && !s.slice(openPos + 1, pos).includes('(') && !s.slice(openPos + 1, pos).includes(')')) {
      const inner = s.slice(openPos + 1, pos);
      return { token: inner, consumed: pos - openPos + 1 };
    }
    return { token: null, consumed: 0 };
  }

  // LaTeX command with braced arg ending at pos (pos === '}')
  if (s[pos] === '}') {
    const openBrace = s.lastIndexOf('{', pos - 1);
    if (openBrace >= 0) {
      const arg = s.slice(openBrace + 1, pos);
      let cmdEnd = openBrace - 1;
      if (cmdEnd >= 0 && /[a-zA-Z]/.test(s[cmdEnd])) {
        let cmdStart = cmdEnd;
        while (cmdStart > 0 && /[a-zA-Z]/.test(s[cmdStart - 1])) cmdStart--;
        if (cmdStart > 0 && s[cmdStart - 1] === '\\') {
          const cmd = s.slice(cmdStart - 1, openBrace);
          const consumed = pos - (cmdStart - 1) + 1;
          return { token: `${cmd}{${arg}}`, consumed };
        }
      }
    }
    return { token: null, consumed: 0 };
  }

  // Plain LaTeX command ending at pos
  if (/[a-zA-Z]/.test(s[pos])) {
    let end = pos;
    let start = end;
    while (start > 0 && /[a-zA-Z]/.test(s[start - 1])) start--;
    if (start > 0 && s[start - 1] === '\\') {
      const cmd = s.slice(start - 1, end + 1);
      return { token: cmd, consumed: end - start + 2 };
    }
    // Single letter
    return { token: s[pos], consumed: 1 };
  }

  // Single digit
  if (/[0-9]/.test(s[pos])) {
    return { token: s[pos], consumed: 1 };
  }

  return { token: null, consumed: 0 };
}

export default findMatch;
