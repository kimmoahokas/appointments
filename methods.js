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
    'addMultipleUsers': function(userarray) {
        //TODO: security!
        //validate the array
        check(userarray, Array);
        userarray.forEach(function(entry) {
            check(entry, {
                username: String,
                password: String,
                email: String,
                courses: Array,
                profile: Match.Optional(Object)
            });
            // for simplicity add profile:{admin: false} to every object
            if (!entry.profile) {
                entry.profile = {};
            }
            if (!entry.admin) {
                entry.admin = false;
            }
        });
        userarray.forEach(function(user) {
            var result = Meteor.users.findOne({username: user.username});
            if (!result) {
                Accounts.createUser(user);
            }
        });
    },
    'getServerTimeZone': function() {
        if(Meteor.isServer) {
            return moment().format('Z');
        }
    }
});
