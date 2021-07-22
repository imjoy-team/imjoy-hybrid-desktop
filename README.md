# ImJoy Remote Desktop
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/oeway/omero-guide-fiji/imjoy?urlpath=desktop)

[![Actions Status](https://github.com/imjoy-team/imjoy-remote-desktop/workflows/repo2docker/badge.svg)](https://github.com/imjoy-team/imjoy-remote-desktop/actions)

[![Actions Status](https://github.com/imjoy-team/imjoy-remote-desktop/workflows/sphinx/badge.svg)](https://github.com/imjoy-team/imjoy-remote-desktop/actions)


An ImJoy powered fully customizable remote desktop environment for running Fiji and other desktop software.

With the ImJoy integration, developers can use ImJoy plugins to customize the remote desktop. It allows creating hybrid apps that runs partly in the browser and a remote server. This combination allows 
 1) improve the user experience by letting latency sensitive part (e.g. interactive UI) run in the browser as ImJoy plugin, and the computation part run remotely
 2) By doing runtime customization with ImJoy plugins, it allows the user reusing the docker container thus speed up the launching in a public docker environment


To run the desktop, you can either [run on mybinder.org](https://mybinder.org/v2/gh/oeway/omero-guide-fiji/imjoy?urlpath=desktop) or build locally with [repo2docker](https://repo2docker.readthedocs.io/).

To build locally:

 * Install [Docker](https://www.docker.com/) if required
 * Create a virtual environment and install repo2docker from PyPI.
 * Clone this repository
 * Run  ``repo2docker``. 
 * Depending on the permissions, you might have to run the command as an admin

```
pip install jupyter-repo2docker
git clone https://github.com/ome/omero-guide-fiji.git
cd omero-guide-fiji
repo2docker .
```

## Acknoledgements

ImJoy Remote Desktop is built on top of [omero-guide-fiji](https://github.com/ome/omero-guide-fiji) made by the [Open Microscopy Environment team](https://github.com/ome).