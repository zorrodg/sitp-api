/**
 * Routes class file
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */
var person = require('./../models/person');

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
    
    if(name && person && req.url !== '/favicon.ico'){
      // Query Database
      return person.then(function(model){

        model.qCreate([
          {
            name: "John",
            surname: "Doe",
            age: 25,
            male: true
          }
        ]);

        return model.find({ name: name }, function(err, query){
          var result = query[0];

          if(result){
            result.age = 27;
            result.surname = 'Zorro Maldonado';

            result.save();

            return res.send('Hello ' + result.fullName() + ', I salute you');
          }

          return res.redirect('/');
        });
          
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