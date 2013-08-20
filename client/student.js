Template.layout.rendered = function() {
    $('#calendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
    }); // initialize the calendar
};
