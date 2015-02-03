/**
 * Tareas de scraper separadas para generar web workers
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module app
 */
'use strict';

require('./config');

var _       = require('underscore'),
    Scraper = require('./lib/scraper/module'),
    args    = [].concat(process.argv);

args.shift();
args.shift();

switch(args[0]){
  case 'scraper':
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
              process.exit();
            });
          }
        });
      }
    });
    break;
  case 'lines':
    var startTime = new Date().getTime(), endTime;
    Scraper.getList(function(data){
      if(data){
        var rutas = require('./output/rutas.json');
        Scraper.writeLines(rutas, function(data){
          endTime = new Date().getTime();
          console.log('Finalizado en ' + (endTime - startTime)/1000 + 's.');
          process.exit();
        });
      }
    });
    break;
  case 'stops':
    var startTime = new Date().getTime(), endTime;
    var paraderos = require('./output/paraderos.json');
    Scraper.writeStops(paraderos, function(data){
      endTime = new Date().getTime();
      console.log('Finalizado en ' + (endTime - startTime)/1000 + 's.');
      process.exit();
    });
    break;
  default:
    console.log('Inserta un comando');
    process.exit();
    break;
}