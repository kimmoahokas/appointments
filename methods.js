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
            var mail = {
                from: 'T-110.5102@list.aalto.fi',
                to: contactEmail(student),
                replyTo: 'T-110.5102@list.aalto.fi',
                subject: 'T-110.5102 Appointment',
                text:
"You have just reserved appointment on course\n" +
"T-110.5102 Laboratory Works in Networking and Security\n" +
"Details:\n" +
"   Date: " + moment(appointment.start).format(Settings.dateFormat) + "\n" +
"   Time: " + moment(appointment.start).format(Settings.timeFormat) + ' - ' + moment(appointment.end).format(Settings.timeFormat) + "\n" +
"   Location: Computer Science building room A120 (Playroom)\n" +
"   Student: " + student.username + "\n" +
"You can cancel this appointment until " + moment(appointment.editEnds).format(Settings.dateTimeFormat) + "\n" +
"To cancel go to " + Router.url('my_appointments') + '\n' +
"Remember to be on time!\n" +
"If you can't come to appointment, contact course email immediately!\n\n" +
"Best regards,\n" +
"T-110.5102 Staff\n"
            };

            // Send two separate emails so that students don't see assistant name
            Email.send(mail);
            mail.to = contactEmail(assistant);
            Email.send(mail);
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
            var student = Meteor.users.findOne(this.userId);
            var assistant = Meteor.users.findOne(appointment.assistant);
            Appointments.update(appointmentId, {$set: {student: null}});
            var mail = {
                from: 'T-110.5102@list.aalto.fi',
                to: contactEmail(student),
                replyTo: 'T-110.5102@list.aalto.fi',
                subject: 'T-110.5102 Appointment cancelled',
                text:
"You have just cancelled appointment on course\n" +
"T-110.5102 Laboratory Works in Networking and Security\n" +
"Details:\n" +
"   Date: " + moment(appointment.start).format(Settings.dateFormat) + "\n" +
"   Time: " + moment(appointment.start).format(Settings.timeFormat) + ' - ' + moment(appointment.end).format(Settings.timeFormat) + "\n" +
"   Location: Computer Science building room A120 (Playroom)\n" +
"   Student: " + student.username + "\n\n" +
"Best regards,\n" +
"T-110.5102 Staff\n"
            };

            // Send two separate emails so that students don't see assistant name
            Email.send(mail);
            mail.to = contactEmail(assistant);
            Email.send(mail);
            return true;
        }
    },
    deleteRoundAppointments: function(roundId) {
        check(roundId, String);
        if (this.userId && Meteor.isServer) {
            user = Meteor.users.findOne(this.userId);
            if (user.profile.admin) {
                Appointments.remove({round: roundId});
            }
            return true;
        }
    },
    'addMultipleUsers': function(userarray) {
        //validate the array
        check(userarray, Array);
        userarray.forEach(function(entry) {
            check(entry, {
                username: String,
                password: String,
                email: String,
                profile: Match.Optional(Object)
            });
            // for simplicity add profile:{admin: false} to every object
            if (!entry.profile) {
                entry.profile = {};
            }
            if (!entry.profile.admin) {
                entry.profile.admin = false;
            }
        });
        userarray.forEach(function(user) {
            var result = Meteor.users.findOne({username: user.username});
            if (!result) {
                Accounts.createUser(user);
            }
        });
    },
    'getServerDate': function() {
        if(Meteor.isServer) {
            return new Date();
        }
    }
});

var contactEmail = function (user) {
    if (user.emails && user.emails.length) {
        return user.emails[0].address;
    }
    return null;
};
