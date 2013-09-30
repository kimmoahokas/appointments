
Deps.autorun(function() {
    Meteor.subscribe('available-appointments', Session.get('selectedRound'));
});

var reserveCalendar;

var initReserveCalendar = function() {
    //initialize the calendar. remember to wrap the target div in template
    //with {{#constant}}{{/constant}} to protect it from meteor live updates
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
            callback(events);
        },
        eventClick: function(event) {
            Session.set('selectedAppointment', event._id);
            Deps.flush();
            return false;
        }
    });
};

Template.reserveTemplate.rendered = function() {
    if (!this._calendarRendered) {
        initReserveCalendar();
        this._calendarRendered = true;
    }
};

Template.reserveTemplate.events({
    'click #reserve-appointment-button': function(event) {
        if(Session.get('selectedAppointment')) {
            Meteor.call('reserveAppointment', Session.get('selectedAppointment'), function (error, result) {
                if(!error) {
                    alert('Appointment succesfully reserved!');
                } else {
                    alert('Error occured! Please contact course staff. Details: ' + error);
                }
            });
        }
    },
    'click #cancel-appointment-button': function(event) {
        var result = confirm('Cancel this appointment?');
        if (result) {
            var appointmentId = event.target.value;
            Meteor.call('cancelAppointment', appointmentId, function(error, result) {
                if(!error) {
                    alert('Appointment succesfully cancelled!');
                } else {
                    alert('Error occured, please contact course email! Details: ' + error.reason);
                }
            });
        }
    }
});

Template.reserveTemplate.selectedAppointment = function() {
    return Appointments.findOne(Session.get('selectedAppointment'));
};

Template.reserveTemplate.canReserve = function(editEnds) {
    return new Date() < editEnds && this.student === null;
};

Template.reserveTemplate.canCancel = function(editEnds) {
    return new Date() < editEnds &&
    (this.student === Meteor.userId() || (this.student !== null && this.assistant === Meteor.userId()));
};

// Refresh calendar widget on data change
Deps.autorun(function() {
        var count = Appointments.find().count();
        // log the count so that meteor detects data dependency
        console.log('appointment change dep fired, appointment count:', count);
        $('#reserveCalendar').fullCalendar('refetchEvents');
});
