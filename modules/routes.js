/**
 * Routes class file
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

function Routes (app) {
  var person = require('./../models/person');
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
    
    if(name && person){
      // Query Database
      return person.then(function(model){
        return model.qAll({ name: name })
          .then(function(query) {
            var result = query[0];

            if(result){
              return res.send('Hello ' + result.name + ' ' + result.surname + ', I salute you');
            }

            return res.redirect('/');

          }, handleError);
        }, handleError);
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