// Handle subscriptions in one place, makes things a lot easier.

Meteor.subscribe('available-rounds');
Meteor.subscribe('my-appointments');

var appointmentHandle = Meteor.subscribe('all-appointments');
var roundHandle = Meteor.subscribe('all-rounds');
var userHandle = Meteor.subscribe('all-users');
