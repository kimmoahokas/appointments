
Template.navbar.myCourses = function() {
    // it is enough to just return all courses, as subscriptions handle
    // permissions.
    return Courses.find();
};


Template.navbar.selectedCourse = function() {
    var courseCode = Session.get('courseCode');
    if (courseCode) {
        return Courses.findOne({code: courseCode});
    }
};
