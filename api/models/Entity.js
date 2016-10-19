/**
* Entity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    idw: {
      type: 'string',
      unique: true
    },
    attributes:{
      collection:'attribute'
    },
    relations:{
      collection:'relation'
    }
  },

  beforeDestroy: function(criteria, cb) {
    // Destroy any user associated to a deleted pet
    Entity.find(criteria).populate('attributes').exec(function (err, pets){
      if (err) return cb(err);
      pets.forEach(function(recordToDestroy) {
        Attribute.destroy({id: _.pluck(recordToDestroy.owners, 'id')}).exec(function(err) {
          sails.log.debug('attributes deleted');
        });
      });
      cb();
    })
  }

};
