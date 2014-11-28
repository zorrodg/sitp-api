/**
 * Model class
 * Módulo de Modelos
 * @package sitp-api
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module model
 */

// Module dependencies
// var orm = require('orm'),
//     Q = require('q'),
//     qOrm = require('q-orm');

// var q = Q.defer();

// qOrm.qConnect(process.env.DATABASE_URL)
//   .then(function(db){
//     var Person = db.qDefine('person', 
//       {
//         name      : String,
//         surname   : String,
//         age       : Number, // FLOAT
//         male      : Boolean
//       }, 
//       {
//         methods: {
//           fullName: function () {
//             return this.name + ' ' + this.surname;
//           }
//         }, 
//         validations: {}
//       }
//     );

//     return q.resolve(Person);
    
//   }, function(err){
//     console.log('ORM Connection error', err); // LOG
//     return false;
//   });

// module.exports = q.promise;
