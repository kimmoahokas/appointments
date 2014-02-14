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
    try {
        Email.send(mail);
    } catch (e) {
        throw new Meteor.Error(500, 'error while sending email to: ' + mail.to, e);
    }
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
    mail.to = contactEmail(data.assistant);
    try {
        Email.send(mail);
    } catch (e) {
        throw new Meteor.Error(500, 'error while sending email to: ' + mail.to, e);
    }
};

sendCourseEnrolmentEmail = function(user, course) {
    var content = Handlebars.templates['enrollmentEmail']({
        url: Router.routes['home'].url(),
        courseName: course.name,
        courseCode: course.code,
        email: user.emails[0],
    });
    var mail = {
        from: course.email,
        replyTo: course.email,
        to: user.emails[0].address,
        subject: 'Registration to ' + course.name + ' appointment reservation system',
        text: content
    };
    try {
        Email.send(mail);
    } catch (e) {
        throw new Meteor.Error(500, 'error while sending email to: ' + mail.to, e);
    }
};

sendRegistrationEmail = function(email, password, course) {
    var content = Handlebars.templates['registrationEmail']({
        url: Router.routes['home'].url(),
        courseName: course.name,
        courseCode: course.code,
        email: email,
        password: password
    });
    var mail = {
        from: course.email,
        replyTo: course.email,
        to: email,
        subject: 'Registration to ' + course.name + ' appointment reservation system',
        text: content
    };
    try {
        Email.send(mail);
    } catch (e) {
        console.log(e);
        throw new Meteor.Error(500, 'error while sending email to: ' + mail.to, e);
    }
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
