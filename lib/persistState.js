'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.mergePersistedState = mergePersistedState;
exports['default'] = persistState;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _adaptersLocalStorage = require('./adapters/localStorage');

var _adaptersLocalStorage2 = _interopRequireDefault(_adaptersLocalStorage);

var _mergeStateJs = require('./mergeState.js');

var _mergeStateJs2 = _interopRequireDefault(_mergeStateJs);

var _bufferActionsJs = require('./bufferActions.js');

var _bufferActionsJs2 = _interopRequireDefault(_bufferActionsJs);

var ActionTypes = {
  INIT: '@@redux-localstorage/INIT'
};

function persistStateMiddleware(store, storage, key) {
  return function (next) {
    return function (action) {
      next(action);

      if (action.type === ActionTypes.INIT) return;

      storage.put(key, store.getState(), function (err) {
        if (err) console.error('Unable to persist state to localStorage:', err);
      });
    };
  };
}

/**
 * @description
 * mergePersistedState is a higher order reducer used to initialise
 * redux-localstorage to rehydrate the store by merging the application's initial
 * state with any persisted state.
 *
 * @param {Function} merge function that merges the initial state and
 * persisted state and returns the result.
 */

function mergePersistedState(merge) {
  return function (next) {
    return function (state, action) {

      if (action.type === ActionTypes.INIT) {
        return action.payload ? merge(state, action.payload) : state;
      }

      return next(state, action);
    };
  };
}

/**
 * @description
 * persistState is a Store Enhancer that persists store changes.
 *
 * @param {Object} [storage = adapter(localStorage)] Object used to interface with any type of storage back-end.
 * @param {String} [key = "redux-localstorage"] String used as storage key.
 *
 * @return {Function} An enhanced store.
 */

function persistState(storage, key) {
  key = key || 'redux-localstorage';

  if (typeof storage === 'undefined') {
    storage = (0, _adaptersLocalStorage2['default'])(localStorage);
  } else if (typeof storage === 'string') {
    key = storage;
    storage = (0, _adaptersLocalStorage2['default'])(localStorage);
  }

  return function (next) {
    return function (reducer, initialState) {
      // Check if ActionTypes.INIT is already handled, "lift" reducer if not
      if (typeof reducer(undefined, { type: ActionTypes.INIT }) !== 'undefined') reducer = mergePersistedState(_mergeStateJs2['default'])(reducer);

      // Apply middleware
      var store = next(reducer, initialState);
      var dispatch = (0, _redux.compose)((0, _bufferActionsJs2['default'])(), persistStateMiddleware(store, storage, key), store.dispatch);

      // Retrieve and dispatch persisted store state
      storage.get(key, function (err, persistedState) {
        if (err) console.error('Failed to retrieve initialize state from localStorage:', err);
        dispatch({
          type: ActionTypes.INIT,
          meta: { BUFFER_BUSTER: true },
          payload: persistedState
        });
      });

      return _extends({}, store, {
        dispatch: dispatch
      });
    };
  };
}