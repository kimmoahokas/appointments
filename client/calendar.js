Template.calendarTemplate.rendered = function() {
    var calendar = $('#calendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        columnFormat: 'ddd d.M.',
        selectable: true,
        editable: true,
        select: function(startDate, endDate, allDay, jsEvent, view) {
            if (console) {
                console.log('start:', startDate, 'end:', endDate, 'duration:', endDate - startDate);
            }
            var appointments = createAppointments(startDate, endDate);
            appointments.forEach(function(appointment) {
                calendar.fullCalendar('renderEvent', appointment, true);
            });
        }
    });
};


var createAppointments = function(startDate, endDate) {
    if(!Meteor.user() || !Meteor.user().profile.admin) {
        //only admins can create appointments
        return false;
    }
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
