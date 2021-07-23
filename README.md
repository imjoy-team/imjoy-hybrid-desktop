# ImJoy Hybrid Desktop
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/imjoy-team/imjoy-hybrid-desktop/binder?urlpath=desktop)
[![Actions Status](https://github.com/imjoy-team/imjoy-hybrid-desktop/workflows/repo2docker/badge.svg)](https://github.com/imjoy-team/imjoy-hybrid-desktop/actions)


An ImJoy powered fully customizable hybrid desktop environment for running native desktop apps and web apps together.

**What do you mean by saying it's a hybrid desktop?**
It's hybrid because it support in-browser web apps and the native apps running remotely, the app windows are shown in the same interface and this is what meant by saying it's hybrid desktop.


With the ImJoy integration, developers can use ImJoy plugins to customize the remote desktop. It allows creating hybrid apps that runs partly in the browser and a remote server. This combination allows 
 1) improve the user experience by letting latency sensitive part (e.g. interactive UI) run in the browser as ImJoy plugin, and the computation part run remotely
 2) By doing runtime customization with ImJoy plugins, it allows the user reusing the docker container thus speed up the launching in a public docker environment


## Usage
To start the remote desktop environment, you can either [run on mybinder.org](https://mybinder.org/v2/gh/imjoy-team/imjoy-hybrid-desktop/binder?urlpath=desktop) or build locally with [repo2docker](https://repo2docker.readthedocs.io/).

To build locally:

 * Install [Docker](https://www.docker.com/) if required
 * Create a virtual environment and install repo2docker from PyPI.
 * Clone this repository and checkout to the `binder` branch
 * Run  ``repo2docker``. 
 * Depending on the permissions, you might have to run the command as an admin

```
pip install jupyter-repo2docker
git clone https://github.com/ome/omero-guide-fiji.git
cd omero-guide-fiji
repo2docker .
```

## Customization
By passing an URL as query `plugin=`, you can pass an ImJoy plugin to prepare your desktop. [Here](https://github.com/imjoy-team/imjoy-hybrid-desktop/blob/main/examples/FijiDesktopDemo.imjoy.html) is an example for registering a `app-launcher` service for staring up Fiji (via `pyimagej`).

In the plugin, it contains the following Python script:
```python
from imjoy import api
import imagej


class ImJoyPlugin():
   async def setup(self):
         # Here we register an app launcher which will show up in the startup screen as an icon
         # For the icons, you can choose one from https://fonts.google.com/icons?selected=Material+Icons
         await api.registerService(name="Start Fiji", type="app-launcher", icon="play_arrow", run=self.start_fiji)

   async def start_fiji(self):
         await api.showLoader(True)
         await api.showMessage("Launching Fiji...")
         # now start Fiji
         ij = imagej.init('/srv/conda/app/Fiji.app', headless=False)
         ij.ui().showUI()
         await api.showMessage("Fiji Started Successfully!")

         # run macro
         macro = """
         #@ String name
         #@ int age
         #@ String city
         #@output Object greeting
         greeting = "Hello " + name + ". You are " + age + " years old, and live in " + city + "."
         """
         args = {
            'name': 'Chuckles',
            'age': 13,
            'city': 'Nowhere'
         }
         result = ij.py.run_macro(macro, args)
         await api.showMessage(str(result.getOutput('greeting')))  

         await api.showLoader(False)
         # connect the VNC client to the desktop
         await api.connectDesktop()
         

api.export(ImJoyPlugin())
```
For Fiji, further customization can be done by changing the macro or calling pyimagej functions.
For more detailed usage about pyimagej, please go here: https://github.com/imagej/pyimagej/blob/master/doc/Usage.md

You can store the plugin code in any other repo and construct an URL which will bring the user directly to the customized desktop. Here are the steps:
 1. If you use Gist or Github to store your ImJoy plugin file, make sure you click the "raw" button to get the raw URL. For example, it should be something like: `https://raw.githubusercontent.com/imjoy-team/imjoy-hybrid-desktop/main/examples/FijiDesktopDemo.imjoy.html`
 2. Now add the raw link right after `https://mybinder.org/v2/gh/imjoy-team/imjoy-hybrid-desktop/binder?urlpath=desktop?plugin=`. For example, the final link will looks like:
    ```
    https://mybinder.org/v2/gh/imjoy-team/imjoy-hybrid-desktop/binder?urlpath=desktop?plugin=https://raw.githubusercontent.com/imjoy-team/imjoy-hybrid-desktop/main/examples/FijiDesktopDemo.imjoy.html
    ```
 3. If you want to place the link in a markdown file, you can use a Binder badge: `[![Binder](https://mybinder.org/badge_logo.svg)]()`. For example, here is a badge with the link in markdown:
    ```markdown
    [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/imjoy-team/imjoy-hybrid-desktop/binder?urlpath=desktop?plugin=https://raw.githubusercontent.com/imjoy-team/imjoy-hybrid-desktop/main/examples/FijiDesktopDemo.imjoy.html)
    ```
    It will be rendered as [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/imjoy-team/imjoy-hybrid-desktop/binder?urlpath=desktop?plugin=https://raw.githubusercontent.com/imjoy-team/imjoy-hybrid-desktop/main/examples/FijiDesktopDemo.imjoy.html).

## Acknoledgements

ImJoy Hybrid Desktop is built on top of [omero-guide-fiji](https://github.com/ome/omero-guide-fiji) made by the [Open Microscopy Environment team](https://github.com/ome).