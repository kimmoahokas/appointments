var appointmentHandle = Meteor.subscribe('all-appointments');
var roundHandle = Meteor.subscribe('all-rounds');
var userHandle = Meteor.subscribe('all-users');
var manageCalendar;

Template.manageAppointmentsTemplate.rendered = function() {
    if (!manageCalendar) {
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
    }
};


var createAppointments = function(startDate, endDate) {
    var name = $('select#round option:selected').text();
    var round = $('select#round option:selected').val();
    var duration = parseInt($('#duration_field').val(),10);
    var space = parseInt($('#space_field').val(),10);

    //TODO: check that appointments are in the ROUNDrange?
    var currentTime = startDate;
    while(currentTime < endDate) {
        var end = addMinutes(currentTime, duration);
        if (end <= endDate) {
            var appointment = {
                title: name,
                round: round,
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
            //TODO: check that appointments are in the reserved range?
            Appointments.update({_id: Session.get('editEventId')}, {
                $set: {
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
    },
    'click #manage-appointments-tab': function(event) {
        //change tabs on right
        $('li#manage-appointments-tab').addClass('active');
        $('li#manage-rounds-tab').removeClass('active');
        $('div#appointment-admin').removeClass('hidden');
        $('div#round-admin').addClass('hidden');
    },
    'click #manage-rounds-tab': function(event) {
        //change tabs on right
        $('li#manage-appointments-tab').removeClass('active');
        $('li#manage-rounds-tab').addClass('active');
        $('div#appointment-admin').addClass('hidden');
        $('div#round-admin').removeClass('hidden');
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
                var id = Rounds.insert({name:rname, max_reservations:1});
                Session.set('editRoundId', id);
                //update DOM so we can modify selection
                Deps.flush();
                var selector = "#edit-round-select option[value='" + id + "']";
                $(selector).prop('selected, true');
            }
        } else {
            Session.set('editRoundId', value);
            //update DOM so we can modify selection
            Deps.flush();
        }
    },
    'click #update_round_button': function(event) {
        if(Session.get('editRoundId')) {
            Rounds.update({_id: Session.get('editRoundId')}, {
                $set: {
                    opens: moment($('#round-open').val()).toDate(),
                    closes: moment($('#round-close').val()).toDate(),
                    max_reservations: $('#max-reservations').val()
                }
            });
        }
        return false;
    },
    'click #delete_round_button': function(event) {
        if (Session.get('editRoundId')) {
             Rounds.remove(Session.get('editRoundId'));
             var result = Meteor.call('deleteRoundAppointments', Session.get('editRoundId'));
             console.log(result);
             Session.set('editRoundId', null);
             //update DOM so we can modify selection
            Deps.flush();

        }
        return false;
    }
});

Template.manageAppointmentsTemplate.rounds = function() {
    return Rounds.find();
};

Template.manageAppointmentsTemplate.selected = function(id) {
    if(id === Session.get('editRoundId')) {
        return 'selected="selected"';
    }
};

//Terrible hack to prevent template from rerendering and destroying the calendar component
//TODO: proper protection to calendar, move these to template
var setAppointmentEditFields = function (appointment) {
    // This is actually an ugly hack, better move these to template
    if (appointment) {
        var s = moment(appointment.start);
        var e = moment(appointment.end);
        var assistant = Meteor.users.findOne(appointment.assistant);
        var student = Meteor.users.findOne(appointment.student);
        $('dd#round-title').html(appointment.title);
        $('dd#assistant-name').html(assistant.username);
        if (student) {
            $('dd#student-name').html(student.username);
        } else {
            $('dd#student-name').html('Not reserved');
        }
        $('#selected_start').val(s.format('YYYY-MM-DD[T]HH:mm'));
        $('#selected_end').val(e.format('YYYY-MM-DD[T]HH:mm'));
        $('#selected_start').prop('disabled', false);
        $('#selected_end').prop('disabled', false);
        $('#update_appointment_button').prop('disabled', false);
        $('#delete_appointment_button').prop('disabled', false);
    } else {
        $('dd#round-title').html('');
        $('dd#assistant-name').html('');
        $('dd#student-name').html('');
        $('#selected_start').val('');
        $('#selected_end').val('');
        $('#selected_start').prop('disabled', true);
        $('#selected_end').prop('disabled', true);
        $('#update_appointment_button').prop('disabled', true);
        $('#delete_appointment_button').prop('disabled', true);
    }
};

//Terrible hack to prevent template from rerendering and destroying the calendar component
//TODO: proper protection to calendar, move these to template
var setRoundEditFields = function (round) {
    if (round) {
        var s = moment(round.opens);
        var e = moment(round.closes);
        $('#round-open').val(s.format('YYYY-MM-DD[T]HH:mm'));
        $('#round-close').val(e.format('YYYY-MM-DD[T]HH:mm'));
        $('#max-reservations').val(round.max_reservations);
        $('#round-open').prop('disabled', false);
        $('#round-close').prop('disabled', false);
        $('#max-reservations').prop('disabled', false);
        $('#delete_round_button').prop('disabled', false);
        $('#update_round_button').prop('disabled', false);
    } else {
        $('#round-open').val('');
        $('#round-close').val('');
        $('#max-reservations').val('');
        $('#round-open').prop('disabled', true);
        $('#round-close').prop('disabled', true);
        $('#max-reservations').prop('disabled', true);
        $('#delete_round_button').prop('disabled', true);
        $('#update_round_button').prop('disabled', true);
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

Deps.autorun(function() {
    if (Session.get('editRoundId')) {
        var round = Rounds.findOne({_id: Session.get('editRoundId')});
        setRoundEditFields(round);
    } else {
        setRoundEditFields();
    }
});

// Refresh calendar widget on data change
Deps.autorun(function() {
        var count = Appointments.find().count();
        // log the count so that meteor detects data dependency
        console.log('appointment change dep fired, appointment count:', count);
        $('#manageCalendar').fullCalendar('refetchEvents');
});
