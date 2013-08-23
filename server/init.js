Meteor.startup(function() {
    
    // configure the app //
    
    // forbid users from changing their user document
    Meteor.users.deny({update: function () { return true; }});
    
    
    // create test data
    if (Appointments.find().count() === 0) {
        Appointments.insert({"title": "test1", "start" : "2013-08-19T13:00:00Z", "end" : "2013-08-19T13:30:00Z"});
    }

    // create admin users
    if (Meteor.users.find({username: "ato"}).count() === 0) {
        Accounts.createUser({
            username: "ato",
            email: "antti.tolonen@gmail.com",
            password: "changeMeNow",
            profile: { admin: true }
        });
    }
});
