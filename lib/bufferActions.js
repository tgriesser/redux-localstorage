/**
 * Middleware for intercepting and queue'ing actions until an action.meta.BUFFER_BUSTER action
 * has been dispatched. This action will be dispatched first, followed by the queued actions in
 * the order they were originally dispatched.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = bufferActions;

function bufferActions() {
  var buffer = true;
  var queue = [];

  return function (next) {
    return function (action) {
      if (!buffer) return next(action);

      if (action.meta && action.meta.BUFFER_BUSTER) {
        buffer = false;
        next(action);
        queue.forEach(function (queuedAction) {
          return next(queuedAction);
        });
      } else {
        queue.push(action);
      }
    };
  };
}

module.exports = exports["default"];