/**
 * Modulo Scraper. Agarra las rutas de la página del SITP
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

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
    console.log('Got Cheerio for lists!'.yellow, url);
    require('./list')(data, url)
      .then(callback, handlePromiseError);
  });
};

Scraper.prototype.writeLines = function(linesArray, callback){
  var url = this.baseUrl,
      detail = require('./detail'),
      count = 0;
  
  for(var i = 0, l = linesArray.length; i < l; i++){
    getDetail(linesArray[i]);
  }

  function getDetail(url){
    return getCheerio(url, function (data) {
      return detail(data, url).
        then(function(res){
          if(res && 'id_ruta' in res) {

            completeLine(res, function(updatedRes){
              return saveInDB(updatedRes);
            });
          }
          
        }, handlePromiseError);
    });
  }

  function insertOrUpdate(err, ruta){
    if(!err) {
      count++;
      console.log('%s/%s Ruta: %s'.bgRed, count, linesArray.length, ruta.id_ruta); // LOG
    }

    if(count === linesArray.length) {
      console.log('Finalizado el listado de rutas: Total: %d'.yellow, count);
      return callback(true);
    }

    return false;
  }

  function completeLine (ruta, callback) {
    var url = 'http://www.rutasbogota.com/ruta/',
        scraper = require('./rutasbogota');

    getCheerio(url + ruta.id_ruta, function(data){
      scraper(data).then(function(paraderos){
        console.log('Complementando ruta: '.green + ruta.id_ruta);
        return callback(_.extend(ruta, paraderos));
      }, function(){
        return callback(ruta);
      });
    });
  }

  function saveInDB (res) {
    return Ruta.findOne({'id_ruta': res.id_ruta}, function(err, found){
      if(found) {
        for(var key in res){
          found[key] = res[key];
        }

        console.log('Ruta actualizada: %s'.cyan, res.id_ruta);
        return found.save(insertOrUpdate);
      } else {
        console.log('Ruta escrita: %s', res.id_ruta);
        return new Ruta(res).save(insertOrUpdate);
      }
    });
  }
};

Scraper.prototype.writeStops = function(stopsArray, callback){
  new Paradero({ 
    id_paradero   : '123',
    desc          : 'String',
    buscable      : 'String',
    url           : '',
    ubicacion     : {}
  }).save(callback);

};


function getCheerio(url, callback){
  // URL to scrape
  if(!url) return 'No url';

  // Send request
  request({
    url:url,
    encoding: 'binary'
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