// Handle subscriptions in one place, makes things a lot easier.

//Subscribe to user data. first users's own info
Meteor.subscribe('userData');

// Admins and course staff get also all users on course
Deps.autorun(function() {
    Meteor.subscribe('courseUsers', Session.get('courseCode'));
});

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
