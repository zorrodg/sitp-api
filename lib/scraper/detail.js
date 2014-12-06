var fs = require('fs'),
  purify = require('./purify'),
  Q = require('q');

module.exports = function($, url){
  var esquemaRuta, ruta, titulo, id, horario, horas, q = Q.defer();

  ruta = $('h1.pub').text();
  if(ruta){
    esquemaRuta = $('#texto_principal')
      .children('table:first-child')
      .find('.azulBold').parent()
      .html();
    horario = $('#texto_principal')
      .children('table:last-child')
      .find('tr > td:last-child')
      .html();

    ruta = purify(ruta);
    console.log('Leyendo %s', ruta);

    id = ruta.match(/R?r?uta( Nocturna| Urbana)? ([A-Z0-9]{1,5}):?/)[2];
    esquemaRuta = purify(esquemaRuta).replace(/\sy\s/, ',').split(',');
    horas = purify(horario).match(/([0-9]{1,2}:[0-9]{2} a?p?\.m\.?) a ([0-9]{1,2}:[0-9]{2} a?p?\.m\.?)/g);
    
    if(horas){
      if(horas.length > 1){
        horario = {
          lun_sab: horas[0].replace(/\sa\s/, ' - ').replace(/\./g, ''),
          dom_fes: horas[1].replace(/\sa\s/, ' - ').replace(/\./g, '')
        };
      } else {
        horario = {
          lun_dom: horas[0].replace(/\sa\s/, ' - ').replace(/\./g, '')
        };
      }
    }
    

    // fs.writeFile(__dirname.replace('/lib/scraper', '') + '/output/' + id + '.json', JSON.stringify({
    //   id: id,
    //   url: url,
    //   ruta: ruta,
    //   esquema: esquemaRuta,
    //   horario: horario
    // }), 'utf8', function(err) {
    //   if(err) throw err;
    //   console.log('Escrito archivo: '+ id + '.json');
    //   q.resolve(true);
    // });
    q.resolve({
      id:      id,
      url:     url,
      ruta:    ruta,
      esquema: esquemaRuta,
      horario: horario
    });
    
  } else {
    console.log('Error en ' + url);
    q.reject(false);
  }
  
  return q.promise;
};