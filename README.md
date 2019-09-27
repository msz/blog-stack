> As of 2019 I no longer use this. IPNS resolution took too much time for efficient operation of the site. However, if you only use IPFS names, you should be good!

# my IPFS blog stack

This is the Docker service I use to deploy my Jekyll blog at
http://michal.space. It does several things:

* Watches blog source repository for new commits on GitHub and automatically
  pulls them
* Automatically builds each commit
* Publishes the build directory under an IPNS name using the bundled IPFS node
* Provides access to the IPFS node's web gateway with access limited to the
  blog itself

The service's web gateway rewrites all URLs to refer to IPFS hashes and
proxies the requests to the internal IPFS node. This way the website can be
easily migrated to another technology because all existing links on the Web
can be IPFS-agnostic.

The service is designed to consist of easily swappable, self contained parts.
For example, it uses Jekyll but default, but it's as simple as swapping out
the `make-build` container to use another static site generator.

## architecture

![img](http://www.plantuml.com/plantuml/proxy?idx=0&src=https://raw.github.com/msz/blog-stack/master/architecture.plantuml)

## how to use

1. Clone this repo
2. Configure environment variables:
    * `GIT_REPO` - the address of your blog source repository. If private, you
      will need to add the service's SSH key as a deployment key, so use the
      SSH URL for the repo.
    * `GITHUB_TOKEN` - the GitHub webhook secret used to verify that incoming
      webhook payloads really come from GitHub. A long random string works best.
3.
```
docker-compose up
```
4. [if your blog repo is private] Authorize the service's SSH key as a
   deployment key so the service can pull your repository. You can find it in
   the `ssh-data` Docker volume — it gets generated during the `make-pull`
   container startup if it doesn't alredy exist. Add it as a deploy key using
   [this guide](https://github.com/blog/2024-read-only-deploy-keys).
5. Configure a GitHub webhook which will notify the service about new
   commits. Go to `${your_repo}/settings/hooks/new` and choose the following:
   * *Payload URL*: the URL which will point to the `make` container in the
     service
   * *Content type*: `application/json`
   * *Secret*: the `GITHUB_TOKEN` you used in step 2
   * Choose "Just the `push` event"
6. Add a dnslink so your domain name will point to your IPNS hash. In your
   domain's DNS, add a TXT entry with the following contents:
   `dnslink=${IPNS_hash}`.
7. Finally, push a new commit to your blog repo. The service should download
   the repo, build the code, and publish to IPNS successfully.

## why is it so overengineered?

For fun. I switched my VPS provider a few times in a short timespan and
setting up all components of the stack manually became quite tedious. I
thought this was a good opportunity to learn how to use Docker. And it was!

An easy way to go about it would be to cram everything into a monolithic
Docker container, but this goes against the Docker philosophy of one
container only doing one thing. It quickly became clear that the correct
choice would be a Docker service consisting of several interacting
containers. It made sense to break everything down into atomic parts,
including the build pipeline. For example, since I was recently looking into
switching from Jekyll to Hexo, I would want the ability to just swap out a
Jekyll container for a Hexo container and leave the rest of the setup the
same.

For the build pipeline, I ideally wanted containers that are run once in
response to an event and then terminate. Sadly, Docker services only support
long-running application components. So I wrote
[oneshot](https://github.com/msz/oneshot), a simple webhook server whose sole
purpose is to run a shell command in response to a POST request. All build
pipeline components are oneshot servers which listen for events and each of
them takes care of running their own job in response to them. Refer to the
architecture diagram for details.

## why ipfs

I like the technology behind it and it's a pretty great solution for hosting
and replicating static files. It's less great for publishing content that
changes (IPNS is slow), but it's okay for a blog.
