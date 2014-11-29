/**
 * Model class
 * Módulo de Modelos
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module model
 */

// Module dependencies
var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

var Ruta = mongoose.model('Ruta', { 
    name      : String,
    surname   : String,
    age       : Number, // FLOAT
    male      : Boolean
  });

module.exports = Ruta;

