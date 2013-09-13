var appointmentHandle = Meteor.subscribe('all-appointments');
var manageCalendar;


Template.manageAppointmentsTemplate.rendered = function() {
    manageCalendar = $('#manageCalendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        columnFormat: 'ddd d.M.',
        selectable: true,
        editable: true,
        events: function(start, end, callback) {
            var events = Appointments.find({$and: [
                {start: {$gte: start}},
                {end: {$lte: end}}
            ]}).fetch();
            //TODO: color reserved appointments?
            callback(events);
        },
        select: function(startDate, endDate) {
            if(!Meteor.user() || !Meteor.user().profile.admin) {
                //only admins can create appointments
                return;
            }
            createAppointments(startDate, endDate);
        },
        eventClick: function(event) {
            Session.set('editEventId', event['_id']);
            // Force DOM re-render
            Deps.flush();
            return false;
        }
    });
};


var createAppointments = function(startDate, endDate) {
    var name = $('#name_field').val();
    var duration = parseInt($('#duration_field').val(),10);
    var space = parseInt($('#space_field').val(),10);

    var currentTime = startDate;
    while(currentTime < endDate) {
        var end = addMinutes(currentTime, duration);
        if (end <= endDate) {
            var appointment = {
                title: name,
                start: currentTime,
                end: end,
                allDay: false,
                assistant: Meteor.userId(),
                student: null,
            };
            Appointments.insert(appointment);
        }
        currentTime = addMinutes(end, space);
    }
    Deps.flush();
};

var addMinutes = function(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
};

Template.manageAppointmentsTemplate.events({
    'click #update_appointment_button': function(event) {
        if (Session.get('editEventId')) {
            Appointments.update({_id: Session.get('editEventId')}, {
                $set: {
                    title: $('#selected_name').val(),
                    start: moment($('#selected_start').val()).toDate(),
                    end: moment($('#selected_end').val()).toDate()
                }
            });
            $('#manageCalendar').fullCalendar('refetchEvents');
            Session.set('editEventId', null);
        }
        return false;
    },
    'click #delete_appointment_button': function(event) {
        if (Session.get('editEventId')) {
             Appointments.remove(Session.get('editEventId'));
             Session.set('editEventId', null);
        }
        return false;
    }
});

var setAppointmentEditFields = function (appointment) {
    if (appointment) {
        var s = moment(appointment.start);
        var e = moment(appointment.end);
        $('#selected_name').val(appointment.title);
        $('#selected_start').val(s.format('YYYY-MM-DD[T]HH:mm'));
        $('#selected_end').val(e.format('YYYY-MM-DD[T]HH:mm'));
        $('#selected_name').prop('disabled', false);
        $('#selected_start').prop('disabled', false);
        $('#selected_end').prop('disabled', false);
        $('#update_appointment_button').prop('disabled', false);
        $('#delete_appointment_button').prop('disabled', false);
    } else {
        $('#selected_name').val('');
        $('#selected_start').val('');
        $('#selected_end').val('');
        $('#selected_name').prop('disabled', true);
        $('#selected_start').prop('disabled', true);
        $('#selected_end').prop('disabled', true);
        $('#update_appointment_button').prop('disabled', true);
        $('#delete_appointment_button').prop('disabled', true);
    }
};

// On event click set event details to modification form
Deps.autorun(function() {
    if (Session.get('editEventId')) {
        var appointment = Appointments.findOne({_id: Session.get('editEventId')});
        setAppointmentEditFields(appointment);
    } else {
        setAppointmentEditFields();
    }
});

// Refresh calendar widget on data change
Deps.autorun(function() {
        var count = Appointments.find().count();
        // log the count so that meteor detects data dependency
        console.log('appointment change dep fired, appointment count:', count);
        $('#manageCalendar').fullCalendar('refetchEvents');
});
