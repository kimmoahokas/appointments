
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
        var formData = readUserAddFormData();
         Meteor.call('addMultipleUsers', formData, function(err, result) {
            if (!err) {
                alert("Users succesfully added!");
            } else {
                alert("Error! Details: " + err.reason);
            }
         });
        event.preventDefault();
    }
});


var readUserAddFormData = function() {
    var rawData = {};
    $.each($('#addUsersForm').serializeArray(), function() {
        rawData[this.name] = this.value;
    });
    var users = rawData['multiple-users'].replace('\r', '');
    var userStringArray = users.split('\n');
    var userArray = [];
    userStringArray.forEach(function(data) {
        var parts = data.split(',');
        userArray.push({
            email: parts[0].trim(),
            name: parts[1].trim()

        });
    });

    var serializedData = {
        courseId: rawData['course-select'],
        admin: rawData['admin-select'] === 'true',
        assistant: rawData['assistant-select'] === 'true',
        userData: userArray
    };
    return serializedData;
};

