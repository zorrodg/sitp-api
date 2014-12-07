var fs = require('fs'),
  purify = require('./purify'),
  Q = require('q');

module.exports = function($, url){
  var esquemaRuta, infoPrincipal, ruta, titulo, id, horario, horas, q = Q.defer();

  ruta = $('h1.pub').text();
  infoPrincipal = $('#infoPrincipalNoticias').length;
  if(ruta){
    if(infoPrincipal) {
      esquemaRuta = $('div.pub')
        .find('table').find('.azulBold').parent()
        .html();
    } else {
      esquemaRuta = $('#texto_principal')
      .find('.azulBold').parent()
      .html();
    }
    
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

    esquemaRuta = esquemaRuta.length > 1 ? esquemaRuta : null;

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
      id_ruta: id,
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