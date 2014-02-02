Appointments.allow({
    insert: function (userId, doc) {
        return isAppointmentEditPermitted(userId, doc);
    },
    update: function (userId, doc, fields, modifier) {
        return isAppointmentEditPermitted(userId, doc);
    },
    remove: function (userId, doc) {
        return isAppointmentEditPermitted(userId, doc);
    }
});

Rounds.allow({
    insert: function (userId, doc) {
        return isRoundEditPermitted(userId, doc);
    },
    update: function (userId, doc, fields, modifier) {
        return isRoundEditPermitted(userId, doc);
    },
    remove: function (userId, doc) {
        return isRoundEditPermitted(userId, doc);
    }
});

 var isAppointmentEditPermitted = function(userId, doc) {
    var roundId = doc.round;
    var round = Rounds.findOne(roundId);
    var course = Courses.findOne(round.course);
    return isCourseStaff(userId, course.code);
};

var isRoundEditPermitted = function(userId, doc) {
    var course = Courses.findOne(doc.course);
    return isCourseStaff(userId, course.code);
};
