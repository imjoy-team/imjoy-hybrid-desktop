FROM tswetnam/xpra:20.04

# # user is already in suders

# RUN usermod -aG sudo root
# create user with a home directory
ARG NB_USER
ARG NB_UID

USER root
ENV USER ${NB_USER}
# Make sure the contents of our repo are in ${HOME}
# COPY . ${HOME}
RUN adduser --disabled-password \
    --gecos "Default user" \
    --uid ${NB_UID} \
    ${NB_USER}

ENV HOME /home/${NB_USER}

# copy the entry point file
ADD ./binder ${HOME}/binder
RUN chmod +x ${HOME}/binder/start
RUN chmod +x ${HOME}/binder/postBuild

RUN chown -R ${NB_UID} ${HOME}
# for conda
RUN chown -R ${NB_UID} /opt 

USER ${USER}
WORKDIR ${HOME}

SHELL ["/bin/bash", "--login", "-c"]

RUN wget \
    https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh 
RUN conda --version


ENV PATH="${HOME}/.local/bin:${PATH}"

RUN conda env update --file ${HOME}/binder/environment.yml
# install the notebook package
RUN pip install --no-cache notebook
RUN ${HOME}/binder/postBuild
ENTRYPOINT ["./binder/start"]
# To start xpra: xpra start --bind-tcp=0.0.0.0:9876 --html=on --start-child=xterm --daemon=no :100