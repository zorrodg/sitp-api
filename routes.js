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
    var name = req.params.name;

    if(name){
      return res.send('Hello ' + name + ', I salute you');
    }

    return res.redirect('/');
  });

  return app;
}

module.exports = Routes;