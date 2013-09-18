Router.configure({
    layout: 'layout',
    //notFoundTemplate: 'notFound',
    //loadingTemplate: 'loading'
    renderTemplates: {
        'navbarTemplate': {to: 'navbar'}
    }
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'selectRound',
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
        path: '/round/:_id',
        controller: 'ReserveController',
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

ReserveController = RouteController.extend({
    template:'reserveTemplate',

    run: function() {
        Session.set('selectedRound', this.params._id);
        this.render({'navbarTemplate': {to: 'navbar'}});
        this.render('reserveTemplate');
    }
});

