'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = persistStateMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypesJs = require('./actionTypes.js');

var _actionTypesJs2 = _interopRequireDefault(_actionTypesJs);

function persistStateMiddleware(store, storage) {
  var key = arguments.length <= 2 || arguments[2] === undefined ? 'redux-localstorage' : arguments[2];

  function persistState() {
    storage.put(key, store.getState(), function (err) {
      if (err) console.error('Unable to persist state to storage:', err); // eslint-disable-line no-console
    });
  }

  return function (next) {
    return function (action) {
      next(action);

      if (action.type !== _actionTypesJs2['default'].INIT) {
        persistState();
      }

      return action;
    };
  };
}

module.exports = exports['default'];