Courses = new Meteor.Collection("courses");

Rounds = new Meteor.Collection("rounds", {
    transform: function(round) {
        round.code = getRoundCourseCode(round);
        return round;
    }
});

Appointments = new Meteor.Collection("appointments", {
    transform: function (appointment) {
        //normal users are not abble to reserve/cancell this appointment after
        // previous day clock 18
        var editEnds = moment(appointment.start).subtract('days', 1).startOf('day').hour(18).toDate();
        appointment.editEnds = editEnds;
        appointment.code = getAppointmentCourseCode(appointment);
        if(appointment.student) {
            appointment.color = 'red';
            appointment.reserved = true;
        }
        return appointment;
    }
});


var getAppointmentCourseCode = function(appointment) {
    var round = Rounds.findOne(appointment.round);
    if (round) {
        var course = Courses.findOne(round.course);
        return course.code;
    }
};

var getRoundCourseCode = function(round) {
    var course = Courses.findOne(round.course);
    return course.code;
};
