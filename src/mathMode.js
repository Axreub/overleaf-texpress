/**
 * Math Mode Detection for LaTeX
 * 
 * Detects whether the cursor is inside a math environment.
 * Uses CodeMirror 6's syntax tree when available, falls back to text-based detection.
 */

/**
 * Helper to safely remove LaTeX comments from text to prevent false positive math detection.
 * Ignores escaped percent signs (\%).
 */
function stripComments(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    // If it's an escape character, skip it and the next character
    if (text[i] === '\\') {
      result += text[i];
      if (i + 1 < text.length) {
        result += text[i + 1];
        i += 2;
      } else {
        i++;
      }
      continue;
    }
    // If it's a comment, skip until the end of the line
    if (text[i] === '%') {
      while (i < text.length && text[i] !== '\n') {
        i++;
      }
      continue;
    }
    result += text[i];
    i++;
  }
  return result;
}

/**
 * Check if a syntax tree node name indicates math mode
 */
function isMathNode(nodeName) {
  const mathNodeNames = [
    'Math', 'InlineMath', 'DisplayMath', 'MathEnvironment',
    'Equation', 'Align', 'Gather', 'Multline', 'MathDelimiter', '$', '$$',
  ];
  return mathNodeNames.some(name =>
    nodeName === name || name.includes('Math') || name.includes('Equation')
  );
}

/**
 * Attempt to detect math mode using CM6 syntax tree
 */
export function detectMathModeFromTree(state, pos) {
  try {
    // Try standard locations for Overleaf's bundled CodeMirror
    const syntaxTree = window.CodeMirror?.language?.syntaxTree || window.CM?.language?.syntaxTree;
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
    return null; // Syntax tree unavailable, triggers fallback safely
  }
}

/**
 * Text-based math mode detection (fallback)
 */
export function detectMathModeFromText(textBefore) {
  const cleanText = stripComments(textBefore);

  const displayMathStart = cleanText.lastIndexOf('\\[');
  const displayMathEnd = cleanText.lastIndexOf('\\]');
  if (displayMathStart > displayMathEnd) return true;

  const lastParaBreak = cleanText.lastIndexOf('\n\n');
  const paraText = lastParaBreak >= 0 ? cleanText.slice(lastParaBreak + 2) : cleanText;

  let dollarCount = 0;
  let doubleDollarCount = 0;
  let i = 0;

  while (i < paraText.length) {
    if (paraText[i] === '\\' && i + 1 < paraText.length) {
      i += 2;
      continue;
    }
    if (paraText[i] === '$') {
      if (i + 1 < paraText.length && paraText[i + 1] === '$') {
        doubleDollarCount++;
        i += 2;
        continue;
      }
      dollarCount++;
    }
    i++;
  }

  if (doubleDollarCount % 2 === 1) return true;
  if (dollarCount % 2 === 1) return true;

  const mathEnvironments = [
    'equation', 'align', 'gather', 'multline', 'eqnarray',
    'equation\\*', 'align\\*', 'gather\\*', 'multline\\*'
  ];

  for (const env of mathEnvironments) {
    const beginRegex = new RegExp(`\\\\begin\\{${env}\\}`, 'g');
    const endRegex = new RegExp(`\\\\end\\{${env}\\}`, 'g');
    const begins = (cleanText.match(beginRegex) || []).length;
    const ends = (cleanText.match(endRegex) || []).length;
    if (begins > ends) return true;
  }

  return false;
}

/**
 * Detect if cursor is in display math mode (for multi-line snippets)
 */
export function isDisplayMath(textBefore) {
  const cleanText = stripComments(textBefore);
  let doubleDollarCount = 0;
  let i = 0;

  while (i < cleanText.length) {
    if (cleanText[i] === '\\' && i + 1 < cleanText.length) {
      i += 2;
      continue;
    }
    if (cleanText[i] === '$' && i + 1 < cleanText.length && cleanText[i + 1] === '$') {
      doubleDollarCount++;
      i += 2;
      continue;
    }
    i++;
  }

  if (doubleDollarCount % 2 === 1) return true;

  const displayStart = cleanText.lastIndexOf('\\[');
  const displayEnd = cleanText.lastIndexOf('\\]');
  if (displayStart > displayEnd) return true;

  const displayEnvs = ['equation', 'align', 'gather', 'multline', 'eqnarray'];
  for (const env of displayEnvs) {
    const beginRegex = new RegExp(`\\\\begin\\{${env}\\*?\\}`, 'g');
    const endRegex = new RegExp(`\\\\end\\{${env}\\*?\\}`, 'g');
    const begins = (cleanText.match(beginRegex) || []).length;
    const ends = (cleanText.match(endRegex) || []).length;
    if (begins > ends) return true;
  }

  return false;
}

/**
 * Main math mode detection function
 */
export function isInMathMode(state, pos, textBefore) {
  const treeResult = detectMathModeFromTree(state, pos);
  if (treeResult !== null) return treeResult;
  return detectMathModeFromText(textBefore);
}

const TEXT_CMD_RE = /\\(text|textbf|textit|textrm|textsf|textsc|textsl|textup|emph|mbox)$/;

/**
 * Detect whether the cursor sits inside an unclosed \text{...}-style group.
 */
export function isInsideTextCommand(textBefore) {
  let depth = 0;
  for (let i = textBefore.length - 1; i >= 0; i--) {
    const c = textBefore[i];

    // Skip escaped braces and the backslash preceding them
    if ((c === '{' || c === '}') && i > 0 && textBefore[i - 1] === '\\') {
      i--; // Skip the escape character so it doesn't trigger on the next loop
      continue;
    }

    if (c === '}') {
      depth++;
    } else if (c === '{') {
      if (depth === 0) {
        // We found our immediate enclosing bracket. Is it a text command?
        if (TEXT_CMD_RE.test(textBefore.slice(0, i))) {
          return true;
        } else {
          return false; // It's a non-text command (like \frac), stop searching
        }
      } else {
        depth--;
      }
    }
  }
  return false;
}

export default isInMathMode;