var fs = require('fs'),
  purify = require('./purify'),
  diacritic = require('diacritic').clean,
  _ = require('underscore'),
  Q = require('q');

module.exports = function ($, url) {
  var q = Q.defer(),
      trayectos = $('h2#paraderos ~ ol'),
      trayectoIda = $(trayectos[0]).find('li'),
      trayectoVuelta = $(trayectos[1]).find('li'),
      paraderosIda = [],
      paraderosVuelta = [],
      $paradero, i, path;

  if(trayectoIda.length){
    for (i = trayectoIda.length - 1; i >= 0; i--) {
      $paradero = $(trayectoIda[i]).find('a');
      path = $paradero.attr('href');
      paraderosIda.push(path.slice(path.lastIndexOf('/') + 1, path.length));
    }  
  }

  if(trayectoVuelta.length){
    for (i = trayectoVuelta.length - 1; i >= 0; i--) {
      $paradero = $(trayectoVuelta[i]).find('a');
      path = $paradero.attr('href');
      paraderosVuelta.push(path.slice(path.lastIndexOf('/') + 1, path.length));
    }  
  }

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
  

  return q.promise;
};