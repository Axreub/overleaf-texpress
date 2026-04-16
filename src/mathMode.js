/**
 * Math Mode Detection for LaTeX
 * 
 * Detects whether the cursor is inside a math environment.
 * Uses CodeMirror 6's syntax tree when available, falls back to text-based detection.
 */

/**
 * Check if a syntax tree node name indicates math mode
 * @param {string} nodeName - The syntax tree node type name
 * @returns {boolean}
 */
function isMathNode(nodeName) {
  // Common LaTeX syntax tree node names for math contexts
  // These may vary depending on the LaTeX language support package
  const mathNodeNames = [
    'Math',
    'InlineMath',
    'DisplayMath',
    'MathEnvironment',
    'Equation',
    'Align',
    'Gather',
    'Multline',
    'MathDelimiter',
    '$',
    '$$',
  ];
  
  return mathNodeNames.some(name => 
    nodeName === name || 
    nodeName.includes('Math') || 
    nodeName.includes('Equation')
  );
}

/**
 * Attempt to detect math mode using CM6 syntax tree
 * @param {EditorState} state - CodeMirror editor state
 * @param {number} pos - Cursor position
 * @returns {boolean|null} - true/false if detected, null if syntax tree unavailable
 */
export function detectMathModeFromTree(state, pos) {
  try {
    // Dynamic import check - syntaxTree may not be available
    const { syntaxTree } = window.CodeMirror?.language || {};
    if (!syntaxTree) return null;
    
    const tree = syntaxTree(state);
    if (!tree || tree.length === 0) return null;
    
    let node = tree.resolveInner(pos, -1);
    
    while (node) {
      if (isMathNode(node.type.name)) {
        return true;
      }
      node = node.parent;
    }
    
    return false;
  } catch (e) {
    // Syntax tree not available, return null to trigger fallback
    return null;
  }
}

/**
 * Text-based math mode detection (fallback)
 * Counts delimiters and checks for math environments
 * 
 * @param {string} textBefore - All text before the cursor position
 * @returns {boolean}
 */
export function detectMathModeFromText(textBefore) {
  // Check for display math \[ ... \]
  const displayMathStart = textBefore.lastIndexOf('\\[');
  const displayMathEnd = textBefore.lastIndexOf('\\]');
  if (displayMathStart > displayMathEnd) {
    return true;
  }

  // Count unescaped $ and $$ signs within the current paragraph only.
  // Inline math cannot span paragraph breaks, so this avoids false positives
  // from earlier math content in the document (e.g. an odd number of $ signs
  // from previous paragraphs incorrectly signalling "in math mode").
  const lastParaBreak = textBefore.lastIndexOf('\n\n');
  const paraText = lastParaBreak >= 0 ? textBefore.slice(lastParaBreak + 2) : textBefore;

  let dollarCount = 0;
  let doubleDollarCount = 0;
  let i = 0;

  while (i < paraText.length) {
    // Skip escaped characters
    if (paraText[i] === '\\' && i + 1 < paraText.length) {
      i += 2;
      continue;
    }

    if (paraText[i] === '$') {
      // Check for $$
      if (i + 1 < paraText.length && paraText[i + 1] === '$') {
        doubleDollarCount++;
        i += 2;
        continue;
      }
      dollarCount++;
    }
    i++;
  }

  // Inside $$ ... $$ (display math)
  if (doubleDollarCount % 2 === 1) {
    return true;
  }

  // Inside $ ... $ (inline math)
  if (dollarCount % 2 === 1) {
    return true;
  }

  // Check for math environments
  const mathEnvironments = [
    'equation', 'align', 'gather', 'multline', 'eqnarray',
    'equation\\*', 'align\\*', 'gather\\*', 'multline\\*'
  ];

  for (const env of mathEnvironments) {
    const beginRegex = new RegExp(`\\\\begin\\{${env}\\}`, 'g');
    const endRegex = new RegExp(`\\\\end\\{${env}\\}`, 'g');

    const begins = (textBefore.match(beginRegex) || []).length;
    const ends = (textBefore.match(endRegex) || []).length;

    if (begins > ends) {
      return true;
    }
  }

  return false;
}

/**
 * Detect if cursor is in display math mode (for multi-line snippets)
 * @param {string} textBefore - Text before cursor
 * @returns {boolean}
 */
export function isDisplayMath(textBefore) {
  // Check for $$ ... 
  let doubleDollarCount = 0;
  let i = 0;
  
  while (i < textBefore.length) {
    if (textBefore[i] === '\\' && i + 1 < textBefore.length) {
      i += 2;
      continue;
    }
    
    if (textBefore[i] === '$' && i + 1 < textBefore.length && textBefore[i + 1] === '$') {
      doubleDollarCount++;
      i += 2;
      continue;
    }
    i++;
  }
  
  if (doubleDollarCount % 2 === 1) {
    return true;
  }
  
  // Check for \[ ... \]
  const displayStart = textBefore.lastIndexOf('\\[');
  const displayEnd = textBefore.lastIndexOf('\\]');
  if (displayStart > displayEnd) {
    return true;
  }
  
  // Check for display math environments
  const displayEnvs = ['equation', 'align', 'gather', 'multline', 'eqnarray'];
  for (const env of displayEnvs) {
    const beginRegex = new RegExp(`\\\\begin\\{${env}\\*?\\}`, 'g');
    const endRegex = new RegExp(`\\\\end\\{${env}\\*?\\}`, 'g');
    const begins = (textBefore.match(beginRegex) || []).length;
    const ends = (textBefore.match(endRegex) || []).length;
    if (begins > ends) {
      return true;
    }
  }
  
  return false;
}

/**
 * Main math mode detection function
 * Tries syntax tree first, falls back to text-based detection
 * 
 * @param {EditorState} state - CodeMirror editor state
 * @param {number} pos - Cursor position
 * @param {string} textBefore - Text before cursor (for fallback)
 * @returns {boolean}
 */
export function isInMathMode(state, pos, textBefore) {
  // Try syntax tree detection first
  const treeResult = detectMathModeFromTree(state, pos);
  if (treeResult !== null) {
    return treeResult;
  }
  
  // Fall back to text-based detection
  return detectMathModeFromText(textBefore);
}

export default isInMathMode;
