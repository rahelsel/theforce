Meteor.publish('myInfo', function() {
	return Meteor.users.find({ _id: this.userId });
});
Meteor.publish('user.findAdminsDetails', function(ids) {
	return Meteor.users.find({ _id: { $in: ids } });
});
Meteor.publish('user.getUsersFromIds',function(ids){
	let record = Meteor.users.find({_id:{$in:ids}});
	return record;
   })