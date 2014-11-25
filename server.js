// Dependencies
var app = require('express')();

// Seteando el puerto
app.set('port', process.env.PORT || 5000);
// Variables globales
process.env.DATABASE_URL = 'postgres://iihbagdlipnocu:EIgZe7oUnn3Mqk4F7RJpeixoS4@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d5i57kjvaj1ttc?ssl=true';

// Añadiendo rutas
app = require('./modules/routes')(app);

// Init server
app.listen(app.get('port'), function(){
  console.log('Servidor express iniciado en puerto %s', app.get('port'));
});