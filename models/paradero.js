/**
 * Modelo de Paraderos
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module Paradero
 */

'use strict';

// Module dependencies
var mongoose = require('mongoose'),
    _        = require('underscore'),
    diacritic = require('diacritic').clean;

var db = mongoose.createConnection(process.env.DATABASE_URL);

// Paradero schema
var paraderoSchema = mongoose.Schema({ 
  id_paradero       : String,
  desc          : String,
  buscable      : String,
  url           : String,
  ubicacion     : {}
});

/**
 * Devuelve el paradero basado en el identificador
 * @param  {String}   id       ID de paradero
 * @param  {Function} callback
 * @return {void}
 */
paraderoSchema.statics.findById = function(id, callback){
  this.findOne({ id_paradero: id }, function(err, paradero){
    if(err) return err;

    return callback(truncate(paradero));
  });
};

paraderoSchema.statics.search = function(criteria, callback){
  var terms = [];

  _.each(criteria, function(term) {
    terms.push(diacritic(term.toLowerCase().replace(/[\+_\-\.]/g, ' ')));
  });

  this.find()
    .where({ buscable:{ $all: terms }})
    .exec(function(err, results){
      var truncatedResults = [];
      if(err) return err;

      _.each(results, function(elem){
        truncatedResults.push(truncate(elem));
      });

      return callback(truncatedResults);
    });
};

function truncate(result){
  return _.pick(result, 'id_paradero', 'desc', 'url', 'ubicacion');
}

module.exports = db.model('Paradero', paraderoSchema);
