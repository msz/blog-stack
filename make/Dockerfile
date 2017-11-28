FROM 'michalszewczak/oneshot'

COPY make.js /make.js

RUN npm install -g node-fetch-json

ENV ONESHOT_COMMAND="node make.js"
