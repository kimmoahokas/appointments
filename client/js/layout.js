Template.layout.timeZoneInfo = function() {
    var serverZone = moment(Session.get('serverDate')).format('Z');
    var localZone = moment().format('Z');

    console.log('local zone: ' + localZone + ', server zone: ' + serverZone);
    if (serverZone !== localZone) {
        return {
            local: localZone,
            remote: serverZone
        };
    }
};
