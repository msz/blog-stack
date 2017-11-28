#!/bin/sh
set -e

BRANCH="${GIT_BRANCH:-master}"

echo "Making sure we have the correct SSH key for Github..."
rm -f ~/.ssh/known_hosts
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

if [ ! -d $REPO_DIR ]; then
    echo "Cloning from $GIT_REPO..."
    git clone $GIT_REPO $REPO_DIR
fi
cd $REPO_DIR
git fetch
git reset --hard origin/$BRANCH
