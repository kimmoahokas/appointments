//Initial users of the system
var users = [
    {
        username: "admin",
        email: "admin@example.com",
        password: "reallysecret",
        admin: true,
        profile: {}
    },
    {
        username: 'Kimmo Ahokas',
        email: 'kimmo.ahokas@aalto.fi',
        password: 'salakala',
        admin: true,
        profile: {}
    },
    {
        username: 'Toivo Testaaja',
        email: 'testaaja@example.com',
        password: 'hyvinsalainen',
        admin: false,
        profile: {}
    }
];

// Initial courses
var courses = [
    {
        name: 'CSE-C2400 Tietokoneverkot',
        code: 'CSE-C2400',
        email: 'cse-c2400@aalto.fi',
        roundDefaultStart: {
            day: 3,     //wednesday this week
            hour: 18,
            minute: 0
        },
        roundDefaultEnd: {
            day: 12,    //friday next week
            hour: 18,
            minute: 0
        },
        roundDefaultMaxReservations: 1,
        defaultLocation: "Playroom (A106)"
    }
];

var addUsers = function() {
    users.forEach(function(user) {
        var result = Meteor.users.findOne({username: user.username});
        if (!result) {
            Accounts.createUser(user);
        }
    });
};

var addCourses = function() {
    courses.forEach(function(course) {
        var result = Courses.findOne({name: course.name});
        if (!result) {
            Courses.insert(course);
        }
    });
};

Meteor.startup(function() {
    addUsers();
    addCourses();
});
