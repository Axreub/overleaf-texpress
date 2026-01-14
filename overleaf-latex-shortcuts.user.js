// ==UserScript==
// @name         Overleaf LaTeX Shortcuts
// @namespace    https://github.com/overleaf-latex-shortcuts
// @version      1.0.1
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
        {trigger: "\\sum", replacement: "\\sum_{$0}^{$1} $2", options: "m"},
        {trigger: "\\prod", replacement: "\\prod_{$0}^{$1} $2", options: "m"},
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
    // Note: No word boundary (w) required - these only work in math mode anyway
    // This allows "erdipi" to expand the "pi" part even after other characters
    greekLetters.forEach(letter => {
        snippets.push({
            trigger: letter,
            replacement: '\\' + letter,
            options: 'mA', // math mode, auto-expand
            priority: -2   // Lower priority so @a style triggers take precedence
        });
    });

    // Add vareps and varphi shortcuts
    snippets.push({ trigger: 'vareps', replacement: '\\varepsilon', options: 'mA', priority: -1 });
    snippets.push({ trigger: 'varphi', replacement: '\\varphi', options: 'mA', priority: -1 });

    // ========================================
    // DOM-BASED TEXT MANIPULATION
    // ========================================

    function getTextBeforeCursor() {
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

    // Replace text spanning before and after cursor (for bracket wrapping)
    // charsBefore: number of characters before cursor to include
    // charsAfter: number of characters after cursor to include
    function replaceTextRange(charsBefore, charsAfter, replacement, cursorOffset = -1) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;

        try {
            const range = selection.getRangeAt(0);
            let container = range.startContainer;
            let offset = range.startOffset;

            if (container.nodeType !== Node.TEXT_NODE) {
                return false;
            }

            // Get all text nodes in the current line (most brackets are on same line)
            const cmLine = container.parentElement?.closest('.cm-line');
            if (!cmLine) return false;

            const walker = document.createTreeWalker(cmLine, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while ((node = walker.nextNode())) {
                textNodes.push(node);
            }

            const currentIndex = textNodes.indexOf(container);
            if (currentIndex === -1) return false;

            // Calculate start position (go back charsBefore characters)
            let startNode = container;
            let startOffset = offset - charsBefore;

            if (startOffset < 0) {
                let remaining = -startOffset;
                startOffset = 0;
                for (let i = currentIndex - 1; i >= 0 && remaining > 0; i--) {
                    const tn = textNodes[i];
                    if (tn.textContent.length >= remaining) {
                        startNode = tn;
                        startOffset = tn.textContent.length - remaining;
                        remaining = 0;
                    } else {
                        remaining -= tn.textContent.length;
                        startNode = tn;
                        startOffset = 0;
                    }
                }
                if (remaining > 0) {
                    console.log('Cannot go back far enough, remaining:', remaining);
                    return false;
                }
            }

            // Calculate end position (go forward charsAfter characters)
            let endNode = container;
            let endOffset = offset + charsAfter;

            if (endOffset > container.textContent.length) {
                let remaining = endOffset - container.textContent.length;
                for (let i = currentIndex + 1; i < textNodes.length && remaining > 0; i++) {
                    const tn = textNodes[i];
                    if (tn.textContent.length >= remaining) {
                        endNode = tn;
                        endOffset = remaining;
                        remaining = 0;
                    } else {
                        remaining -= tn.textContent.length;
                    }
                }
                if (remaining > 0) {
                    console.log('Cannot go forward far enough, remaining:', remaining);
                    return false;
                }
            }

            // Create selection range and replace
            const newRange = document.createRange();
            newRange.setStart(startNode, startOffset);
            newRange.setEnd(endNode, endOffset);

            selection.removeAllRanges();
            selection.addRange(newRange);

            document.execCommand('insertText', false, replacement);

            // Position cursor if specified
            if (cursorOffset >= 0 && cursorOffset < replacement.length) {
                const currentRange = selection.getRangeAt(0);
                let cursorNode = currentRange.startContainer;
                let cursorPos = currentRange.startOffset;

                if (cursorNode.nodeType === Node.TEXT_NODE) {
                    const moveBack = replacement.length - cursorOffset;
                    if (cursorPos >= moveBack) {
                        const finalRange = document.createRange();
                        finalRange.setStart(cursorNode, cursorPos - moveBack);
                        finalRange.setEnd(cursorNode, cursorPos - moveBack);
                        selection.removeAllRanges();
                        selection.addRange(finalRange);
                    }
                }
            }

            return true;
        } catch (e) {
            console.error('Overleaf LaTeX Shortcuts: replaceTextRange error:', e);
            return false;
        }
    }

    function replaceText(matchLength, replacement, cursorOffset = -1) {
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
                let moveBack = replacement.length - cursorOffset;

                // Get current selection (should be at end of inserted text)
                const currentRange = selection.getRangeAt(0);
                let cursorNode = currentRange.startContainer;
                let cursorPos = currentRange.startOffset;

                // Handle multi-line replacements: walk backwards through nodes
                if (cursorNode.nodeType === Node.TEXT_NODE) {
                    if (cursorPos >= moveBack) {
                        // Simple case: cursor offset is within current node
                        const finalRange = document.createRange();
                        finalRange.setStart(cursorNode, cursorPos - moveBack);
                        finalRange.setEnd(cursorNode, cursorPos - moveBack);
                        selection.removeAllRanges();
                        selection.addRange(finalRange);
                    } else {
                        // Multi-line case: need to traverse backwards through nodes
                        moveBack -= cursorPos;

                        // Get all text nodes in cm-content and find our position
                        const cmContent = document.querySelector('.cm-content');
                        if (cmContent) {
                            const allTextNodes = [];
                            const walker = document.createTreeWalker(cmContent, NodeFilter.SHOW_TEXT, null, false);
                            let node;
                            while ((node = walker.nextNode())) {
                                allTextNodes.push(node);
                            }

                            // Find index of current node
                            const currentIndex = allTextNodes.indexOf(cursorNode);

                            // Walk backwards
                            for (let i = currentIndex - 1; i >= 0 && moveBack > 0; i--) {
                                const tn = allTextNodes[i];
                                const len = tn.textContent.length;
                                // Account for newline between nodes (cm-line elements)
                                moveBack--; // for the newline
                                if (moveBack <= len) {
                                    const finalRange = document.createRange();
                                    finalRange.setStart(tn, len - moveBack);
                                    finalRange.setEnd(tn, len - moveBack);
                                    selection.removeAllRanges();
                                    selection.addRange(finalRange);
                                    break;
                                }
                                moveBack -= len;
                            }
                        }
                    }
                }
            }

            return true;
        } catch (e) {
            console.error('Overleaf LaTeX Shortcuts: Replace error:', e);
            return false;
        }
    }

    function tryExpand() {
        const textBefore = getTextBeforeCursor();
        if (!textBefore || textBefore.length < 2) return false;

        const textAfter = getTextAfterCursor(50);
        const inMathMode = isInMathMode(textBefore, textBefore.length);

        // Check for fraction shortcut first (only in math mode)
        if (inMathMode) {
            const fractionMatch = matchFraction(textBefore);
            if (fractionMatch) {
                let replacement = `\\frac{${fractionMatch.numerator}}{${fractionMatch.denominator}}`;

                // Check for enclosing brackets to add \left \right
                const textBeforeMatch = textBefore.substring(0, textBefore.length - fractionMatch.matchLength);
                const brackets = findEnclosingBrackets(textBeforeMatch, textAfter);

                if (brackets) {
                    // Calculate chars from cursor to opening bracket
                    // brackets.openIndex is position in textBeforeMatch, need distance from end
                    const distanceToOpen = textBeforeMatch.length - brackets.openIndex;
                    const charsBefore = fractionMatch.matchLength + distanceToOpen;
                    const charsAfter = brackets.closeIndex + 1;

                    if (brackets.openBracket === '\\{') {
                        const wrapped = `\\left\\{ ${replacement} \\right\\}`;
                        // Cursor after the content: \left\{ + space + replacement
                        const cursorPos = 8 + replacement.length;
                        return replaceTextRange(charsBefore + 1, charsAfter + 1, wrapped, cursorPos);
                    } else {
                        const wrapped = `\\left${brackets.openBracket} ${replacement} \\right${brackets.closeBracket}`;
                        // Cursor after the content: \left( + space + replacement
                        const cursorPos = 7 + replacement.length;
                        return replaceTextRange(charsBefore, charsAfter, wrapped, cursorPos);
                    }
                }

                return replaceText(fractionMatch.matchLength, replacement, -1);
            }
        }

        // Check for regular snippets
        const match = matchSnippet(textBefore, inMathMode, textAfter);
        if (match) {
            let replacement = match.snippet.replacement;

            // Handle regex captures [[0]], [[1]], etc.
            if (match.captures && match.captures.length > 0) {
                for (let i = 0; i < match.captures.length; i++) {
                    replacement = replacement.replace(new RegExp(`\\[\\[${i}\\]\\]`, 'g'), match.captures[i]);
                }
            }

            // Check for big operators that should get \left \right when inside brackets
            const triggerStr = String(match.snippet.trigger);
            const bigOps = ['sum', 'prod', 'int', 'lim', 'oint', 'iint', 'iiint', 'bigcup', 'bigcap'];
            const isBigOp = bigOps.some(op => triggerStr === op || triggerStr.endsWith(op));

            if (isBigOp && inMathMode) {
                const textBeforeMatch = textBefore.substring(0, textBefore.length - match.matchLength);
                const brackets = findEnclosingBrackets(textBeforeMatch, textAfter);

                if (brackets) {
                    // Calculate chars from cursor to opening bracket
                    const distanceToOpen = textBeforeMatch.length - brackets.openIndex;
                    const charsBefore = match.matchLength + distanceToOpen;
                    const charsAfter = brackets.closeIndex + 1;

                    // Process tabstops first
                    const { text: processedReplacement } = processReplacement(replacement);

                    if (brackets.openBracket === '\\{') {
                        const wrappedReplacement = `\\left\\{ ${processedReplacement} \\right\\}`;
                        // Cursor after the content: \left\{ + space + content
                        const cursorPos = 8 + processedReplacement.length;
                        return replaceTextRange(charsBefore + 1, charsAfter + 1, wrappedReplacement, cursorPos);
                    } else {
                        const wrappedReplacement = `\\left${brackets.openBracket} ${processedReplacement} \\right${brackets.closeBracket}`;
                        // Cursor after the content: \left( + space + content
                        const cursorPos = 7 + processedReplacement.length;
                        return replaceTextRange(charsBefore, charsAfter, wrappedReplacement, cursorPos);
                    }
                }
            }

            // Process tabstops
            const { text, cursorOffset } = processReplacement(replacement);

            return replaceText(match.matchLength, text, cursorOffset);
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
    function matchSnippet(textBefore, inMathMode, textAfter = '') {
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
            // if (typeof snippet.replacement === 'function') continue;

            // Skip snippets with unresolved variables like ${GREEK}, ${SYMBOL}
            const triggerStr = snippet.trigger instanceof RegExp ? snippet.trigger.source : String(snippet.trigger);
            if (triggerStr.includes('${GREEK}') || triggerStr.includes('${SYMBOL}') || triggerStr.includes('${MORE_SYMBOLS}')) {
                continue;
            }

            // Skip single-character special triggers that cause issues
            if (typeof snippet.trigger === 'string' && snippet.trigger.length === 1) {
                // Skip quote and caret triggers which are problematic
                if ('"\'^'.includes(snippet.trigger)) {
                    continue;
                }
                // For bracket triggers, only expand if NOT already followed by matching close bracket
                // This prevents re-expansion when user deletes closing bracket or edits existing brackets
                const bracketPairs = { '(': ')', '[': ']', '{': '}' };
                if (bracketPairs[snippet.trigger] && textAfter.length > 0) {
                    const expectedClose = bracketPairs[snippet.trigger];
                    if (textAfter[0] === expectedClose) {
                        // Already has closing bracket, don't expand
                        continue;
                    }
                }
            }

            // Skip snippets with ${VISUAL} - visual mode not supported
            if (typeof snippet.replacement === 'string' && snippet.replacement.includes('${VISUAL}')) {
                continue;
            }

            let match = null;
            let matchLength = 0;
            let captures = [];

            const trigger = snippet.trigger;
            const isRegExp = trigger instanceof RegExp;

            if (isRegExp || isRegexOption) {
                // Handle both RegExp objects and string patterns with 'r' option
                let regex;
                try {
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
                } catch (e) {
                    // Invalid regex, skip this snippet
                    continue;
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

                    // Prevent double backslash: if replacement starts with backslash
                    // and there's already a backslash before the trigger, skip
                    const replacementStr = typeof snippet.replacement === 'string' ? snippet.replacement : '';
                    if (replacementStr.startsWith('\\')) {
                        const charBefore = textBefore[textBefore.length - trigger.length - 1];
                        if (charBefore === '\\') {
                            // Already has a backslash, skip to prevent \\command
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
        // But NOT if the numerator is part of a LaTeX command like \pi

        // First, try to match LaTeX command as numerator: \cmd/x or \cmd{...}/x
        // Match \command/denominator (e.g., \pi/2 -> \frac{\pi}{2})
        const latexCmdMatch = textBefore.match(/(\\[a-zA-Z]+)\/([a-zA-Z0-9])$/);
        if (latexCmdMatch) {
            return {
                matchLength: latexCmdMatch[0].length,
                numerator: latexCmdMatch[1],
                denominator: latexCmdMatch[2]
            };
        }

        // Match \command{arg}/denominator (e.g., \hat{H}/2 -> \frac{\hat{H}}{2})
        const latexCmdWithArgMatch = textBefore.match(/(\\[a-zA-Z]+\{[^}]+\})\/([a-zA-Z0-9])$/);
        if (latexCmdWithArgMatch) {
            return {
                matchLength: latexCmdWithArgMatch[0].length,
                numerator: latexCmdWithArgMatch[1],
                denominator: latexCmdWithArgMatch[2]
            };
        }

        // Simple version: single char or number / single char or number
        // But check that the char before numerator is not a backslash or letter (part of command)
        const simpleMatch = textBefore.match(/([a-zA-Z0-9])\/([a-zA-Z0-9])$/);
        if (simpleMatch) {
            // Check character before the numerator
            const charBeforeNumerator = textBefore[textBefore.length - 4]; // char before "x/y"
            // If it's a backslash or letter, this might be part of a LaTeX command - skip
            if (charBeforeNumerator && /[a-zA-Z\\]/.test(charBeforeNumerator)) {
                return null;
            }
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

        // Find $0 position and mark it with a unique placeholder
        // This ensures cursor position is calculated correctly after other $n markers are removed
        const cursorPlaceholder = '\u200B\u200B\u200B'; // Zero-width spaces as unique marker
        result = result.replace(/\$0/, cursorPlaceholder);

        // Remove all other $n markers
        result = result.replace(/\$(\d+)/g, '');

        // Now find where the cursor placeholder is and calculate offset
        const placeholderIndex = result.indexOf(cursorPlaceholder);
        if (placeholderIndex !== -1) {
            cursorOffset = placeholderIndex;
            // Remove the placeholder
            result = result.replace(cursorPlaceholder, '');
        }

        return { text: result, cursorOffset };
    }

    // ========================================
    // BRACKET DETECTION FOR AUTO \left \right
    // ========================================
    // Searches backwards through text to find an unmatched opening bracket
    // Returns { openBracket, openIndex, closeBracket } or null
    function findEnclosingBrackets(textBefore, textAfter) {
        const pairs = { '(': ')', '[': ']' };
        const openBrackets = ['(', '['];
        const closeBrackets = [')', ']'];

        // Stack to track bracket nesting
        // We scan backwards through textBefore
        let stack = [];

        for (let i = textBefore.length - 1; i >= 0; i--) {
            const char = textBefore[i];

            if (closeBrackets.includes(char)) {
                // Found a closing bracket, push to stack
                stack.push(char);
            } else if (openBrackets.includes(char)) {
                // Found an opening bracket
                if (stack.length > 0 && pairs[char] === stack[stack.length - 1]) {
                    // This matches a closing bracket we saw, pop it
                    stack.pop();
                } else {
                    // This is an unmatched opening bracket!
                    // Now check if textAfter has the matching closing bracket
                    const expectedClose = pairs[char];

                    // Scan forward through textAfter to find matching close
                    let depth = 1;
                    for (let j = 0; j < textAfter.length && depth > 0; j++) {
                        const afterChar = textAfter[j];
                        if (afterChar === char) {
                            depth++;
                        } else if (afterChar === expectedClose) {
                            depth--;
                            if (depth === 0) {
                                // Found the matching close!
                                return {
                                    openBracket: char,
                                    openIndex: i,
                                    closeBracket: expectedClose,
                                    closeIndex: j
                                };
                            }
                        }
                    }
                    // No matching close found, continue searching backwards
                }
            }
        }

        // Also check for \{ ... \} pattern
        for (let i = textBefore.length - 1; i >= 1; i--) {
            if (textBefore[i] === '{' && textBefore[i - 1] === '\\') {
                // Found \{, check for \} in textAfter
                for (let j = 0; j < textAfter.length - 1; j++) {
                    if (textAfter[j] === '\\' && textAfter[j + 1] === '}') {
                        return {
                            openBracket: '\\{',
                            openIndex: i - 1,
                            closeBracket: '\\}',
                            closeIndex: j
                        };
                    }
                }
            }
        }

        return null;
    }

    // ========================================
    // KEYBOARD HANDLING
    // ========================================
    let lastProcessedEvent = null;

    function handleKeyUp(e) {
        // Prevent processing the same event twice (from both cm and document listeners)
        if (lastProcessedEvent === e) {
            return;
        }
        lastProcessedEvent = e;

        // Skip if we just did an expansion (prevent cascading)
        if (expansionCooldown) {
            return;
        }

        // Skip pure modifier key presses
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
            return;
        }

        // Skip navigation and deletion keys that don't produce new text
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
             'Home', 'End', 'PageUp', 'PageDown',
             'Escape', 'Tab', 'Enter', 'F1', 'F2', 'F3', 'F4',
             'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
             'Backspace', 'Delete'].includes(e.key)) {
            return;
        }

        // Set cooldown immediately to prevent any cascading during this expansion
        expansionCooldown = true;

        // Small delay to let the editor update its state
        setTimeout(() => {
            const expanded = tryExpand();

            // Reset cooldown after a delay (longer if we expanded)
            setTimeout(() => {
                expansionCooldown = false;
            }, expanded ? 100 : 20);
        }, 10);
    }

    function getTextAfterCursor(length = 1) {
        const selection = window.getSelection();
        if (!selection.rangeCount || !selection.isCollapsed) return '';

        const range = selection.getRangeAt(0);
        let container = range.startContainer;
        let offset = range.startOffset;

        if (container.nodeType === Node.TEXT_NODE) {
            // Get text after cursor in current node
            const textAfter = container.textContent.substring(offset, offset + length);
            if (textAfter.length >= length) {
                return textAfter;
            }
            // Need to look at next text node
            const cmLine = container.parentElement?.closest('.cm-line');
            if (cmLine) {
                const walker = document.createTreeWalker(cmLine, NodeFilter.SHOW_TEXT, null, false);
                let node;
                let foundCurrent = false;
                let result = textAfter;
                while ((node = walker.nextNode()) && result.length < length) {
                    if (node === container) {
                        foundCurrent = true;
                        continue;
                    }
                    if (foundCurrent) {
                        result += node.textContent.substring(0, length - result.length);
                    }
                }
                return result;
            }
            return textAfter;
        }
        return '';
    }

    function moveCursorForward(chars = 1) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;

        const range = selection.getRangeAt(0);
        let container = range.startContainer;
        let offset = range.startOffset;

        if (container.nodeType === Node.TEXT_NODE) {
            const remaining = container.textContent.length - offset;
            if (remaining >= chars) {
                // Simple case: can move within current node
                const newRange = document.createRange();
                newRange.setStart(container, offset + chars);
                newRange.setEnd(container, offset + chars);
                selection.removeAllRanges();
                selection.addRange(newRange);
                return true;
            } else {
                // Need to move to next text node
                let toMove = chars - remaining;
                const cmLine = container.parentElement?.closest('.cm-line');
                if (cmLine) {
                    const walker = document.createTreeWalker(cmLine, NodeFilter.SHOW_TEXT, null, false);
                    let node;
                    let foundCurrent = false;
                    while ((node = walker.nextNode())) {
                        if (node === container) {
                            foundCurrent = true;
                            continue;
                        }
                        if (foundCurrent) {
                            if (node.textContent.length >= toMove) {
                                const newRange = document.createRange();
                                newRange.setStart(node, toMove);
                                newRange.setEnd(node, toMove);
                                selection.removeAllRanges();
                                selection.addRange(newRange);
                                return true;
                            }
                            toMove -= node.textContent.length;
                        }
                    }
                }
            }
        }
        return false;
    }

    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            // Check if we are inside brackets and should jump out
            const textAfter = getTextAfterCursor(1);
            if (textAfter && /[)\]}]/.test(textAfter[0])) {
                e.preventDefault();
                e.stopPropagation();
                moveCursorForward(1);
                return;
            }
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        console.log('Overleaf LaTeX Shortcuts: Initializing...');

        // Wait for the editor to be ready
        const checkEditor = setInterval(() => {
            const cmEditor = document.querySelector('.cm-editor');

            if (cmEditor) {
                clearInterval(checkEditor);
                console.log('Overleaf LaTeX Shortcuts: Editor found, setting up listeners.');
                setupListeners(cmEditor);
            }
        }, 500);

        // Final timeout after 30 seconds
        setTimeout(() => {
            clearInterval(checkEditor);
            const cmEditor = document.querySelector('.cm-editor');
            if (cmEditor) {
                console.log('Overleaf LaTeX Shortcuts: Final timeout, setting up listeners.');
                setupListeners(cmEditor);
            }
        }, 30000);
    }

    function setupListeners(cmEditor) {
        // Attach keyup listener to the editor
        cmEditor.addEventListener('keyup', handleKeyUp, true);
        cmEditor.addEventListener('keydown', handleKeyDown, true);

        // Also try document-level listener as backup
        document.addEventListener('keyup', (e) => {
            if (e.target.closest && e.target.closest('.cm-editor')) {
                handleKeyUp(e);
            }
        }, true);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && e.target.closest && e.target.closest('.cm-editor')) {
                handleKeyDown(e);
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
            // [input text before cursor, expected output, is math mode]
            { input: '$@a', inMath: true, expectOutput: '\\alpha' },
            { input: '$@b', inMath: true, expectOutput: '\\beta' },
            { input: '$gamma', inMath: true, expectOutput: '\\gamma' },
            { input: '$pi', inMath: true, expectOutput: '\\pi' },
            { input: '$Delta', inMath: true, expectOutput: '\\Delta' },
            { input: '$erd', inMath: true, expectOutput: '^{}', expectMatch: 'rd' }, // Should match 'rd', not 'erd'
            { input: '$rd', inMath: true, expectOutput: '^{}' },
            { input: '$sr', inMath: true, expectOutput: '^{2}' },
            { input: '$sq', inMath: true, expectOutput: '\\sqrt{  }' },
            { input: '$Hhat', inMath: true, expectOutput: '\\hat{H}' },
            { input: '$xbar', inMath: true, expectOutput: '\\bar{x}' },
            { input: '$ooo', inMath: true, expectOutput: '\\infty' },
            { input: '$RR', inMath: true, expectOutput: '\\mathbb{R}' },
            { input: '$e^{', inMath: true, expectOutput: null }, // Should NOT match '{' after expansion
            { input: 'text without math @a', inMath: false, expectOutput: null },
        ];

        console.log('=== Snippet Test Results ===');
        let passed = 0;
        let failed = 0;

        for (const tc of testCases) {
            const match = matchSnippet(tc.input, tc.inMath);

            if (tc.expectOutput === null) {
                // Expect no match
                if (match === null) {
                    console.log(`✓ PASS: "${tc.input}" -> no match (expected)`);
                    passed++;
                } else {
                    console.log(`✗ FAIL: "${tc.input}" -> expected no match, got trigger "${match.snippet.trigger}"`);
                    failed++;
                }
                continue;
            }

            if (match === null) {
                console.log(`✗ FAIL: "${tc.input}" -> expected output "${tc.expectOutput}", got no match`);
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

            const triggerInfo = match.snippet.trigger instanceof RegExp
                ? match.snippet.trigger.source
                : match.snippet.trigger;

            if (text === tc.expectOutput) {
                console.log(`✓ PASS: "${tc.input}" -> "${text}" (trigger: ${triggerInfo})`);
                passed++;
            } else {
                console.log(`✗ FAIL: "${tc.input}" -> expected "${tc.expectOutput}", got "${text}" (trigger: ${triggerInfo})`);
                failed++;
            }
        }

        console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);
        return { passed, failed };
    };

    // Debug function to see what would match for a given input
    window.debugSnippet = function(input, inMath = true) {
        console.log(`\nDebug: "${input}" (math mode: ${inMath})`);
        const match = matchSnippet(input, inMath);
        if (match) {
            console.log('  Matched trigger:', match.snippet.trigger);
            console.log('  Match length:', match.matchLength);
            console.log('  Captures:', match.captures);
            console.log('  Raw replacement:', match.snippet.replacement);

            let replacement = match.snippet.replacement;
            if (match.captures && match.captures.length > 0) {
                for (let i = 0; i < match.captures.length; i++) {
                    replacement = replacement.replace(new RegExp(`\\[\\[${i}\\]\\]`, 'g'), match.captures[i]);
                }
            }
            const { text, cursorOffset } = processReplacement(replacement);
            console.log('  Final text:', text);
            console.log('  Cursor offset:', cursorOffset);
        } else {
            console.log('  No match found');
        }
        return match;
    };

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
