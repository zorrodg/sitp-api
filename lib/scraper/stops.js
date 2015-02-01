'use strict';

var Q         = require('q'),
    _         = require('underscore'),
    diacritic = require('diacritic').clean,
    purify    = require('./purify');

module.exports = function($, url){
  var q  = Q.defer(),
      title = diacritic($('h1.page-header').text());

  console.log(url, title);

  return q.promise;
};