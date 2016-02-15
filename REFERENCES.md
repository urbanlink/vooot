# References



## Authentication
https://ericswann.wordpress.com/2015/04/24/nozus-js-1-intro-to-sails-with-passport-and-jwt-json-web-token-auth/

## iCalendar
http://stevethomas.com.au/php/how-to-build-an-ical-calendar-with-php-and-mysql.html


## git

    mkdir -p /var/www/vooot/voootApi
    mkdir -p /var/git/vooot/voootApi
    cd /var/git/vooot/voootApi
    git init
    git config receive.denycurrentbranch false
    cp git/hooks/post-receive .git/hooks/post-receive
    sudo chmod +x .git/hooks/post-receive
