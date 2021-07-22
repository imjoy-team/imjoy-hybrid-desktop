loadImJoyBasicApp({
    process_url_query: true,
    show_window_title: false,
    show_progress_bar: true,
    show_empty_window: true,
    menu_style: { width: '25px', height:'25px' },
    window_style: {width: '100%', height: '100%'},
    main_container: null,
    menu_container: "imjoy-menu-container",
    window_manager_container: "imjoy-window-container",
    imjoy_api: { } // override some imjoy API functions here
}).then(async app => {
    // get the api object from the root plugin
    const api = app.imjoy.api;
    // if you want to let users to load new plugins, add a menu item
    app.addMenuItem({
        label: "➕ Load Plugin",
        callback() {
        const uri = prompt(
            `Please type a ImJoy plugin URL`,
            "https://github.com/imjoy-team/imjoy-plugins/blob/master/repository/ImageAnnotator.imjoy.html"
        );
        if (uri) app.loadPlugin(uri);
        },
    });
        
    app.addMenuItem({
        label: "🧩 ImJoy Fiddle",
        async callback() {
          const plugin = await app.loadPlugin("https://if.imjoy.io")
          await app.runPlugin(plugin)
          app.removeMenuItem("🧩 ImJoy Fiddle")
        },
    });

    // make sure we can drag/resize the imjoy windows
    const vncContainer = document.getElementById('noVNC_container');
    app.$on("window-size-pos-changing", (changing)=>{
        if(changing){
            vncContainer.style.pointerEvents = 'none';
        }
        else{
            vncContainer.style.pointerEvents = 'all';
        }
    })
    // Setting up the jupyter engine
    let serverConfig;
    try{
        serverConfig = await (await fetch('./jupyter_server_config.json')).json()
    }
    catch(e){
        alert("Failed to fetch jupyter server data, elFinder and Python Engine will be disabled.")
        console.error(e)
        throw e
    }
    console.log("Jupyter Server Config: ", serverConfig)
    const baseURL = window.location.href.split('?')[0].replace('/desktop/', '/');
    app.addMenuItem({
        label: "📁 elFinder",
        callback() {
            api.createWindow({src: baseURL+'elfinder', name: 'elFinder', passive: true})
        },
    });

    const engineManager =
      (await api.getPlugin("Jupyter-Engine-Manager")) ||
      (await api.getPlugin({
        src:
          "https://imjoy-team.github.io/jupyter-engine-manager/Jupyter-Engine-Manager.imjoy.html",
      }));

    const engines = api.getServices({type: 'engine'})
    const pythonEngines = engines.filter(engine => engine.pluginType === 'native-python')
    for(let engine of pythonEngines){
        await api.unregisterService(engine)
    }
    await engineManager.removeEngine({name: 'MyBinder Engine'})
    await engineManager.createEngine({
      name: "DefaultJupyterEngine",
      url: baseURL,
      nbUrl: baseURL+'?token=' + serverConfig.token,
    });
    // or display a message
    await api.showMessage("ImJoy Loaded Successfully!");
});