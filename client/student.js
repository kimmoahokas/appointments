Template.info.events({
    'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
});

Meteor.startup(function() {
    $('#calendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
    }); // initialize the calendar
});
