/**
 * Modulo Scraper. Agarra las rutas de la página del SITP
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */
'use strict';

// Module dependencies
var Q        = require('q'),
    _        = require('underscore'),
    colors   = require('colors'),
    request  = require('request'),
    Ruta     = require('./../../models/ruta'),
    Paradero = require('./../../models/paradero'),
    cheerio  = require('cheerio');

exports = module.exports = new Scraper();

/**
 * Class Definition
 */
function Scraper(){
  this.baseUrl = 'http://www.sitp.gov.co/';

  return this;
}

Scraper.prototype.getList = function(callback){
  var url = this.baseUrl;
  getCheerio(url + 'publicaciones/rutas_del_servicio_urbano_pub', function(data){
    require('./list')(data, url)
      .then(callback, handlePromiseError);
  });
};

Scraper.prototype.writeLines = function(linesArray, callback){
  var url = this.baseUrl,
      detail = require('./detail'),
      count = 0, nuevas = 0, actualizadas = 0, complementadas = 0;
  
  for(var i = 0, l = linesArray.length; i < l; i++){
    getDetail(linesArray[i]);
  }

  function getDetail(url){
    getCheerio(url, function (data) {
      return detail(data, url)
        .then(completeLine, handlePromiseError)
        .then(saveInDB, handlePromiseError);
    });
  }

  function completeLine (ruta) {
    var url = 'http://www.rutasbogota.com/',
        q = Q.defer(),
        scraper = require('./rutasbogota');

    if(ruta && 'id_ruta' in ruta) {
      getCheerio(url + 'ruta/' + ruta.id_ruta, function(data){
        scraper(data, url).then(function(paraderos){
          complementadas++;
          q.resolve(_.extend(ruta, paraderos));
        }, function(){
          q.resolve(ruta);
        });
      });
    } else {
      q.reject(false);
    }
    return q.promise;
  }

  function saveInDB (res) {
    return Ruta.findOne({'id_ruta': res.id_ruta}, function(err, found){
      if(found) {
        for(var key in res){
          found[key] = res[key];
        }
        actualizadas++;
        return found.save(insertOrUpdate);
      } else {
        nuevas++;
        return new Ruta(res).save(insertOrUpdate);
      }
    });
  }

  function insertOrUpdate(err, ruta){
    var linesLength = linesArray.length;
    if(!err) {
      count++;
      console.log('%d% | %s/%s | %s', Math.ceil((count / linesLength) * 100), count, linesLength, ruta.ruta);
    }

    if(count === linesLength) {
      console.log('Finalizado. Total de rutas: %d Nuevas: %d Actualizadas: %d Complementadas: %d'.green, count, nuevas, actualizadas, complementadas);
      return callback(true);
    }

    return false;
  }
};

Scraper.prototype.writeStops = function(stopsArray, callback){
  var scraper = require('./stops'),
      count = 0, nuevos = 0, actualizados = 0;

  console.log('Total de paraderos: %d'.yellow, stopsArray.length);
  for(var i = 0, l = stopsArray.length; i < l; i++){
    getStopDetail(stopsArray[i]);
  }
  //getStopDetail(stopsArray[26]);

  function getStopDetail(url){
    getCheerio(url, function(paradero){
      return scraper(paradero, url)
        .then(saveInDB, handlePromiseError);
    }, 'utf-8');
  }

  function saveInDB(paradero){
    return Paradero.findOne({'id_paradero': paradero.id_paradero}, function(err, found){
      if(found) {
        for(var key in paradero){
          found[key] = paradero[key];
        }
        actualizados++;
        return found.save(insertOrUpdate);
      } else {
        nuevos++;
        return new Paradero(paradero).save(insertOrUpdate);
      }
    });
  }

  function insertOrUpdate (err, paradero) {
    var stopsLength = stopsArray.length;
    if(!err){
      count++;
      console.log('%d% | %s/%s | %s - %s', Math.ceil((count / stopsLength)*100), count, stopsLength, paradero.id_paradero, paradero.desc);
    }

    if(count === stopsLength){
      console.log('Finalizado. Total de paraderos: %d Nuevos: %d Actualizados: %d'.green, count, nuevos, actualizados);
      return callback(true);
    }
  }
  
};


function getCheerio(url, callback, encoding){
  // URL to scrape
  if(!url) return 'No url';

  // Send request
  request({
    url:url,
    encoding: encoding || 'binary'
  }, function(err, response, body){
      if(response.statusCode === 200 && body){
        return callback(cheerio.load(body, {
          normalizeWhitespace: false,
          xmlMode: false,
          decodeEntities: true
        }));
      }
      return console.warn('Error leyendo %s. Error: %s'.blue, url, err);
  });
}

function handlePromiseError(err){
  return console.log(err);
}