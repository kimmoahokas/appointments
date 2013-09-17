// default values for session variables


// Id of event that is currently selected for modification in manage view
Session.setDefault('editedAppointmentId', null);

// Id of round that is currently selected for modification in manage view
Session.setDefault('editRoundId', null);

// The round user has selected in reservation view
Session.setDefault('selectedRound', null);

// the appointment user has selected in reserve view
Session.setDefault('selectedAppointment', null);

// The tab that is currently active in manage view
Session.set('selectedTab', 'manageAppointments');
