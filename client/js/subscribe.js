// Handle subscriptions in one place, makes things a lot easier.

//Subscribe to user data. first users's own info
Meteor.subscribe('userData');

// Admins and course staff get also all users on course
Deps.autorun(function() {
    var course = Session.get('selectedCourse');
    if (course && isCourseStaff(Meteor.userId(), course.code)) {
        Meteor.subscribe('courseUsers', course.code);
    }
});

//subscribe to courses available for me
Meteor.subscribe('courses');

Deps.autorun(function() {
    var course = Session.get('selectedCourse');
    if (course) {
        Meteor.subscribe('rounds', course.code);
    }
});


Meteor.subscribe('my-appointments');

// assistants & admins subscribe to all appointments on course
Deps.autorun(function() {
    var course = Session.get('selectedCourse');
    if (course && isCourseStaff(Meteor.userId(), course.code)) {
        Meteor.subscribe('all-appointments', course.code);
    }
});

Deps.autorun(function() {
    Meteor.subscribe('available-appointments', Session.get('selectedRound'));
});
