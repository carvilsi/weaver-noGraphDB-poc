/**
* Relation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    relation: 'string',
    source: {
      model: 'Entity'
    },
    target: {
      model: 'Entity'
    },
    attributes:{
      collection:'attribute'
    }
  }
};
