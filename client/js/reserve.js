
Deps.autorun(function() {
    Meteor.subscribe('available-appointments', Session.get('selectedRound'));
});

var reserveCalendar;

Template.reserveTemplate.rendered = function() {
    reserveCalendar = $('#reserveCalendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        columnFormat: 'ddd d.M.',
        selectable: false,
        //the calendar must be editable, so we can modify it after creation
        editable: true,
        eventColor: 'blue',
        events: function(start, end, callback) {
            var events = Appointments.find({
                round: Session.get('selectedRound'),
                $or: [
                    {student: null},
                    {student: Meteor.userId()}
                ],
                start: {$gte: start},
                end: {$lte: end}
            }).fetch();
            //TODO: color reserved appointments?
            callback(events);
        },
        eventClick: function(event) {
            Session.set('selectedAppointment', event._id);
            Deps.flush();
            return false;
        }
    });
};

Template.reserveTemplate.events({
    'click #reserve-appointment-button': function(event) {
        if(Session.get('selectedAppointment')) {
            Meteor.call('reserveAppointment', Session.get('selectedAppointment'), function (error, result) {
                if(!error) {
                    alert('Appointment succesfully reserved!');
                } else {
                    alert('Error occured! Please contact course staff');
                }
            });
        }
    }
});

var showAppointmentDetails = function(appointment) {
    if(appointment) {
        $('#reserve-round-title').html(appointment.title);
        $('#reserve-start').html(moment(appointment.start).format('LLLL'));
        $('#reserve-end').html(moment(appointment.end).format('LLLL'));
        if (appointment.student) {
            var student = Meteor.users.findOne(appointment.student);
            $('#reserve-student-name').html(student.username);
        } else {
            $('#reserve-student-name').html('Not reserved');
        }
        $('#reserve-appointment-button').prop('disabled', false);
    } else {
        $('#reserve-round-title').html('');
        $('#reserve-start').html('');
        $('#reserve-end').html('');
        $('#reserve-student-name').html('student.username');
        $('#reserve-appointment-button').prop('disabled', true);
    }
};

// On event click show event details
Deps.autorun(function() {
    if (Session.get('selectedAppointment')) {
        var appointment = Appointments.findOne({_id: Session.get('selectedAppointment')});
        showAppointmentDetails(appointment);
    } else {
        showAppointmentDetails();
    }
});

// Refresh calendar widget on data change
Deps.autorun(function() {
        var count = Appointments.find().count();
        // log the count so that meteor detects data dependency
        console.log('appointment change dep fired, appointment count:', count);
        $('#reserveCalendar').fullCalendar('refetchEvents');
});
