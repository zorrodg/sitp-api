var Entities = require('html-entities').XmlEntities,
  entities = new Entities();

module.exports = function(node) {
  if(!node) return '';
  return entities.decode(node)
      .replace(/(<([^>]+)>)/ig, '')
      .replace(/(e|E)squema de ruta:/, '')
      .replace(/^\s*/g, '')
      .replace(/,\s+/g, ',')
      .replace(/\.(\.|\s)*?$/g, '');
};