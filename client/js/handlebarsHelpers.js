//register global handlebars helpers that are available on all templates

Handlebars.registerHelper('canEdit', function(editEnds) {
    //this = appointment, only students can cancel appointments
    return new Date() < editEnds && Meteor.userId() === this.assistant;
});

Handlebars.registerHelper('getUserName', function(userId) {
    var user = Meteor.users.findOne(userId);
    return user ? user.username : 'Not available';
});

Handlebars.registerHelper('formatDate', function(date) {
    return moment(date).format(Settings.dateFormat);
});

Handlebars.registerHelper('formatTime', function(date) {
    return moment(date).format(Settings.timeFormat);
});

Handlebars.registerHelper('formatDateTime', function(date) {
    return moment(date).format(Settings.dateTimeFormat);
});

Handlebars.registerHelper('getRoundName', function(roundId) {
    var round = Rounds.findOne(roundId);
    return round.name;
});

Handlebars.registerHelper('selectedCourse', function() {
    return Session.get('selectedCourse');
});

Handlebars.registerHelper('myCourses', function() {
    // it is enough to just return all courses, as subscriptions handle
    // permissions.
    return Courses.find();
});

// from lib/helpers.js
Handlebars.registerHelper('isCourseStaff', function() {
    var course = Session.get('currentCourse');
    if (course) {
        return isCourseStaff(Meteor.userId(), course.code);
    } else {
        return false;
    }
});


// this is for the basic layout, but as it is not a template, the function must
// be added globally
Handlebars.registerHelper('timeZoneInfo',function() {
    var serverZone = Session.get('serverTimeZone');
    var localZone = moment().format('Z');

    console.log('local zone: ' + localZone + ', server zone: ' + serverZone);
    if (serverZone !== localZone) {
        return {
            local: localZone,
            remote: serverZone
        };
    }
});
