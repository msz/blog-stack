FROM cethy/alpine-supercronic

# Add crontab file in the cron directory
COPY crontab /etc/crontab

RUN apk add --update curl && \
    rm -rf /var/cache/apk/* && \
    chmod 0644 /etc/crontab && \
    touch /var/log/cron.log

# Run the command on container startup
CMD ["/etc/crontab"]
