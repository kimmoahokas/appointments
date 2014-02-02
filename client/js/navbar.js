Template.navbar.events({
    // in navigation bar stay in the same page but change course
    'click ul#course-select li': function(event) {
        var currentRoute = Router.current();
        // currentRoute might be null because Router.current() is reactive
        if (currentRoute) {
            var routeName = currentRoute.route.name;
            var code = event.currentTarget.dataset.value;
            Router.go(routeName, {code: code});
        }
    }
});

//TODO: miten käsitellään routet jotka eivät liity kursseihin?
