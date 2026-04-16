/**
 * Tabstop State Management
 * 
 * Uses CodeMirror 6 StateField to track active tabstops and enable
 * Tab/Shift-Tab navigation through them.
 */

/**
 * State effect to set tabstops after snippet expansion
 */
export const setTabstopsEffect = { type: 'setTabstops' };

/**
 * State effect to clear tabstops
 */
export const clearTabstopsEffect = { type: 'clearTabstops' };

/**
 * State effect to advance to next tabstop
 */
export const nextTabstopEffect = { type: 'nextTabstop' };

/**
 * Create the tabstop state field configuration
 * This will be used with CM6's StateField.define()
 */
export function createTabstopState() {
  return {
    positions: [],  // Array of { from, to } ranges
    current: -1,    // Index of current tabstop (-1 = none active)
  };
}

/**
 * Update tabstop positions when document changes
 * Maps old positions through the change set
 * 
 * @param {Object} state - Current tabstop state
 * @param {Object} changes - CM6 ChangeSet
 * @returns {Object} - Updated state
 */
export function mapTabstopsThroughChanges(state, changes) {
  if (state.positions.length === 0) {
    return state;
  }
  
  const newPositions = state.positions.map(pos => ({
    from: changes.mapPos(pos.from),
    to: changes.mapPos(pos.to)
  })).filter(pos => pos.from < pos.to); // Remove collapsed ranges
  
  return {
    ...state,
    positions: newPositions,
    current: newPositions.length > 0 ? state.current : -1
  };
}

/**
 * Set new tabstops from snippet expansion
 * 
 * @param {Array} tabstops - Array of { index, from, to } from processReplacement
 * @returns {Object} - New tabstop state
 */
export function setTabstops(tabstops) {
  if (!tabstops || tabstops.length === 0) {
    return createTabstopState();
  }
  
  return {
    positions: tabstops.map(ts => ({ from: ts.from, to: ts.to })),
    current: 0
  };
}

/**
 * Advance to the next tabstop
 * 
 * @param {Object} state - Current tabstop state
 * @returns {Object} - Updated state with next tabstop active, or cleared if done
 */
export function advanceTabstop(state) {
  if (state.positions.length === 0 || state.current < 0) {
    return createTabstopState();
  }
  
  const nextIndex = state.current + 1;
  
  if (nextIndex >= state.positions.length) {
    // No more tabstops, clear state
    return createTabstopState();
  }
  
  return {
    ...state,
    current: nextIndex
  };
}

/**
 * Get the current tabstop range
 * 
 * @param {Object} state - Tabstop state
 * @returns {Object|null} - { from, to } or null if no active tabstop
 */
export function getCurrentTabstop(state) {
  if (state.current < 0 || state.current >= state.positions.length) {
    return null;
  }
  return state.positions[state.current];
}

/**
 * Check if there are active tabstops
 * 
 * @param {Object} state - Tabstop state
 * @returns {boolean}
 */
export function hasActiveTabstops(state) {
  return state.current >= 0 && state.current < state.positions.length;
}

/**
 * Create a CM6-compatible StateField definition
 * This creates the actual StateField to be added to the editor
 */
export function createTabstopField(StateField, StateEffect) {
  // Define effects
  const setEffect = StateEffect.define();
  const clearEffect = StateEffect.define();
  const advanceEffect = StateEffect.define();
  
  const field = StateField.define({
    create() {
      return createTabstopState();
    },
    
    update(value, tr) {
      // Handle effects
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
      
      // Map positions through document changes
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

export default {
  createTabstopState,
  setTabstops,
  advanceTabstop,
  getCurrentTabstop,
  hasActiveTabstops,
  createTabstopField
};
