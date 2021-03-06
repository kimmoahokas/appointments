// default values for session variables


// Id of event that is currently selected for modification in manage view
Session.setDefault('editedAppointmentId', null);

// Id of round that is currently selected for modification in manage view
Session.setDefault('editRoundId', null);

// The round user has selected in reservation view
Session.setDefault('selectedRound', null);

// the appointment user has selected in reserve view
Session.setDefault('selectedAppointment', null);

// The tab that is currently active in apointments manage view
Session.setDefault('selectedTab', 'manageAppointments');

//The tab that is currently active in user management view
Session.setDefault('userManagementSelectedTab', 'addUsers');

// set the default filter for appointments to show to user
// need to run this automatically when user is logged in
Deps.autorun(function() {
    var filter = {
        end: {$gte: new Date()},
    };
    var courseStaff = isCourseStaff(Meteor.userId(), Session.get('selectedCourse'));
    // different defaults for students and assistants
    if (Meteor.user() && !courseStaff) {
        filter.student = Meteor.userId();
    } else if (Meteor.user() && courseStaff) {
        filter.assistant = Meteor.userId();
        filter.student = {$ne: null};
    }
    Session.set('appointmentFilter', filter);
});

Meteor.startup(function() {
        Meteor.call('getServerTimeZone', function(err, val) {
        if (!err) {
            Session.set('serverTimeZone', val);
        }
    });
});

// set the course that user has selected. Note that selectedCourse may be null
setCurrentCourse = function(courseCode) {
    var course = Courses.findOne({code: courseCode});
    Session.set('selectedCourse', course);
};
