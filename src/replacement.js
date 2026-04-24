/**
 * Replacement Template Processing
 *
 * Handles tabstop markers ($0, $1, ${0:default}), regex captures ([[0]], [[1]]),
 * [[VISUAL]] substitution, and function-based replacements.
 */

/**
 * Process regex captures in replacement string
 * Replaces [[0]], [[1]], etc. with captured groups
 * 
 * @param {string} template - Replacement template
 * @param {string[]} captures - Captured groups from regex match
 * @returns {string} - Processed replacement
 */
export function applyCaptures(template, captures) {
  if (!captures || captures.length === 0) {
    return template;
  }
  
  let result = template;
  for (let i = 0; i < captures.length; i++) {
    result = result.replace(new RegExp(`\\[\\[${i}\\]\\]`, 'g'), captures[i]);
  }
  return result;
}

/**
 * Process a snippet replacement template
 * Handles tabstops and returns final text with cursor position
 * 
 * @param {string|Function} replacement - Replacement template or function
 * @param {Object} match - Match object with captures
 * @param {number} insertPos - Position where text will be inserted
 * @returns {Object} - { text, cursorPos, tabstops }
 */
export function processReplacement(replacement, match, insertPos) {
  let template;
  
  // Handle function replacements
  if (typeof replacement === 'function') {
    try {
      template = replacement(match.captures ? [match.captures[0], ...match.captures] : []);
    } catch (e) {
      console.error('Snippet function error:', e);
      return null;
    }
  } else {
    template = replacement;
  }
  
  // Apply regex captures: [[0]], [[1]], etc.
  if (match.captures && match.captures.length > 0) {
    template = applyCaptures(template, match.captures);
  }
  
  // Process tabstops and calculate positions
  return processTabstops(template, insertPos);
}

/**
 * Process tabstop markers in template
 * 
 * Tabstop syntax:
 *   $0        - Final cursor position
 *   $1, $2... - Sequential tabstops
 *   ${0:text} - Tabstop with default text
 * 
 * @param {string} template - Template with tabstop markers
 * @param {number} basePos - Base position for offset calculation
 * @returns {Object} - { text, cursorPos, tabstops }
 */
export function processTabstops(template, basePos) {
  let result = template;
  const tabstops = [];
  let cursorPos = basePos + template.length; // Default: end of replacement
  
  // First pass: Process ${n:default} style tabstops
  // Replace with default value but record position
  const defaultRegex = /\$\{(\d+):([^}]+)\}/g;
  let defaultMatch;
  const processedDefaults = new Map();
  
  // Process in order of appearance
  let offset = 0;
  defaultRegex.lastIndex = 0;
  
  while ((defaultMatch = defaultRegex.exec(template)) !== null) {
    const [fullMatch, numStr, defaultVal] = defaultMatch;
    const num = parseInt(numStr, 10);
    const startInTemplate = defaultMatch.index;
    
    // Calculate position in result after previous replacements
    const adjustedStart = startInTemplate - offset + basePos;
    
    // Record tabstop position
    if (!processedDefaults.has(num)) {
      tabstops.push({
        index: num,
        from: adjustedStart,
        to: adjustedStart + defaultVal.length
      });
      processedDefaults.set(num, true);
    }
    
    // Update offset for next iteration
    offset += fullMatch.length - defaultVal.length;
  }
  
  // Replace all ${n:default} with just the default value
  result = result.replace(/\$\{(\d+):([^}]+)\}/g, '$2');
  
  // Second pass: Find $0 for cursor position
  const cursorMarker = result.indexOf('$0');
  if (cursorMarker !== -1) {
    cursorPos = basePos + cursorMarker;
    result = result.replace('$0', '');
    
    // Adjust tabstops that come after $0
    for (const ts of tabstops) {
      if (ts.from > basePos + cursorMarker) {
        ts.from -= 2; // Length of '$0'
        ts.to -= 2;
      }
    }
  }
  
  // Third pass: Record plain $n tabstops (n > 0) as zero-width positions,
  // then remove the markers. These are positions where the cursor should land
  // when Tab is pressed, but with no default text to select.
  {
    const plainRegex = /\$(\d+)/g;
    let m;
    let off = 0;
    while ((m = plainRegex.exec(result)) !== null) {
      const num = parseInt(m[1], 10);
      const pos = basePos + m.index - off;
      if (!processedDefaults.has(num)) {
        tabstops.push({ index: num, from: pos, to: pos });
        processedDefaults.set(num, true);
      }
      off += m[0].length;
    }
  }
  result = result.replace(/\$(\d+)/g, '');
  
  // Sort tabstops by index
  tabstops.sort((a, b) => a.index - b.index);
  
  return {
    text: result,
    cursorPos,
    tabstops
  };
}

/**
 * Build a fraction replacement from matched parts
 *
 * @param {Object} fractionMatch - Match with numerator
 * @param {number} insertPos - Position where fraction starts
 * @returns {Object} - { text, cursorPos }
 */
/**
 * Substitute [[VISUAL]] in a template with the selected text, then process tabstops.
 *
 * @param {string|Function} replacement - Replacement template or function
 * @param {string} selectedText - The currently selected text
 * @param {number} insertPos - Position where the replacement will be inserted
 * @returns {Object} - { text, cursorPos, tabstops }
 */
export function processVisualReplacement(replacement, selectedText, insertPos) {
  const template = typeof replacement === 'function'
    ? replacement([selectedText])
    : replacement.replace(/\[\[VISUAL\]\]/g, selectedText);
  return processTabstops(template, insertPos);
}

export function buildFractionReplacement(fractionMatch, insertPos) {
  const { numerator } = fractionMatch;
  const text = `\\frac{${numerator}}{}`;

  // Cursor position: inside the denominator braces, after the denominator text.
  // This lets the user immediately extend the denominator (e.g. a/b → \frac{a}{b|}
  // and keep typing). Tab jumps over the closing } to exit.
  const cursorPos = insertPos + text.length - 1;

  return { text, cursorPos };
}

export default processReplacement;
