"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (storage) {
  return {
    0: storage,

    put: function put(key, value, callback) {
      storage.setItem(key, JSON.stringify(value), callback);
    },

    get: function get(key, callback) {
      JSON.parse(storage.getItem(key, callback));
    },

    del: function del(key, callback) {
      storage.removeItem(key, callback);
    }
  };
};

module.exports = exports["default"];