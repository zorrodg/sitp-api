/**
 * Configuración de rutas
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */
'use strict';

var Ruta    = require('./models/ruta'),
    _       = require('underscore'),
    Scraper = require('./lib/scraper/module');

function Routes (app) {
  /**
   * Home
   */
  app.get('/', function (req,res) { 
    return res.send('Bienvenido al servicio de rutas del SITP.');
  });

  /**
   * Encuentra rutas por el ID
   */
  app.get('/ruta/:id_ruta', function(req, res){
    Ruta.findById(req.params.id_ruta, function(data) {
      res.set('Content-Type', 'application/json')
        .send(JSON.stringify(data));
    });
  });

  /**
   * Encuentra rutas por el barrio de salida y de llegada
   */
  app.get('/buscar/:barrio_salida/:barrio_llegada?', function(req, res){
    var criterios = [];
    for(var obj in req.params){
      if(req.params[obj]){
        criterios.push(req.params[obj]);
      } 
    }
    
    Ruta.search(criterios, function(data){
      res.set('Content-Type', 'application/json')
        .send(JSON.stringify(data));
    });
  });
  
  /**
   * Scraper
   */
  app.get('/scraper/init', function (req,res){
    var startTime = new Date().getTime(), endTime;
    Scraper.getList(function(data){
      if(data){
        var rutas = require('./output/rutas.json');
        Scraper.writeLines(rutas, function(data){
          if(data){
            var paraderos = require('./output/paraderos.json');
            Scraper.writeStops(paraderos, function(data){
              endTime = new Date().getTime();
              console.log('Finalizado en ' + (endTime - startTime)/1000 + 's.');
              return res.send('Finalizado en ' + (endTime - startTime)/1000 + 's.');
            });
          }
        });
      }
    });
  });

  app.get('/scraper/lines', function (req,res){
    var startTime = new Date().getTime(), endTime;
    Scraper.getList(function(data){
      if(data){
        var rutas = require('./output/rutas.json');
        Scraper.writeLines(rutas, function(data){
          endTime = new Date().getTime();
          console.log('Finalizado en ' + (endTime - startTime)/1000 + 's.');
          return res.send('Lineas escritas --> Finalizado en ' + (endTime - startTime)/1000 + 's.');
        });
      }
    });
  });

  app.get('/scraper/stops', function (req,res){
    var startTime = new Date().getTime(), endTime;
    var paraderos = require('./output/paraderos.json');
    Scraper.writeStops(paraderos, function(data){
      endTime = new Date().getTime();
      console.log('Finalizado en ' + (endTime - startTime)/1000 + 's.');
      return res.send('Paraderos escritos --> Finalizado en ' + (endTime - startTime)/1000 + 's.');
    });
  });

  return app;
}

module.exports = Routes;