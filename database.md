# Basic Database structure #

The database used by tuija follows following structure.

## User ##

    user =
    {
        id: String,
        username: String,
        password: String (hash),
        email: String,
        profile: {
            admin: Boolean,
            studentnum: String,
        }
    }

Note: The profile object is completely optional and can contain anything.

## Appointments ##

    appointment =
    {
        id: String,
        title: String,
        round: Round id (String),
        start: Date,
        end: Date,
        allDay: boolean,
        assistant: User id (String),
        student: User id (String)
    }


## Rounds ##

    round =
    {
        id: String,
        name: String,
        max_reservations: Number
    }

