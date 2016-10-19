/**
 * EntityController
 *
 * @description :: Server-side logic for managing entities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * Maybe I will remove the answer from the server, and just update the
 * clients with ws
 */

module.exports = {

	/**
	 * TODO: Add option without attributes params
	 * TODO: Add option for an array of attributes
	 */


	create: function (req, res) {
		if ( !_.isString( req.param('id') ) ) {
	  	return res.badRequest();
		}
		var ent = req.allParams();
		var ido;
		// if (ent.id) {
			if (!ent.key && !ent.value) {
				try {
					Entity.create({
							idw: ent.id
						}).exec(function(err, entity){
						if(err){
							sails.log.error(err);
							res.json(400,{error:err});
						} else {
							res.json(200,entity);
						}
					});

				} catch (e) {
					sails.log.error(e);
				}
			} else {
				Attribute.create({
					key: ent.key,
					value: ent.value
				}).exec(function(err, obj){
					if (err) {
						sails.log.error(err);
						res.json(400, {error:'attribute NOK :('});
					} else {
						if (obj){
							try {
								Entity.create({
										idw: ent.id
									}).populate('attributes').exec(function(err, entity){
									if(err){
										sails.log.error(err);
										res.json(400,{error:err});
									} else {
										entity.attributes.add(obj);
										entity.save(function(err,newEntity) {
											if (err) {
												res.json(400);
											} else {
												console.log(newEntity);
												res.json(200,newEntity);
											}
										});
									}
								});

							} catch (e) {
								sails.log.error(e);
							}
						} else {
							sails.log.error('No Attribute created');
							res.json(400, {error:'attribute NOK :('});
						}
					}
				});
			}
	},

	update: function(req, res){
		var ent = req.allParams();
		Attribute.create({
			key: ent.key,
			value: ent.value
			 }).exec(function(err, obj){
			if(err){
				sails.log.error(err);
				res.json(400,{error:'NoK'});
			} else {
				Entity.findOne().where({
					 idw: ent.id
				}).populate('attributes').exec(function (err, enty) {
						if(err){
							sails.log.error(err);
							res.send(400);
						} else {
								if (enty){
									 enty.attributes.add(obj.id);
									 enty.save(function (err, newEntity) {
									 		if (err) {
									 			res.json(400);
									 		} else {
									 			res.json(200,newEntity);
									 		}
									 });
								} else {
										res.json(400, {error:'obj do not exists'});
								}
						}
					});
			}
		});
	},

/**
 * Read entity eagernes
 * default 0
 */

read: function(req, res){
	if ( !_.isString( req.param('id') ) ) {
  	return res.badRequest();
	}
	if (!(req.param('e'))){
		Entity.findOne().where({
			 idw: req.param('id')
		}).populate('attributes').exec(function (err, enty) {
				if(err){
					sails.log.error(err);
					res.send(400);
				} else {
						if (enty){
							 res.json(200, enty);
						} else {
								res.json(400, {error:'obj do not exists'});
						}
				}
			});
	} else {
		// eagerness 1
		Entity.findOne().where({
			 idw: req.param('id')
		}).populate('attributes').populate('relations').exec(function (err, enty) {
				if(err){
					sails.log.error(err);
					res.send(400);
				} else {
						if (enty){
							var v = req.param('v');
							if (enty.relations && v != 0) {
								sails.log.debug(enty.relations.length);
								for (var i = 0; i < enty.relations.length; i++) {
									Relation.findOne().where({
										 id:enty.relations[i].id
									}).populateAll().exec(function (err, rel) {
											if(err){
												sails.log.error(err);
												res.send(400);
											} else {
													if (rel){
														 sails.log.debug(rel);
													}
											}
										});
								}
							}
							res.json(200, enty);
						} else {
								res.json(400, {error:'obj do not exists'});
						}
				}
			});
	}
},

/**
 * TODO add some eagerness levels to the query
 * e = 0 default deletes the entity and the attributes
 * e = 1 deletes the entity and the attributes and all entities (+attributes) related
 * e = ...
 */

delete: function(req, res) {
	if ( !_.isString( req.param('id') ) ) {
		return res.badRequest();
	}
	var ent = req.allParams();
	Entity.destroy({
		idw : ent.id
	})
	.exec(function (err){
  if (err) {
    res.json(400, {error:'obj do not exists'});
  }
  res.json(200,{msg:'Ok'});
});
},

/**
 * TODO add option to create not existing entities
 */
relate: function(req,res){
	if ( !_.isString(req.param('source')) && !_.isString(req.param('target')) && !_.isString(req.param('relation')) ) {
		return res.badRequest();
	}
	var rel = req.allParams();
	Entity.find().where({
		 idw: [rel.source, rel.target]
	}).populate('relations').exec(function (err, entity) {
			if(err){
				sails.log.error(err);
				res.send(400);
			} else {
				var source = entity[0].idw === rel.source ? entity[0] : entity[1];
				var target = entity[0].idw === rel.target ? entity[0] : entity[1];
					if (entity[0] && entity[1]){
						Relation.create({
						 relation: rel.relation,
						 source: source,
						 target: target
					 }).exec(function(err,relation){
						 if (err) {
							 sails.log.error(err);
			 				res.send(400);
						} else {
							source.relations.add(relation);
							source.save(function(err, newEntity){
									if (err) {
										sails.log.error(err);
										res.send(400);
									} else {
										res.json(200,newEntity);
									}
							});
						}
					});
					} else {
							if (!source) {
								res.json(400,{msg:'source does not exists'});
							}
							if (!target) {
								res.json(400,{msg:'target does not exists'});
							}
					}
			}

			// }
		});
}
};