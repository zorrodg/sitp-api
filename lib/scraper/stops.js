'use strict';

var Q         = require('q'),
    _         = require('underscore'),
    colors    = require('colors'),
    diacritic = require('diacritic').clean,
    purify    = require('./purify');

module.exports = function($, url){
  var q  = Q.defer(),
      paradero = {
        ubicacion: {}
      },
      title = $('h1.page-header').text(),
      titleInfo = title.match(/^Paradero +?(?:[dD]iag(?:onal)?|[dD][gG]|[aA][cC]|[Cc]alle) +?(\d+\s?[A-Z]?\s?[A-Zbisur]{0,3}(?!\S)\s?[A-Zbisur]{0,3}(?!\S))[\w -]+?(?:[tT]rans(?:versal)?|[tT][vV]|[aA][kK]|[kK][rR]|con|[aA]v\.?|[Cc](?:arre)?r?a) (\d+\s?[A-Z]?\s?[A-Zbiste]{0,4}(?!\S)\s?[A-Zbiste]{0,4}(?!\S))(?:[- ]+(.*))?/);

  if(titleInfo){
    paradero.ubicacion.calle = titleInfo[1].trim();
    paradero.ubicacion.carrera = titleInfo[2].trim();
    paradero.desc = titleInfo[3];
    paradero.buscable = titleInfo[3] ? diacritic(titleInfo[3].toLowerCase()) : null;

    console.warn('%s'.green, title); // LOG
    console.warn('Calle: %s Carrera: %s Buscable: %s'.cyan, paradero.ubicacion.calle, paradero.ubicacion.carrera, paradero.buscable); // LOG
    return q.promise;
  }

  console.log(title);

  return q.promise;
};