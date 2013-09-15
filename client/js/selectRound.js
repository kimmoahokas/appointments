Meteor.subscribe('available-rounds');

Template.selectRound.events({
    'change #round-select': function(event) {
        var value = $('#round-select option:selected').val();
        Router.go('reserve', {_id: value});
    }
});
