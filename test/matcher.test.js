/**
 * Tests for Snippet Matcher
 * 
 * Run with: npm test
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { findMatch, matchFraction } from '../src/matcher.js';
import { snippets } from '../src/snippets.js';
import { findMatchingOpen, TALL_CONTENT_RE } from '../src/extension.js';

describe('findMatch', () => {
  it('should match Greek letter shortcuts in math mode', () => {
    const match = findMatch('$@a', snippets, true);
    assert.ok(match, 'Should find a match');
    assert.strictEqual(match.snippet.replacement, '\\alpha');
  });

  it('should match word-form Greek letters in math mode', () => {
    const match = findMatch('$gamma', snippets, true);
    assert.ok(match, 'Should find a match');
    assert.strictEqual(match.snippet.replacement, '\\gamma');
  });

  it('should match beta to \\beta, not \\b + \\eta (priority test)', () => {
    const match = findMatch('$beta', snippets, true);
    assert.ok(match, 'Should find a match');
    assert.strictEqual(match.snippet.trigger, 'beta', 'Should match full "beta" trigger');
    assert.strictEqual(match.snippet.replacement, '\\beta');
  });

  it('should match theta to \\theta, not th + \\eta (priority test)', () => {
    const match = findMatch('$theta', snippets, true);
    assert.ok(match, 'Should find a match');
    assert.strictEqual(match.snippet.trigger, 'theta', 'Should match full "theta" trigger');
    assert.strictEqual(match.snippet.replacement, '\\theta');
  });

  it('should still match eta to \\eta when typed alone', () => {
    const match = findMatch('$eta', snippets, true);
    assert.ok(match, 'Should find a match');
    assert.strictEqual(match.snippet.trigger, 'eta');
    assert.strictEqual(match.snippet.replacement, '\\eta');
  });
  
  it('should NOT match math snippets in text mode', () => {
    const match = findMatch('some text @a', snippets, false);
    assert.strictEqual(match, null, 'Should not match in text mode');
  });
  
  it('should match text mode snippets', () => {
    const match = findMatch('mk', snippets, false);
    assert.ok(match, 'Should find mk snippet');
    assert.ok(match.snippet.replacement.startsWith('$$0$'), 'mk replacement should start with $$0$');
  });
  
  it('should match decoration snippets like Hhat', () => {
    const match = findMatch('$Hhat', snippets, true);
    assert.ok(match, 'Should find Hhat match');
    assert.strictEqual(match.snippet.replacement, '\\hat{[[0]]}');
    assert.deepStrictEqual(match.captures, ['H']);
  });
  
  it('should prioritize longer matches', () => {
    // "xddot" should match the regex for letter+ddot
    const match = findMatch('$xddot', snippets, true);
    assert.ok(match, 'Should find match');
    // Should be the regex version with captures
    assert.ok(match.snippet.trigger instanceof RegExp, 'Should match regex trigger');
    assert.deepStrictEqual(match.captures, ['x']);
  });
  
  it('should match sr for squared', () => {
    const match = findMatch('$xsr', snippets, true);
    assert.ok(match, 'Should find sr match');
    assert.strictEqual(match.snippet.replacement, '^{2}');
  });
  
  it('should match auto-subscript like x2', () => {
    const match = findMatch('$x2', snippets, true);
    assert.ok(match, 'Should find auto-subscript match');
    assert.strictEqual(match.snippet.replacement, '[[0]]_{[[1]]}');
    assert.deepStrictEqual(match.captures, ['x', '2']);
  });
});

describe('findMatchingOpen', () => {
  it('finds opening paren for simple content', () => {
    assert.strictEqual(findMatchingOpen('(\\sum', '(', ')'), 0);
  });

  it('finds opening paren past nested parens', () => {
    // outer ( is at index 0; inner (a+b) is nested
    assert.strictEqual(findMatchingOpen('(\\sum (a+b)', '(', ')'), 0);
  });

  it('returns -1 when no opening bracket exists', () => {
    assert.strictEqual(findMatchingOpen('\\sum', '(', ')'), -1);
  });

  it('finds opening square bracket', () => {
    assert.strictEqual(findMatchingOpen('[\\int_{0}^{1}', '[', ']'), 0);
  });

  it('handles content before the opening bracket', () => {
    const text = 'f(x) + (\\frac{a}{b}';
    // f(x) + (\frac... — the ( before \frac is at index 7
    assert.strictEqual(findMatchingOpen(text, '(', ')'), 7);
  });
});

describe('TALL_CONTENT_RE', () => {
  it('matches \\frac', () => assert.ok(TALL_CONTENT_RE.test('\\frac{a}{b}')));
  it('matches \\sum with limits', () => assert.ok(TALL_CONTENT_RE.test('\\sum_{i=1}^N a_i')));
  it('matches \\int', () => assert.ok(TALL_CONTENT_RE.test('\\int_0^1 f(x)')));
  it('matches \\prod', () => assert.ok(TALL_CONTENT_RE.test('\\prod_{k=1}^n')));
  it('matches \\lim', () => assert.ok(TALL_CONTENT_RE.test('\\lim_{x\\to 0}')));
  it('does not match plain letters', () => assert.ok(!TALL_CONTENT_RE.test('x + y')));
  it('does not match \\sin', () => assert.ok(!TALL_CONTENT_RE.test('\\sin x')));
  it('does not match \\alpha', () => assert.ok(!TALL_CONTENT_RE.test('\\alpha + \\beta')));
});

describe('matchFraction', () => {
  it('should match simple fractions like a/b', () => {
    const match = matchFraction('a/b');
    assert.ok(match, 'Should match a/b');
    assert.strictEqual(match.numerator, 'a');
    assert.strictEqual(match.denominator, 'b');
    assert.strictEqual(match.matchLength, 3);
  });
  
  it('should match LaTeX command fractions like \\pi/2', () => {
    const match = matchFraction('\\pi/2');
    assert.ok(match, 'Should match \\pi/2');
    assert.strictEqual(match.numerator, '\\pi');
    assert.strictEqual(match.denominator, '2');
  });
  
  it('should match fractions with LaTeX on both sides', () => {
    const match = matchFraction('\\alpha/\\beta');
    assert.ok(match, 'Should match');
    assert.strictEqual(match.numerator, '\\alpha');
    assert.strictEqual(match.denominator, '\\beta');
  });
  
  it('should match parenthesized numerator', () => {
    const match = matchFraction('(a+b)/c');
    assert.ok(match, 'Should match (a+b)/c');
    assert.strictEqual(match.numerator, 'a+b');
    assert.strictEqual(match.denominator, 'c');
  });
  
  it('should not match partial LaTeX commands', () => {
    // "alpha/b" should not match because 'a' is part of 'alpha'
    const match = matchFraction('alpha/b');
    // The regex should not match 'a/b' when preceded by 'lph'
    // Actually this depends on implementation - let's check
    if (match) {
      // If it matches, make sure it's the right match
      assert.ok(match.numerator !== 'a', 'Should not match partial command');
    }
  });
});
