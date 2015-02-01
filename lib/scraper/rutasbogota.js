'use strict';

var fs      = require('fs'),
    Q         = require('q'),
    _         = require('underscore'),
    diacritic = require('diacritic').clean,
    purify    = require('./purify'),
    paraderosFile,
    paraderosFilepath = __dirname.replace('/lib/scraper', '') + '/output/paraderos.json';

module.exports = function ($, url) {
  var q = Q.defer(),
      trayectos = $('h2#paraderos ~ ol'),
      trayectoIda = $(trayectos[0]).find('li'),
      trayectoVuelta = $(trayectos[1]).find('li'),
      paraderosIda = [],
      paraderosVuelta = [],
      paraderos = [];

  paraderosIda = parseTrayecto($, trayectoIda);
  paraderosVuelta = parseTrayecto($, trayectoVuelta);


  if(paraderosIda.length > 0 && paraderosVuelta.length > 0){
    q.resolve({
      paraderos:{
        ida: paraderosIda,
        vuelta: paraderosVuelta
      }
    });
  } else {
    q.reject(false);
  }

  paraderos = [].concat(paraderosIda, paraderosVuelta).map(function(parada){
    return url + 'paradero/' + parada;
  });

  try{
    paraderosFile = fs.readFileSync(paraderosFilepath);
    paraderosFile = JSON.parse(paraderosFile);
    
    paraderos = [].concat(paraderos, paraderosFile);
    fs.writeFileSync(paraderosFilepath, JSON.stringify(_.uniq(paraderos)));
  } catch(e){
    if(e.code === 'ENOENT'){
      fs.writeFileSync(paraderosFilepath, JSON.stringify(_.uniq(paraderos)));
    } else {
      throw e;
    }
  }

  return q.promise;
};

function parseTrayecto ($, trayecto) {
  var $paradero, i, path, paraderos = [];

  if(trayecto.length){
    for (i = trayecto.length - 1; i >= 0; i--) {
      $paradero = $(trayecto[i]).find('a');
      path = $paradero.attr('href');
      paraderos.push(path.slice(path.lastIndexOf('/') + 1, path.length));
    }  
  }

  return paraderos;
}