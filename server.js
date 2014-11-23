var app = require('express')();

// Seteando el puerto
app.set('port', process.env.PORT || 5000);

app.get('/', function (req,res) {
  res.send('Hello world');
});

// Init server
app.listen(app.get('port'), function(){
  console.log('Servidor express iniciado en puerto %s', app.get('port'));
});