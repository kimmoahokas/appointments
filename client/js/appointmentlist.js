Template.appointmentListTemplate.appointments = function() {
    var filter = Session.get('appointmentFilter');
    console.log(filter);
    var appointments = Appointments.find(filter, {
        sort: {start : 1}
    });
    return appointments;
};

Template.appointmentListTemplate.events({
    'click .appointment-cancel-button': function(event) {
        var result = confirm('Cancel this appointment?');
        if (result) {
            var appointmentId = event.target.value;
            Meteor.call('cancelAppointment', appointmentId, function(error, result) {
                if(!error) {
                    alert('Appointment succesfully cancelled!');
                } else {
                    alert('Error occured, please contact course email! Details: ' + error.reason);
                }
            });
        }
    },
});
