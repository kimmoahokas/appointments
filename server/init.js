//Initial users of the system
var users = [
    {
        username: 'Toivo Testaaja',
        email: 'testaaja@example.com',
        password: 'hyvinsalainen',
        admin: true,
        courses: [
            {code: 'CSE-C2400', assistant: false}
        ],
        profile: {}
    }
];

// List of courses to add to the system
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
        defaultLocation: "Playroom (A120)"
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
