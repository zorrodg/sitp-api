/**
 * Routes class file
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

var pg = require('pg');

function Routes (app) {
  /**
   * Home
   */
  app.get('/', function (req,res) {
    return res.send('Hello stranger, please enter your name in the path');
  });

  
  app.get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        if (err)
         { console.error(err); response.send("Error " + err); }
        else
         { response.send(result.rows); }
      });
    });
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