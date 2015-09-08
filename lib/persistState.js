'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = persistState;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _persistStateMiddlewareJs = require('./persistStateMiddleware.js');

var _persistStateMiddlewareJs2 = _interopRequireDefault(_persistStateMiddlewareJs);

var _bufferActionsJs = require('./bufferActions.js');

var _bufferActionsJs2 = _interopRequireDefault(_bufferActionsJs);

var _actionTypesJs = require('./actionTypes.js');

var _actionTypesJs2 = _interopRequireDefault(_actionTypesJs);

var _adaptersLocalStorage = require('./adapters/localStorage');

var _adaptersLocalStorage2 = _interopRequireDefault(_adaptersLocalStorage);

var defaultStorage = (0, _adaptersLocalStorage2['default'])(localStorage);
var defaultKey = 'redux-localstorage';

/**
 * @description
 * persistState is a Store Enhancer that persists store changes.
 *
 * @param {Object} [storage = adapter(localStorage)] Object used to interface with any type of storage back-end.
 * @param {String} [key = "redux-localstorage"] String used as storage key.
 * @param {Function} [callback] Called when persistState has finished initializing.
 *
 * @returns {Function} An enhanced create store function.
 */

function persistState(storage, key, callback) {
  if (storage === undefined) storage = defaultStorage;
  if (key === undefined) key = defaultKey;

  var finalStorage = storage;
  var finalKey = key;
  var finalCallback = callback;

  // Juggle arguments if needed
  if (typeof key === 'function') {
    finalCallback = key;
    finalKey = defaultKey;
  }

  if (typeof storage === 'string') {
    finalKey = storage;
    finalStorage = defaultStorage;
  } else if (typeof storage === 'function') {
    finalCallback = storage;
    finalStorage = defaultStorage;
  }

  return function (next) {
    return function (reducer, initialState) {
      // Apply middleware
      var store = next(reducer, initialState);
      var dispatch = (0, _bufferActionsJs2['default'])()((0, _persistStateMiddlewareJs2['default'])(store, finalStorage, finalKey)(store.dispatch));

      // Retrieve and dispatch persisted store state
      finalStorage.get(finalKey, function (err, persistedState) {
        if (err) console.error('Failed to retrieve persisted state from storage:', err); // eslint-disable-line no-console
        dispatch({
          type: _actionTypesJs2['default'].INIT,
          payload: persistedState
        });
        if (finalCallback) finalCallback();
      });

      return _extends({}, store, {
        dispatch: dispatch
      });
    };
  };
}

module.exports = exports['default'];