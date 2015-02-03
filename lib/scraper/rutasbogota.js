'use strict';

var fs      = require('fs'),
    Q         = require('q'),
    _         = require('underscore'),
    diacritic = require('diacritic').clean,
    purify    = require('./purify'),
    Paradero  = require('./../../models/paradero'),
    paraderosFilepath = __dirname.replace('/lib/scraper', '') + '/output/paraderos.json',
    paraderosFile,
    paraderosIda = [],
    paraderosVuelta = [];

module.exports = function ($, url) {
  var q = Q.defer(),
      trayectos = $('h2#paraderos ~ ol'),
      trayectoIda = $(trayectos[0]).find('li'),
      trayectoVuelta = $(trayectos[1]).find('li'),
      paraderos = [];


  parseTrayecto($, trayectoIda)
    .then(function(paraderos){
      paraderosIda = paraderos;
      resolveQ(q);
    });
  parseTrayecto($, trayectoVuelta)
    .then(function(paraderos){
      paraderosVuelta = paraderos;
      resolveQ(q);
    });
  

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

function resolveQ (q) {
  if(paraderosIda.length > 0 && paraderosVuelta.length > 0){
    return q.resolve({
      paraderos:{
        ida: paraderosIda,
        vuelta: paraderosVuelta
      }
    });
  }

  return false;
}

function parseTrayecto ($, trayecto) {
  var $paradero,
      q = Q.defer(),
      i, 
      path, 
      paraderos = [], 
      idParadero, 
      foundId, 
      total = trayecto.length, 
      count = 0;

  if(total){
    for (i = total - 1; i >= 0; i--) {
      $paradero = $(trayecto[i]).find('a');
      path = $paradero.attr('href');
      idParadero = path.slice(path.lastIndexOf('/') + 1, path.length);
      //paraderos.push(path.slice(path.lastIndexOf('/') + 1, path.length));

      Paradero.findOne({ 'id_paradero': idParadero }, queryResult);
    }  
  }

  function queryResult(err, found){
    if(err){
      console.log(err);
      return process.exit();
    }

    if(found) {
      paraderos.push(found._id);
    }

    count++;
    if(count === total){
      return q.resolve(paraderos);
    }
  }

  return q.promise;
}