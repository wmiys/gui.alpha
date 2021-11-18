mod_wsgi-express start-server \
--user www-data  \
--group www-data  \
--server-name wmiys.com  \
--port 82   \
--access-log  \
--log-level info   \
--server-root /etc/wmiys.com \
--host 104.225.208.116 \
--document-root /var/www/wmiys/front-end/wmiys/static \
--setup-only \
/var/www/wmiys/front-end/wmiys.wsgi

/etc/wmiys.com/apachectl restart
