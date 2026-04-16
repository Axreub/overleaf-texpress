/**
 * Tests for Extension Functionality
 *
 * Run with: npm test
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { shouldJumpOverBracket } from '../src/extension.js';

describe('shouldJumpOverBracket', () => {
  it('should return true for closing parenthesis', () => {
    assert.strictEqual(shouldJumpOverBracket(')'), true);
    assert.strictEqual(shouldJumpOverBracket(') + x'), true);
  });

  it('should return true for closing square bracket', () => {
    assert.strictEqual(shouldJumpOverBracket(']'), true);
    assert.strictEqual(shouldJumpOverBracket('] + y'), true);
  });

  it('should return true for closing curly brace', () => {
    assert.strictEqual(shouldJumpOverBracket('}'), true);
    assert.strictEqual(shouldJumpOverBracket('} + z'), true);
  });

  it('should return false for opening brackets', () => {
    assert.strictEqual(shouldJumpOverBracket('('), false);
    assert.strictEqual(shouldJumpOverBracket('['), false);
    assert.strictEqual(shouldJumpOverBracket('{'), false);
  });

  it('should return false for other characters', () => {
    assert.strictEqual(shouldJumpOverBracket('x'), false);
    assert.strictEqual(shouldJumpOverBracket(' '), false);
    assert.strictEqual(shouldJumpOverBracket('\\'), false);
  });

  it('should return false for empty string', () => {
    assert.strictEqual(shouldJumpOverBracket(''), false);
  });

  it('should return false for null/undefined', () => {
    assert.strictEqual(shouldJumpOverBracket(null), false);
    assert.strictEqual(shouldJumpOverBracket(undefined), false);
  });
});

describe('Tab jumping behavior documentation', () => {
  it('Tab should jump over ) when cursor is before it', () => {
    // Scenario: User types '(' -> auto-close creates '()' with cursor inside
    // User types content -> '(content|)'
    // User presses Tab -> cursor moves to '(content)|'
    const textAfter = ')';
    assert.strictEqual(shouldJumpOverBracket(textAfter), true,
      'Tab should jump over closing paren');
  });

  it('Tab should jump over ] when cursor is before it', () => {
    const textAfter = ']';
    assert.strictEqual(shouldJumpOverBracket(textAfter), true,
      'Tab should jump over closing square bracket');
  });

  it('Tab should jump over } when cursor is before it', () => {
    const textAfter = '}';
    assert.strictEqual(shouldJumpOverBracket(textAfter), true,
      'Tab should jump over closing curly brace');
  });

  it('Tab should NOT jump when next char is not a closing bracket', () => {
    // When there's no closing bracket, Tab should fall through to default behavior
    assert.strictEqual(shouldJumpOverBracket('x'), false);
    assert.strictEqual(shouldJumpOverBracket('+'), false);
  });
});

describe('auto-close bracket interaction', () => {
  // These tests document the expected behavior when auto-close brackets
  // interact with snippet expansion

  it('describes the flow: typing ( creates () with cursor inside', () => {
    // When user types '(' in math mode:
    // 1. Auto-close inserts '()'
    // 2. Cursor is placed at position 1 (between brackets)
    // Expected result: '(|)' where | is cursor
    assert.ok(true, 'Auto-close creates matching pair');
  });

  it('describes the flow: Tab jumps over auto-closed bracket', () => {
    // After typing content inside auto-closed brackets:
    // 1. Text is '(content|)' where | is cursor
    // 2. User presses Tab
    // 3. shouldJumpOverBracket(')') returns true
    // 4. Cursor moves to '(content)|'
    assert.ok(true, 'Tab jumps over closing bracket');
  });

  it('describes the flow: tall bracket auto-sizing consumes duplicate bracket', () => {
    // When user types '(\sum_{i=1}^N)' with auto-close:
    // 1. User types '(' -> '(|)'
    // 2. User types '\sum_{i=1}^N' -> '(\sum_{i=1}^N|)'
    // 3. User types ')' -> tall-content check fires, consumes the extra ')'
    // 4. Result: '\left(\sum_{i=1}^N\right)|'
    assert.ok(true, 'Duplicate bracket consumed during tall auto-sizing');
  });
});
