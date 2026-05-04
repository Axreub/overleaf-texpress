(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/snippets.js
  var snippets_exports = {};
  __export(snippets_exports, {
    FRAC_PREFIX_OPS: () => FRAC_PREFIX_OPS,
    default: () => snippets_default,
    snippets: () => snippets
  });
  function expandTriggers(snippetList) {
    const result = [];
    for (const snippet of snippetList) {
      if (Array.isArray(snippet.trigger)) {
        for (const t of snippet.trigger) {
          result.push({ ...snippet, trigger: t });
        }
      } else {
        result.push(snippet);
      }
    }
    return result;
  }
  var GREEK_LETTERS_HIGH_PRIORITY, GREEK_LETTERS_NORMAL, FRAC_PREFIX_OPS, greekSnippetsHighPriority, greekSnippetsNormal, greekSnippets, rawSnippets, snippets, snippets_default;
  var init_snippets = __esm({
    "src/snippets.js"() {
      GREEK_LETTERS_HIGH_PRIORITY = ["beta", "theta"];
      GREEK_LETTERS_NORMAL = [
        "alpha",
        "gamma",
        "delta",
        "epsilon",
        "zeta",
        "eta",
        "iota",
        "kappa",
        "lambda",
        "mu",
        "nu",
        "xi",
        "pi",
        "rho",
        "sigma",
        "tau",
        "upsilon",
        "phi",
        "chi",
        "psi",
        "omega",
        "Gamma",
        "Delta",
        "Theta",
        "Lambda",
        "Xi",
        "Pi",
        "Sigma",
        "Upsilon",
        "Phi",
        "Psi",
        "Omega"
      ];
      FRAC_PREFIX_OPS = /* @__PURE__ */ new Set([
        "arcsin",
        "sin",
        "arccos",
        "cos",
        "arctan",
        "tan",
        "csc",
        "sec",
        "cot",
        "sinh",
        "cosh",
        "tanh",
        "coth",
        "partial",
        "left",
        "log",
        "ln",
        "exp",
        "hat",
        "bar",
        "tilde",
        "vec",
        "dot",
        "ddot",
        "mathcal",
        "mathscr",
        "mathbf",
        "boldsymbol"
      ]);
      GREEK_LETTERS_HIGH_PRIORITY.forEach((letter) => {
        FRAC_PREFIX_OPS.add(letter);
      });
      GREEK_LETTERS_NORMAL.forEach((letter) => {
        FRAC_PREFIX_OPS.add(letter);
      });
      greekSnippetsHighPriority = GREEK_LETTERS_HIGH_PRIORITY.map((letter) => ({
        trigger: letter,
        replacement: "\\" + letter,
        options: { mode: "math", auto: true, priority: -1 }
      }));
      greekSnippetsNormal = GREEK_LETTERS_NORMAL.map((letter) => ({
        trigger: letter,
        replacement: "\\" + letter,
        options: { mode: "math", auto: true, priority: -2 }
      }));
      greekSnippets = [...greekSnippetsHighPriority, ...greekSnippetsNormal];
      rawSnippets = [
        // ----------------------------------------
        // Math/Text Mode Entry
        // ----------------------------------------
        { trigger: "mk", replacement: "$$0$ $1", options: { mode: "text", auto: true } },
        { trigger: "dm", replacement: "$$\n$0\n$$ $1", options: { mode: "text", auto: true, wordBoundary: true } },
        // beg: cursor starts in body ($0), Tab navigates to env name inside \begin{}
        // Both \begin and \end show "env" placeholder — second occurrence is static (not a linked tabstop)
        { trigger: "mathbeg", replacement: "\\begin{${1:env}}\n$0\n\\end{${1:env}}", options: { mode: "text", auto: true } },
        // Text-mode display math environments — reach for these like you'd reach for dm
        { trigger: "mathali", replacement: "\\begin{align*}\n$0\n\\end{align*}", options: { mode: "text", auto: true } },
        { trigger: "matheq", replacement: "\\begin{equation}\n$0\n\\end{equation}", options: { mode: "text", auto: true } },
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
        { trigger: ["@o", "ome"], replacement: "\\omega", options: { mode: "math", auto: true } },
        { trigger: ["@O", "Ome"], replacement: "\\Omega", options: { mode: "math", auto: true } },
        { trigger: "@p", replacement: "\\partial", options: { mode: "math", auto: true } },
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
        { trigger: /([A-Za-z])(\d)/, replacement: "[[0]]_{[[1]]}", options: { mode: "math", auto: true, priority: -1 } },
        // Functions with backslash
        { trigger: /([^\\])(exp|log|ln)/, replacement: "[[0]]\\[[1]]($0)", options: { mode: "math", auto: true } },
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
        { trigger: [/([a-zA-Z]),\./, /([a-zA-Z])\.,/], replacement: "\\mathbf{[[0]]}", options: { mode: "math", auto: true } },
        // Standalone decorations (with tabstop)
        // Lower priority than letter+decoration regex versions
        { trigger: "hat", replacement: "\\hat{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
        { trigger: "bar", replacement: "\\bar{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
        { trigger: "cal", replacement: "\\mathcal{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
        { trigger: "scr", replacement: "\\mathscr{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
        { trigger: "dot", replacement: "\\dot{$0}$1", options: { mode: "math", auto: true, priority: -2 } },
        { trigger: "ddot", replacement: "\\ddot{$0}$1", options: { mode: "math", auto: true, priority: -1 } },
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
        { trigger: ["ooo", "infty", "nfty"], replacement: "\\infty", options: { mode: "math", auto: true } },
        { trigger: "sum", replacement: "\\sum", options: { mode: "math", auto: true } },
        { trigger: "prod", replacement: "\\prod", options: { mode: "math", auto: true } },
        { trigger: "\\sum", replacement: "\\sum_{$0}^{$1} $2", options: { mode: "math", auto: false } },
        { trigger: "\\prod", replacement: "\\prod_{$0}^{$1} $2", options: { mode: "math", auto: false } },
        { trigger: "lim", replacement: "\\lim_{}", options: { mode: "math", auto: true } },
        { trigger: "argmin", replacement: "\\operatorname{argmin}", options: { mode: "math", auto: true } },
        { trigger: "argmax", replacement: "\\operatorname{argmax}", options: { mode: "math", auto: true } },
        { trigger: ["ber", "Ber"], replacement: "\\operatorname{Ber}", options: { mode: "math", auto: true } },
        { trigger: "Var", replacement: "\\operatorname{Var}", options: { mode: "math", auto: true } },
        { trigger: "Cov", replacement: "\\operatorname{Cov}", options: { mode: "math", auto: true } },
        { trigger: "+-", replacement: "\\pm", options: { mode: "math", auto: true } },
        { trigger: "-+", replacement: "\\mp", options: { mode: "math", auto: true } },
        { trigger: "...", replacement: "\\dots $0", options: { mode: "math", auto: true } },
        { trigger: ["nabl", "del"], replacement: "\\nabla", options: { mode: "math", auto: true } },
        { trigger: ["xx", "times"], replacement: "\\times $0", options: { mode: "math", auto: true } },
        { trigger: ["**", "cdot"], replacement: "\\cdot $0", options: { mode: "math", auto: true } },
        { trigger: ["otimes", "ox"], replacement: "\\otimes $0", options: { mode: "math", auto: true } },
        { trigger: ["oplus", "o+"], replacement: "\\oplus $0", options: { mode: "math", auto: true } },
        { trigger: "para", replacement: "\\parallel $0", options: { mode: "math", auto: true } },
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
        { trigger: ["larr", "leftarr"], replacement: "\\leftarrow", options: { mode: "math", auto: true } },
        { trigger: ["Larr", "Leftarr"], replacement: "\\Leftarrow", options: { mode: "math", auto: true } },
        { trigger: ["rarr", "rightarr"], replacement: "\\rightarrow", options: { mode: "math", auto: true } },
        { trigger: ["Rarr", "Rightarr"], replacement: "\\Rightarrow", options: { mode: "math", auto: true } },
        { trigger: ["lrarr", "leftrightarr"], replacement: "\\leftrightarrow", options: { mode: "math", auto: true } },
        { trigger: ["Lrarr", "Leftrightarr"], replacement: "\\Leftrightarrow", options: { mode: "math", auto: true } },
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
          replacement: "\\[[0]] [[1]]"
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
        { trigger: "array", replacement: "\\begin{array}\n$0\n\\end{array}", options: { mode: "math", auto: true } },
        // ----------------------------------------
        // Visual Mode (select text, then press trigger key)
        // [[VISUAL]] in string replacements is substituted with the selected text.
        // Function replacements receive ([selectedText]) and return a string template.
        // ----------------------------------------
        // Detects tall symbols that need \left/\right sizing (same set as extension.js)
        // defined here to avoid a circular import with extension.js
        .../* @__PURE__ */ (() => {
          const TALL_RE = /\\(frac|dfrac|tfrac|sum|prod|int|oint|iint|iiint|lim|bigcup|bigcap|bigoplus|bigotimes|bigvee|bigwedge)/;
          const tall = (v) => TALL_RE.test(v);
          return [
            { trigger: "/", replacement: "\\frac{[[VISUAL]]}{$0}$1", options: { mode: "math", visual: true } },
            { trigger: "(", replacement: ([v]) => tall(v) ? `\\left(${v}\\right)$0` : `(${v})$0`, options: { mode: "math", visual: true } },
            { trigger: "[", replacement: ([v]) => tall(v) ? `\\left[${v}\\right]$0` : `[${v}]$0`, options: { mode: "math", visual: true } },
            { trigger: "{", replacement: ([v]) => tall(v) ? `\\left\\{${v}\\right\\}$0` : `\\{${v}\\}$0`, options: { mode: "math", visual: true } },
            { trigger: "|", replacement: ([v]) => tall(v) ? `\\left|${v}\\right|$0` : `|${v}|$0`, options: { mode: "math", visual: true } }
          ];
        })(),
        { trigger: "U", replacement: "\\underbrace{ [[VISUAL]] }_{ $0 }", options: { mode: "math", visual: true } },
        { trigger: "O", replacement: "\\overbrace{ [[VISUAL]] }^{ $0 }", options: { mode: "math", visual: true } },
        { trigger: "B", replacement: "\\underset{ $0 }{ [[VISUAL]] }", options: { mode: "math", visual: true } },
        { trigger: "C", replacement: "\\cancel{ [[VISUAL]] }", options: { mode: "math", visual: true } },
        { trigger: "K", replacement: "\\cancelto{ $0 }{ [[VISUAL]] }", options: { mode: "math", visual: true } },
        { trigger: "S", replacement: "\\sqrt{ [[VISUAL]] }", options: { mode: "math", visual: true } },
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
                arr[j][i] = i === j ? 1 : 0;
              }
            }
            let output = arr.map((el) => el.join(" & ")).join(" \\\\\n");
            return `\\begin{pmatrix}
${output}
\\end{pmatrix}`;
          },
          options: { mode: "math", auto: true }
        },
        // Add Greek letter word snippets
        ...greekSnippets
      ];
      snippets = expandTriggers(rawSnippets);
      snippets_default = snippets;
    }
  });

  // src/matcher.js
  var matcher_exports = {};
  __export(matcher_exports, {
    default: () => matcher_default,
    findMatch: () => findMatch,
    findVisualMatch: () => findVisualMatch,
    matchFraction: () => matchFraction
  });
  function matchesMode(snippet, inMathMode) {
    const mode = snippet.options?.mode || "any";
    if (mode === "math")
      return inMathMode;
    if (mode === "text")
      return !inMathMode;
    return true;
  }
  function tryMatch(textBefore, snippet) {
    const { trigger, options } = snippet;
    const needsWordBoundary = options?.wordBoundary || false;
    if (trigger instanceof RegExp) {
      const regex = new RegExp("(" + trigger.source + ")$");
      const match = textBefore.match(regex);
      if (match) {
        return {
          matchLength: match[1].length,
          captures: match.slice(2)
          // Skip full match and first group
        };
      }
      return null;
    }
    if (typeof trigger === "string") {
      if (!textBefore.endsWith(trigger)) {
        return null;
      }
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
  function shouldSkipSnippet(snippet, textBefore, textAfter) {
    const { trigger, replacement, options } = snippet;
    const triggerStr = trigger instanceof RegExp ? trigger.source : String(trigger);
    if (triggerStr.includes("{$GREEK}") || triggerStr.includes("{$SYMBOL}") || triggerStr.includes("{$MORE_SYMBOLS}")) {
      return true;
    }
    if (typeof replacement === "string" && replacement.includes("${VISUAL}")) {
      return true;
    }
    if (typeof trigger === "string" && trigger.length === 1) {
      if (`"'^`.includes(trigger)) {
        return true;
      }
      const bracketPairs = { "(": ")", "[": "]", "{": "}" };
      if (bracketPairs[trigger] && textAfter.length > 0) {
        if (textAfter[0] === bracketPairs[trigger]) {
          return true;
        }
      }
    }
    if (typeof replacement === "string" && replacement.startsWith("\\")) {
      const charBefore = textBefore[textBefore.length - (typeof trigger === "string" ? trigger.length : 0) - 1];
      if (charBefore === "\\") {
        return true;
      }
    }
    return false;
  }
  function findMatch(textBefore, snippets2, inMathMode, textAfter = "") {
    const sortedSnippets = [...snippets2].sort((a, b) => {
      const prioA = a.options?.priority || 0;
      const prioB = b.options?.priority || 0;
      if (prioB !== prioA)
        return prioB - prioA;
      const lenA = typeof a.trigger === "string" ? a.trigger.length : 0;
      const lenB = typeof b.trigger === "string" ? b.trigger.length : 0;
      return lenB - lenA;
    });
    for (const snippet of sortedSnippets) {
      if (!matchesMode(snippet, inMathMode))
        continue;
      if (snippet.options?.visual)
        continue;
      if (snippet.options?.auto === false)
        continue;
      if (shouldSkipSnippet(snippet, textBefore, textAfter)) {
        continue;
      }
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
  function findVisualMatch(typedChar, snippets2, inMathMode) {
    for (const snippet of snippets2) {
      if (!snippet.options?.visual)
        continue;
      if (!matchesMode(snippet, inMathMode))
        continue;
      if (typeof snippet.trigger === "string" && snippet.trigger === typedChar)
        return snippet;
      if (snippet.trigger instanceof RegExp && snippet.trigger.test(typedChar))
        return snippet;
    }
    return null;
  }
  function matchFraction(textBefore) {
    const s = textBefore;
    const len = s.length;
    if (len < 2)
      return null;
    if (s[len - 1] !== "/")
      return null;
    const { token: numerator, consumed, singleChar } = scanTokenLeft(s, len - 2);
    if (!numerator)
      return null;
    if (singleChar) {
      const charBeforeNum = s[len - 3];
      if (charBeforeNum && /[a-zA-Z\\]/.test(charBeforeNum)) {
        return null;
      }
    }
    return {
      matchLength: consumed + 1,
      // numerator + '/'
      numerator
    };
  }
  function scanTokenLeft(s, pos) {
    const atom = scanAtom(s, pos);
    if (!atom.token)
      return null;
    let consumed = atom.consumed;
    while (true) {
      const markerPos = pos - consumed;
      if (markerPos < 0)
        break;
      if (s[markerPos] !== "^" && s[markerPos] !== "_")
        break;
      const base = scanAtom(s, markerPos - 1);
      if (!base.token)
        break;
      consumed += 1 + base.consumed;
    }
    while (true) {
      const before = s.slice(0, pos - consumed + 1);
      const cmdPeek = before.match(/\\([a-zA-Z]+)\s?$/);
      if (cmdPeek && FRAC_PREFIX_OPS.has(cmdPeek[1])) {
        consumed += cmdPeek[0].length;
        continue;
      }
      const adjCmdPeek = before.match(/\\[a-zA-Z]+$/);
      if (adjCmdPeek) {
        consumed += adjCmdPeek[0].length;
        continue;
      }
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
  function scanAtom(s, pos) {
    if (pos < 0)
      return { token: null, consumed: 0, singleChar: false };
    if (s[pos] === ")") {
      const openPos = findMatchingOpenParen(s, pos, "regular");
      if (openPos >= 0) {
        const inner = s.slice(openPos + 1, pos);
        return { token: inner, consumed: pos - openPos + 1, singleChar: false };
      }
      return { token: null, consumed: 0, singleChar: false };
    }
    if (s[pos] === "}") {
      const openBrace = findMatchingOpenParen(s, pos, "curly");
      if (openBrace >= 0) {
        const arg = s.slice(openBrace + 1, pos);
        let cmdEnd = openBrace - 1;
        if (cmdEnd >= 0 && /[a-zA-Z]/.test(s[cmdEnd])) {
          let cmdStart = cmdEnd;
          while (cmdStart > 0 && /[a-zA-Z]/.test(s[cmdStart - 1]))
            cmdStart--;
          if (cmdStart > 0 && s[cmdStart - 1] === "\\") {
            const cmd = s.slice(cmdStart - 1, openBrace);
            const consumed = pos - (cmdStart - 1) + 1;
            return { token: `${cmd}{${arg}}`, consumed, singleChar: false };
          }
        }
        return { token: `{${arg}}`, consumed: pos - openBrace + 1, singleChar: false };
      }
      return { token: null, consumed: 0, singleChar: false };
    }
    if (/[a-zA-Z]/.test(s[pos])) {
      let end = pos;
      let start = end;
      while (start > 0 && /[a-zA-Z]/.test(s[start - 1]))
        start--;
      if (start > 0 && s[start - 1] === "\\") {
        const cmd = s.slice(start - 1, end + 1);
        return { token: cmd, consumed: end - start + 2, singleChar: false };
      }
      const word = s.slice(start, end + 1);
      return { token: word, consumed: end - start + 1, singleChar: word.length === 1 };
    }
    if (/[0-9]/.test(s[pos])) {
      return { token: s[pos], consumed: 1, singleChar: true };
    }
    return { token: null, consumed: 0, singleChar: false };
  }
  function findMatchingOpenParen(s, closePos, parenType) {
    let rightParen, leftParen;
    if (parenType === "regular") {
      rightParen = ")";
      leftParen = "(";
    } else if (parenType === "square") {
      rightParen = "]";
      leftParen = "[";
    } else if (parenType === "curly") {
      rightParen = "}";
      leftParen = "{";
    }
    let depth = 1;
    let i = closePos - 1;
    while (i >= 0 && depth > 0) {
      if (s[i] === rightParen)
        depth++;
      else if (s[i] === leftParen)
        depth--;
      i--;
    }
    return depth === 0 ? i + 1 : -1;
  }
  var matcher_default;
  var init_matcher = __esm({
    "src/matcher.js"() {
      init_snippets();
      matcher_default = findMatch;
    }
  });

  // src/mathMode.js
  var mathMode_exports = {};
  __export(mathMode_exports, {
    default: () => mathMode_default,
    detectMathModeFromText: () => detectMathModeFromText,
    detectMathModeFromTree: () => detectMathModeFromTree,
    isDisplayMath: () => isDisplayMath,
    isInMathMode: () => isInMathMode,
    isInsideTextCommand: () => isInsideTextCommand
  });
  function isMathNode(nodeName) {
    const mathNodeNames = [
      "Math",
      "InlineMath",
      "DisplayMath",
      "MathEnvironment",
      "Equation",
      "Align",
      "Gather",
      "Multline",
      "MathDelimiter",
      "$",
      "$$"
    ];
    return mathNodeNames.some(
      (name) => nodeName === name || nodeName.includes("Math") || nodeName.includes("Equation")
    );
  }
  function detectMathModeFromTree(state, pos) {
    try {
      const { syntaxTree } = window.CodeMirror?.language || {};
      if (!syntaxTree)
        return null;
      const tree = syntaxTree(state);
      if (!tree || tree.length === 0)
        return null;
      let node = tree.resolveInner(pos, -1);
      while (node) {
        if (isMathNode(node.type.name)) {
          return true;
        }
        node = node.parent;
      }
      return false;
    } catch (e) {
      return null;
    }
  }
  function detectMathModeFromText(textBefore) {
    const displayMathStart = textBefore.lastIndexOf("\\[");
    const displayMathEnd = textBefore.lastIndexOf("\\]");
    if (displayMathStart > displayMathEnd) {
      return true;
    }
    const lastParaBreak = textBefore.lastIndexOf("\n\n");
    const paraText = lastParaBreak >= 0 ? textBefore.slice(lastParaBreak + 2) : textBefore;
    let dollarCount = 0;
    let doubleDollarCount = 0;
    let i = 0;
    while (i < paraText.length) {
      if (paraText[i] === "\\" && i + 1 < paraText.length) {
        i += 2;
        continue;
      }
      if (paraText[i] === "$") {
        if (i + 1 < paraText.length && paraText[i + 1] === "$") {
          doubleDollarCount++;
          i += 2;
          continue;
        }
        dollarCount++;
      }
      i++;
    }
    if (doubleDollarCount % 2 === 1) {
      return true;
    }
    if (dollarCount % 2 === 1) {
      return true;
    }
    const mathEnvironments = [
      "equation",
      "align",
      "gather",
      "multline",
      "eqnarray",
      "equation\\*",
      "align\\*",
      "gather\\*",
      "multline\\*"
    ];
    for (const env of mathEnvironments) {
      const beginRegex = new RegExp(`\\\\begin\\{${env}\\}`, "g");
      const endRegex = new RegExp(`\\\\end\\{${env}\\}`, "g");
      const begins = (textBefore.match(beginRegex) || []).length;
      const ends = (textBefore.match(endRegex) || []).length;
      if (begins > ends) {
        return true;
      }
    }
    return false;
  }
  function isDisplayMath(textBefore) {
    let doubleDollarCount = 0;
    let i = 0;
    while (i < textBefore.length) {
      if (textBefore[i] === "\\" && i + 1 < textBefore.length) {
        i += 2;
        continue;
      }
      if (textBefore[i] === "$" && i + 1 < textBefore.length && textBefore[i + 1] === "$") {
        doubleDollarCount++;
        i += 2;
        continue;
      }
      i++;
    }
    if (doubleDollarCount % 2 === 1) {
      return true;
    }
    const displayStart = textBefore.lastIndexOf("\\[");
    const displayEnd = textBefore.lastIndexOf("\\]");
    if (displayStart > displayEnd) {
      return true;
    }
    const displayEnvs = ["equation", "align", "gather", "multline", "eqnarray"];
    for (const env of displayEnvs) {
      const beginRegex = new RegExp(`\\\\begin\\{${env}\\*?\\}`, "g");
      const endRegex = new RegExp(`\\\\end\\{${env}\\*?\\}`, "g");
      const begins = (textBefore.match(beginRegex) || []).length;
      const ends = (textBefore.match(endRegex) || []).length;
      if (begins > ends) {
        return true;
      }
    }
    return false;
  }
  function isInMathMode(state, pos, textBefore) {
    const treeResult = detectMathModeFromTree(state, pos);
    if (treeResult !== null) {
      return treeResult;
    }
    return detectMathModeFromText(textBefore);
  }
  function isInsideTextCommand(textBefore) {
    let depth = 0;
    for (let i = textBefore.length - 1; i >= 0; i--) {
      const c = textBefore[i];
      if ((c === "{" || c === "}") && i > 0 && textBefore[i - 1] === "\\")
        continue;
      if (c === "}") {
        depth++;
      } else if (c === "{") {
        if (depth === 0) {
          if (TEXT_CMD_RE.test(textBefore.slice(0, i)))
            return true;
        } else {
          depth--;
        }
      }
    }
    return false;
  }
  var TEXT_CMD_RE, mathMode_default;
  var init_mathMode = __esm({
    "src/mathMode.js"() {
      TEXT_CMD_RE = /\\(text|textbf|textit|textrm|textsf|textsc|textsl|textup|emph|mbox)$/;
      mathMode_default = isInMathMode;
    }
  });

  // src/extension.js
  init_snippets();
  init_matcher();

  // src/replacement.js
  function applyCaptures(template, captures) {
    if (!captures || captures.length === 0) {
      return template;
    }
    let result = template;
    for (let i = 0; i < captures.length; i++) {
      result = result.replace(new RegExp(`\\[\\[${i}\\]\\]`, "g"), captures[i]);
    }
    return result;
  }
  function processReplacement(replacement, match, insertPos) {
    let template;
    if (typeof replacement === "function") {
      try {
        template = replacement(match.captures ? [match.captures[0], ...match.captures] : []);
      } catch (e) {
        console.error("Snippet function error:", e);
        return null;
      }
    } else {
      template = replacement;
    }
    if (match.captures && match.captures.length > 0) {
      template = applyCaptures(template, match.captures);
    }
    return processTabstops(template, insertPos);
  }
  function processTabstops(template, basePos) {
    let result = template;
    const tabstops = [];
    let cursorPos = basePos + template.length;
    const defaultRegex = /\$\{(\d+):([^}]+)\}/g;
    let defaultMatch;
    const processedDefaults = /* @__PURE__ */ new Map();
    let offset = 0;
    defaultRegex.lastIndex = 0;
    while ((defaultMatch = defaultRegex.exec(template)) !== null) {
      const [fullMatch, numStr, defaultVal] = defaultMatch;
      const num = parseInt(numStr, 10);
      const startInTemplate = defaultMatch.index;
      const adjustedStart = startInTemplate - offset + basePos;
      if (!processedDefaults.has(num)) {
        tabstops.push({
          index: num,
          from: adjustedStart,
          to: adjustedStart + defaultVal.length
        });
        processedDefaults.set(num, true);
      }
      offset += fullMatch.length - defaultVal.length;
    }
    result = result.replace(/\$\{(\d+):([^}]+)\}/g, "$2");
    const cursorMarker = result.indexOf("$0");
    if (cursorMarker !== -1) {
      cursorPos = basePos + cursorMarker;
      result = result.replace("$0", "");
      for (const ts of tabstops) {
        if (ts.from > basePos + cursorMarker) {
          ts.from -= 2;
          ts.to -= 2;
        }
      }
    }
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
    result = result.replace(/\$(\d+)/g, "");
    tabstops.sort((a, b) => a.index - b.index);
    return {
      text: result,
      cursorPos,
      tabstops
    };
  }
  function processVisualReplacement(replacement, selectedText, insertPos) {
    const template = typeof replacement === "function" ? replacement([selectedText]) : replacement.replace(/\[\[VISUAL\]\]/g, selectedText);
    return processTabstops(template, insertPos);
  }
  function buildFractionReplacement(fractionMatch, insertPos) {
    const { numerator } = fractionMatch;
    const text = `\\frac{${numerator}}{}`;
    const cursorPos = insertPos + text.length - 1;
    return { text, cursorPos };
  }

  // src/extension.js
  init_mathMode();

  // src/tabstops.js
  function createTabstopState() {
    return {
      positions: [],
      // Array of { from, to } ranges
      current: -1
      // Index of current tabstop (-1 = none active)
    };
  }
  function mapTabstopsThroughChanges(state, changes) {
    if (state.positions.length === 0) {
      return state;
    }
    const newPositions = state.positions.map((pos) => ({
      from: changes.mapPos(pos.from),
      to: changes.mapPos(pos.to)
    })).filter((pos) => pos.from < pos.to);
    return {
      ...state,
      positions: newPositions,
      current: newPositions.length > 0 ? state.current : -1
    };
  }
  function setTabstops(tabstops) {
    if (!tabstops || tabstops.length === 0) {
      return createTabstopState();
    }
    return {
      positions: tabstops.map((ts) => ({ from: ts.from, to: ts.to })),
      current: 0
    };
  }
  function advanceTabstop(state) {
    if (state.positions.length === 0 || state.current < 0) {
      return createTabstopState();
    }
    const nextIndex = state.current + 1;
    if (nextIndex >= state.positions.length) {
      return createTabstopState();
    }
    return {
      ...state,
      current: nextIndex
    };
  }
  function getCurrentTabstop(state) {
    if (state.current < 0 || state.current >= state.positions.length) {
      return null;
    }
    return state.positions[state.current];
  }
  function hasActiveTabstops(state) {
    return state.current >= 0 && state.current < state.positions.length;
  }
  function createTabstopField(StateField, StateEffect) {
    const setEffect = StateEffect.define();
    const clearEffect = StateEffect.define();
    const advanceEffect = StateEffect.define();
    const field = StateField.define({
      create() {
        return createTabstopState();
      },
      update(value, tr) {
        for (const effect of tr.effects) {
          if (effect.is(setEffect)) {
            return setTabstops(effect.value);
          }
          if (effect.is(clearEffect)) {
            return createTabstopState();
          }
          if (effect.is(advanceEffect)) {
            return advanceTabstop(value);
          }
        }
        if (tr.docChanged) {
          return mapTabstopsThroughChanges(value, tr.changes);
        }
        return value;
      }
    });
    return {
      field,
      setEffect,
      clearEffect,
      advanceEffect
    };
  }

  // src/extension.js
  function getTextBefore(state, pos, maxLength = 500) {
    const start = Math.max(0, pos - maxLength);
    return state.doc.sliceString(start, pos);
  }
  function getTextAfter(state, pos, maxLength = 50) {
    const end = Math.min(state.doc.length, pos + maxLength);
    return state.doc.sliceString(pos, end);
  }
  var knownCommands = new Set(
    snippets.map((s) => typeof s.replacement === "string" ? s.replacement.match(/^\\([a-zA-Z]+)/) : null).filter(Boolean).map((m) => m[1])
  );
  var TALL_CONTENT_RE = /\\(frac|dfrac|tfrac|sum|prod|int|oint|iint|iiint|lim|bigcup|bigcap|bigoplus|bigotimes|bigvee|bigwedge)/;
  function findMatchingOpen(text, openChar, closeChar) {
    let depth = 0;
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] === closeChar) {
        depth++;
      } else if (text[i] === openChar) {
        if (depth === 0)
          return i;
        depth--;
      }
    }
    return -1;
  }
  function createInputHandler(tabstopEffects) {
    return (view, from, to, text) => {
      if (text.length > 2) {
        return false;
      }
      const state = view.state;
      const pos = from;
      const existingTextBefore = getTextBefore(state, pos);
      const textBefore = existingTextBefore + text;
      const textAfter = getTextAfter(state, to);
      const inMathMode = isInMathMode(state, pos, existingTextBefore) && !isInsideTextCommand(existingTextBefore);
      if (to > from && text.length === 1) {
        const visualSnippet = findVisualMatch(text, snippets, inMathMode);
        if (visualSnippet) {
          const selectedText = state.doc.sliceString(from, to);
          const processed = processVisualReplacement(visualSnippet.replacement, selectedText, from);
          if (processed) {
            const { text: replacementText, cursorPos, tabstops } = processed;
            const effects = [];
            if (tabstops && tabstops.length > 0 && tabstopEffects) {
              effects.push(tabstopEffects.setEffect.of(tabstops));
            }
            view.dispatch({
              changes: { from, to, insert: replacementText },
              selection: { anchor: cursorPos },
              effects
            });
            return true;
          }
        }
      }
      if (inMathMode && text.length === 1 && /[a-zA-Z]/.test(text)) {
        const cmdMatch = existingTextBefore.match(/\\([a-zA-Z]+)$/);
        if (cmdMatch && knownCommands.has(cmdMatch[1])) {
          view.dispatch({
            changes: { from, to, insert: " " + text },
            selection: { anchor: from + 2 }
          });
          return true;
        }
      }
      if (inMathMode && (text === ")" || text === "]")) {
        const openChar = text === ")" ? "(" : "[";
        const leftCmd = text === ")" ? "\\left(" : "\\left[";
        const rightCmd = text === ")" ? "\\right)" : "\\right]";
        const openIdx = findMatchingOpen(existingTextBefore, openChar, text);
        if (openIdx >= 0) {
          const content = existingTextBefore.slice(openIdx + 1);
          if (TALL_CONTENT_RE.test(content)) {
            const docOpenPos = pos - existingTextBefore.length + openIdx;
            const replaceTo = textAfter.length > 0 && textAfter[0] === text ? to + 1 : to;
            const replacement = leftCmd + content + rightCmd;
            view.dispatch({
              changes: { from: docOpenPos, to: replaceTo, insert: replacement },
              selection: { anchor: docOpenPos + replacement.length }
            });
            return true;
          }
        }
      }
      if (inMathMode) {
        const fractionMatch = matchFraction(textBefore);
        if (fractionMatch) {
          const insertPos = pos - fractionMatch.matchLength + text.length;
          const { text: replacementText, cursorPos } = buildFractionReplacement(
            fractionMatch,
            insertPos
          );
          view.dispatch({
            changes: {
              from: pos - fractionMatch.matchLength + text.length,
              to,
              insert: replacementText
            },
            selection: { anchor: cursorPos }
          });
          return true;
        }
      }
      const match = findMatch(textBefore, snippets, inMathMode, textAfter);
      if (match) {
        const replaceFrom = pos - match.matchLength + text.length;
        let replaceTo = to;
        const triggerStr = match.snippet.trigger instanceof RegExp ? textBefore.slice(-match.matchLength) : match.snippet.trigger;
        const lastTriggerChar = triggerStr[triggerStr.length - 1];
        if ((lastTriggerChar === ")" || lastTriggerChar === "]" || lastTriggerChar === "}") && textAfter.length > 0 && textAfter[0] === lastTriggerChar) {
          replaceTo = to + 1;
        }
        const processed = processReplacement(
          match.snippet.replacement,
          match,
          replaceFrom
        );
        if (!processed) {
          return false;
        }
        const { text: replacementText, tabstops } = processed;
        let { cursorPos } = processed;
        let adjustedFrom = replaceFrom;
        if ((replacementText.startsWith("^") || replacementText.startsWith("_")) && replaceFrom > 0 && state.doc.sliceString(replaceFrom - 1, replaceFrom) === " ") {
          adjustedFrom = replaceFrom - 1;
          cursorPos -= 1;
          if (tabstops) {
            for (const ts of tabstops) {
              ts.from -= 1;
              ts.to -= 1;
            }
          }
        }
        const effects = [];
        if (tabstops && tabstops.length > 0 && tabstopEffects) {
          effects.push(tabstopEffects.setEffect.of(tabstops));
        }
        view.dispatch({
          changes: {
            from: adjustedFrom,
            to: replaceTo,
            insert: replacementText
          },
          selection: { anchor: cursorPos },
          effects
        });
        return true;
      }
      return false;
    };
  }
  function createTabCommand(tabstopField, tabstopEffects) {
    return (view) => {
      const state = view.state;
      if (!state.selection.main.empty)
        return false;
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
      const pos = state.selection.main.head;
      const doc = state.doc;
      const line = doc.lineAt(pos);
      const lineText = doc.sliceString(line.from, line.to);
      const firstNonSpace = lineText.search(/\S/);
      const contentStart = firstNonSpace === -1 ? line.to : line.from + firstNonSpace;
      if (pos <= contentStart)
        return false;
      const inMatrix = MATRIX_ENVS.has(getCurrentEnvironment(getTextBefore(state, pos)) ?? "");
      const scanRe = inMatrix ? /[}\)\]$&]/ : /[}\)\]$]/;
      function jumpPast(text, idx, baseDocPos) {
        const isDollar = text[idx] === "$";
        const advance = isDollar && text[idx + 1] === "$" ? 2 : 1;
        view.dispatch({ selection: { anchor: baseDocPos + idx + advance } });
      }
      const restOfLine = doc.sliceString(pos, line.to);
      const cur = restOfLine.search(scanRe);
      if (cur !== -1) {
        jumpPast(restOfLine, cur, pos);
        return true;
      }
      for (let n = line.number + 1; n <= Math.min(doc.lines, line.number + 5); n++) {
        const nl = doc.line(n);
        const nlText = doc.sliceString(nl.from, nl.to);
        const idx = nlText.search(scanRe);
        if (idx !== -1) {
          jumpPast(nlText, idx, nl.from);
          return true;
        }
      }
      return false;
    };
  }
  function createShiftTabCommand() {
    return (view) => {
      const state = view.state;
      if (!state.selection.main.empty)
        return false;
      const pos = state.selection.main.head;
      const line = state.doc.lineAt(pos);
      const lineStart = line.from;
      const lineText = state.doc.sliceString(lineStart, line.to);
      const firstNonSpace = lineText.search(/\S/);
      const contentStart = firstNonSpace === -1 ? line.to : lineStart + firstNonSpace;
      if (firstNonSpace > 0 && pos <= contentStart)
        return false;
      const doc = state.doc;
      const beforeCursor = doc.sliceString(lineStart, pos);
      const inMatrix = MATRIX_ENVS.has(getCurrentEnvironment(doc.sliceString(Math.max(0, pos - 500), pos)) ?? "");
      for (let i = beforeCursor.length - 2; i >= 0; i--) {
        const ch = beforeCursor[i];
        if (ch === "}" || ch === ")" || ch === "]" || inMatrix && ch === "&") {
          view.dispatch({ selection: { anchor: lineStart + i + 1 } });
          return true;
        }
        if (ch === "$") {
          const target = i > 0 && beforeCursor[i - 1] === "$" ? i - 1 : i;
          view.dispatch({ selection: { anchor: lineStart + target } });
          return true;
        }
      }
      for (let n = line.number - 1; n >= Math.max(1, line.number - 5); n--) {
        const pl = doc.line(n);
        const plText = doc.sliceString(pl.from, pl.to);
        for (let i = plText.length - 1; i >= 0; i--) {
          const ch = plText[i];
          if (ch === "}" || ch === ")" || ch === "]" || inMatrix && ch === "&") {
            view.dispatch({ selection: { anchor: pl.from + i + 1 } });
            return true;
          }
          if (ch === "$") {
            const target = i > 0 && plText[i - 1] === "$" ? i - 1 : i;
            view.dispatch({ selection: { anchor: pl.from + target } });
            return true;
          }
        }
      }
      return true;
    };
  }
  var MATRIX_ENVS = /* @__PURE__ */ new Set([
    "matrix",
    "pmatrix",
    "bmatrix",
    "Bmatrix",
    "vmatrix",
    "Vmatrix",
    "align",
    "align*",
    "aligned",
    "cases",
    "array"
  ]);
  function getCurrentEnvironment(textBefore) {
    const regex = /\\(begin|end)\{([^}]+)\}/g;
    const stack = [];
    let m;
    while ((m = regex.exec(textBefore)) !== null) {
      if (m[1] === "begin") {
        stack.push(m[2]);
      } else if (stack.length > 0 && stack[stack.length - 1] === m[2]) {
        stack.pop();
      }
    }
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }
  function createEnterCommand() {
    return (view) => {
      const state = view.state;
      if (!state.selection.main.empty)
        return false;
      const pos = state.selection.main.head;
      const env = getCurrentEnvironment(getTextBefore(state, pos));
      if (!env || !MATRIX_ENVS.has(env))
        return false;
      const insert = " \\\\\n";
      view.dispatch({
        changes: { from: pos, to: pos, insert },
        selection: { anchor: pos + insert.length }
      });
      return true;
    };
  }
  function createShiftEnterCommand() {
    return (view) => {
      const state = view.state;
      if (!state.selection.main.empty)
        return false;
      const pos = state.selection.main.head;
      const env = getCurrentEnvironment(getTextBefore(state, pos));
      if (!env || !MATRIX_ENVS.has(env))
        return false;
      const insert = " & ";
      view.dispatch({
        changes: { from: pos, to: pos, insert },
        selection: { anchor: pos + insert.length }
      });
      return true;
    };
  }
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
  function createSnippetExtensions(CM) {
    const { EditorView, StateField, StateEffect, keymap, Prec } = CM;
    const tabstopConfig = createTabstopField(StateField, StateEffect);
    const { field: tabstopField, setEffect, clearEffect, advanceEffect } = tabstopConfig;
    const tabstopEffects = { setEffect, clearEffect, advanceEffect };
    const rawInputHandler = EditorView.inputHandler.of(createInputHandler(tabstopEffects));
    const inputHandler = Prec?.highest ? Prec.highest(rawInputHandler) : rawInputHandler;
    const keymapDef = keymap.of([
      { key: "Tab", run: createTabCommand(tabstopField, tabstopEffects) },
      { key: "Shift-Tab", run: createShiftTabCommand() },
      { key: "Enter", run: createEnterCommand() },
      { key: "Shift-Enter", run: createShiftEnterCommand() },
      { key: "Escape", run: createEscapeCommand(tabstopField, tabstopEffects) }
    ]);
    const snippetKeymap = Prec?.highest ? Prec.highest(keymapDef) : keymapDef;
    return [
      tabstopField,
      inputHandler,
      snippetKeymap
    ];
  }

  // src/index.js
  var registered = false;
  function extractCodeMirrorModules(detail = {}) {
    if (detail.CodeMirror)
      return detail.CodeMirror;
    if (window.CodeMirror)
      return window.CodeMirror;
    const EditorView = detail.EditorView || window.EditorView || window.CM?.view?.EditorView;
    const StateField = detail.StateField || window.StateField || window.CM?.state?.StateField;
    const StateEffect = detail.StateEffect || window.StateEffect || window.CM?.state?.StateEffect;
    const keymap = detail.keymap || window.keymap || window.CM?.view?.keymap;
    const Prec = detail.Prec || window.Prec || window.CM?.state?.Prec;
    if (EditorView && StateField && StateEffect && keymap) {
      return { EditorView, StateField, StateEffect, keymap, Prec };
    }
    return null;
  }
  function getEditorViewFromElement(el) {
    for (const key of Object.keys(el)) {
      if (!key.startsWith("__cm"))
        continue;
      const val = el[key];
      if (val && typeof val.dispatch === "function")
        return val;
      if (val && val.view && typeof val.view.dispatch === "function")
        return val.view;
    }
    return null;
  }
  function getStateEffectFromView(view) {
    const SE = window.StateEffect || window.CM?.state?.StateEffect;
    if (SE?.appendConfig)
      return SE;
    try {
      const state = view.state;
      const facetVal = Object.values(state).find(
        (v) => v && typeof v === "object" && typeof v.appendConfig !== "undefined"
      );
      if (facetVal)
        return facetVal;
    } catch (_) {
    }
    return null;
  }
  window.addEventListener("UNSTABLE_editor:extensions", (event) => {
    if (registered)
      return;
    try {
      const CM = extractCodeMirrorModules(event.detail);
      if (!CM) {
        console.warn("Overleaf LaTeX Shortcuts: CM6 modules not found in event detail");
        return;
      }
      const exts = createSnippetExtensions(CM);
      event.detail.extensions.push(...exts);
      registered = true;
      console.log("Overleaf LaTeX Shortcuts: registered via UNSTABLE_editor:extensions");
    } catch (err) {
      console.error("Overleaf LaTeX Shortcuts: Path A failed:", err);
    }
  });
  var checkInterval = setInterval(() => {
    if (registered) {
      clearInterval(checkInterval);
      return;
    }
    const cmEditor = document.querySelector(".cm-editor");
    if (!cmEditor)
      return;
    const view = getEditorViewFromElement(cmEditor);
    if (!view)
      return;
    const StateEffect = getStateEffectFromView(view);
    if (!StateEffect?.appendConfig) {
      return;
    }
    const CM = extractCodeMirrorModules();
    if (!CM) {
      console.warn("Overleaf LaTeX Shortcuts: CM6 modules not found for Path B");
      clearInterval(checkInterval);
      return;
    }
    try {
      const exts = createSnippetExtensions(CM);
      view.dispatch({ effects: StateEffect.appendConfig.of(exts) });
      registered = true;
      console.log("Overleaf LaTeX Shortcuts: registered via appendConfig");
    } catch (err) {
      console.error("Overleaf LaTeX Shortcuts: Path B failed:", err);
    }
    clearInterval(checkInterval);
  }, 500);
  setTimeout(() => clearInterval(checkInterval), 3e4);
  window.debugSnippets = function () {
    const cmEditor = document.querySelector(".cm-editor");
    if (!cmEditor) {
      console.log("No .cm-editor found");
      return;
    }
    const view = getEditorViewFromElement(cmEditor);
    if (!view) {
      console.log("Could not find EditorView on .cm-editor element");
      return;
    }
    const state = view.state;
    const pos = state.selection.main.head;
    const start = Math.max(0, pos - 500);
    const textBefore = state.doc.sliceString(start, pos);
    const textAfter = state.doc.sliceString(pos, Math.min(state.doc.length, pos + 50));
    Promise.resolve().then(() => (init_mathMode(), mathMode_exports)).then(({ detectMathModeFromText: detectMathModeFromText2 }) => {
      Promise.resolve().then(() => (init_matcher(), matcher_exports)).then(({ findMatch: findMatch2, matchFraction: matchFraction2 }) => {
        Promise.resolve().then(() => (init_snippets(), snippets_exports)).then(({ snippets: snippets2 }) => {
          const inMathMode = detectMathModeFromText2(textBefore);
          const fractionMatch = inMathMode ? matchFraction2(textBefore) : null;
          const match = findMatch2(textBefore, snippets2, inMathMode, textAfter);
          console.log("=== debugSnippets ===");
          console.log("Text before (last 50):", textBefore.slice(-50));
          console.log("Text after:", textAfter.slice(0, 20));
          console.log("In math mode:", inMathMode);
          console.log("Fraction match:", fractionMatch);
          console.log("Snippet match:", match ? {
            trigger: match.snippet.trigger.toString(),
            matchLength: match.matchLength,
            captures: match.captures,
            replacement: typeof match.snippet.replacement === "function" ? "[function]" : match.snippet.replacement
          } : null);
        });
      });
    });
  };
})();
