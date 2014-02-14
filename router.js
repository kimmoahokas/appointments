Router.configure({
    //render the router manually to index template. this should be a little
    // faster as the router does not need to render navbar.
    autoRender: false,
    notFoundTemplate: 'notFound',
    //loadingTemplate: 'loading'
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'selectCourse',
        load: function() {
            setCurrentCourse( null);
        },
        data: function() {
            return {courses: Courses.find()};
        }
    });
    this.route('course', {
        path: '/:code/rounds',
        template: 'selectRound',
        load: function() {
            setCurrentCourse(this.params.code);
        },
        data: function() {
            var now = new Date();
            var rounds = Rounds.find({
                opens: {$lte: now},
                closes: {$gte: now}
            });
            return {
                rounds:rounds
            };
        }
    });
    this.route('reserve', {
        path: '/:code/rounds/:_id',
        template: 'reserveTemplate',
        load: function() {
            setCurrentCourse(this.params.code);
            Session.set('selectedRound', this.params._id);
        },
        unload: function() {
            Session.set('selectedRound', null);
        }
    });
    this.route('manage', {
        path: '/:code/manage',
        template:'manageAppointmentsTemplate',
        load: function() {
            setCurrentCourse(this.params.code);
        }
    });
    this.route('my_appointments', {
        path: '/:code/my_appointments',
        template: 'appointmentListTemplate',
        load: function() {
            setCurrentCourse(this.params.code);
        }
    });
    this.route('manage_users', {
        template: 'manageUsersTemplate',
    });
});
