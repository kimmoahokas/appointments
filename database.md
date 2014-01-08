# Basic Database structure #

The database used by tuija follows following structure.

## User ##

    user =
    {
        _id: String,
        username: String,
        password: String (hash),
        email: String,
        admin: Boolean (optional, default false),
        courses: [
            {
                id: Course id (String),
                assistant: Boolean (optional, default false),
            }
        ],
        profile: Object;
    }

Note: The profile object is completely optional and can contain anything. It is also modifiable by the user, so don't store anything critical there.

## Courses ##

    course =
    {
        _id: String,
        name: String,
        code: String,
        email: String,
        roundDefaultStart: {
            day: Number (see http://momentjs.com/docs/#/get-set/day/),
            hour: Number (see http://momentjs.com/docs/#/get-set/hour/),
            minute: Number (see http://momentjs.com/docs/#/get-set/minute/)
        },
        roundDefaultEnd: {
            day: Number (see http://momentjs.com/docs/#/get-set/day/),
            hour: Number (see http://momentjs.com/docs/#/get-set/hour/),
            minute: Number (see http://momentjs.com/docs/#/get-set/minute/)
        },
        roundDefaultMaxReservations: Number,
        defaultLocation: String
    }

The course code will be part of the course url in reservation system.
`roundDefaultStart` and `roundDefaultEnd` tell the system how to set default values for round start and end. For example `{day: 3, hour:18, minute:0}` means that the default is on wednesday this week at 18:00.

## Rounds ##

    round =
    {
        _id: String,
        course: Course id (String),
        name: String,
        location: String,
        slug: String (unique on this course),
        max_reservations: Number,
        opens: Date,
        closes: Date,
    }

The slug string will be part of the url in the reservation system.

## Appointments ##

    appointment =
    {
        _id: String,
        title: String,
        round: Round id (String),
        start: Date,
        end: Date,
        allDay: Boolean,
        assistant: User id (String),
        student: User id (String)
    }

## TODO ##

* Where should be the last time when specific appointment is reservable? And how this should be presented in database? Maybe something like `{day: -1, hour: 18, minute: 0}`.
