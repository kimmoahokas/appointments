//Define database update/fetch methods for clients

Meteor.methods({
    reserveAppoinment: function(appointmentId) {
        check(appointmentId, String);
        var appointment = Appointments.findOne(appointmentId);
        if(!appointment) {
            throw new Meteor.Error(404, "Invalid appointment!");
        }
        if (appointment.student) {
            throw new Meteor.Error(404, "Appointment already reserved!");
        }
        Appointments.update(appointmentId, {$set: {student: this.userId}});
    }
});
