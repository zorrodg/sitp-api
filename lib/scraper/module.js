/**
 * Modulo Scraper. Agarra las rutas de la página del SITP
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

// Module dependencies
var Q       = require('q'),
    request = Q.denodeify(require('request')),
    Ruta    = require('./../../models/ruta'),
    cheerio = require('cheerio');

exports = module.exports = new Scraper();

/**
 * Class Definition
 */
function Scraper(){
  this.baseUrl = 'http://www.sitp.gov.co/publicaciones/';

  return this;
}

Scraper.prototype.getList = function(callback){
  var url = this.baseUrl;
  getCheerio(url + 'rutas_del_servicio_urbano_pub', function(data){
    console.log('Got Cheerio for lists!', url);
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
            Ruta.findOne({'id_ruta': res.id_ruta}, function(err, found){
              if(found) {
                for(var key in res){
                  found[key] = res[key];
                }

                console.log('Ruta actualizada: %s', res.id_ruta);
                return found.save(insertOrUpdate);
              } else {
                console.log('Ruta escrita: %s', res.id_ruta);
                return new Ruta(res).save(insertOrUpdate);
              }
            });
          }
          
        }, handlePromiseError);
    });
  }

  function insertOrUpdate(err, ruta){
    if(!err) {
      count++;
    }

    if(count === linesArray.length) return callback(true);

    return false;
  }
};



function getCheerio(url, callback){
  // URL to scrape
  if(!url) return 'No url';

  // Send request
  request({
    url:url,
    encoding: 'binary'
  }).then(function(res){
    callback(cheerio.load(res[1], {
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: true
    }));
  }, handlePromiseError);
}

function handlePromiseError(err){
  return console.log(err);
}