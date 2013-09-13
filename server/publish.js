Meteor.publish("available-appointments", function(roundId) {
    return Rounds.find(roundId);
});


// publish all events in db to admins
Meteor.publish('all-appointments', function() {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        if (user.profile.admin) {
            return Appointments.find();
        }
    }
});
