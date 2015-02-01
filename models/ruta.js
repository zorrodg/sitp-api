/**
 * Modelo de Rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module Ruta
 */

'use strict';

// Module dependencies
var mongoose = require('mongoose'),
    _        = require('underscore'),
    diacritic = require('diacritic').clean;

var db = mongoose.createConnection(process.env.DATABASE_URL);

// Ruta schema
var rutaSchema = mongoose.Schema({ 
  id_ruta       : String,
  ruta          : String,
  url           : String,
  esquema       : [],
  buscable      : [],
  horario       : {},
  paraderos     : {}
});

/**
 * Devuelve la ruta basado en el identificador
 * @param  {String}   id       ID de ruta
 * @param  {Function} callback
 * @return {void}
 */
rutaSchema.statics.findById = function(id, callback){
  this.findOne({ id_ruta: id }, function(err, ruta){
    if(err) return err;

    return callback(truncate(ruta));
  });
};

rutaSchema.statics.search = function(criteria, callback){
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
  return _.pick(result, 'id_ruta', 'ruta', 'horario', 'url', 'esquema', 'paraderos');
}

module.exports = db.model('Ruta', rutaSchema);
