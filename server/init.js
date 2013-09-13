Meteor.startup(function() {
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
