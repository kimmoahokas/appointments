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
