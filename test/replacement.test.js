/**
 * Tests for Replacement Processing
 *
 * Run with: npm test
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { applyCaptures, processTabstops, processReplacement, buildFractionReplacement } from '../src/replacement.js';

describe('applyCaptures', () => {
  it('should replace [[0]] with first capture', () => {
    const result = applyCaptures('\\hat{[[0]]}', ['H']);
    assert.strictEqual(result, '\\hat{H}');
  });

  it('should replace multiple captures', () => {
    const result = applyCaptures('[[0]]_{[[1]]}', ['x', '2']);
    assert.strictEqual(result, 'x_{2}');
  });

  it('should handle multiple occurrences of same capture', () => {
    const result = applyCaptures('[[0]] + [[0]]', ['x']);
    assert.strictEqual(result, 'x + x');
  });

  it('should leave template unchanged with no captures', () => {
    const result = applyCaptures('\\alpha', []);
    assert.strictEqual(result, '\\alpha');
  });
});

describe('processTabstops', () => {
  it('should handle $0 cursor marker', () => {
    const result = processTabstops('\\frac{$0}{y}', 0);
    assert.strictEqual(result.text, '\\frac{}{y}');
    assert.strictEqual(result.cursorPos, 6); // Position after \frac{
  });

  it('should handle ${n:default} tabstops', () => {
    const result = processTabstops('\\lim_{ ${0:n} \\to ${1:\\infty} }', 0);
    assert.strictEqual(result.text, '\\lim_{ n \\to \\infty }');
    assert.strictEqual(result.tabstops.length, 2);
  });

  it('should place cursor at end if no $0 marker', () => {
    const result = processTabstops('\\alpha', 0);
    assert.strictEqual(result.text, '\\alpha');
    assert.strictEqual(result.cursorPos, 6);
  });

  it('should remove plain $n markers', () => {
    const result = processTabstops('\\frac{$0}{$1}$2', 0);
    assert.strictEqual(result.text, '\\frac{}{}');
  });
});


describe('buildFractionReplacement', () => {
  it('should produce empty denominator with cursor inside', () => {
    const result = buildFractionReplacement({ numerator: 'x' }, 0);
    assert.strictEqual(result.text, '\\frac{x}{}');
    // \frac{x}{} is 10 chars, cursor before closing } at position 9
    assert.strictEqual(result.cursorPos, 9);
  });

  it('should handle longer numerator', () => {
    const result = buildFractionReplacement({ numerator: 'abc' }, 5);
    assert.strictEqual(result.text, '\\frac{abc}{}');
    // \frac{abc}{} is 12 chars, cursor at 5 + 12 - 1 = 16
    assert.strictEqual(result.cursorPos, 16);
  });
});
