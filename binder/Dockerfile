FROM ubuntu:bionic
# FROM buildpack-deps:bionic

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install xpra
VOLUME /tmp/.X11-unix
RUN apt update \
 && DEBIAN_FRONTEND=noninteractive apt install -y wget gnupg xvfb x11-xserver-utils python3-pip lxterminal \
#   pulseaudio lxterminal \
 && pip3 install pyinotify \
 && echo "deb [arch=amd64] https://xpra.org/ bionic main" > /etc/apt/sources.list.d/xpra.list \
 && wget -q https://xpra.org/gpg.asc -O- | apt-key add - \
 && echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ bionic main" > /etc/apt/sources.list.d/xpra.list \
 && wget -q https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public -O- | apt-key add - \
 && apt update \
 && DEBIAN_FRONTEND=noninteractive apt install -y xpra \
 && mkdir -p /run/user/0/xpra \
 && apt install -y adoptopenjdk-11-hotspot unzip \
 # remove packages that are not needed
 && apt remove -y python3-pip

# Set up locales properly
RUN apt-get -qq update && \
    apt-get -qq install --yes --no-install-recommends locales > /dev/null && \
    apt-get -qq purge && \
    apt-get -qq clean && \
    rm -rf /var/lib/apt/lists/*
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
# Use bash as default shell, rather than sh
ENV SHELL /bin/bash

 
# Set up user
ARG NB_USER
ARG NB_UID
ENV USER ${NB_USER}
ENV HOME /home/${NB_USER}
RUN groupadd \
        --gid ${NB_UID} \
        ${NB_USER} && \
    useradd \
        --comment "Default user" \
        --create-home \
        --gid ${NB_UID} \
        --no-log-init \
        --shell /bin/bash \
        --uid ${NB_UID} \
        ${NB_USER}
RUN wget --quiet -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key |  apt-key add - && \
    DISTRO="bionic" && \
    echo "deb https://deb.nodesource.com/node_14.x $DISTRO main" >> /etc/apt/sources.list.d/nodesource.list && \
    echo "deb-src https://deb.nodesource.com/node_14.x $DISTRO main" >> /etc/apt/sources.list.d/nodesource.list

# Allow target path repo is cloned to be configurable
ARG REPO_DIR=${HOME}
ENV REPO_DIR ${REPO_DIR}
WORKDIR ${REPO_DIR}
RUN chown ${NB_USER}:${NB_USER} ${REPO_DIR}

# Make sure the contents of our repo are in ${HOME}
COPY . ${HOME}

# copy the entry point file
ADD ./binder ${HOME}/binder
RUN chmod +x ${HOME}/binder/start \
    && chmod +x ${HOME}/binder/postBuild

WORKDIR ${HOME}
SHELL ["/bin/bash", "--login", "-c"]

RUN chown -R ${NB_USER} ${HOME} \
    && mkdir /opt/conda \
    && chmod ugo+w /opt/conda

# We always want containers to run as non-root
USER ${NB_USER}

RUN wget \
    https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ${HOME}/miniconda.sh \
    && bash miniconda.sh -b -p /opt/conda/miniconda3 \
    && rm -f $HOME/miniconda.sh
ENV PATH="/opt/conda/miniconda3/bin:${PATH}"

# We want to allow two things:
#   1. If there's a .local/bin directory in the repo, things there
#      should automatically be in path
#   2. postBuild and users should be able to install things into ~/.local/bin
#      and have them be automatically in path
#
# The XDG standard suggests ~/.local/bin as the path for local user-specific
# installs. See https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
ENV PATH ${HOME}/.local/bin:${REPO_DIR}/.local/bin:${PATH}

# RUN conda env update --file ${HOME}/binder/environment.yml
# install the notebook package
RUN conda install jupyter
RUN ${HOME}/binder/postBuild
ENTRYPOINT ["./binder/start"]
# To start xpra: xpra start --bind-tcp=0.0.0.0:9876 --html=on --start-child=xterm --daemon=no :100
