Meteor.subscribe('my-appointments');

//TODO: add some control to only show old/future/etc appointments

Template.appointmentListTemplate.appointments = function() {
    var appointments = Appointments.find({
        $or: [
            {assistant: Meteor.userId(), student: {$ne: null}},
            {student: Meteor.userId()}
        ]
    }, {
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
