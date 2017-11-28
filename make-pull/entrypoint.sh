#!/bin/sh

if [ ! -f /root/.ssh/id_rsa ]; then
    # Generate the SSH key if does not exist
    ssh-keygen -t rsa -N "" -f /root/.ssh/id_rsa
fi

node /oneshot/index.js
