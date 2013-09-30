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
Session.set('selectedTab', 'manageAppointments');

//The tab that is currently active in user management view
Session.set('userManagementSelectedTab', 'addUsers');

Meteor.startup(function() {
        Meteor.call('getServerDate', function(err, val) {
        if (!err) {
            Session.set('serverDate', val);
        }
    });
});
