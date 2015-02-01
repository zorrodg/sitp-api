'use strict';

// Dependencies
var app = require('express')();

// Seteando el puerto
app.set('port', process.env.PORT || 5000);
// Variables globales
//process.env.DATABASE_URL = 'postgres://iihbagdlipnocu:EIgZe7oUnn3Mqk4F7RJpeixoS4@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d5i57kjvaj1ttc?ssl=true';
process.env.DATABASE_URL = 'mongodb://rutas-sitp-user:sitpuser@ds053370.mongolab.com:53370/rutas-sitp';

// Añadiendo rutas
app = require('./routes')(app);

// Init server
app.listen(app.get('port'), function(){
  console.log('Servidor express iniciado en puerto %s', app.get('port'));
});