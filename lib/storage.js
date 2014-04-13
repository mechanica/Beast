'use strict';

var _ = require('lodash')
  , config = require('mech-config')
  , Execution = require('./execution.js')
  , logger = require('./logger.js')
  , mongo = require('mongodb')
  , Promise = require('promise')
  ;

function wrapBSON(json) {
  var bson = _.clone(json);
  bson._id = mongo.ObjectID(bson._id);
  return bson;
}

function unwrapBSON(bson) {
  var json = _.clone(bson);
  json._id = json._id.toHexString();
  return json;
}

var Storage = module.exports;

var db = new Promise(function (ok, fail) {
  mongo.connect(config.persistence.url, function(err, db) {
    if(err) {
      fail(err);
    } else {
      ok(db);
    }
  });
});

var collection = db.then(function (db) {
  return new Promise(function (ok, fail) {
    db.collection('execution', function (err, collection) {
      if (err) {
        fail(err);
      } else {
        ok(collection);
      }
    });
  });
});

Storage.createExecution = function (cb) {
  return collection.then(function (db) {
    var execution = new Execution();

    return new Promise(function (ok, fail) {
      db.insert(wrapBSON(execution.json()), function (err, res) {
        if (err) {
          fail(err);
        } else {
          ok(execution.update(unwrapBSON(res[0])));
        }
      });
    });
  }).nodeify(cb);
};

Storage.getExecution = function (uuid, cb) {
  return collection.then(function (db) {
    return new Promise(function (ok, fail) {
      db.findOne(wrapBSON({ _id: uuid }), function (err, res) {
        if (err) {
          fail(err);
        } else {
          ok(new Execution(unwrapBSON(res)));
        }
      });
    });
  }).nodeify(cb);
};

Storage.saveExecution = function (execution, cb) {
  return collection.then(function (db) {
    return new Promise(function (ok, fail) {
      db.update(wrapBSON({ _id: execution.uuid }), wrapBSON(execution.json()), function (err) {
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
