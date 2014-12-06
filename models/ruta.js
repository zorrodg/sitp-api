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
  id_ruta       : String,
  ruta          : String,
  url           : String,
  esquema       : [],
  horario       : {}
});

module.exports = mongoose.model('Ruta', rutaSchema);
