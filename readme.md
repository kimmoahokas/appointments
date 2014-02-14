# Tuija Appointment scheduler

This is the new appointment scheduler for T-110 courses. It currently works for one course and can only be customized in the code. No support for aalto login yet, so paaswords must be generated and distributed somehow.

The system is built using [Meteor][meteor].

## Getting started ##

1. Install [node.js][nodejs]
2. Install [Meteor][meteor]: `curl https://install.meteor.com/ | sh`
3. Install meteorite: `sudo -H npm install -g meteorite`
4. Clone source: `git clone https://github.com/mr-kimia/appointments.git`
5. Change to project dir: `cd appointments`
6. Install dependencies with meteorite: `mrt install`
7. Run development server: `meteor`
8. Open [http://localhost:3000](http://localhost:3000)

## Package management ##

Allways use meteorite (`mrt`) to add/remove packages. Otherwise the system will break!

Licensed under the MIT License (MIT). see file license.md for further details.

## Deploying to production ##

For instructions on how to deploy Tuija to production environment see file deploying.md

[meteor]: http://www.meteor.com
[nodejs]: http://nodejs.org
