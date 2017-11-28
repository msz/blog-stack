FROM michalszewczak/oneshot

RUN \
    apk --update add ruby ruby-io-console ruby-irb ruby-json ruby-rake ruby-rdoc ruby-dev libffi-dev gcc libc-dev zlib-dev make && \
    gem install bundler

VOLUME /data

COPY jekyll-build.sh /jekyll-build.sh
RUN chmod 755 /jekyll-build.sh
ENV ONESHOT_COMMAND="/jekyll-build.sh"
