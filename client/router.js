Router.map(function() {
    this.route('home', {
        path: '/',
        renderTemplates: {
            'navbarTemplate': {to: 'navbar'},
            'calendarTemplate': {to: 'calendar'},
            'appointmentDetailsTemplate': {to: 'details'}
        }
    });
    this.route('manage', {
        renderTemplates: {
            'navbarTemplate': {to: 'navbar'},
            'calendarTemplate': {to: 'calendar'}, // normal calendar for testing
            'appointmentDetailsManageTemplate': {to: 'details'}
        }
    });
});

Router.configure({
    layout: 'layout',
    //notFoundTemplate: 'notFound',
    //loadingTemplate: 'loading'
});
