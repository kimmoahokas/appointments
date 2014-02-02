// send notification email about reserved appointment to student and assistant
// studentId is needed as a parameter, as it might not be in db yet.
sendReservationEmails = function(studentId, appointmentId) {
    var data = getAppointmentInfo(studentId, appointmentId);

    // Send two separate emails so that students don't see assistant name
    var mail = formatEmail(data, 'studentReserve');
    mail.subject = data.course.code + ' appointment reserved';
    mail.to = contactEmail(data.student);
    Email.send(mail);
    mail = formatEmail(data, 'assistantReserve');
    mail.subject = data.course.code + ' appointment reserved';
    mail.to = contactEmail(data.assistant);
    Email.send(mail);
};

// send notification email about cancelled appointment to student and assistant
// studentId is needed as a parameter, as it might have been removed from db.
sendCancellationEmails = function(studentId, appointmentId) {
    var data = getAppointmentInfo(studentId, appointmentId);

    // Send two separate emails so that students don't see assistant name
    var mail = formatEmail(data, 'studentCancel');
    mail.subject = data.course.code + ' appointment cancelled';
    mail.to = contactEmail(data.student);
    Email.send(mail);
    mail = formatEmail(data, 'assistantCancel');
    mail.subject = data.course.code + ' appointment cancelled';
    mail.to = contactEmail(assistant);
    Email.send(mail);
};

var formatEmail = function(data, template) {
    var content = Handlebars.templates[template]({
        courseName: data.course.name,
        courseCode: data.course.code,
        courseEmail: data.course.email,
        round: data.round.name,
        location: data.round.location,
        date: moment(data.appointment.start).format(Settings.dateFormat),
        time: moment(data.appointment.start).format(Settings.timeFormat) + ' - ' +
              moment(data.appointment.end).format(Settings.timeFormat),
        lastCancel: moment(data.appointment.editEnds).format(Settings.dateTimeFormat),
        modifyUrl: Router.routes['my_appointments'].url({code: data.course.code}),
        student: data.student.username,
        assistant: data.assistant.username
    });

    return {
        from: data.course.email,
        replyTo: data.course.email,
        text: content
    };
};
