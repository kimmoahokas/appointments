Template.manageAppointmentsTemplate.rendered = function() {
    var manageCalendar = $('#manageCalendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        columnFormat: 'ddd d.M.',
        selectable: true,
        editable: true,
        select: function(startDate, endDate) {
            if(!Meteor.user() || !Meteor.user().profile.admin) {
                //only admins can create appointments
                return;
            }
            var appointments = createAppointments(startDate, endDate);
            appointments.forEach(function(appointment) {
                manageCalendar.fullCalendar('renderEvent', appointment, true);
            });
        },
        eventClick: function(event) {
            //TODO: let user manage appointment
            return false;
        }
    });
};


var createAppointments = function(startDate, endDate) {
    var name = $('#name_field').val();
    var duration = parseInt($('#duration_field').val(),10);
    var space = parseInt($('#space_field').val(),10);

    var appointments = [];
    var currentTime = startDate;
    while(currentTime < endDate) {
        var end = addMinutes(currentTime, duration);
        if (end <= endDate) {
            var appointment = {
                title: name,
                start: currentTime,
                end: end,
                allDay:false,
                assistant: Meteor.user(),
                reserved: false
            };
            appointments.push(appointment);
        }
        currentTime = addMinutes(end, space);
    }

    return appointments;
};

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

Template.manageAppointmentsTemplate.events({
    'click #update_appointment_button': function(event) {
        alert("Update appointmen button pressed");
        return false;
    },
    'click #delete_appointment_button': function(event) {
        alert("Delete appointment button pressed");
        return false;
    }
});
