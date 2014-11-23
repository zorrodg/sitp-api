/**
 * Routes class file
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

function Routes (app) {
  app.get('/', function(req,res) {
    res.send('Hello World');
  });

  return app;
}

module.exports = Routes;