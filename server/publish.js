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


Meteor.publish('available-rounds', function(courseId) {
    if (this.userId) {
        var now = new Date();
        return Rounds.find({
            course: courseId,
            opens: {$lte: now},
            closes: {$gte: now}
        });
    }
});

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

// publish all events in db to admins
Meteor.publish('all-appointments', function() {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        if (user.admin) {
            return Appointments.find();
        }
    }
});

Meteor.publish('all-rounds', function() {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        if (user.admin) {
            return Rounds.find();
        }
    }
});
