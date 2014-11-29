/**
 * Modelo de Rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module Ruta
 */

// Module dependencies
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

// Ruta schema
var rutaSchema = mongoose.Schema({ 
  name      : String,
  surname   : String,
  age       : Number, // FLOAT
  male      : Boolean
});

module.exports = mongoose.model('Ruta', rutaSchema);
