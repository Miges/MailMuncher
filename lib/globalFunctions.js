safeCallback = function(callback) {
	return  Meteor.bindEnvironment(callback, function(err) { throw err; });
}