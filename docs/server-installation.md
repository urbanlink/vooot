# Server installation

- https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04
- https://code.lengstorf.com/deploy-nodejs-ssl-digitalocean/
- https://www.thefanclub.co.za/how-to/how-secure-ubuntu-1604-lts-server-part-1-basics


    ssh root@ip
    adduser vooot


# Basics
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install nginx git
## Increase Swap space
https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04


# Firewall
    sudo ufw allow OpenSSH
    sudo ufw allow nginx-full
    sudo ufw enable
    sudo ufw status

# nodejs
    $ cd ~
    $ curl -sL https://deb.nodesource.com/setup_7.x -o nodesource_setup.sh
    $ nano nodesource_setup.sh
    $ sudo bash nodesource_setup.sh
    $ sudo apt-get install nodejs
    $ sudo apt-get install build-essential

    $ npm install -g n
    $ sudo n 7.8.0

# PM2
    sudo npm install -g pm2
    pm2 startup systemd
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vooot --hp /home/vooot

# Let's encrypt
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update

# Nginx configuration
    # Always use https
    sudo nano /etc/nginx/sites-enabled/default
      # HTTP — redirect all traffic to HTTPS
      server {
          listen 80;
          listen [::]:80 default_server ipv6only=on;
          return 301 https://$host$request_uri;
      }
    # It only takes a couple extra minutes to create a really secure SSL setup, so we might as well do it. One of the ways to do that is to use a strong Diffie-Hellman group, which helps ensure that our secure app stays secure.
    sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
    sudo nano /etc/nginx/snippets/ssl-params.conf
      # See https://cipherli.st/ for details on this configuration
      ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
      ssl_prefer_server_ciphers on;
      ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
      ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
      ssl_session_cache shared:SSL:10m;
      ssl_session_tickets off; # Requires nginx >= 1.5.9
      ssl_stapling on; # Requires nginx >= 1.3.7
      ssl_stapling_verify on; # Requires nginx => 1.3.7
      resolver 8.8.8.8 8.8.4.4 valid=300s;
      resolver_timeout 5s;
      add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
      add_header X-Frame-Options DENY;
      add_header X-Content-Type-Options nosniff;

      # Add our strong Diffie-Hellman group
      ssl_dhparam /etc/ssl/certs/dhparam.pem;

    sudo nano /etc/nginx/sites-enabled/default
      # HTTPS — proxy all requests to the Node app
      server {
        # Enable HTTP/2
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name app.example.com;

        # Use the Let’s Encrypt certificates
        ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

        # Include the SSL configuration from cipherli.st
        include snippets/ssl-params.conf;

        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-NginX-Proxy true;
            proxy_pass http://localhost:5000/;
            proxy_ssl_session_reuse off;
            proxy_set_header Host $http_host;
            proxy_cache_bypass $http_upgrade;
            proxy_redirect off;
        }
      }


    # Extra security
    sudo apt-get fail2ban


# mysql
[Source](https://www.digitalocean.com/community/tutorials/how-to-secure-mysql-and-mariadb-databases-in-a-linux-vps)

    $ sudo apt-get install mysql-server
    $ sudo mysql_secure_installation
    $ mysql -u root -p
    $ create database dbname;
    $ grant all privileges on dbname.* to 'dbuser'@'localhost' identified by "dbpass";
    $ flush privileges;
    $ exit;


# Git push from
    $ nano /hooks/post-receive

    #!/bin/sh
    git --work-tree=/home/vooot/apps/api.vooot.nl/live --git-dir=/home/vooot/apps/api.vooot.nl/repo checkout -f

    $ npm install
    $ git push master production
