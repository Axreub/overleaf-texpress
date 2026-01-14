// ==UserScript==
// @name         Overleaf LaTeX Shortcuts
// @namespace    https://github.com/overleaf-latex-shortcuts
// @version      1.3.0
// @description  Latex Suite-style snippet expansion for Overleaf
// @author       Axel Riley
// @match        https://www.overleaf.com/project/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // SNIPPET DEFINITIONS
    // ========================================
    // Options:
    //   m = math mode only
    //   t = text mode only
    //   A = auto-expand (no Tab needed)
    //   r = regex trigger
    //   w = word boundary required

    const snippets = [
        // Math mode
        {trigger: "mk", replacement: "$$0$", options: "tA"},
        {trigger: "dm", replacement: "$$\n$0\n$$", options: "tAw"},
        {trigger: "beg", replacement: "\\begin{$0}\n$1\n\\end{$0}", options: "mA"},
    
        // Dashes
        // {trigger: "--", replacement: "–", options: "tA"},
        // {trigger: "–-", replacement: "—", options: "tA"},
        // {trigger: "—-", replacement: "---", options: "tA"},
    
        // Greek letters
        {trigger: "@a", replacement: "\\alpha", options: "mA"},
        {trigger: "@b", replacement: "\\beta", options: "mA"},
        {trigger: "@g", replacement: "\\gamma", options: "mA"},
        {trigger: "@G", replacement: "\\Gamma", options: "mA"},
        {trigger: "@d", replacement: "\\delta", options: "mA"},
        {trigger: "@D", replacement: "\\Delta", options: "mA"},
        {trigger: "@e", replacement: "\\epsilon", options: "mA"},
        {trigger: ":e", replacement: "\\varepsilon", options: "mA"},
        {trigger: "@z", replacement: "\\zeta", options: "mA"},
        {trigger: "@t", replacement: "\\theta", options: "mA"},
        {trigger: "@T", replacement: "\\Theta", options: "mA"},
        {trigger: ":t", replacement: "\\vartheta", options: "mA"},
        {trigger: "@i", replacement: "\\iota", options: "mA"},
        {trigger: "@k", replacement: "\\kappa", options: "mA"},
        {trigger: "@l", replacement: "\\lambda", options: "mA"},
        {trigger: "@L", replacement: "\\Lambda", options: "mA"},
        {trigger: "@s", replacement: "\\sigma", options: "mA"},
        {trigger: "@S", replacement: "\\Sigma", options: "mA"},
        {trigger: "@u", replacement: "\\upsilon", options: "mA"},
        {trigger: "@U", replacement: "\\Upsilon", options: "mA"},
        {trigger: "@o", replacement: "\\omega", options: "mA"},
        {trigger: "@O", replacement: "\\Omega", options: "mA"},
        {trigger: "ome", replacement: "\\omega", options: "mA"},
        {trigger: "Ome", replacement: "\\Omega", options: "mA"},
    
        // Text environment
        {trigger: "text", replacement: "\\text{$0}$1", options: "mA"},
        {trigger: "\"", replacement: "\\text{$0}$1", options: "mA"},
    
        // Basic operations
        {trigger: "sr", replacement: "^{2}", options: "mA"},
        {trigger: "cb", replacement: "^{3}", options: "mA"},
        {trigger: "rd", replacement: "^{$0}$1", options: "mA"},
        {trigger: "_", replacement: "_{$0}$1", options: "mA"},
        {trigger: "sts", replacement: "_\\text{$0}", options: "mA"},
        {trigger: "sq", replacement: "\\sqrt{ $0 }$1", options: "mA"},
        {trigger: "//", replacement: "\\frac{$0}{$1}$2", options: "mA"},
        {trigger: "ee", replacement: "e^{ $0 }$1", options: "mA"},
        {trigger: "invs", replacement: "^{-1}", options: "mA"},
        {trigger: /([A-Za-z])(\d)/, replacement: "[[0]]_{[[1]]}", options: "rmA", description: "Auto letter subscript", priority: -1},
    
        {trigger: /([^\\])(exp|log|ln)/, replacement: "[[0]]\\[[1]]", options: "rmA"},
        {trigger: "conj", replacement: "^{*}", options: "mA"},
        {trigger: "Re", replacement: "\\mathrm{Re}", options: "mA"},
        {trigger: "Im", replacement: "\\mathrm{Im}", options: "mA"},
        {trigger: "bf", replacement: "\\mathbf{$0}", options: "mA"},
        {trigger: "rm", replacement: "\\mathrm{$0}$1", options: "mA"},
    
        // Linear algebra
        {trigger: /([^\\])(det)/, replacement: "[[0]]\\[[1]]", options: "rmA"},
        {trigger: "trace", replacement: "\\mathrm{Tr}", options: "mA"},
    
        // More operations
        {trigger: "([a-zA-Z])hat", replacement: "\\hat{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])bar", replacement: "\\bar{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])cal", replacement: "\\mathcal{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])scr", replacement: "\\mathscr{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])dot", replacement: "\\dot{[[0]]}", options: "rmA", priority: -1},
        {trigger: "([a-zA-Z])ddot", replacement: "\\ddot{[[0]]}", options: "rmA", priority: 1},
        {trigger: "([a-zA-Z])tilde", replacement: "\\tilde{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])und", replacement: "\\underline{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])vec", replacement: "\\vec{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z]),\\.", replacement: "\\mathbf{[[0]]}", options: "rmA"},
        {trigger: "([a-zA-Z])\\.,", replacement: "\\mathbf{[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}),\\.", replacement: "\\boldsymbol{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK})\\.,", replacement: "\\boldsymbol{\\[[0]]}", options: "rmA"},
    
        {trigger: "hat", replacement: "\\hat{$0}$1", options: "mA"},
        {trigger: "bar", replacement: "\\bar{$0}$1", options: "mA"},
        {trigger: "cal", replacement: "\\mathcal{$0}$1", options: "mA"},
        {trigger: "scr", replacement: "\\mathscr{$0}$1", options: "mA"},
        {trigger: "dot", replacement: "\\dot{$0}$1", options: "mA", priority: -1},
        {trigger: "ddot", replacement: "\\ddot{$0}$1", options: "mA"},
        {trigger: "cdot", replacement: "\\cdot", options: "mA"},
        {trigger: "tilde", replacement: "\\tilde{$0}$1", options: "mA"},
        {trigger: "und", replacement: "\\underline{$0}$1", options: "mA"},
        {trigger: "vec", replacement: "\\vec{$0}$1", options: "mA"},
    
        // More auto letter subscript
        {trigger: /([A-Za-z])_(\d\d)/, replacement: "[[0]]_{[[1]]}", options: "rmA"},
        {trigger: /\\hat{([A-Za-z])}(\d)/, replacement: "\\hat{[[0]]}_{[[1]]}", options: "rmA"},
        {trigger: /\\vec{([A-Za-z])}(\d)/, replacement: "\\vec{[[0]]}_{[[1]]}", options: "rmA"},
        {trigger: /\\mathbf{([A-Za-z])}(\d)/, replacement: "\\mathbf{[[0]]}_{[[1]]}", options: "rmA"},
    
        {trigger: "xnn", replacement: "x_{n}", options: "mA"},
        {trigger: "\\xii", replacement: "x_{i}", options: "mA", priority: 1},
        {trigger: "xjj", replacement: "x_{j}", options: "mA"},
        {trigger: "xp1", replacement: "x_{n+1}", options: "mA"},
        {trigger: "ynn", replacement: "y_{n}", options: "mA"},
        {trigger: "yii", replacement: "y_{i}", options: "mA"},
        {trigger: "yjj", replacement: "y_{j}", options: "mA"},
    
        // Symbols
        {trigger: "ooo", replacement: "\\infty", options: "mA"},
        {trigger: "sum", replacement: "\\sum", options: "mA"},
        {trigger: "prod", replacement: "\\prod", options: "mA"},
        {trigger: "\\sum", replacement: "\\sum_{${0:i}=${1:1}}^{${2:N}} $3", options: "m"},
        {trigger: "\\prod", replacement: "\\prod_{${0:i}=${1:1}}^{${2:N}} $3", options: "m"},
        {trigger: "lim", replacement: "\\lim_{ ${0:n} \\to ${1:\\infty} } $2", options: "mA"},
        {trigger: "argmin", replacement : "\\operatorname{\argmin}", options: "mA"},
        {trigger: "argmax", replacement : "\\operatorname{\argmax}", options: "mA"},
        {trigger: "ber", replacement : "\\operatorname{Ber}", options: "mA"},
            {trigger: "Ber", replacement : "\\operatorname{Ber}", options: "mA"},
        {trigger: "+-", replacement: "\\pm", options: "mA"},
        {trigger: "-+", replacement: "\\mp", options: "mA"},
        {trigger: "...", replacement: "\\dots", options: "mA"},
        {trigger: "nabl", replacement: "\\nabla", options: "mA"},
        {trigger: "del", replacement: "\\nabla", options: "mA"},
        {trigger: "xx", replacement: "\\times", options: "mA"},
        {trigger: "**", replacement: "\\cdot", options: "mA"},
        {trigger: "para", replacement: "\\parallel", options: "mA"},
    
        {trigger: "===", replacement: "\\equiv", options: "mA"},
        {trigger: "!=", replacement: "\\neq", options: "mA"},
        {trigger: ">=", replacement: "\\geq", options: "mA"},
        {trigger: "<=", replacement: "\\leq", options: "mA"},
        {trigger: ">>", replacement: "\\gg", options: "mA"},
        {trigger: "<<", replacement: "\\ll", options: "mA"},
        {trigger: "simm", replacement: "\\sim", options: "mA"},
        {trigger: "sim=", replacement: "\\simeq", options: "mA"},
        {trigger: "prop", replacement: "\\propto", options: "mA"},
    
    
        {trigger: "<->", replacement: "\\leftrightarrow ", options: "mA"},
        {trigger: "->", replacement: "\\to", options: "mA"},
        {trigger: "!>", replacement: "\\mapsto", options: "mA"},
        {trigger: "=>", replacement: "\\implies", options: "mA"},
        {trigger: "=<", replacement: "\\impliedby", options: "mA"},
    
        {trigger: "and", replacement: "\\cap", options: "mA"},
        {trigger: "orr", replacement: "\\cup", options: "mA"},
        {trigger: "inn", replacement: "\\in", options: "mA"},
        {trigger: "notin", replacement: "\\not\\in", options: "mA"},
        {trigger: "\\\\\\", replacement: "\\setminus", options: "mA"},
        {trigger: "sub=", replacement: "\\subseteq", options: "mA"},
        {trigger: "sup=", replacement: "\\supseteq", options: "mA"},
        {trigger: "eset", replacement: "\\emptyset", options: "mA"},
        {trigger: "set", replacement: "\\{ $0 \\}$1", options: "mA"},
        {trigger: "e\\xi sts", replacement: "\\exists", options: "mA", priority: 1},
    
        {trigger: "LL", replacement: "\\mathcal{L}", options: "mA"},
        {trigger: "HH", replacement: "\\mathcal{H}", options: "mA"},
        {trigger: "CC", replacement: "\\mathbb{C}", options: "mA"},
        {trigger: "RR", replacement: "\\mathbb{R}", options: "mA"},
        {trigger: "ZZ", replacement: "\\mathbb{Z}", options: "mA"},
        {trigger: "NN", replacement: "\\mathbb{N}", options: "mA"},
        {trigger: "QQ", replacement: "\\mathbb{Q}", options: "mA"},
        {trigger: "EE", replacement: "\\mathbb{E}", options: "mA"},
    
        // Handle spaces and backslashes
    
        // Snippet variables can be used as shortcuts when writing snippets.
        // For example, ${GREEK} below is shorthand for "alpha|beta|gamma|Gamma|delta|..."
        // You can edit snippet variables under the Advanced snippet settings section.
    
        {trigger: "([^\\\\])(${GREEK})", replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before Greek letters"},
        {trigger: "([^\\\\])(${SYMBOL})", replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before symbols"},
    
        // Insert space after Greek letters and symbols
        {trigger: "\\\\(${GREEK}|${SYMBOL}|${MORE_SYMBOLS})([A-Za-z])", replacement: "\\[[0]] [[1]]", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) sr", replacement: "\\[[0]]^{2}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) cb", replacement: "\\[[0]]^{3}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) rd", replacement: "\\[[0]]^{$0}$1", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) hat", replacement: "\\hat{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) dot", replacement: "\\dot{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) bar", replacement: "\\bar{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) vec", replacement: "\\vec{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) tilde", replacement: "\\tilde{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) und", replacement: "\\underline{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) cal", replacement: "\\mathcal{\\[[0]]}", options: "rmA"},
        {trigger: "\\\\(${GREEK}|${SYMBOL}) scr", replacement: "\\mathscr{\\[[0]]}", options: "rmA"},
    
    
        // Derivatives and integrals
        {trigger: "par", replacement: "\\frac{ \\partial ${0:y} }{ \\partial ${1:x} } $2", options: "m"},
        {trigger: /pa([A-Za-z])([A-Za-z])/, replacement: "\\frac{ \\partial [[0]] }{ \\partial [[1]] } ", options: "rm"},
        {trigger: "ddt", replacement: "\\frac{d}{dt} ", options: "mA"},
    
        {trigger: /([^\\])int/, replacement: "[[0]]\\int", options: "mA", priority: -1},
        {trigger: "\\int", replacement: "\\int $0 \\, d${1:x} $2", options: "m"},
        {trigger: "dint", replacement: "\\int_{${0:0}}^{${1:1}} $2 \\, d${3:x} $4", options: "mA"},
        {trigger: "oint", replacement: "\\oint", options: "mA"},
        {trigger: "iint", replacement: "\\iint", options: "mA"},
        {trigger: "iiint", replacement: "\\iiint", options: "mA"},
        {trigger: "oinf", replacement: "\\int_{0}^{\\infty} $0 \\, d${1:x} $2", options: "mA"},
        {trigger: "infi", replacement: "\\int_{-\\infty}^{\\infty} $0 \\, d${1:x} $2", options: "mA"},
    
    
        // Trigonometry
        {trigger: /([^\\])(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)/, replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before trig funcs"},
    
        {trigger: /\\(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)([A-Za-gi-z])/,
         replacement: "\\[[0]] [[1]]", options: "rmA",
         description: "Add space after trig funcs. Skips letter h to allow sinh, cosh, etc."},
    
        {trigger: /\\(sinh|cosh|tanh|coth)([A-Za-z])/,
         replacement: "\\[[0]] [[1]]", options: "rmA",
         description: "Add space after hyperbolic trig funcs"},
    
    
        // Visual operations
        {trigger: "U", replacement: "\\underbrace{ ${VISUAL} }_{ $0 }", options: "mA"},
        {trigger: "O", replacement: "\\overbrace{ ${VISUAL} }^{ $0 }", options: "mA"},
        {trigger: "B", replacement: "\\underset{ $0 }{ ${VISUAL} }", options: "mA"},
        {trigger: "C", replacement: "\\cancel{ ${VISUAL} }", options: "mA"},
        {trigger: "K", replacement: "\\cancelto{ $0 }{ ${VISUAL} }", options: "mA"},
        {trigger: "S", replacement: "\\sqrt{ ${VISUAL} }", options: "mA"},
    
    
        // Physics
        {trigger: "kbt", replacement: "k_{B}T", options: "mA"},
        {trigger: "msun", replacement: "M_{\\odot}", options: "mA"},
    
        // Quantum mechanics
        {trigger: "dag", replacement: "^{\\dagger}", options: "mA"},
        {trigger: "o+", replacement: "\\oplus ", options: "mA"},
        {trigger: "ox", replacement: "\\otimes ", options: "mA"},
        {trigger: "bra", replacement: "\\bra{$0} $1", options: "mA"},
        {trigger: "ket", replacement: "\\ket{$0} $1", options: "mA"},
        {trigger: "brk", replacement: "\\braket{ $0 | $1 } $2", options: "mA"},
        {trigger: "outer", replacement: "\\ket{${0:\\psi}} \\bra{${0:\\psi}} $1", options: "mA"},
    
        // Chemistry
        {trigger: "pu", replacement: "\\pu{ $0 }", options: "mA"},
        {trigger: "cee", replacement: "\\ce{ $0 }", options: "mA"},
        {trigger: "he4", replacement: "{}^{4}_{2}He ", options: "mA"},
        {trigger: "he3", replacement: "{}^{3}_{2}He ", options: "mA"},
        {trigger: "iso", replacement: "{}^{${0:4}}_{${1:2}}${2:He}", options: "mA"},
    
    
        // Environments
        {trigger: "pmat", replacement: "\\begin{pmatrix}\n$0\n\\end{pmatrix}", options: "MA"},
        {trigger: "bmat", replacement: "\\begin{bmatrix}\n$0\n\\end{bmatrix}", options: "MA"},
        {trigger: "Bmat", replacement: "\\begin{Bmatrix}\n$0\n\\end{Bmatrix}", options: "MA"},
        {trigger: "vmat", replacement: "\\begin{vmatrix}\n$0\n\\end{vmatrix}", options: "MA"},
        {trigger: "Vmat", replacement: "\\begin{Vmatrix}\n$0\n\\end{Vmatrix}", options: "MA"},
        {trigger: "matrix", replacement: "\\begin{matrix}\n$0\n\\end{matrix}", options: "MA"},
    
        {trigger: "pmat", replacement: "\\begin{pmatrix}$0\\end{pmatrix}", options: "nA"},
        {trigger: "bmat", replacement: "\\begin{bmatrix}$0\\end{bmatrix}", options: "nA"},
        {trigger: "Bmat", replacement: "\\begin{Bmatrix}$0\\end{Bmatrix}", options: "nA"},
        {trigger: "vmat", replacement: "\\begin{vmatrix}$0\\end{vmatrix}", options: "nA"},
        {trigger: "Vmat", replacement: "\\begin{Vmatrix}$0\\end{Vmatrix}", options: "nA"},
        {trigger: "matrix", replacement: "\\begin{matrix}$0\\end{matrix}", options: "nA"},
    
        {trigger: "cases", replacement: "\\begin{cases}\n$0\n\\end{cases}", options: "mA"},
        {trigger: "align", replacement: "\\begin{align}\n$0\n\\end{align}", options: "mA"},
        {trigger: "array", replacement: "\\begin{array}\n$0\n\\end{array}", options: "mA"},
    
    
        // Brackets
        {trigger: "avg", replacement: "\\langle $0 \\rangle $1", options: "mA"},
        {trigger: "norm", replacement: "\\lvert $0 \\rvert $1", options: "mA", priority: 1},
        {trigger: "Norm", replacement: "\\lVert $0 \\rVert $1", options: "mA", priority: 1},
        {trigger: "ceil", replacement: "\\lceil $0 \\rceil $1", options: "mA"},
        {trigger: "floor", replacement: "\\lfloor $0 \\rfloor $1", options: "mA"},
        {trigger: "mod", replacement: "|$0|$1", options: "mA"},
        {trigger: "(", replacement: "(${VISUAL})", options: "mA"},
        {trigger: "[", replacement: "[${VISUAL}]", options: "mA"},
        {trigger: "{", replacement: "{${VISUAL}}", options: "mA"},
        {trigger: "(", replacement: "($0)$1", options: "mA"},
        {trigger: "{", replacement: "{$0}$1", options: "mA"},
        {trigger: "[", replacement: "[$0]$1", options: "mA"},
        {trigger: "lr(", replacement: "\\left( $0 \\right) $1", options: "mA"},
        {trigger: "lr{", replacement: "\\left\\{ $0 \\right\\} $1", options: "mA"},
        {trigger: "lr[", replacement: "\\left[ $0 \\right] $1", options: "mA"},
        {trigger: "lr|", replacement: "\\left| $0 \\right| $1", options: "mA"},
        {trigger: "lra", replacement: "\\left< $0 \\right> $1", options: "mA"},
    
    
        // Misc
    
        // Automatically convert standalone letters in text to math (except a, A, I).
        // (Un-comment to enable)
        // {trigger: /([^'])\b([B-HJ-Zb-z])\b([\n\s.,?!:'])/, replacement: "[[0]]$[[1]]$[[2]]", options: "tA"},
    
        // Automatically convert Greek letters in text to math.
        // {trigger: "(${GREEK})([\\n\\s.,?!:'])", replacement: "$\\[[0]]$[[1]]", options: "rtAw"},
    
        // Automatically convert text of the form "x=2" and "x=n+1" to math.
        // {trigger: /([A-Za-z]=\d+)([\n\s.,?!:'])/, replacement: "$[[0]]$[[1]]", options: "rtAw"},
        // {trigger: /([A-Za-z]=[A-Za-z][+-]\d+)([\n\s.,?!:'])/, replacement: "$[[0]]$[[1]]", options: "tAw"},
    
    
        // Snippet replacements can have placeholders.
        {trigger: "tayl", replacement: "${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3", options: "mA", description: "Taylor expansion"},
    
        // Snippet replacements can also be JavaScript functions.
        // See the documentation for more information.
        {trigger: /iden(\d)/, replacement: (match) => {
            const n = match[1];
    
            let arr = [];
            for (let j = 0; j < n; j++) {
                arr[j] = [];
                for (let i = 0; i < n; i++) {
                    arr[j][i] = (i === j) ? 1 : 0;
                }
            }
    
            let output = arr.map(el => el.join(" & ")).join(" \\\\\n");
            output = `\\begin{pmatrix}\n${output}\n\\end{pmatrix}`;
            return output;
        }, options: "mA", description: "N x N identity matrix"},
    ];    

    // ========================================
    // STATE
    // ========================================
    let activeTabstops = [];
    let currentTabstopIndex = -1;
    let editorView = null;
    let queuedExpansion = null;
    let expansionCooldown = false; // Prevent cascading expansions

    // ========================================
    // GREEK LETTER WORD SNIPPETS
    // ========================================
    // These are added programmatically so you can type "gamma" -> "\gamma"
    const greekLetters = [
        'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
        'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho',
        'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
        'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega'
    ];

    // Add Greek letter word snippets to the main snippets array
    greekLetters.forEach(letter => {
        snippets.push({
            trigger: letter,
            replacement: '\\' + letter,
            options: 'mAw', // math mode, auto-expand, word boundary required
            priority: -2    // Lower priority so @a style triggers take precedence
        });
    });

    // ========================================
    // CODEMIRROR 6 INTEGRATION
    // ========================================

    // Find the CodeMirror EditorView instance
    function findEditorView() {
        const cmEditor = document.querySelector('.cm-editor');
        if (!cmEditor) return null;

        // Method 1: Check for view property directly
        if (cmEditor.cmView && cmEditor.cmView.view) {
            return cmEditor.cmView.view;
        }

        // Method 2: Look through Symbol properties (CM6 often uses Symbols)
        const symbols = Object.getOwnPropertySymbols(cmEditor);
        for (const sym of symbols) {
            const val = cmEditor[sym];
            if (val && typeof val === 'object') {
                if (val.state && val.dispatch) return val;
                if (val.view && val.view.state && val.view.dispatch) return val.view;
            }
        }

        // Method 3: Search through regular properties
        for (const key of Object.keys(cmEditor)) {
            const val = cmEditor[key];
            if (val && typeof val === 'object' && val.state && val.dispatch) {
                return val;
            }
        }

        // Method 4: Look in .cm-content element
        const cmContent = document.querySelector('.cm-content');
        if (cmContent) {
            for (const sym of Object.getOwnPropertySymbols(cmContent)) {
                const val = cmContent[sym];
                if (val && typeof val === 'object') {
                    if (val.state && val.dispatch) return val;
                    if (val.view && val.view.state && val.view.dispatch) return val.view;
                }
            }
        }

        // Method 5: Check Overleaf's global objects
        if (window._ide?.editorManager?.getCurrentDocumentController?.()?.cm6) {
            return window._ide.editorManager.getCurrentDocumentController().cm6;
        }

        // Method 6: Look for EditorView in window's CodeMirror modules
        if (window.CM && window.CM.EditorView) {
            // Try to find instances
            const views = document.querySelectorAll('.cm-editor');
            for (const v of views) {
                if (v._view) return v._view;
            }
        }

        // Method 7: Traverse up the prototype chain looking for view
        let proto = Object.getPrototypeOf(cmEditor);
        while (proto && proto !== Object.prototype) {
            for (const key of Object.getOwnPropertyNames(proto)) {
                try {
                    const desc = Object.getOwnPropertyDescriptor(proto, key);
                    if (desc && desc.get) {
                        const val = desc.get.call(cmEditor);
                        if (val && val.state && val.dispatch) return val;
                    }
                } catch (e) {}
            }
            proto = Object.getPrototypeOf(proto);
        }

        // Method 8: Last resort - try to find any object with state.doc
        function deepSearch(obj, depth = 0) {
            if (depth > 3 || !obj || typeof obj !== 'object') return null;
            if (obj.state && obj.state.doc && obj.dispatch) return obj;
            for (const key in obj) {
                try {
                    const result = deepSearch(obj[key], depth + 1);
                    if (result) return result;
                } catch (e) {}
            }
            return null;
        }

        return deepSearch(cmEditor);
    }

    // Get text from the document up to cursor position
    function getTextBeforeCursor(view) {
        if (!view) return '';
        const state = view.state;
        const pos = state.selection.main.head;
        return state.doc.sliceString(0, pos);
    }

    // Get cursor position
    function getCursorPos(view) {
        if (!view) return 0;
        return view.state.selection.main.head;
    }

    // Replace text in the editor using CM6 API
    function replaceTextInEditor(view, from, to, replacement, cursorOffset = -1) {
        if (!view) return false;

        // Calculate cursor position
        let cursorPos;
        if (cursorOffset >= 0) {
            cursorPos = from + cursorOffset;
        } else {
            cursorPos = from + replacement.length;
        }

        view.dispatch({
            changes: { from, to, insert: replacement },
            selection: { anchor: cursorPos }
        });

        return true;
    }

    // ========================================
    // FALLBACK: DOM-BASED APPROACH
    // ========================================
    // This works when we can't access the CM6 EditorView directly

    let useFallback = false;

    function getTextBeforeCursorFallback() {
        const selection = window.getSelection();
        if (!selection.rangeCount || !selection.isCollapsed) return '';

        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        // Get the parent element if we're in a text node
        let elementContainer = startContainer;
        if (elementContainer.nodeType === Node.TEXT_NODE) {
            elementContainer = elementContainer.parentElement;
        }

        const cmLine = elementContainer?.closest?.('.cm-line');
        if (!cmLine) {
            console.log('Overleaf LaTeX Shortcuts: Could not find .cm-line');
            return '';
        }

        // Get all text in the current line before cursor
        const treeWalker = document.createTreeWalker(
            cmLine,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let lineText = '';
        let node;
        while ((node = treeWalker.nextNode())) {
            if (node === startContainer) {
                lineText += node.textContent.substring(0, startOffset);
                break;
            }
            lineText += node.textContent;
        }

        // For math mode detection, we need more context - get previous lines too
        const cmContent = document.querySelector('.cm-content');
        if (cmContent) {
            const lines = cmContent.querySelectorAll('.cm-line');
            let fullText = '';
            for (const line of lines) {
                if (line === cmLine) {
                    fullText += lineText;
                    break;
                }
                fullText += line.textContent + '\n';
            }
            return fullText;
        }

        return lineText;
    }

    function replaceTextFallback(matchLength, replacement, cursorOffset = -1) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;

        const range = selection.getRangeAt(0);

        // We need to select the text to replace
        // Move start of selection back by matchLength characters
        try {
            // First, get current position in text node
            let container = range.startContainer;
            let offset = range.startOffset;

            if (container.nodeType !== Node.TEXT_NODE) {
                // Try to find a text node
                const textNodes = [];
                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                let n;
                while ((n = walker.nextNode())) textNodes.push(n);

                if (textNodes.length > 0) {
                    container = textNodes[textNodes.length - 1];
                    offset = container.textContent.length;
                } else {
                    return false;
                }
            }

            // Calculate new start position
            let remaining = matchLength;
            let startContainer = container;
            let startOffset = offset;

            if (offset >= matchLength) {
                startOffset = offset - matchLength;
            } else {
                // Need to go to previous text nodes
                remaining = matchLength - offset;
                startOffset = 0;

                // Get previous text nodes in the line
                const cmLine = container.parentElement?.closest('.cm-line');
                if (cmLine) {
                    const walker = document.createTreeWalker(
                        cmLine,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    const textNodes = [];
                    let n;
                    while ((n = walker.nextNode())) {
                        if (n === container) break;
                        textNodes.push(n);
                    }

                    // Walk backwards
                    for (let i = textNodes.length - 1; i >= 0 && remaining > 0; i--) {
                        const tn = textNodes[i];
                        if (tn.textContent.length >= remaining) {
                            startContainer = tn;
                            startOffset = tn.textContent.length - remaining;
                            remaining = 0;
                        } else {
                            remaining -= tn.textContent.length;
                            startContainer = tn;
                            startOffset = 0;
                        }
                    }
                }
            }

            // Create selection range for the text to replace
            const newRange = document.createRange();
            newRange.setStart(startContainer, startOffset);
            newRange.setEnd(container, offset);

            selection.removeAllRanges();
            selection.addRange(newRange);

            // Use execCommand to replace (this properly integrates with contenteditable)
            document.execCommand('insertText', false, replacement);

            // Now position cursor at the right place if cursorOffset is specified
            if (cursorOffset >= 0 && cursorOffset < replacement.length) {
                // We need to move cursor back from end of replacement
                const moveBack = replacement.length - cursorOffset;

                // Get current selection (should be at end of inserted text)
                const currentRange = selection.getRangeAt(0);
                let cursorNode = currentRange.startContainer;
                let cursorPos = currentRange.startOffset;

                if (cursorNode.nodeType === Node.TEXT_NODE && cursorPos >= moveBack) {
                    const finalRange = document.createRange();
                    finalRange.setStart(cursorNode, cursorPos - moveBack);
                    finalRange.setEnd(cursorNode, cursorPos - moveBack);
                    selection.removeAllRanges();
                    selection.addRange(finalRange);
                }
            }

            return true;
        } catch (e) {
            console.error('Overleaf LaTeX Shortcuts: Replace error:', e);
            return false;
        }
    }

    function tryExpandFallback() {
        const textBefore = getTextBeforeCursorFallback();
        if (!textBefore || textBefore.length < 2) return false;

        const inMathMode = isInMathMode(textBefore, textBefore.length);

        // Check for fraction shortcut first (only in math mode)
        if (inMathMode) {
            const fractionMatch = matchFraction(textBefore);
            if (fractionMatch) {
                const replacement = `\\frac{${fractionMatch.numerator}}{${fractionMatch.denominator}}`;
                return replaceTextFallback(fractionMatch.matchLength, replacement, -1);
            }
        }

        // Check for regular snippets
        const match = matchSnippet(textBefore, inMathMode);
        if (match) {
            let replacement = match.snippet.replacement;

            // Handle regex captures [[0]], [[1]], etc.
            if (match.captures && match.captures.length > 0) {
                for (let i = 0; i < match.captures.length; i++) {
                    replacement = replacement.replace(new RegExp(`\\[\\[${i}\\]\\]`, 'g'), match.captures[i]);
                }
            }

            // Process tabstops
            const { text, cursorOffset } = processReplacement(replacement);

            return replaceTextFallback(match.matchLength, text, cursorOffset);
        }

        return false;
    }

    // ========================================
    // MATH MODE DETECTION
    // ========================================
    function isInMathMode(text, cursorPos) {
        const textBefore = text.substring(0, cursorPos);

        // Check for display math \[ ... \]
        const displayMathStart = textBefore.lastIndexOf('\\[');
        const displayMathEnd = textBefore.lastIndexOf('\\]');
        if (displayMathStart > displayMathEnd) {
            return true;
        }

        // Check for inline math $ ... $ (not $$)
        // Count unescaped $ signs
        let dollarCount = 0;
        let doubleDollarCount = 0;
        let i = 0;
        while (i < textBefore.length) {
            if (textBefore[i] === '\\' && i + 1 < textBefore.length) {
                i += 2; // Skip escaped character
                continue;
            }
            if (textBefore[i] === '$') {
                if (i + 1 < textBefore.length && textBefore[i + 1] === '$') {
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
        const mathEnvs = ['equation', 'align', 'gather', 'multline', 'eqnarray',
                         'equation\\*', 'align\\*', 'gather\\*', 'multline\\*'];

        for (const env of mathEnvs) {
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

    // ========================================
    // SNIPPET MATCHING
    // ========================================
    function matchSnippet(textBefore, inMathMode) {
        // Sort by priority (higher priority first), then by trigger length (longer first)
        const sortedSnippets = [...snippets].sort((a, b) => {
            const prioA = a.priority || 0;
            const prioB = b.priority || 0;
            if (prioB !== prioA) return prioB - prioA;
            // For string triggers, sort by length
            const lenA = typeof a.trigger === 'string' ? a.trigger.length : 0;
            const lenB = typeof b.trigger === 'string' ? b.trigger.length : 0;
            return lenB - lenA;
        });

        for (const snippet of sortedSnippets) {
            const opts = snippet.options || '';
            const needsMath = opts.includes('m') || opts.includes('M');
            const needsText = opts.includes('t');
            const isRegexOption = opts.includes('r');
            const needsWordBoundary = opts.includes('w');

            // Check mode requirements
            if (needsMath && !inMathMode) continue;
            if (needsText && inMathMode) continue;

            // Skip function replacements for now (not supported in this version)
            if (typeof snippet.replacement === 'function') continue;

            let match = null;
            let matchLength = 0;
            let captures = [];

            const trigger = snippet.trigger;
            const isRegExp = trigger instanceof RegExp;

            if (isRegExp || isRegexOption) {
                // Handle both RegExp objects and string patterns with 'r' option
                let regex;
                if (isRegExp) {
                    // Convert RegExp to string and wrap for end-of-string matching
                    const source = trigger.source;
                    regex = new RegExp('(' + source + ')$');
                } else {
                    regex = new RegExp('(' + trigger + ')$');
                }

                match = textBefore.match(regex);
                if (match) {
                    matchLength = match[1].length;
                    // Capture groups for replacement (skip the full match and first group)
                    captures = match.slice(2);
                }
            } else if (typeof trigger === 'string') {
                // Plain text trigger
                if (textBefore.endsWith(trigger)) {
                    // Check word boundary if required
                    if (needsWordBoundary) {
                        const charBefore = textBefore[textBefore.length - trigger.length - 1];
                        if (charBefore && /\w/.test(charBefore)) {
                            continue;
                        }
                    }
                    match = true;
                    matchLength = trigger.length;
                }
            }

            if (match) {
                return {
                    snippet,
                    matchLength,
                    captures
                };
            }
        }

        return null;
    }

    // ========================================
    // FRACTION SHORTCUT (x/y -> \frac{x}{y})
    // ========================================
    function matchFraction(textBefore) {
        // Match patterns like: a/b, x/y, 123/456, (a+b)/c, etc.
        // Simple version: single char or number / single char or number
        const simpleMatch = textBefore.match(/([a-zA-Z0-9])\/([a-zA-Z0-9])$/);
        if (simpleMatch) {
            return {
                matchLength: 3,
                numerator: simpleMatch[1],
                denominator: simpleMatch[2]
            };
        }

        // Parenthesized numerator: (...)/(...)
        const parenMatch = textBefore.match(/\(([^()]+)\)\/\(([^()]+)\)$/);
        if (parenMatch) {
            return {
                matchLength: parenMatch[0].length,
                numerator: parenMatch[1],
                denominator: parenMatch[2]
            };
        }

        // Parenthesized numerator only: (...)/x
        const parenNumMatch = textBefore.match(/\(([^()]+)\)\/([a-zA-Z0-9])$/);
        if (parenNumMatch) {
            return {
                matchLength: parenNumMatch[0].length,
                numerator: parenNumMatch[1],
                denominator: parenNumMatch[2]
            };
        }

        // Parenthesized denominator only: x/(...)
        const parenDenMatch = textBefore.match(/([a-zA-Z0-9])\/\(([^()]+)\)$/);
        if (parenDenMatch) {
            return {
                matchLength: parenDenMatch[0].length,
                numerator: parenDenMatch[1],
                denominator: parenDenMatch[2]
            };
        }

        return null;
    }

    // ========================================
    // TABSTOP HANDLING
    // ========================================
    function processReplacement(replacement) {
        let result = replacement;
        let cursorOffset = -1; // -1 means cursor at end

        // Remove ${VISUAL} placeholder (used for visual selections in original Latex Suite)
        // We don't support visual selections, so just remove it
        result = result.replace(/\$\{VISUAL\}/g, '');

        // Process ${n:default} style tabstops
        // Replace them with their default values
        result = result.replace(/\$\{(\d+):([^}]+)\}/g, (match, num, defaultVal) => {
            return defaultVal;
        });

        // Find $0 position (this is where cursor should go)
        const dollar0Match = result.match(/\$0/);
        if (dollar0Match) {
            cursorOffset = dollar0Match.index;
        }

        // Remove all $n markers
        result = result.replace(/\$(\d+)/g, '');

        return { text: result, cursorOffset };
    }

    // ========================================
    // EXPANSION LOGIC
    // ========================================
    function tryExpand(view) {
        if (!view) return false;

        const textBefore = getTextBeforeCursor(view);
        if (!textBefore) return false;

        const cursorPos = getCursorPos(view);
        const inMathMode = isInMathMode(textBefore, textBefore.length);

        // Check for fraction shortcut first (only in math mode)
        if (inMathMode) {
            const fractionMatch = matchFraction(textBefore);
            if (fractionMatch) {
                const replacement = `\\frac{${fractionMatch.numerator}}{${fractionMatch.denominator}}`;
                const from = cursorPos - fractionMatch.matchLength;
                replaceTextInEditor(view, from, cursorPos, replacement, -1);
                return true;
            }
        }

        // Check for regular snippets
        const match = matchSnippet(textBefore, inMathMode);
        if (match) {
            let replacement = match.snippet.replacement;

            // Handle regex captures [[0]], [[1]], etc.
            if (match.captures && match.captures.length > 0) {
                for (let i = 0; i < match.captures.length; i++) {
                    replacement = replacement.replace(new RegExp(`\\[\\[${i}\\]\\]`, 'g'), match.captures[i]);
                }
            }

            // Process tabstops
            const { text, cursorOffset } = processReplacement(replacement);

            const from = cursorPos - match.matchLength;
            replaceTextInEditor(view, from, cursorPos, text, cursorOffset);
            return true;
        }

        return false;
    }

    // ========================================
    // KEYBOARD HANDLING
    // ========================================
    function handleKeyUp(e) {
        // Skip if we just did an expansion (prevent cascading)
        if (expansionCooldown) {
            return;
        }

        // Skip pure modifier key presses
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
            return;
        }

        // Skip navigation keys that don't produce text
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
             'Home', 'End', 'PageUp', 'PageDown',
             'Escape', 'Tab', 'Enter', 'F1', 'F2', 'F3', 'F4',
             'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
            return;
        }

        // Small delay to let the editor update its state
        setTimeout(() => {
            let expanded = false;

            if (useFallback) {
                expanded = tryExpandFallback();
            } else if (editorView) {
                expanded = tryExpand(editorView);
            } else {
                // Try to find view again
                editorView = findEditorView();
                if (editorView) {
                    expanded = tryExpand(editorView);
                } else {
                    // Use fallback
                    expanded = tryExpandFallback();
                }
            }

            // If we expanded something, set cooldown to prevent cascading
            if (expanded) {
                expansionCooldown = true;
                setTimeout(() => {
                    expansionCooldown = false;
                }, 50); // 50ms cooldown
            }
        }, 10);
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        console.log('Overleaf LaTeX Shortcuts: Initializing...');

        // Wait for the editor to be ready
        let attempts = 0;
        const checkEditor = setInterval(() => {
            attempts++;
            const cmEditor = document.querySelector('.cm-editor');

            if (cmEditor) {
                // Debug: Log what properties exist on the element
                if (attempts === 1) {
                    console.log('Overleaf LaTeX Shortcuts: Found .cm-editor element');
                    console.log('  - Regular properties:', Object.keys(cmEditor).slice(0, 10));
                    console.log('  - Symbol properties:', Object.getOwnPropertySymbols(cmEditor).length);
                }

                editorView = findEditorView();

                if (editorView) {
                    clearInterval(checkEditor);
                    console.log('Overleaf LaTeX Shortcuts: EditorView found! Using CM6 API.');
                    console.log('  - Has state:', !!editorView.state);
                    console.log('  - Has dispatch:', !!editorView.dispatch);
                    setupListeners(cmEditor);
                } else if (attempts >= 10) {
                    // After 5 seconds, switch to fallback mode
                    clearInterval(checkEditor);
                    useFallback = true;
                    console.log('Overleaf LaTeX Shortcuts: EditorView not found, using fallback mode.');
                    console.log('  - Fallback uses DOM manipulation with execCommand');
                    setupListeners(cmEditor);
                } else if (attempts <= 3) {
                    console.log('Overleaf LaTeX Shortcuts: Attempt', attempts, '- searching for EditorView...');
                }
            }
        }, 500);

        // Final timeout after 30 seconds
        setTimeout(() => {
            clearInterval(checkEditor);
            const cmEditor = document.querySelector('.cm-editor');
            if (cmEditor && !editorView && !useFallback) {
                useFallback = true;
                console.log('Overleaf LaTeX Shortcuts: Final timeout, using fallback mode.');
                setupListeners(cmEditor);
            }
        }, 30000);
    }

    function setupListeners(cmEditor) {
        // Attach keyup listener to the editor
        cmEditor.addEventListener('keyup', handleKeyUp, true);

        // Also try document-level listener as backup
        document.addEventListener('keyup', (e) => {
            if (e.target.closest && e.target.closest('.cm-editor')) {
                handleKeyUp(e);
            }
        }, true);

        console.log('Overleaf LaTeX Shortcuts: Ready!');
        console.log('  - Try typing "@a" inside math mode: $@a$');
        console.log('  - The @a should become \\alpha');
        console.log('  - Run window.testSnippets() in console to test snippet matching');
    }

    // ========================================
    // TEST FUNCTION (run from browser console)
    // ========================================
    window.testSnippets = function() {
        const testCases = [
            // [input text before cursor, expected match trigger, expected output, is math mode]
            { input: '$@a', inMath: true, expectTrigger: '@a', expectOutput: '\\alpha' },
            { input: '$@b', inMath: true, expectTrigger: '@b', expectOutput: '\\beta' },
            { input: '$gamma', inMath: true, expectTrigger: 'gamma', expectOutput: '\\gamma' },
            { input: '$pi', inMath: true, expectTrigger: 'pi', expectOutput: '\\pi' },
            { input: '$Delta', inMath: true, expectTrigger: 'Delta', expectOutput: '\\Delta' },
            { input: '$rd', inMath: true, expectTrigger: 'rd', expectOutput: '^{}' },
            { input: '$sr', inMath: true, expectTrigger: 'sr', expectOutput: '^{2}' },
            { input: '$sq', inMath: true, expectTrigger: 'sq', expectOutput: '\\sqrt{  }' },
            { input: '$Hhat', inMath: true, expectTrigger: /Hhat/, expectOutput: '\\hat{H}' },
            { input: '$xbar', inMath: true, expectTrigger: /xbar/, expectOutput: '\\bar{x}' },
            { input: '$ooo', inMath: true, expectTrigger: 'ooo', expectOutput: '\\infty' },
            { input: '$RR', inMath: true, expectTrigger: 'RR', expectOutput: '\\mathbb{R}' },
            { input: 'text without math @a', inMath: false, expectTrigger: null, expectOutput: null },
        ];

        console.log('=== Snippet Test Results ===');
        let passed = 0;
        let failed = 0;

        for (const tc of testCases) {
            const match = matchSnippet(tc.input, tc.inMath);

            if (tc.expectTrigger === null) {
                // Expect no match
                if (match === null) {
                    console.log(`✓ PASS: "${tc.input}" (no math) -> no match`);
                    passed++;
                } else {
                    console.log(`✗ FAIL: "${tc.input}" (no math) -> expected no match, got "${match.snippet.trigger}"`);
                    failed++;
                }
                continue;
            }

            if (match === null) {
                console.log(`✗ FAIL: "${tc.input}" -> expected match for "${tc.expectTrigger}", got no match`);
                failed++;
                continue;
            }

            // Check if trigger matches
            const triggerMatches = tc.expectTrigger instanceof RegExp
                ? tc.expectTrigger.test(String(match.snippet.trigger))
                : String(match.snippet.trigger) === tc.expectTrigger;

            if (!triggerMatches) {
                console.log(`✗ FAIL: "${tc.input}" -> expected trigger "${tc.expectTrigger}", got "${match.snippet.trigger}"`);
                failed++;
                continue;
            }

            // Process the replacement
            let replacement = match.snippet.replacement;
            if (match.captures && match.captures.length > 0) {
                for (let i = 0; i < match.captures.length; i++) {
                    replacement = replacement.replace(new RegExp(`\\[\\[${i}\\]\\]`, 'g'), match.captures[i]);
                }
            }
            const { text } = processReplacement(replacement);

            if (text === tc.expectOutput) {
                console.log(`✓ PASS: "${tc.input}" -> "${text}"`);
                passed++;
            } else {
                console.log(`✗ FAIL: "${tc.input}" -> expected "${tc.expectOutput}", got "${text}"`);
                failed++;
            }
        }

        console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);
        return { passed, failed };
    };

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
