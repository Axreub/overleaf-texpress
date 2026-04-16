/**
 * Comprehensive snippet ordering, word-boundary, and fraction tests.
 *
 * These are the regression cases that were previously untested — in particular
 * the "beta → b\eta" class of bugs that only manifest when word-boundary
 * guards are absent or snippet priority ordering is wrong.
 *
 * Run with: npm test
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { findMatch, matchFraction } from '../src/matcher.js';
import { snippets } from '../src/snippets.js';

// ============================================================
// Greek letter ordering regressions
// ============================================================

describe('Greek letter ordering — must not split words', () => {
  it('beta → \\beta (not b + \\eta)', () => {
    const m = findMatch('$beta', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'beta');
    assert.strictEqual(m.snippet.replacement, '\\beta');
  });

  it('theta → \\theta (not th + \\eta)', () => {
    const m = findMatch('$theta', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'theta');
    assert.strictEqual(m.snippet.replacement, '\\theta');
  });

  it('zeta → \\zeta (contains "eta" as suffix)', () => {
    const m = findMatch('$zeta', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'zeta');
    assert.strictEqual(m.snippet.replacement, '\\zeta');
  });

  it('eta alone → \\eta', () => {
    const m = findMatch('$eta', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'eta');
    assert.strictEqual(m.snippet.replacement, '\\eta');
  });

  it('epsilon → \\epsilon', () => {
    const m = findMatch('$epsilon', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'epsilon');
    assert.strictEqual(m.snippet.replacement, '\\epsilon');
  });

  it('upsilon → \\upsilon', () => {
    const m = findMatch('$upsilon', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'upsilon');
    assert.strictEqual(m.snippet.replacement, '\\upsilon');
  });

  it('omega → \\omega', () => {
    const m = findMatch('$omega', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'omega');
    assert.strictEqual(m.snippet.replacement, '\\omega');
  });

  it('sigma → \\sigma', () => {
    const m = findMatch('$sigma', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'sigma');
    assert.strictEqual(m.snippet.replacement, '\\sigma');
  });

  it('lambda → \\lambda', () => {
    const m = findMatch('$lambda', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(m.snippet.trigger, 'lambda');
    assert.strictEqual(m.snippet.replacement, '\\lambda');
  });
});

// ============================================================
// Word-boundary guard — must NOT expand inside a longer word
// ============================================================

describe('word-boundary guard — no match mid-word', () => {
  it('abeta — beta trigger must NOT fire (preceded by "a")', () => {
    const m = findMatch('$abeta', snippets, true);
    // If anything matches, it must not be the bare "beta" trigger
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'beta',
        'beta trigger should not match when preceded by a word character');
    }
  });

  it('alphabet — alpha trigger must NOT fire mid-word', () => {
    const m = findMatch('$alphabet', snippets, true);
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'alpha',
        'alpha trigger should not match inside "alphabet"');
    }
  });

  it('xeta — eta trigger must NOT fire (preceded by "x")', () => {
    const m = findMatch('$xeta', snippets, true);
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'eta',
        'eta trigger should not match inside "xeta"');
    }
  });

  it('sigmap — sigma trigger must NOT fire (preceded by nothing helpful, but "sigmap" ends in "p" not "sigma" — eta not involved, just a regression guard)', () => {
    // "sigmap" ends in "p", so sigma should not match at all
    const m = findMatch('$sigmap', snippets, true);
    // sigma trigger only matches if text ends with "sigma"
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'sigma',
        'sigma trigger should not match "sigmap"');
    }
  });

  it('xpi — pi trigger must NOT fire (preceded by "x")', () => {
    const m = findMatch('$xpi', snippets, true);
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'pi',
        'pi trigger should not match inside "xpi"');
    }
  });
});

// ============================================================
// Backslash guard — \\beta should not re-expand
// ============================================================

describe('backslash guard — already-expanded commands', () => {
  it('\\\\beta — must NOT expand beta again', () => {
    // Text ending in \beta (already a LaTeX command)
    const m = findMatch('$\\beta', snippets, true);
    // The shouldSkipSnippet check prevents expanding when \ precedes the trigger
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'beta',
        'beta should not re-expand when preceded by backslash');
    }
  });

  it('\\\\eta — must NOT expand eta again', () => {
    const m = findMatch('$\\eta', snippets, true);
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'eta',
        'eta should not re-expand when preceded by backslash');
    }
  });
});

// ============================================================
// Decoration snippet priority — letter+decoration vs standalone
// ============================================================

describe('decoration snippet priority', () => {
  it('Hhat → \\hat{H} via regex, not standalone hat', () => {
    const m = findMatch('$Hhat', snippets, true);
    assert.ok(m, 'should find a match');
    assert.ok(m.snippet.trigger instanceof RegExp, 'should use regex trigger');
    assert.deepStrictEqual(m.captures, ['H']);
    assert.strictEqual(m.snippet.replacement, '\\hat{[[0]]}');
  });

  it('xddot → \\ddot{x} via regex (ddot has priority 2, beats dot)', () => {
    const m = findMatch('$xddot', snippets, true);
    assert.ok(m, 'should find a match');
    assert.ok(m.snippet.trigger instanceof RegExp);
    assert.deepStrictEqual(m.captures, ['x']);
    assert.strictEqual(m.snippet.replacement, '\\ddot{[[0]]}');
  });

  it('standalone hat (no preceding letter) → \\hat{$0}', () => {
    const m = findMatch('$hat', snippets, true);
    assert.ok(m, 'should find a match');
    assert.strictEqual(typeof m.snippet.trigger, 'string');
    assert.strictEqual(m.snippet.trigger, 'hat');
  });

  it('xvec → \\vec{x}', () => {
    const m = findMatch('$xvec', snippets, true);
    assert.ok(m, 'should find a match');
    assert.ok(m.snippet.trigger instanceof RegExp);
    assert.deepStrictEqual(m.captures, ['x']);
    assert.strictEqual(m.snippet.replacement, '\\vec{[[0]]}');
  });
});

// ============================================================
// exists trigger (was broken as "e\xi sts")
// ============================================================

describe('exists trigger', () => {
  it('"exists" → \\exists', () => {
    const m = findMatch('$exists', snippets, true);
    assert.ok(m, 'should find a match for "exists"');
    assert.strictEqual(m.snippet.trigger, 'exists');
    assert.strictEqual(m.snippet.replacement, '\\exists');
  });
});

// ============================================================
// matchFraction — backward-scan implementation
// ============================================================

describe('matchFraction — comprehensive cases', () => {
  it('a/b — simple single chars', () => {
    const m = matchFraction('a/b');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'a');
    assert.strictEqual(m.denominator, 'b');
    assert.strictEqual(m.matchLength, 3);
  });

  it('\\pi/2 — LaTeX command / digit', () => {
    const m = matchFraction('\\pi/2');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\pi');
    assert.strictEqual(m.denominator, '2');
  });

  it('\\alpha/\\beta — LaTeX / LaTeX', () => {
    const m = matchFraction('\\alpha/\\beta');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\alpha');
    assert.strictEqual(m.denominator, '\\beta');
  });

  it('(a+b)/c — parenthesised numerator', () => {
    const m = matchFraction('(a+b)/c');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'a+b');
    assert.strictEqual(m.denominator, 'c');
  });

  it('(a+b)/(c+d) — both sides parenthesised', () => {
    const m = matchFraction('(a+b)/(c+d)');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'a+b');
    assert.strictEqual(m.denominator, 'c+d');
  });

  it('\\hat{H}/\\hbar — LaTeX-with-arg / LaTeX', () => {
    const m = matchFraction('\\hat{H}/\\hbar');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\hat{H}');
    assert.strictEqual(m.denominator, '\\hbar');
  });

  it('\\hat{H}/2 — LaTeX-with-arg / digit', () => {
    const m = matchFraction('\\hat{H}/2');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\hat{H}');
    assert.strictEqual(m.denominator, '2');
  });

  it('x/\\sqrt{2} — char / LaTeX-with-arg', () => {
    const m = matchFraction(' x/\\sqrt{2}');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'x');
    assert.strictEqual(m.denominator, '\\sqrt{2}');
  });

  it('\\pi/(a+b) — LaTeX / parenthesised denominator', () => {
    const m = matchFraction('\\pi/(a+b)');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\pi');
    assert.strictEqual(m.denominator, 'a+b');
  });

  it('alpha/b — must NOT match a/b (a is part of alpha)', () => {
    const m = matchFraction('alpha/b');
    // If it matches, it must not have grabbed the final 'a' as a single-char numerator
    if (m) {
      assert.notStrictEqual(m.numerator, 'a',
        'should not split "alpha" to use "a" as numerator');
    }
  });

  it('1/2 — digit / digit', () => {
    const m = matchFraction('1/2');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '1');
    assert.strictEqual(m.denominator, '2');
  });

  it('string too short returns null', () => {
    assert.strictEqual(matchFraction('a'), null);
    assert.strictEqual(matchFraction(''), null);
  });

  it('no slash returns null', () => {
    assert.strictEqual(matchFraction('alpha'), null);
  });
});
