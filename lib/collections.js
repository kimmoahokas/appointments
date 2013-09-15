Appointments = new Meteor.Collection("appointments", {
    transform: function (appointment) {
        if(appointment.student) {
            appointment.color = 'red';
            appointment.reserved = true;
        }
        return appointment;
    }
});

Rounds = new Meteor.Collection("rounds");


