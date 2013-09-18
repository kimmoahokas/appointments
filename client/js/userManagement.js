
Template.manageUsersTemplate.events({
    'click #add-users-tab': function(event) {
        Session.set('userManagementSelectedTab', 'addUsers');
    },
    'click #manage-users-tab': function(event) {
        Session.set('userManagementSelectedTab', 'manageUsers');
    },
});


Template.manageUsersTemplate.isSelectedTab = function(tab) {
    return Session.get('userManagementSelectedTab') === tab;
};

Template.addUsersTab.events({
    'click #add-users-button': function(event) {
        var text = $('textarea#multiple-users').val();
        try {
             var array = $.parseJSON(text);
             // no errors, so assume that the object is good and send it to server
             Meteor.call('addMultipleUsers', array, function(err, result) {
                if (!err) {
                    alert("Users succesfully added!");
                } else {
                    alert("Error! Details: " + err.reason);
                }
             });
        } catch(expection) {
            alert("Unable to Parse JSON. Please fix your syntax");
        }
    }
});
