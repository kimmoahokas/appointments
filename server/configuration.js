// when creating accounts, also add admin and courses fields
Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        user.profile = options.profile;
    }
    if (options.admin) {
        user.admin = options.admin;
    }
    if (options.courses) {
        user.courses = options.courses;
    }
    return user;
});
