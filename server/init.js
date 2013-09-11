Meteor.startup(function() {
    // create test data
    if (Appointments.find().count() === 0) {
        Appointments.insert({"title": "test1", "start" : "2013-08-26T13:00:00Z", "end" : "2013-08-26T13:30:00Z"});
    }

    // create admin users
    if (Meteor.users.find({username: "admin"}).count() === 0) {
        Accounts.createUser({
            username: "admin",
            email: "admin@example.com",
            password: "reallysecret",
            profile: { admin: true }
        });
    }
});
