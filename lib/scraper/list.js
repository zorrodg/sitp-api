'use strict';

var fs     = require('fs'),
    purify = require('./purify'),
    _      = require('underscore'),
    colors = require('colors'),
    Q      = require('q');

module.exports = function($, url){
  var todas = $('#cssmenu > ul > li'), 
    seccion, rutas, ruta, urlRuta, arrayFinal = [], q = Q.defer();

  console.log('Iniciando listado de rutas...'.yellow);

  for(var i = 0, len = todas.length; i < len; i++){
    seccion = $(todas[i]);
    rutas = seccion.find('ul > li');
    for(var idRuta, j = 0, len2 = rutas.length; j < len2; j++){
      idRuta = $(rutas[j]).find('a').attr('href');
      urlRuta = url + idRuta;
      if(idRuta){
        arrayFinal.push(urlRuta);
      }
    }
  }

  arrayFinal = _.uniq(arrayFinal);
  
  console.log('Escribiendo archivo de rutas...');
  fs.writeFile(__dirname.replace('/lib/scraper', '') + '/output/rutas.json', JSON.stringify(arrayFinal), function(err){
    if(err) throw err;
    console.log('Archivo escrito! Rutas Escritas: %s'.green, arrayFinal.length);
    q.resolve(true);
  });

  return q.promise;
};