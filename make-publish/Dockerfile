FROM michalszewczak/oneshot

COPY script /script
RUN chmod 755 /script/ipfs-publish.js

RUN apk --update add git python && \
    cd script && \
    npm install

VOLUME /data

ENV ONESHOT_COMMAND="/script/ipfs-publish.js"
