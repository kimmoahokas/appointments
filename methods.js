//Define database update/fetch methods for clients

Meteor.methods({
    reserveAppointment: function(appointmentId) {
        check(appointmentId, String);
        if(!this.userId) {
            throw new Meteor.Error(403, 'You must be logged in to reserve appointment!');
        }

        var appointment = Appointments.findOne(appointmentId);
        if(!appointment) {
            throw new Meteor.Error(403, 'Invalid appointment!');
        }
        if (appointment.student) {
            throw new Meteor.Error(403, 'Appointment already reserved!');
        }
        var student = Meteor.users.findOne(this.userId);
        var assistant = Meteor.users.findOne(appointment.assistant);

        if(Meteor.isServer && student && assistant) {
            Appointments.update(appointmentId, {$set: {student: this.userId}});
            sendReservationEmails(this.userId, appointmentId);
            return true;
        }
    },
    cancelAppointment: function(appointmentId) {
        check(appointmentId, String);
        if(!this.userId) {
            throw new Meteor.Error(403, 'You must be logged in to cancel appointment!');
        }

        var appointment = Appointments.findOne(appointmentId);
        if(!appointment) {
            throw new Meteor.Error(403, 'Invalid appointment!');
        }
        if (appointment.student != this.userId) {
            throw new Meteor.Error(403, 'You have not reserved this appointment!');
        }
        if(Meteor.isServer) {
            Appointments.update(appointmentId, {$set: {student: null}});
            sendCancellationEmails(this.userId, appointmentId);
            return true;
        }
    },
    deleteRound: function(roundId) {
        check(roundId, String);
        var round = Rounds.findOne(roundId);
        var course = Courses.findOne(round.course);
        if (Meteor.isServer && isCourseStaff(this.userId, course.code)) {
            Appointments.remove({round: roundId});
            Rounds.remove(roundId);
            return true;
        }
    },
    'addMultipleUsers': function(formData) {
        //TODO: security!
        //validate the array
        if (!this.userId) {
            throw new Meteor.Error(403, 'You must be logged in!');
        }
        var user = Meteor.users.findOne(this.userId);
        if (!user && !user.admin) {
            throw new Meteor.Error(403, 'You must be admin!');
        }
        var matcher = Match.ObjectIncluding({
            courseId: String,
            admin: Boolean,
            assistant: Boolean,
            userData: [Match.ObjectIncluding({
                name: String,
                email: String
            })]
        });
        check(formData, matcher);

        var course = Courses.findOne(formData.courseId);
        if (!course) {
            throw new Meteor.Error(403, 'Invalid course!');
        }

        if (Meteor.isServer) {
            formData.userData.forEach(function(userObject) {
                var existingUser = Meteor.users.findOne({'emails.address': userObject.email});
                if (existingUser) {
                    AddUserToCourse(existingUser, course, formData.assistant);
                    sendCourseEnrolmentEmail(existingUser, course);
                } else {
                    var password = generatePassword();
                    Accounts.createUser({
                        username: userObject.name,
                        email: userObject.email,
                        password: password,
                        admin: formData.admin,
                        courses: [{
                            code: course.code,
                            assistant: formData.assistant
                        }]
                    });
                    sendRegistrationEmail(userObject.email, password, course);
                }
            });
        }
    },
    'getServerTimeZone': function() {
        if(Meteor.isServer) {
            return moment().format('Z');
        }
    }
});

var AddUserToCourse = function(user, course, isAssistant) {
    var courseInfo = _.where(user.courses, {code: course.code});
    if (courseInfo.length < 1) {
        user.courses.push({code: course.code, assistant: isAssistant});
        Meteor.users.update(user._id, {
            $set: {courses: user.courses}
        });
    }
};

var generatePassword = function() {
    //handy trick from http://stackoverflow.com/a/9719815
    return Math.random().toString(36).slice(-8);
};
