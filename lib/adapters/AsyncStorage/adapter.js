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
      storage.getItem(key, function (err, value) {
        if (err) return callback(err, null);
        try {
          callback(null, JSON.parse(value));
        } catch (e) {
          callback(e);
        }
      });
    },

    del: function del(key, callback) {
      storage.removeItem(key, callback);
    }
  };
};

module.exports = exports["default"];