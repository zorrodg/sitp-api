'use strict';

var Q         = require('q'),
    _         = require('underscore'),
    colors    = require('colors'),
    diacritic = require('diacritic').clean,
    purify    = require('./purify');

var count = 0;

module.exports = function($, url){
  var q  = Q.defer(),
      paradero = {
        ubicacion: {}
      },
      title = $('h1.page-header').text(),
      idParadero = url.slice(url.lastIndexOf('/') + 1, url.length),
      mapaInfo = $('div#mapa ~ script').text(),
      titleInfo = title.match(/^Paradero +?(?:[dD]iag(?:onal)?|[dD][gG]\.?|[aA][cC]\.?|[Cc]a?ll?e?) +?(\d+\s?[A-Z]?\s?[A-Zbisur]{0,3}(?!\S)\s?[A-Zbisur]{0,3}(?!\S))[\w -]+?(?:[tT]rans(?:versal)?|[tT][vV]\.?|[aA][kK]|[kK][rR]|con|[aA][vV]\.?|[Cc]a?rr?e?r?r?a?) ?(\d+\s?[A-Z]?\s?[A-Zbiste]{0,4}(?!\S)\s?[A-Zbiste]{0,4}(?!\S))(?:[- ]+(.*))?/);

  mapaInfo = mapaInfo.match(/center: new google.maps.LatLng\((.*),(.*)\)/);

  if(titleInfo){
    paradero.ubicacion.lat = mapaInfo[1];
    paradero.ubicacion.lng = mapaInfo[2];
    paradero.ubicacion.calle = parseAddress(titleInfo[1], 'calle');
    paradero.ubicacion.carrera = parseAddress(titleInfo[2], 'carrera');
    paradero.desc = titleInfo[3];
    paradero.buscable = titleInfo[3] ? diacritic(titleInfo[3].toLowerCase().replace('.', '')) : null;
    paradero.id_paradero = idParadero;
    paradero.url = url;

    q.resolve(paradero);

    return q.promise;
  }

  titleInfo = title.match(/^Paradero +?(?:[tT]rans(?:versal)?|[tT][vV]\.?|[aA][kK]|[kK][rR]|[Cc]a?rr?e?r?r?a?) +?(\d+\s?[A-Z]?\s?[A-Zbiste]{0,4}(?!\S)\s?[A-Zbiste]{0,4}(?!\S))[\w -]+?(?:[dD]iag(?:onal)?|[dD][gG]\.?|[aA][cC]\.?|[aA][vV]\.|con|[Cc]a?ll?e?) ?(\d+\s?[A-Z]?\s?[A-Zbisur]{0,3}(?!\S)\s?[A-Zbisur]{0,3}(?!\S))(?:[- ]+(.*))?/);

  if(titleInfo){
    paradero.ubicacion.lat = mapaInfo[1];
    paradero.ubicacion.lng = mapaInfo[2];
    paradero.ubicacion.calle = parseAddress(titleInfo[2], 'calle');
    paradero.ubicacion.carrera = parseAddress(titleInfo[1], 'carrera');
    paradero.desc = titleInfo[3];
    paradero.buscable = titleInfo[3] ? diacritic(titleInfo[3].toLowerCase().replace('.', '')) : null;
    paradero.id_paradero = idParadero;
    paradero.url = url;

    q.resolve(paradero);

    return q.promise;
  }

  count++;

  console.log('%d: %s %s'.bgRed, count, idParadero, title);

  return q.promise;
};

function parseAddress (address, type) {
  var result;
  switch(type){
    case 'calle':
    result = address.replace(/S(?!ur)/, 'Sur').replace(/(\S)\s?[sS]ur/, '$1 Sur');
    break;
    case 'carrera':
    result = address.replace(/E(?!ste)/, 'Este').replace(/(\S)\s?[eE]ste/, '$1 Este');
    break;
  }

  return result.trim().replace(/^(\d+)([A-Z])/, '$1 $2').replace(/(\S)\s?[bB]is/, '$1 Bis');
}