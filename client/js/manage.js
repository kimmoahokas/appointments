var manageCalendar;

var initManageCalendar = function() {
    //initialize the calendar. remember to wrap the target div in template
    //with {{#constant}}{{/constant}} to protect it from meteor live updates
    manageCalendar = $('#manageCalendar').fullCalendar({
        weekends: false,
        defaultView: 'agendaWeek',
        allDaySlot: false,
        columnFormat: 'ddd d.M.',
        selectable: true,
        editable: true,
        events: function(start, end, callback) {
            var filter = Session.get('appointmentFilter');
            if (filter.start) {
                if (start > filter.start) {
                    filter.start = start;
                }
            }
            if (filter.end) {
                if (end < filter.end) {
                    filter.end = end;
                }
            }
            var events = Appointments.find(filter).fetch();
            callback(events);
        },
        select: function(startDate, endDate) {
            if($('select#round option:selected').val() === '') {
                alert('Please select round before creating slots');
                return;
            }
            var course = Session.get('selectedCourse');
            if(course && isCourseStaff(Meteor.userId(), course.code)) {
                //only admins can create appointments
                createAppointments(startDate, endDate);
            }
        },
        eventClick: function(event) {
            Session.set('editedAppointmentId', event['_id']);
            // Force DOM re-render
            //Deps.flush();
            return false;
        }
    });
};

Template.manageAppointmentsTemplate.rendered = function() {
    if (!this._calendarRendered) {
        initManageCalendar();
        this._calendarRendered = true;
    }
};

var createAppointments = function(startDate, endDate) {
    var name = $('select#round option:selected').text();
    var roundId = $('select#round option:selected').val();
    var duration = parseInt($('#duration_field').val(),10);
    var space = parseInt($('#space_field').val(),10);

    var round = Rounds.findOne(roundId);

    //TODO: check that appointments are in the ROUNDrange?
    var currentTime = startDate;
    while(currentTime < endDate) {
        var end = addMinutes(currentTime, duration);
        if (end <= endDate) {
            var appointment = {
                title: name,
                round: roundId,
                start: currentTime,
                end: end,
                allDay: false,
                assistant: Meteor.userId(),
                student: null,
                location: round.location
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
        if (Session.get('editedAppointmentId')) {
            //TODO: check that appointments are in the reserved range?
            Appointments.update({_id: Session.get('editedAppointmentId')}, {
                $set: {
                    start: moment($('#selected_start').val()).toDate(),
                    end: moment($('#selected_end').val()).toDate()
                }
            });
            $('#manageCalendar').fullCalendar('refetchEvents');
            Session.set('editedAppointmentId', null);
        }
        return false;
    },
    'click #delete_appointment_button': function(event) {
        if (Session.get('editedAppointmentId')) {
             Appointments.remove(Session.get('editedAppointmentId'));
             Session.set('editedAppointmentId', null);
        }
        return false;
    },
    //The following two events could probably be handled more elegantly with two
    //templates and router
    'click #manage-appointments-tab': function(event) {
        Session.set('selectedTab', 'manageAppointments');
    },
    'click #manage-rounds-tab': function(event) {
        Session.set('selectedTab', 'manageRounds');
    },
    'change #edit-round-select': function(event) {
        var value = $('#edit-round-select option:selected').val();
        if (value === '') {
            Session.set('editRoundId', null);
            //update DOM so we can modify selection
            Deps.flush();
            return;
        } else if (value === 'add') {
            Session.set('editRoundId', null);
            //update DOM so we can modify selection
            Deps.flush();
            var rname = prompt('Enter name for new round');
            if (rname) {
                var course = Session.get('selectedCourse');
                var id = createRound(rname, course);
                Session.set('editRoundId', id);
                //update DOM so we can modify selection
                Deps.flush();
                var selector = "#edit-round-select option[value='" + id + "']";
                $(selector).prop('selected, true');
            }
        } else {
            Session.set('editRoundId', value);
        }
    },
    'click #update_round_button': function(event) {
        if(Session.get('editRoundId')) {
            Rounds.update({_id: Session.get('editRoundId')}, {
                $set: {
                    opens: moment($('#round-open').val()).toDate(),
                    closes: moment($('#round-close').val()).toDate(),
                    max_reservations: $('#max-reservations').val(),
                    location: $('#round-location').val()
                }
            });
        }
        return false;
    },
    'click #delete_round_button': function(event) {
        if (Session.get('editRoundId')) {
             var result = Meteor.call('deleteRound', Session.get('editRoundId'));
             console.log(result);
             Session.set('editRoundId', null);
        }
        return false;
    }
});

// Helpers sahred with all three templates
// Helpers defined this way, because three templates share couple of helpers
var helpers = {
    rounds: function() {
        return Rounds.find();
    },

    toDate: function(date) {
        return moment(date).format('YYYY-MM-DD[T]HH:mm');
    }
};

// helper to select correct tab in "main" template
Template.manageAppointmentsTemplate.isSelectedTab = function(tab) {
    return Session.equals('selectedTab', tab);
};

//helpers for appoint management template
Template.manageAppointmentTab.helpers(helpers);
Template.manageAppointmentTab.editedAppointment = function() {
    return Appointments.findOne(Session.get('editedAppointmentId'));
};


//helpers for round management template
Template.manageRoundTab.helpers(helpers);
Template.manageRoundTab.currentRound = function() {
    return Rounds.findOne(Session.get('editRoundId'));
};
Template.manageRoundTab.selected = function(id) {
    if(Session.equals('editRoundId', id)) {
        return 'selected="selected"';
    }
};

// Refresh calendar widget on data change
Deps.autorun(function() {
    var filter = Session.get('appointmentFilter');
    var count = Appointments.find().count();
    $('#manageCalendar').fullCalendar('refetchEvents');
});

var createRound = function(name, course) {
    var s = course.roundDefaultStart;
    var c = course.roundDefaultEnd;
    var open = moment().day(s.day).hour(s.hour).minute(s.minute).millisecond(0).toDate();
    var close = moment().day(c.day).hour(c.hour).minute(c.minute).millisecond(0).toDate();
    var id = Rounds.insert({
        course: course._id,
        name: name,
        location: course.defaultLocation,
        max_reservations: course.roundDefaultMaxReservations,
        opens: open,
        closes: close
    });
    return id;
};
