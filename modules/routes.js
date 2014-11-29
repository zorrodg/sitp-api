/**
 * Routes class file
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */
var Ruta = require('./../models/person');

function Routes (app) {
  /**
   * Home
   */
  app.get('/', function (req,res) { 
    return res.send('Hello stranger, please enter your name in the path');
  });

  /**
   * Salute
   */
  app.get('/:name', function (req, res) {
    var name = req.params.name;
    
    if(name && req.url !== '/favicon.ico'){

      ruta = new Ruta({
        name: name,
        surname: 'Zorro',
        age: 27,
        male: true
      });
      
      return ruta.save(function(err){
        if(err) console.log(err);
        res.send('Hello ' + ruta.name + ' ' + ruta.surname +', I salute you');
      });  
    }

    return res.redirect('/');

    function handleError(err){
      console.log('error', error); // LOG
      return res.redirect('/');
    }
  });

  return app;
  
}

module.exports = Routes;