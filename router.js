Router.configure({
    //render the router manually to index template. this should be a little
    // faster as the router does not need to render navbar.
    autoRender: false,
    notFoundTemplate: 'notFound',
    //loadingTemplate: 'loading'
});

Router.map(function() {
    this.route('selectCourse', {
        path: '/',
        template: 'selectCourse',
        data: function() {
            return {courses: Courses.find()};
        }
    });
    this.route('selectRound', {
        path: '/:code/rounds',
        template: 'selectRound',
        before: function() {
            Session.set('courseCode', this.params.code);
        },
        data: function() {
            var now = new Date();
            var rounds = Rounds.find({
                opens: {$lte: now},
                closes: {$gte: now}
            });
            return {rounds:rounds};
        }
    });
    this.route('reserve', {
        path: '/:code/rounds/:slug',
        template: 'reserveTemplate',
        before: function() {
            Session.set('courseCode', this.params.code);
            Session.set('roundSlug', this.params.slug);
        }
    });
    this.route('manage', {
        template:'manageAppointmentsTemplate',
    });
    this.route('my_appointments', {
        template: 'appointmentListTemplate',
    });
    this.route('manage_users', {
        template: 'manageUsersTemplate',
    });
});
