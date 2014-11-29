/**
 * Modulo Scraper. Agarra las rutas de la página del SITP
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module routes
 */

// Module dependencies
var Q = require('q'),
    request = Q.denodeify(require('request')),
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
    console.log('Got Cheerio for lists!');
    require('./list')(data, url)
      .then(callback, handlePromiseError);
  });
};

Scraper.prototype.writeLines = function(linesArray, callback){
  var url = this.baseUrl,
      detail = require('./detail'),
      count = 0;
  
  for(var i = 0, l = linesArray.length; i < l; i++){
    getCheerio(linesArray[i], getDetail);
  }

  function getDetail(data){
    return detail(data, linesArray[i]).
      then(function(res){
        if(res) count++;
        if(count === linesArray.length) callback(true);
      }, handlePromiseError);
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