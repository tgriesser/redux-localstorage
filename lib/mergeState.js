'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = mergeState;
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function mergeDeepWithoutMutating(target, source) {
  for (var key in source) {
    var value = target[key];
    if (isObject(value)) {
      target[key] = _extends({}, value);
      mergeDeepWithoutMutating(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function mergeState(initialState, persistedState) {
  var finalInitialState = _extends({}, initialState);
  mergeDeepWithoutMutating(finalInitialState, persistedState);
  return finalInitialState;
}

module.exports = exports['default'];