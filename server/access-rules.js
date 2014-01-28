Appointments.allow({
    insert: function (userId, doc) {
        //only admins can add appointments
        if (userId) {
            var user = Meteor.users.findOne(userId);
            return user.admin;
        }
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        //TODO: allow reserving the appointment
        if (userId) {
            var user = Meteor.users.findOne(userId);
            return user.admin;
        }
        return false;
    },
    remove: function (userId, doc) {
        if (userId) {
            var user = Meteor.users.findOne(userId);
            return user.admin;
        }
        return false;
    }
});

Rounds.allow({
    insert: function (userId, doc) {
        //only admins can add appointments
        if (userId) {
            var user = Meteor.users.findOne(userId);
            return user.admin;
        }
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        //TODO: allow reserving the appointment
        if (userId) {
            var user = Meteor.users.findOne(userId);
            return user.admin;
        }
        return false;
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        if (userId) {
            var user = Meteor.users.findOne(userId);
            return user.admin;
        }
        return false;
    }
});
