// Handle subscriptions in one place, makes things a lot easier.

//subscribe to courses available for me
Meteor.subscribe('courses');

Deps.autorun(function() {
    Meteor.subscribe('rounds', Session.get('courseCode'));
});


Meteor.subscribe('available-rounds');
Meteor.subscribe('my-appointments');

var appointmentHandle = Meteor.subscribe('all-appointments');
var roundHandle = Meteor.subscribe('all-rounds');
var userHandle = Meteor.subscribe('all-users');
