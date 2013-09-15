Meteor.subscribe('my-appointments');

//TODO: add some control to only show old/future/etc appointments

Template.appointmentListTemplate.appointments = function() {
    var appointments = Appointments.find({
        $or: [
            {assistant: Meteor.userId(), student: {$ne: null}},
            {student: Meteor.userId()}
        ]
    }, {
        sort: {start : 1},
        transform: function(app) {
            var student = Meteor.users.findOne(app.student);
            if (student) {
                app.student = student.username;
            }
            var assistant = Meteor.users.findOne(app.assistant);
            if (assistant) {
                app.assistant = assistant.username;
            } else {
                app.assistant = "Not available";
            }

            app.start = moment(app.start).format('LLLL');
            app.end = moment(app.end).format('LLLL');
            return app;
        }
    });
    return appointments;
};
