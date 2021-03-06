Template.filterTemplate.filter = function() {
    return Session.get('appointmentFilter');
};

Template.filterTemplate.rounds = function() {
    //TODO: need a better way to determine which rounds to show in filter
    return Rounds.find();
};

Template.filterTemplate.assistants = function() {
    var course = Session.get('selectedCourse');
    if (course) {
        return Meteor.users.find({
            'courses.code': course.code,
            'courses.assistant': true
        });
    }
};

// little helpers to determine button states
Template.filterTemplate.showAllActive = function() {
    var filter = Session.get('appointmentFilter');
    return !('student' in filter);
};
Template.filterTemplate.showUnreservedActive = function() {
    var filter = Session.get('appointmentFilter');
    return ('student' in filter && filter.student === null);
};
Template.filterTemplate.showReservedActive = function() {
    var filter = Session.get('appointmentFilter');
    return ('student' in filter && filter.student !== null);
};

Template.filterTemplate.events({
    'click button#show-old': function(event) {
        var filter = Session.get('appointmentFilter');
        if (filter.end) {
            delete filter.end;
        } else {
            filter.end = {$gte: new Date()};
        }
        Session.set('appointmentFilter', filter);
    },
    'click button#show-all': function(event) {
        var filter = Session.get('appointmentFilter');
        delete filter.student;
        Session.set('appointmentFilter', filter);
    },
    'click button#show-unreserved': function(event) {
        var filter = Session.get('appointmentFilter');
        filter.student = null;
        Session.set('appointmentFilter', filter);
    },
    'click button#show-reserved': function(event) {
        var filter = Session.get('appointmentFilter');
        filter.student = {$ne: null};
        Session.set('appointmentFilter', filter);
    },
    'click ul#round-select li': function(event) {
        var filter = Session.get('appointmentFilter');
        var id = event.target.dataset.value;
        if (id === '') {
            delete filter.round;
        } else {
            filter.round = id;
        }
        Session.set('appointmentFilter', filter);
    },
    'click ul#assistant-select li': function(event) {
        var filter = Session.get('appointmentFilter');
        var id = event.target.dataset.value;
        if (id === '') {
            delete filter.assistant;
        } else {
            filter.assistant = id;
        }
        Session.set('appointmentFilter', filter);
    }
});
