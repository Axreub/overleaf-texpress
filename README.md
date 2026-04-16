# Overleaf LaTeX Shortcuts

A userscript that adds [Latex Suite](https://github.com/artisticat1/obsidian-latex-suite)-style snippet expansion to Overleaf. Type short triggers and they automatically expand into LaTeX commands.

## Installation

1. Install a userscript manager:
   - **Chrome/Edge**: [Tampermonkey](https://www.tampermonkey.net/)
   - **Firefox**: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey](https://www.tampermonkey.net/)
   - **Safari**: [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)

2. Build the script (see [Building from Source](#building-from-source) below) or download a pre-built release

3. Install the built script (`dist/overleaf-latex-shortcuts.user.js`) by opening it in your browser or creating a new script in Tampermonkey and pasting the contents

4. Open an Overleaf project and start typing!

## Building from Source

**Prerequisites:** Node.js (v16 or later)

```bash
# Clone the repository
git clone https://github.com/yourusername/overleaf-latex-shortcuts.git
cd overleaf-latex-shortcuts

# Install dependencies
npm install

# Build the userscript (output: dist/overleaf-latex-shortcuts.user.js)
npm run build

# Or watch for changes during development
npm run watch
```

**Running Tests:**
```bash
npm test
```

## Features

- **100+ snippets** covering Greek letters, math operations, calculus, physics, quantum mechanics, and more
- **Math mode detection** - snippets only expand when you're inside `$...$`, `$$...$$`, `\[...\]`, or math environments
- **Tabstop navigation** - press Tab to jump between placeholders
- **Regex triggers** - e.g., `Hhat` becomes `\hat{H}` (works with any letter)
- **Fraction shortcut** - `x/y` becomes `\frac{x}{y}`

## Snippet Reference

### Greek Letters
| Trigger | Output | Trigger | Output |
|---------|--------|---------|--------|
| `@a` | `\alpha` | `@b` | `\beta` |
| `@g` | `\gamma` | `@G` | `\Gamma` |
| `@d` | `\delta` | `@D` | `\Delta` |
| `@e` | `\epsilon` | `:e` | `\varepsilon` |
| `@t` | `\theta` | `@T` | `\Theta` |
| `@l` | `\lambda` | `@L` | `\Lambda` |
| `@s` | `\sigma` | `@S` | `\Sigma` |
| `@o` | `\omega` | `@O` | `\Omega` |
| `@f` | `\phi` | `@F` | `\Phi` |
| `@p` | `\pi` | `@P` | `\Pi` |
| ... and more | | | |

### Basic Operations
| Trigger | Output | Description |
|---------|--------|-------------|
| `sr` | `^{2}` | Squared |
| `cb` | `^{3}` | Cubed |
| `rd` | `^{}` | Raise to power (with tabstop) |
| `sq` | `\sqrt{}` | Square root |
| `//` | `\frac{}{}` | Fraction |
| `x/y` | `\frac{x}{y}` | Auto fraction |
| `ee` | `e^{}` | Exponential |
| `invs` | `^{-1}` | Inverse |

### Decorations
Type a letter followed by the decoration name:

| Trigger | Output | Example |
|---------|--------|---------|
| `Xhat` | `\hat{X}` | `Hhat` → `\hat{H}` |
| `Xbar` | `\bar{X}` | `xbar` → `\bar{x}` |
| `Xdot` | `\dot{X}` | `xdot` → `\dot{x}` |
| `Xddot` | `\ddot{X}` | `xddot` → `\ddot{x}` |
| `Xtilde` | `\tilde{X}` | `psi~` → `\tilde{\psi}` |
| `Xvec` | `\vec{X}` | `rvec` → `\vec{r}` |

### Symbols & Relations
| Trigger | Output | Trigger | Output |
|---------|--------|---------|--------|
| `ooo` | `\infty` | `nabl` | `\nabla` |
| `+-` | `\pm` | `-+` | `\mp` |
| `xx` | `\times` | `**` | `\cdot` |
| `!=` | `\neq` | `===` | `\equiv` |
| `>=` | `\geq` | `<=` | `\leq` |
| `>>` | `\gg` | `<<` | `\ll` |
| `->` | `\to` | `=>` | `\implies` |
| `<->` | `\leftrightarrow` | `iff` | `\iff` |
| `...` | `\dots` | | |

### Set Theory & Logic
| Trigger | Output | Trigger | Output |
|---------|--------|---------|--------|
| `inn` | `\in` | `notin` | `\not\in` |
| `sub=` | `\subseteq` | `sup=` | `\supseteq` |
| `and` | `\cap` | `orr` | `\cup` |
| `eset` | `\emptyset` | `set` | `\{...\}` |
| `exists` | `\exists` | `forall` | `\forall` |

### Blackboard & Calligraphic
| Trigger | Output | Trigger | Output |
|---------|--------|---------|--------|
| `RR` | `\mathbb{R}` | `CC` | `\mathbb{C}` |
| `ZZ` | `\mathbb{Z}` | `NN` | `\mathbb{N}` |
| `QQ` | `\mathbb{Q}` | `FF` | `\mathbb{F}` |
| `LL` | `\mathcal{L}` | `HH` | `\mathcal{H}` |

### Calculus
| Trigger | Output |
|---------|--------|
| `par` | `\frac{\partial y}{\partial x}` (with tabstops) |
| `paxy` | `\frac{\partial x}{\partial y}` (regex: any two letters) |
| `ddt` | `\frac{d}{dt}` |
| `ddx` | `\frac{d}{dx}` |
| `dint` | `\int_{0}^{1} ... dx` (definite integral with tabstops) |
| `oint` | `\oint` |
| `iint` | `\iint` |
| `iiint` | `\iiint` |
| `oinf` | `\int_{0}^{\infty}` |
| `infi` | `\int_{-\infty}^{\infty}` |
| `sum` | `\sum_{i=1}^{N}` (with tabstops) |
| `prod` | `\prod_{i=1}^{N}` (with tabstops) |
| `lim` | `\lim_{n \to \infty}` (with tabstops) |

### Environments
| Trigger | Output |
|---------|--------|
| `pmat` | `\begin{pmatrix}...\end{pmatrix}` |
| `bmat` | `\begin{bmatrix}...\end{bmatrix}` |
| `vmat` | `\begin{vmatrix}...\end{vmatrix}` |
| `cases` | `\begin{cases}...\end{cases}` |
| `align` | `\begin{align}...\end{align}` |
| `beg` | `\begin{...}\end{...}` (with tabstops) |

### Brackets
| Trigger | Output |
|---------|--------|
| `lr(` | `\left( ... \right)` |
| `lr[` | `\left[ ... \right]` |
| `lr{` | `\left\{ ... \right\}` |
| `lr\|` | `\left\| ... \right\|` |
| `lra` | `\left< ... \right>` |
| `avg` | `\langle ... \rangle` |
| `norm` | `\lvert ... \rvert` |
| `Norm` | `\lVert ... \rVert` |
| `ceil` | `\lceil ... \rceil` |
| `floor` | `\lfloor ... \rfloor` |

### Physics & Quantum Mechanics
| Trigger | Output |
|---------|--------|
| `hbar` | `\hbar` |
| `dag` | `^{\dagger}` |
| `ket` | `\ket{}` |
| `bra` | `\bra{}` |
| `brk` | `\braket{...\|...}` |
| `outer` | `\ket{\psi}\bra{\psi}` |
| `o+` | `\oplus` |
| `ox` | `\otimes` |
| `kbt` | `k_{B}T` |

### Text Mode
| Trigger | Output | Description |
|---------|--------|-------------|
| `mk` | `$...$` | Enter inline math |
| `dm` | `$$...$$` | Enter display math |

## Tabstop Navigation

Many snippets include tabstops for quick editing:
- After a snippet expands, your cursor is placed at the first tabstop
- Press **Tab** to jump to the next tabstop
- Press **Escape** to exit tabstop mode
- Tabstops with defaults (like `${0:x}`) will select the default text

Example with `sum`:
1. Type `sum` → expands to `\sum_{i=1}^{N}`
2. Cursor is on `i` (first tabstop)
3. Press Tab → cursor moves to `1`
4. Press Tab → cursor moves to `N`
5. Press Tab → cursor moves after the snippet

## Customization

To add or modify snippets, edit the `snippets` array in the script. Each snippet has:
- `trigger`: The text or regex to match
- `replacement`: The LaTeX to insert (use `$0`, `$1` for tabstops, `${0:default}` for defaults)
- `options`: Combination of:
  - `m` = math mode only
  - `t` = text mode only
  - `A` = auto-expand (no Tab needed)
  - `r` = regex trigger
  - `w` = word boundary required

## Troubleshooting

**Snippets not expanding:**
- Make sure you're in math mode for math-only snippets (inside `$...$` or math environments)
- Check the browser console for errors
- Try refreshing the page

**Conflicts with Overleaf shortcuts:**
- Some triggers might conflict with Overleaf's built-in shortcuts
- You can modify the trigger in the script to avoid conflicts

## License

MIT
