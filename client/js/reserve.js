Template.reserveTemplate.rendered = function() {
    var manageCalendar = $('#reserveCalendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        columnFormat: 'ddd d.M.',
        selectable: false,
        //the calendar must be editable, so we can modify it after creation
        editable: true,
        eventClick: function(event) {
            //TODO: show appointment details and let user reserve this appointment
            return false;
        }
    });
};
