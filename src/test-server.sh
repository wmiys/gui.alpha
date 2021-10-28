mod_wsgi-express start-server /var/www/wmiys/front-end/wmiys.wsgi \
--user www-data  \
--group www-data  \
--server-name wmiys.com  \
--port 80   \
--access-log  \
--log-level info   \
--compress-responses \
--processes 3 \
--startup-timeout 30   \
--server-root /etc/wmiys.com \
--host 104.225.208.116 \
--document-root /var/www/wmiys/front-end/static \
--log-to-terminal

