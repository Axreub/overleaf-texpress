/**
 * Snippet Definitions for Overleaf LaTeX Shortcuts
 * 
 * Options:
 *   mode: "math" | "text" | "any" - when the snippet should trigger
 *   auto: boolean - auto-expand without Tab (default: true for most)
 *   wordBoundary: boolean - require word boundary before trigger
 *   priority: number - higher priority matches first (default: 0)
 */

// ========================================
// GREEK LETTERS (word form)
// ========================================
// Letters that contain other Greek letters as suffixes need higher priority
// to avoid partial matches (e.g., "beta" should not become "\b" + "\eta")
const GREEK_LETTERS_HIGH_PRIORITY = ['beta', 'theta'];  // contain "eta"

const GREEK_LETTERS_NORMAL = [
  'alpha', 'gamma', 'delta', 'epsilon', 'zeta', 'eta',
  'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho',
  'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
  'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega'
];

// Generate Greek letter snippets programmatically
// High priority letters (contain other Greek letters as suffixes)
const greekSnippetsHighPriority = GREEK_LETTERS_HIGH_PRIORITY.map(letter => ({
  trigger: letter,
  replacement: '\\' + letter,
  // wordBoundary prevents "abeta" from matching "beta", etc.
  options: { mode: "math", auto: true, priority: -1, wordBoundary: true }
}));

// Normal priority Greek letters
const greekSnippetsNormal = GREEK_LETTERS_NORMAL.map(letter => ({
  trigger: letter,
  replacement: '\\' + letter,
  options: { mode: "math", auto: true, priority: -2, wordBoundary: true }
}));

const greekSnippets = [...greekSnippetsHighPriority, ...greekSnippetsNormal];

// ========================================
// MAIN SNIPPET DEFINITIONS
// ========================================
export const snippets = [
  // ----------------------------------------
  // Math/Text Mode Entry
  // ----------------------------------------
  { trigger: "mk", replacement: "$$0$", options: { mode: "text", auto: true } },
  { trigger: "dm", replacement: "$$\n$0\n$$", options: { mode: "text", auto: true, wordBoundary: true } },
  // beg: cursor starts in body ($0), Tab navigates to env name inside \begin{}
  // Both \begin and \end show "env" placeholder — second occurrence is static (not a linked tabstop)
  { trigger: "beg", replacement: "\\begin{${1:env}}\n$0\n\\end{${1:env}}", options: { mode: "text", auto: true } },
  // Text-mode display math environments — reach for these like you'd reach for dm
  { trigger: "ali", replacement: "\\begin{align*}\n$0\n\\end{align*}", options: { mode: "text", auto: true } },
  { trigger: "eq",  replacement: "\\begin{equation}\n$0\n\\end{equation}", options: { mode: "text", auto: true } },

  // ----------------------------------------
  // Greek Letters (@ shortcuts)
  // ----------------------------------------
  { trigger: "@a", replacement: "\\alpha", options: { mode: "math", auto: true } },
  { trigger: "@b", replacement: "\\beta", options: { mode: "math", auto: true } },
  { trigger: "@g", replacement: "\\gamma", options: { mode: "math", auto: true } },
  { trigger: "@G", replacement: "\\Gamma", options: { mode: "math", auto: true } },
  { trigger: "@d", replacement: "\\delta", options: { mode: "math", auto: true } },
  { trigger: "@D", replacement: "\\Delta", options: { mode: "math", auto: true } },
  { trigger: "@e", replacement: "\\epsilon", options: { mode: "math", auto: true } },
  { trigger: ":e", replacement: "\\varepsilon", options: { mode: "math", auto: true } },
  { trigger: "@z", replacement: "\\zeta", options: { mode: "math", auto: true } },
  { trigger: "@t", replacement: "\\theta", options: { mode: "math", auto: true } },
  { trigger: "@T", replacement: "\\Theta", options: { mode: "math", auto: true } },
  { trigger: ":t", replacement: "\\vartheta", options: { mode: "math", auto: true } },
  { trigger: "@i", replacement: "\\iota", options: { mode: "math", auto: true } },
  { trigger: "@k", replacement: "\\kappa", options: { mode: "math", auto: true } },
  { trigger: "@l", replacement: "\\lambda", options: { mode: "math", auto: true } },
  { trigger: "@L", replacement: "\\Lambda", options: { mode: "math", auto: true } },
  { trigger: "@s", replacement: "\\sigma", options: { mode: "math", auto: true } },
  { trigger: "@S", replacement: "\\Sigma", options: { mode: "math", auto: true } },
  { trigger: "@u", replacement: "\\upsilon", options: { mode: "math", auto: true } },
  { trigger: "@U", replacement: "\\Upsilon", options: { mode: "math", auto: true } },
  { trigger: "@o", replacement: "\\omega", options: { mode: "math", auto: true } },
  { trigger: "@O", replacement: "\\Omega", options: { mode: "math", auto: true } },
  { trigger: "@p", replacement: "\\partial", options: { mode: "math", auto: true } },
  { trigger: "ome", replacement: "\\omega", options: { mode: "math", auto: true } },
  { trigger: "Ome", replacement: "\\Omega", options: { mode: "math", auto: true } },

  // Variant forms
  { trigger: "vareps", replacement: "\\varepsilon", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "varphi", replacement: "\\varphi", options: { mode: "math", auto: true, priority: -1 } },

  // ----------------------------------------
  // Text Environment
  // ----------------------------------------
  { trigger: "text", replacement: "\\text{$0}$1", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Basic Operations
  // ----------------------------------------
  { trigger: "sr", replacement: "^{2}", options: { mode: "math", auto: true } },
  { trigger: "cb", replacement: "^{3}", options: { mode: "math", auto: true } },
  { trigger: "rd", replacement: "^{$0}$1", options: { mode: "math", auto: true } },
  { trigger: "_", replacement: "_{$0}$1", options: { mode: "math", auto: true } },
  { trigger: "sts", replacement: "_\\text{$0}", options: { mode: "math", auto: true } },
  { trigger: "sq", replacement: "\\sqrt{ $0 }$1", options: { mode: "math", auto: true } },
  { trigger: "//", replacement: "\\frac{$0}{$1}$2", options: { mode: "math", auto: true } },
  { trigger: "ee", replacement: "e^{ $0 }$1", options: { mode: "math", auto: true } },
  { trigger: "invs", replacement: "^{-1}", options: { mode: "math", auto: true } },
  
  // Auto letter subscript: x2 -> x_{2}
  { 
    trigger: /([A-Za-z])(\d)/, 
    replacement: "[[0]]_{[[1]]}", 
    options: { mode: "math", auto: true, priority: -1 }
  },

  // Functions with backslash
  { trigger: /([^\\])(exp|log|ln)/, replacement: "[[0]]\\[[1]]", options: { mode: "math", auto: true } },
  
  { trigger: "conj", replacement: "^{*}", options: { mode: "math", auto: true } },
  { trigger: "Re", replacement: "\\mathrm{Re}", options: { mode: "math", auto: true } },
  { trigger: "Im", replacement: "\\mathrm{Im}", options: { mode: "math", auto: true } },
  { trigger: "bf", replacement: "\\mathbf{$0}", options: { mode: "math", auto: true } },
  { trigger: "rm", replacement: "\\mathrm{$0}$1", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Linear Algebra
  // ----------------------------------------
  { trigger: /([^\\])(det)/, replacement: "[[0]]\\[[1]]", options: { mode: "math", auto: true } },
  { trigger: "trace", replacement: "\\mathrm{Tr}", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Decorations (letter + decoration)
  // Higher priority than standalone versions so "Hhat" -> \hat{H} not \hat{}
  // ----------------------------------------
  { trigger: /([a-zA-Z])hat/, replacement: "\\hat{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: /([a-zA-Z])bar/, replacement: "\\bar{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: /([a-zA-Z])cal/, replacement: "\\mathcal{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: /([a-zA-Z])scr/, replacement: "\\mathscr{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: /([a-zA-Z])dot/, replacement: "\\dot{[[0]]}", options: { mode: "math", auto: true, priority: 0 } },
  { trigger: /([a-zA-Z])ddot/, replacement: "\\ddot{[[0]]}", options: { mode: "math", auto: true, priority: 2 } },
  { trigger: /([a-zA-Z])tilde/, replacement: "\\tilde{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: /([a-zA-Z])und/, replacement: "\\underline{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: /([a-zA-Z])vec/, replacement: "\\vec{[[0]]}", options: { mode: "math", auto: true, priority: 1 } },
  
  // Bold shortcuts: x,. or x., -> \mathbf{x}
  { trigger: /([a-zA-Z]),\./, replacement: "\\mathbf{[[0]]}", options: { mode: "math", auto: true } },
  { trigger: /([a-zA-Z])\.,/, replacement: "\\mathbf{[[0]]}", options: { mode: "math", auto: true } },

  // Standalone decorations (with tabstop)
  // Lower priority than letter+decoration regex versions
  { trigger: "hat", replacement: "\\hat{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "bar", replacement: "\\bar{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "cal", replacement: "\\mathcal{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "scr", replacement: "\\mathscr{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "dot", replacement: "\\dot{$0}$1", options: { mode: "math", auto: true, priority: -2 } },
  { trigger: "ddot", replacement: "\\ddot{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "cdot", replacement: "\\cdot", options: { mode: "math", auto: true } },
  { trigger: "tilde", replacement: "\\tilde{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "und", replacement: "\\underline{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "vec", replacement: "\\vec{$0}$1", options: { mode: "math", auto: true, priority: -1 } },

  // ----------------------------------------
  // More Auto Subscripts
  // ----------------------------------------
  { trigger: /([A-Za-z])_(\d\d)/, replacement: "[[0]]_{[[1]]}", options: { mode: "math", auto: true } },
  { trigger: /\\hat\{([A-Za-z])\}(\d)/, replacement: "\\hat{[[0]]}_{[[1]]}", options: { mode: "math", auto: true } },
  { trigger: /\\vec\{([A-Za-z])\}(\d)/, replacement: "\\vec{[[0]]}_{[[1]]}", options: { mode: "math", auto: true } },
  { trigger: /\\mathbf\{([A-Za-z])\}(\d)/, replacement: "\\mathbf{[[0]]}_{[[1]]}", options: { mode: "math", auto: true } },

  { trigger: "xnn", replacement: "x_{n}", options: { mode: "math", auto: true } },
  { trigger: "\\xii", replacement: "x_{i}", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: "xjj", replacement: "x_{j}", options: { mode: "math", auto: true } },
  { trigger: "xp1", replacement: "x_{n+1}", options: { mode: "math", auto: true } },
  { trigger: "ynn", replacement: "y_{n}", options: { mode: "math", auto: true } },
  { trigger: "yii", replacement: "y_{i}", options: { mode: "math", auto: true } },
  { trigger: "yjj", replacement: "y_{j}", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Symbols
  // ----------------------------------------
  { trigger: "ooo", replacement: "\\infty", options: { mode: "math", auto: true } },
  { trigger: "sum", replacement: "\\sum", options: { mode: "math", auto: true } },
  { trigger: "prod", replacement: "\\prod", options: { mode: "math", auto: true } },
  { trigger: "\\sum", replacement: "\\sum_{$0}^{$1} $2", options: { mode: "math", auto: false } },
  { trigger: "\\prod", replacement: "\\prod_{$0}^{$1} $2", options: { mode: "math", auto: false } },
  { trigger: "lim", replacement: "\\lim_{ ${0:n} \\to ${1:\\infty} } $2", options: { mode: "math", auto: true } },
  { trigger: "argmin", replacement: "\\operatorname{\\argmin}", options: { mode: "math", auto: true } },
  { trigger: "argmax", replacement: "\\operatorname{\\argmax}", options: { mode: "math", auto: true } },
  { trigger: "ber", replacement: "\\operatorname{Ber}", options: { mode: "math", auto: true } },
  { trigger: "Ber", replacement: "\\operatorname{Ber}", options: { mode: "math", auto: true } },
  { trigger: "+-", replacement: "\\pm", options: { mode: "math", auto: true } },
  { trigger: "-+", replacement: "\\mp", options: { mode: "math", auto: true } },
  { trigger: "...", replacement: "\\dots", options: { mode: "math", auto: true } },
  { trigger: "nabl", replacement: "\\nabla", options: { mode: "math", auto: true } },
  { trigger: "del", replacement: "\\nabla", options: { mode: "math", auto: true } },
  { trigger: "xx", replacement: "\\times", options: { mode: "math", auto: true } },
  { trigger: "**", replacement: "\\cdot", options: { mode: "math", auto: true } },
  { trigger: "para", replacement: "\\parallel", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Relations
  // ----------------------------------------
  { trigger: "===", replacement: "\\equiv", options: { mode: "math", auto: true } },
  { trigger: "!=", replacement: "\\neq", options: { mode: "math", auto: true } },
  { trigger: ">=", replacement: "\\geq", options: { mode: "math", auto: true } },
  { trigger: "<=", replacement: "\\leq", options: { mode: "math", auto: true } },
  { trigger: ">>", replacement: "\\gg", options: { mode: "math", auto: true } },
  { trigger: "<<", replacement: "\\ll", options: { mode: "math", auto: true } },
  { trigger: "simm", replacement: "\\sim", options: { mode: "math", auto: true } },
  { trigger: "sim=", replacement: "\\simeq", options: { mode: "math", auto: true } },
  { trigger: "prop", replacement: "\\propto", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Arrows
  // ----------------------------------------
  { trigger: "<->", replacement: "\\leftrightarrow ", options: { mode: "math", auto: true } },
  { trigger: "->", replacement: "\\to", options: { mode: "math", auto: true } },
  { trigger: "!>", replacement: "\\mapsto", options: { mode: "math", auto: true } },
  { trigger: "=>", replacement: "\\implies", options: { mode: "math", auto: true } },
  { trigger: "=<", replacement: "\\impliedby", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Set Theory
  // ----------------------------------------
  { trigger: "and", replacement: "\\cap", options: { mode: "math", auto: true } },
  { trigger: "orr", replacement: "\\cup", options: { mode: "math", auto: true } },
  { trigger: "inn", replacement: "\\in", options: { mode: "math", auto: true } },
  { trigger: "notin", replacement: "\\not\\in", options: { mode: "math", auto: true } },
  { trigger: "\\\\\\", replacement: "\\setminus", options: { mode: "math", auto: true } },
  { trigger: "sub=", replacement: "\\subseteq", options: { mode: "math", auto: true } },
  { trigger: "sup=", replacement: "\\supseteq", options: { mode: "math", auto: true } },
  { trigger: "eset", replacement: "\\emptyset", options: { mode: "math", auto: true } },
  { trigger: "set", replacement: "\\{ $0 \\}$1", options: { mode: "math", auto: true } },
  { trigger: "exists", replacement: "\\exists", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: "forall", replacement: "\\forall", options: { mode: "math", auto: true, wordBoundary: true } },

  // ----------------------------------------
  // Blackboard & Calligraphic
  // ----------------------------------------
  { trigger: "LL", replacement: "\\mathcal{L}", options: { mode: "math", auto: true } },
  { trigger: "HH", replacement: "\\mathcal{H}", options: { mode: "math", auto: true } },
  { trigger: "CC", replacement: "\\mathbb{C}", options: { mode: "math", auto: true } },
  { trigger: "RR", replacement: "\\mathbb{R}", options: { mode: "math", auto: true } },
  { trigger: "ZZ", replacement: "\\mathbb{Z}", options: { mode: "math", auto: true } },
  { trigger: "NN", replacement: "\\mathbb{N}", options: { mode: "math", auto: true } },
  { trigger: "QQ", replacement: "\\mathbb{Q}", options: { mode: "math", auto: true } },
  { trigger: "EE", replacement: "\\mathbb{E}", options: { mode: "math", auto: true } },
  { trigger: "PP", replacement: "\\mathbb{P}", options: { mode: "math", auto: true } },
  { trigger: "FF", replacement: "\\mathbb{F}", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Derivatives and Integrals
  // ----------------------------------------
  { trigger: "par", replacement: "\\frac{ \\partial ${0:y} }{ \\partial ${1:x} } $2", options: { mode: "math", auto: false } },
  { trigger: /pa([A-Za-z])([A-Za-z])/, replacement: "\\frac{ \\partial [[0]] }{ \\partial [[1]] } ", options: { mode: "math", auto: false } },
  { trigger: "ddt", replacement: "\\frac{d}{dt} ", options: { mode: "math", auto: true } },

  { trigger: /([^\\])int/, replacement: "[[0]]\\int", options: { mode: "math", auto: true, priority: -1 } },
  { trigger: "\\int", replacement: "\\int $0 \\, d${1:x} $2", options: { mode: "math", auto: false } },
  { trigger: "dint", replacement: "\\int_{${0:0}}^{${1:1}} $2 \\, d${3:x} $4", options: { mode: "math", auto: true } },
  { trigger: "oint", replacement: "\\oint", options: { mode: "math", auto: true } },
  { trigger: "iint", replacement: "\\iint", options: { mode: "math", auto: true } },
  { trigger: "iiint", replacement: "\\iiint", options: { mode: "math", auto: true } },
  { trigger: "oinf", replacement: "\\int_{0}^{\\infty} $0 \\, d${1:x} $2", options: { mode: "math", auto: true } },
  { trigger: "infi", replacement: "\\int_{-\\infty}^{\\infty} $0 \\, d${1:x} $2", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Trigonometry
  // ----------------------------------------
  { 
    trigger: /([^\\])(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)/, 
    replacement: "[[0]]\\[[1]]", 
    options: { mode: "math", auto: true }
  },
  { 
    trigger: /\\(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)([A-Za-gi-z])/, 
    replacement: "\\[[0]] [[1]]", 
    options: { mode: "math", auto: true }
  },
  { 
    trigger: /\\(sinh|cosh|tanh|coth)([A-Za-z])/, 
    replacement: "\\[[0]] [[1]]", 
    options: { mode: "math", auto: true }
  },

  // ----------------------------------------
  // Physics
  // ----------------------------------------
  { trigger: "kbt", replacement: "k_{B}T", options: { mode: "math", auto: true } },
  { trigger: "msun", replacement: "M_{\\odot}", options: { mode: "math", auto: true } },
  { trigger: "divr", replacement: "\\nabla \\cdot ", options: { mode: "math", auto: true } },
  { trigger: "curl", replacement: "\\nabla \\times ", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Quantum Mechanics
  // ----------------------------------------
  { trigger: "hbar", replacement: "\\hbar", options: { mode: "math", auto: true, priority: 2 } },
  { trigger: "dag", replacement: "^{\\dagger}", options: { mode: "math", auto: true } },
  { trigger: "o+", replacement: "\\oplus ", options: { mode: "math", auto: true } },
  { trigger: "ox", replacement: "\\otimes ", options: { mode: "math", auto: true } },
  { trigger: "bra", replacement: "\\bra{$0} $1", options: { mode: "math", auto: true } },
  { trigger: "ket", replacement: "\\ket{$0} $1", options: { mode: "math", auto: true } },
  { trigger: "brk", replacement: "\\braket{ $0 | $1 } $2", options: { mode: "math", auto: true } },
  { trigger: "outer", replacement: "\\ket{${0:\\psi}} \\bra{${0:\\psi}} $1", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Chemistry
  // ----------------------------------------
  { trigger: "pu", replacement: "\\pu{ $0 }", options: { mode: "math", auto: true } },
  { trigger: "cee", replacement: "\\ce{ $0 }", options: { mode: "math", auto: true } },
  { trigger: "he4", replacement: "{}^{4}_{2}He ", options: { mode: "math", auto: true } },
  { trigger: "he3", replacement: "{}^{3}_{2}He ", options: { mode: "math", auto: true } },
  { trigger: "iso", replacement: "{}^{${0:4}}_{${1:2}}${2:He}", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Environments
  // ----------------------------------------
  { trigger: "pmat", replacement: "\\begin{pmatrix}\n$0\n\\end{pmatrix}", options: { mode: "math", auto: true } },
  { trigger: "bmat", replacement: "\\begin{bmatrix}\n$0\n\\end{bmatrix}", options: { mode: "math", auto: true } },
  { trigger: "Bmat", replacement: "\\begin{Bmatrix}\n$0\n\\end{Bmatrix}", options: { mode: "math", auto: true } },
  { trigger: "vmat", replacement: "\\begin{vmatrix}\n$0\n\\end{vmatrix}", options: { mode: "math", auto: true } },
  { trigger: "Vmat", replacement: "\\begin{Vmatrix}\n$0\n\\end{Vmatrix}", options: { mode: "math", auto: true } },
  { trigger: "matrix", replacement: "\\begin{matrix}\n$0\n\\end{matrix}", options: { mode: "math", auto: true } },

  { trigger: "cases", replacement: "\\begin{cases}\n$0\n\\end{cases}", options: { mode: "math", auto: true } },
  { trigger: "align", replacement: "\\begin{align}\n$0\n\\end{align}", options: { mode: "math", auto: true } },
  { trigger: "array", replacement: "\\begin{array}\n$0\n\\end{array}", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Brackets
  // ----------------------------------------

  // Auto-close brackets in math mode
  { trigger: "(", replacement: "($0)$1", options: { mode: "math", auto: true } },
  { trigger: "[", replacement: "[$0]$1", options: { mode: "math", auto: true } },
  { trigger: "{", replacement: "{$0}$1", options: { mode: "math", auto: true } },

  { trigger: "avg", replacement: "\\langle $0 \\rangle $1", options: { mode: "math", auto: true } },
  { trigger: "norm", replacement: "\\lvert $0 \\rvert $1", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: "Norm", replacement: "\\lVert $0 \\rVert $1", options: { mode: "math", auto: true, priority: 1 } },
  { trigger: "ceil", replacement: "\\lceil $0 \\rceil $1", options: { mode: "math", auto: true } },
  { trigger: "floor", replacement: "\\lfloor $0 \\rfloor $1", options: { mode: "math", auto: true } },
  { trigger: "mod", replacement: "|$0|$1", options: { mode: "math", auto: true } },
  { trigger: "lr(", replacement: "\\left( $0 \\right) $1", options: { mode: "math", auto: true } },
  { trigger: "lr{", replacement: "\\left\\{ $0 \\right\\} $1", options: { mode: "math", auto: true } },
  { trigger: "lr[", replacement: "\\left[ $0 \\right] $1", options: { mode: "math", auto: true } },
  { trigger: "lr|", replacement: "\\left| $0 \\right| $1", options: { mode: "math", auto: true } },
  { trigger: "lra", replacement: "\\left< $0 \\right> $1", options: { mode: "math", auto: true } },

  // ----------------------------------------
  // Taylor Expansion
  // ----------------------------------------
  { 
    trigger: "tayl", 
    replacement: "${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3", 
    options: { mode: "math", auto: true }
  },

  // ----------------------------------------
  // Identity Matrix (function replacement)
  // ----------------------------------------
  { 
    trigger: /iden(\d)/, 
    replacement: (match) => {
      const n = parseInt(match[1], 10);
      let arr = [];
      for (let j = 0; j < n; j++) {
        arr[j] = [];
        for (let i = 0; i < n; i++) {
          arr[j][i] = (i === j) ? 1 : 0;
        }
      }
      let output = arr.map(el => el.join(" & ")).join(" \\\\\n");
      return `\\begin{pmatrix}\n${output}\n\\end{pmatrix}`;
    }, 
    options: { mode: "math", auto: true }
  },

  // Add Greek letter word snippets
  ...greekSnippets,
];

export default snippets;
