/**
 * Routes class file
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

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
  app.get('/:name', function (req,res) {
    var name = req.params.name,
      person = require('./../models/person');

    
    if(name){
      // Query Database
      person.then(function(model){
        model.qAll({ name: name })
          .then(function(query) {
            var result = query[0];
            if(result.name){
              return res.send('Hello ' + name + ' ' + surname + ', I salute you');
            }
          }, handleError);
      }, handleError);
    }

    function handleError(err){
      console.log('error',error); // LOG
      return res.redirect('/');
    }
  });

  return app;
}

module.exports = Routes;