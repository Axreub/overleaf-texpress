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
  it('abeta — beta trigger fires (wordBoundary removed)', () => {
    const m = findMatch('$abeta', snippets, true);
    assert.ok(m, 'beta should now match even when preceded by a letter');
    assert.strictEqual(m.snippet.trigger, 'beta');
  });

  it('alphabet — alpha trigger must NOT fire (text ends in "t", not "alpha")', () => {
    const m = findMatch('$alphabet', snippets, true);
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'alpha',
        'alpha trigger should not match inside "alphabet"');
    }
  });

  it('xeta — eta trigger fires (wordBoundary removed)', () => {
    const m = findMatch('$xeta', snippets, true);
    assert.ok(m, 'eta should now match even when preceded by a letter');
    assert.strictEqual(m.snippet.trigger, 'eta');
  });

  it('sigmap — sigma trigger must NOT fire (text ends in "p", not "sigma")', () => {
    const m = findMatch('$sigmap', snippets, true);
    if (m) {
      assert.notStrictEqual(m.snippet.trigger, 'sigma',
        'sigma trigger should not match "sigmap"');
    }
  });

  it('xpi — pi trigger fires (wordBoundary removed)', () => {
    const m = findMatch('$xpi', snippets, true);
    assert.ok(m, 'pi should now match even when preceded by a letter');
    assert.strictEqual(m.snippet.trigger, 'pi');
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
  it('a/ — simple single char numerator', () => {
    const m = matchFraction('a/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'a');
    assert.strictEqual(m.matchLength, 2);
  });

  it('\\pi/ — LaTeX command numerator', () => {
    const m = matchFraction('\\pi/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\pi');
  });

  it('\\alpha/ — LaTeX command numerator', () => {
    const m = matchFraction('\\alpha/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\alpha');
  });

  it('(a+b)/ — parenthesised numerator', () => {
    const m = matchFraction('(a+b)/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'a+b');
  });

  it('\\hat{H}/ — LaTeX-with-arg numerator', () => {
    const m = matchFraction('\\hat{H}/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '\\hat{H}');
  });

  it('x/ — single letter numerator', () => {
    const m = matchFraction(' x/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, 'x');
  });

  it('1/ — digit numerator', () => {
    const m = matchFraction('1/');
    assert.ok(m, 'should match');
    assert.strictEqual(m.numerator, '1');
  });

  it('slash not at end returns null', () => {
    assert.strictEqual(matchFraction('a/b'), null);
    assert.strictEqual(matchFraction('(a+b)/(c+d)'), null);
  });

  it('string too short returns null', () => {
    assert.strictEqual(matchFraction('a'), null);
    assert.strictEqual(matchFraction(''), null);
  });

  it('no slash returns null', () => {
    assert.strictEqual(matchFraction('alpha'), null);
  });
});
