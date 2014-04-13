'use strict';

var config = require('mech-config')
  , Datastore = require('nedb')
  , Execution = require('./execution.js')
  , Promise = require('promise')
  ;

var Storage = module.exports;

var db = new Promise(function (ok, fail) {
  var store = new Datastore({ filename: config.persistence.file });

  store.loadDatabase(function (err) {
    if (err) {
      fail(err);
    } else {
      ok(store);
    }
  });
});

Storage.createExecution = function (cb) {
  return db.then(function (db) {
    var execution = new Execution();

    return new Promise(function (ok, fail) {
      db.insert(execution.json(), function (err, res) {
        if (err) {
          fail(err);
        } else {
          ok(execution.update(res));
        }
      });
    });
  }).nodeify(cb);
};

Storage.getExecution = function (uuid, cb) {
  return db.then(function (db) {
    return new Promise(function (ok, fail) {
      db.findOne({ _id: uuid }, function (err, res) {
        if (err) {
          fail(err);
        } else {
          ok(new Execution(res));
        }
      });
    });
  }).nodeify(cb);
};

Storage.saveExecution = function (execution, cb) {
  return db.then(function (db) {
    return new Promise(function (ok, fail) {
      db.update({ _id: execution.uuid }, execution.json(), function (err) {
        if (err) {
          fail(err);
        } else {
          ok(execution.uuid);
        }
      });
    }).then(function (uuid) {
      return Storage.getExecution(uuid);
    });
  }).nodeify(cb);
};
