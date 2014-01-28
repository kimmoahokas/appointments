Courses = new Meteor.Collection("courses");

Rounds = new Meteor.Collection("rounds");

Appointments = new Meteor.Collection("appointments", {
    transform: function (appointment) {
        //normal users are not abble to reserve/cancell this appointment after
        // previous day clock 18
        var editEnds = moment(appointment.start).subtract('days', 1).startOf('day').hour(18).toDate();
        appointment.editEnds = editEnds;
        if(appointment.student) {
            appointment.color = 'red';
            appointment.reserved = true;
        }
        return appointment;
    }
});




