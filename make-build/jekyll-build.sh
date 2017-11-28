#!/bin/sh
set -e

cd $BUILD_DIR

bundle install
bundle exec jekyll build
