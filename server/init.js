Meteor.startup(function() {
    // create admin users
    var users = [
        {username: 'Kimmo Ahokas', email: 'kimmo.ahokas@aalto.fi', password: 'salakala', profile: {admin: true}},
        {username: 'Toivo Testaaja', email: 'testaaja@example.com', password: 'hyvinsalainen', profile: {admin: false}},
    ];
    users.forEach(function(user) {
        var result = Meteor.users.findOne({username: user.username});
        if (!result) {
            Accounts.createUser(user);
        }
    });
});
