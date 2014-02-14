contactEmail = function (user) {
    if (user.emails && user.emails.length) {
        return user.emails[0].address;
    }
    return null;
};

getAppointmentInfo = function(studentId, appointmentId) {
    var appointment = Appointments.findOne(appointmentId);
    var round = Rounds.findOne(appointment.round);
    var course = Courses.findOne(round.course);
    var student = Meteor.users.findOne(studentId);
    var assistant = Meteor.users.findOne(appointment.assistant);

    return {
        appointment: appointment,
        round: round,
        course: course,
        student: student,
        assistant: assistant
    };
};

isCourseStaff = function(userId, courseCode) {
    if (!courseCode || !userId) {
        return false;
    }
    var user = Meteor.users.findOne(userId);
    if (!user) {
        return false;
    }
    if (user && user.admin) {
        return true;
    }
    var courseInfo = _.find(user.courses, function(c) {
        return c.code == courseCode;
    });
    if (!courseInfo) {
        return false;
    }
    return courseInfo.assistant;
};
