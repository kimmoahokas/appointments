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
Meteor.startup(function() {
    var filter = {
        end: {$gte: new Date()},
    };
    // different defaults for students and assistants
    if (Meteor.user() && !Meteor.user().profile.admin) {
        filter.student = Meteor.userId();
    } else if (Meteor.user() && Meteor.user().profile.admin) {
        filter.assistant = Meteor.userId();
        filter.student = {$ne: null};
    }
    Session.setDefault('appointmentFilter', filter);
});

Meteor.startup(function() {
        Meteor.call('getServerDate', function(err, val) {
        if (!err) {
            Session.set('serverDate', val);
        }
    });
});
