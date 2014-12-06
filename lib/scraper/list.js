var fs     = require('fs'),
    purify = require('./purify'),
    Q      = require('q');

module.exports = function($, url){
  var todas = $('#cssmenu > ul > li'), 
    seccion, rutas, ruta, urlRuta, arrayFinal = [], q = Q.defer();

  console.log('Iniciando listado de rutas...');

  for(var i = 0, len = todas.length; i < len; i++){
    seccion = $(todas[i]);
    rutas = seccion.find('ul > li');
    for(var j = 0, len2 = rutas.length; j < len2; j++){
      idRuta = $(rutas[j]).find('a').attr('href');
      urlRuta = url + idRuta;
      console.log(urlRuta);
      if(idRuta){
        arrayFinal.push(urlRuta);
      }
    }
  }
  
  console.log('Escribiendo archivo de rutas...');
  fs.writeFile(__dirname.replace('/lib/scraper', '') + '/output/rutas.json', JSON.stringify(arrayFinal), function(err){
    if(err) throw err;
    console.log('Archivo escrito!');
    q.resolve(true);
  });

  return q.promise;
};