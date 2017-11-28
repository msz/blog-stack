FROM michalszewczak/oneshot

RUN apk --update add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

COPY git-pull.sh /git-pull.sh
RUN chmod 755 /git-pull.sh

ENV ONESHOT_COMMAND="/git-pull.sh"

VOLUME /root
VOLUME /data

ENTRYPOINT [ "/entrypoint.sh" ]
