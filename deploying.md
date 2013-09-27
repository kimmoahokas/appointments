# Deploying Tuija #

These instructions are tested on Ubuntu 12.04.3 LTS, for other distributions you need modify some parts.

1. Add repositories (Tuija needs cutting edge software):

        sudo apt-get install python-software-properties
        sudo add-apt-repository ppa:nginx/stable
        sudo add-apt-repository ppa:chris-lea/node.js
        sudo apt-get update

    **Note:** For Ubuntu 12.10 and newer install  `software-properties-common` instead of `python-software-properties`

2. Install dependencies

        sudo apt-get install mongodb nodejs nginx curl git
        sudo -H npm install -g meteorite
        sudo npm install forever -g

3. Install meteor

        curl https://install.meteor.com | /bin/sh

4. Configure nginx to handle https and proxy requests to meteor

    Ubuntu contains a lot of boilerplate configuration for nginx, so we only need to add something like this to /etc/nginx/sites-available/tuija

        #needed for websocket proxying
        map $http_upgrade $connection_upgrade {
            default upgrade;
            ''      close;
        }

        server {
            # on linux this should listen for both IPv4 and IPv6
            listen [::]:80;

            # we don't actually allow any unencrypted traffic, so redirect
            return 301 https://$host$request_uri;
        }

        server {
            # again listen for 443;
            listen [::]:443 ssl;
            server_name appointments.cs.hut.fi;
            ssl_certificate     /etc/nginx/ssl/server.crt;
            ssl_certificate_key /etc/nginx/ssl/server.key;
            location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
            }
        }


    After adding those lines:
        sudo ln -s /etc/nginx/sites-available/tuija /etc/nginx/sites-enabled/tuija
        sudo rm /etc/nginx/sites-enabled/default
        sudo /etc/init.d/nginx start

    **Note:** Currently Tuija does not support reverse proxying with different paths, only root of the domain is supported

5. Clone repository:

        git clone git@git.cs.hut.fi:appointment-scheduler/tuija.git

6. Bundle the meteor application

        cd tuija
        mrt bundle bundle.tar.gz

    Note: you can do the bundling on other machine as well, but then you need to rebuild the native packages included in the bundle.

7. Go to location where you want to run the app:

        cd ~
        cp tuija/bundle.tar.gz .
        tar -xvvf bundle.tar.gz
        cd bundle

8. **If** you bundled the app on other machine, reinstall fibers:

        cd programs/server/node_modules
        rm -r fibers
        npm install fibers

9. Run tuija with forever:

        export ROOT_URL="https://your.server.com"
        export PORT=9000
        export MONGO_URL="localhost"
        export MAIL_URL="smtp://your.mail.server"
        forever start main.js

10. Go to https://your.server.com and the app should work

11. If you need to stop meteor, run `forever stop main.js`
