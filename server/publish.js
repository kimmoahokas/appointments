Meteor.publish("userData", function () {
    return Meteor.users.find(
        {_id: this.userId},
        {fields: {'admin': 1, 'courses': 1}});
});

Meteor.publish("courseUsers", function(courseCode) {
    if (isCourseStaff(this.userId, courseCode)) {
        return Meteor.users.find(
            {'courses.code': courseCode},
            {fields: {username: 1, emails: 1, profile: 1, 'admin': 1, 'courses': 1}}
        );
    }
    return null;
});


Meteor.publish('courses', function() {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        if (user) {
            if (user.admin) {
                return Courses.find();
            } else {
                var courseCodes = _.pluck(user.courses, 'code');
                return Courses.find({
                    code: {$in: courseCodes}
                });
            }
        }
    }
});

//TODO: check that user is endolled to the course
Meteor.publish('rounds', function(courseCode) {
    var course = Courses.findOne({code: courseCode});
    if (course) {
        if (isCourseStaff(this.userId, courseCode)) {
            return Rounds.find({course: course._id});
        }
        else if (this.userId) {
            var now = new Date();
            return Rounds.find({
                course: course._id,
                opens: {$lte: now},
                closes: {$gte: now}
            });
        }
    }
});


//TODO: check that user is enrolled to the course where this round belongs to
Meteor.publish('available-appointments', function(roundId) {
    if (this.userId) {
        // if clock is over 18, don't allow reservations for tomorrow
        var earliest;
        if (moment().hour() >= 18) {
            earliest = moment().add('days', 2).startOf('day').toDate();
        } else {
            earliest = moment().add('days', 1).startOf('day').toDate();
        }
        return Appointments.find(
            {
                round: roundId,
                start: {$gt: earliest},
                student: null
            },
            {fields: {assistant: 0}}
        );
    }
});

//TODO: only publish appointments related to selected course
Meteor.publish('my-appointments', function() {
    if (this.userId) {
        var now = new Date();
        return Appointments.find(
            {
                $or: [
                    {assistant: this.userId, student: {$ne: null}},
                    {student: this.userId}
                ]
            },
            {fields: {assistant: 0}}
        );
    }
});

Meteor.publish('all-appointments', function(courseCode) {
    if (courseCode && isCourseStaff(this.userId, courseCode)) {
        var course = Courses.findOne({code: courseCode});
        var rounds = Rounds.find({course: course._id}, {fields: {_id: 1}}).fetch();
        var roundIds = _.pluck(rounds, '_id');
        return Appointments.find({round: {$in: roundIds}});
    }
});
