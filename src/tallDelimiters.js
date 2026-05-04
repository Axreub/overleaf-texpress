/**
 * Tall math content and \left / \right delimiter upgrading (nested round, square, curly, \{…\}).
 */

/** LaTeX that typically needs delimiter scaling */
export const TALL_CONTENT_RE =
  /\\(frac|dfrac|tfrac|sum|prod|int|oint|iint|iiint|lim|bigcup|bigcap|bigoplus|bigotimes|bigvee|bigwedge|sqrt|binom|choose|overset|underset|stackrel|begin)/;

export function containsTallOp(s) {
  return TALL_CONTENT_RE.test(s);
}

/**
 * @param {string} s
 * @param {number} openIdx index of `(` `[` `{`, or `\` starting `\{`
 * @param {'round'|'square'|'brace'|'set'} kind
 * @returns {number} index of closing `)` `]` `}`, or `\` starting `\}`
 */
export function findMatchingClose(s, openIdx, kind) {
  let i;
  const n = s.length;
  const stack = [];
  if (kind === 'set') {
    if (openIdx + 1 >= n || s[openIdx] !== '\\' || s[openIdx + 1] !== '{') return -1;
    i = openIdx + 2;
  } else if (kind === 'round') {
    if (s[openIdx] !== '(') return -1;
    i = openIdx + 1;
  } else if (kind === 'square') {
    if (s[openIdx] !== '[') return -1;
    i = openIdx + 1;
  } else {
    if (s[openIdx] !== '{') return -1;
    i = openIdx + 1;
  }

  while (i < n) {
    if (s[i] === '\\' && i + 1 < n && s[i + 1] === '{') {
      stack.push('set');
      i += 2;
      continue;
    }
    if (s[i] === '\\' && i + 1 < n && s[i + 1] === '}') {
      if (stack.length && stack[stack.length - 1] === 'set') {
        stack.pop();
        i += 2;
        continue;
      }
      // Outer `\{ ... \}` : closers were never pushed; `\}` matches with empty stack.
      if (kind === 'set' && stack.length === 0) return i;
      i += 2;
      continue;
    }

    const ch = s[i];
    if (ch === '(') {
      stack.push(')');
      i += 1;
    } else if (ch === '[') {
      stack.push(']');
      i += 1;
    } else if (ch === '{') {
      stack.push('}');
      i += 1;
    } else if (ch === ')') {
      if (!stack.length) return kind === 'round' ? i : -1;
      if (stack[stack.length - 1] === ')') {
        stack.pop();
        i += 1;
      } else return -1;
    } else if (ch === ']') {
      if (!stack.length) return kind === 'square' ? i : -1;
      if (stack[stack.length - 1] === ']') {
        stack.pop();
        i += 1;
      } else return -1;
    } else if (ch === '}') {
      if (!stack.length) return kind === 'brace' ? i : -1;
      if (stack[stack.length - 1] === '}') {
        stack.pop();
        i += 1;
      } else return -1;
    } else {
      i += 1;
    }
  }
  return -1;
}

function leftPrefixOkPlain(s, openIdx, kind) {
  const before = s.slice(Math.max(0, openIdx - 10), openIdx);
  return !/\\left\s*$/.test(before);
}

function rightPrefixOkPlain(s, closeIdx, kind) {
  const before = s.slice(Math.max(0, closeIdx - 10), closeIdx);
  return !/\\right\s*$/.test(before);
}

/**
 * Collect (openIdx, closeIdx, kind) for every structural opener before `focus` whose pair encloses `focus`.
 */
function collectPairsEnclosing(s, focus) {
  const pairs = [];
  const n = s.length;
  for (let openIdx = 0; openIdx < focus; openIdx++) {
    let kind = null;
    if (s[openIdx] === '(') kind = 'round';
    else if (s[openIdx] === '[') kind = 'square';
    else if (s[openIdx] === '{') kind = 'brace';
    else if (s[openIdx] === '\\' && openIdx + 1 < n && s[openIdx + 1] === '{') kind = 'set';
    if (!kind) continue;

    const closeIdx = findMatchingClose(s, openIdx, kind);
    // CM caret before the closer is at index closeIdx (gap before sliceString[closeIdx]); include it.
    if (closeIdx < 0 || focus <= openIdx || focus > closeIdx) continue;

    const innerStart = openIdx + (kind === 'set' ? 2 : 1);
    const inner = s.slice(innerStart, closeIdx);
    if (!containsTallOp(inner)) continue;
    if (!leftPrefixOkPlain(s, openIdx, kind)) continue;
    if (!rightPrefixOkPlain(s, closeIdx, kind)) continue;
    pairs.push({ openIdx, closeIdx, kind });
  }
  return pairs;
}

function formatLeft(kind) {
  switch (kind) {
    case 'round':
      return '\\left( ';
    case 'square':
      return '\\left[ ';
    case 'brace':
      return '\\left\\{ ';
    case 'set':
      return '\\left\\{ ';
    default:
      return '';
  }
}

function formatRight(kind) {
  switch (kind) {
    case 'round':
      return ' \\right)';
    case 'square':
      return ' \\right]';
    case 'brace':
      return ' \\right\\}';
    case 'set':
      return ' \\right\\}';
    default:
      return '';
  }
}

function openLen(kind) {
  return kind === 'set' ? 2 : 1;
}

function closeLen(kind) {
  return kind === 'set' ? 2 : 1;
}

/**
 * Repeatedly upgrade the smallest enclosing plain delimiter pair until stable.
 * @param {string} s full document after the primary edit
 * @param {number} focus index strictly inside a pair (e.g. cursor after edit)
 * @returns {{ text: string, focus: number }}
 */
export function upgradeAllEnclosingDelims(s, focus) {
  let cur = s;
  let focusPos = focus;
  const maxPass = 24;
  for (let pass = 0; pass < maxPass; pass++) {
    if (focusPos <= 0 || focusPos >= cur.length) break;
    const pairs = collectPairsEnclosing(cur, focusPos);
    if (pairs.length === 0) break;
    pairs.sort((a, b) => (a.closeIdx - a.openIdx) - (b.closeIdx - b.openIdx));
    const best = pairs[0];
    const { openIdx, closeIdx, kind } = best;
    const ol = openLen(kind);
    const cl = closeLen(kind);
    const openSlice = cur.slice(openIdx, openIdx + ol);
    const closeSlice = cur.slice(closeIdx, closeIdx + cl);

    const leftIns = formatLeft(kind);
    const rightIns = formatRight(kind);

    if (kind === 'set') {
      if (openSlice !== '\\{') break;
      if (closeSlice !== '\\}') break;
    } else {
      const expectOpen = kind === 'round' ? '(' : kind === 'square' ? '[' : '{';
      if (openSlice[0] !== expectOpen) break;
      const expectClose = kind === 'round' ? ')' : kind === 'square' ? ']' : '}';
      if (closeSlice[0] !== expectClose) break;
    }

    cur =
      cur.slice(0, openIdx) +
      leftIns +
      cur.slice(openIdx + ol, closeIdx) +
      rightIns +
      cur.slice(closeIdx + cl);

    const deltaInner = leftIns.length - ol;
    const deltaTotal = leftIns.length - ol + rightIns.length - cl;
    if (focusPos <= closeIdx) focusPos += deltaInner;
    else focusPos += deltaTotal;
  }
  return { text: cur, focus: focusPos };
}

/**
 * Diff two strings and return a single replace range in old coordinates.
 * @returns {{ from: number, to: number, insert: string } | null}
 */
/**
 * Map an index in `src` into `dst` when `dst` is produced from `src` by inserting
 * characters (delimiter upgrades). Walks both strings in lockstep, advancing `dst`
 * on extra characters until the next `src` character matches.
 */
export function mapIndexAcrossDelimiterExpand(src, dst, index) {
  if (src === dst || index <= 0) return Math.min(index, dst.length);
  let si = 0;
  let di = 0;
  while (si < index && si < src.length && di < dst.length) {
    if (src[si] === dst[di]) {
      si++;
      di++;
    } else {
      di++;
    }
  }
  return Math.min(di + (index - si), dst.length);
}

export function singleReplaceDiff(oldStr, newStr) {
  if (oldStr === newStr) return null;
  let l = 0;
  const minLen = Math.min(oldStr.length, newStr.length);
  while (l < minLen && oldStr[l] === newStr[l]) l++;
  let rOld = oldStr.length - 1;
  let rNew = newStr.length - 1;
  while (rOld >= l && rNew >= l && oldStr[rOld] === newStr[rNew]) {
    rOld--;
    rNew--;
  }
  return {
    from: l,
    to: rOld + 1,
    insert: newStr.slice(l, rNew + 1)
  };
}

/** Find matching structural open for a close at `closeIdx`, try `)` `]` `}` and `\}`. */
function findOpenForCloseChar(s, closeIdx) {
  const n = s.length;
  for (let openIdx = 0; openIdx < closeIdx; openIdx++) {
    let kind = null;
    if (s[openIdx] === '(') kind = 'round';
    else if (s[openIdx] === '[') kind = 'square';
    else if (s[openIdx] === '{') kind = 'brace';
    else if (s[openIdx] === '\\' && openIdx + 1 < n && s[openIdx + 1] === '{') kind = 'set';
    if (!kind) continue;
    const c = findMatchingClose(s, openIdx, kind);
    if (c === closeIdx) return { openIdx, kind };
  }
  return null;
}

/**
 * User typed `)` `]` or `}`; if the matching opener is already `\left` but `\right` is missing, return spaced `\right…` (includes leading space before `\right`).
 * @returns {string|null}
 */
export function completeRightForPlainClose(s, closeIdx) {
  const ch = s[closeIdx];
  if (ch !== ')' && ch !== ']' && ch !== '}') return null;
  const found = findOpenForCloseChar(s, closeIdx);
  if (!found) return null;
  const { openIdx, kind } = found;
  const expect = kind === 'round' ? ')' : kind === 'square' ? ']' : '}';
  if (ch !== expect) return null;

  if (leftPrefixOkPlain(s, openIdx, kind)) return null;
  if (!rightPrefixOkPlain(s, closeIdx, kind)) return null;
  return formatRight(kind);
}
