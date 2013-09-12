Router.map(function() {
    this.route('home', {
        path: '/',
        renderTemplates: {
            'navbarTemplate': {to: 'navbar'},
            'reserveTemplate': {to: 'main'}
        }
    });
    this.route('manage', {
        renderTemplates: {
            'navbarTemplate': {to: 'navbar'},
            'manageAppointmentsTemplate': {to: 'main'}
        }
    });
    this.route('my_appointments', {
        renderTemplates: {
            'navbarTemplate': {to: 'navbar'},
            'appointmentListTemplate': {to: 'main'}
        }
    });
});

Router.configure({
    layout: 'layout',
    //notFoundTemplate: 'notFound',
    //loadingTemplate: 'loading'
});
