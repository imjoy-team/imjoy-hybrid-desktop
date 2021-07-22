function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
}

loadImJoyBasicApp({
    process_url_query: false,
    show_window_title: false,
    show_progress_bar: true,
    show_empty_window: true,
    menu_style: { width: '25px', height:'25px' },
    window_style: {width: '100%', height: '100%'},
    main_container: null,
    menu_container: "imjoy-menu-container",
    window_manager_container: "imjoy-window-container",
    imjoy_api: {
        connectDesktop(){
            document.getElementById('noVNC_connect_button').click();
        },
        showLoader(show){
            if(show) document.getElementById('loader').style.display = 'block';
            else document.getElementById('loader').style.display = 'none';
        }
    } // override some imjoy API functions here
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
    const appContainer = document.getElementById('app-icon-container');
    app.imjoy.event_bus.on("register", (ctx)=>{
        if(ctx.config.type==='app-launcher'){
            const li = document.createElement('li');
            li.innerHTML = `<a class="sociali" target="_blank" aria-label="${ctx.config.name}">
                      <i class="material-icons" style="font-size: 50px;width: 100px;" title="${ctx.config.name}">${ctx.config.icon}</i>
                        <span style="display:block;font-size:12px;">${ctx.config.name}</span>
             </a>`
            li.onclick = ()=>{
                ctx.config.run()
            }
            appContainer.appendChild(li)
            app.addMenuItem({
                label: '💻 ' + ctx.config.name,
                callback: ctx.config.run
            });
        }
    })
    await api.registerService({
        type: 'app-launcher',
        name: 'elFinder',
        icon: 'folder_open',
        run(){
            api.createWindow({src: baseURL+'elfinder', name: 'elFinder', passive: true})
        }
    })
    await api.registerService({
        type: 'app-launcher',
        name: 'Connect Desktop',
        icon: 'desktop_mac',
        run(){
            document.getElementById('noVNC_connect_button').click();
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
        document.getElementById('loader').style.display = 'none';
        throw e
    }
    try{
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

        const p = getUrlParameter("plugin") || getUrlParameter("p");
        if (p) {
            const plugin = await app.loadPlugin(p);
            let config = {},
            data = {},
            tmp;
            if(plugin.api.run){
                tmp = getUrlParameter("data");
                if (tmp) data = JSON.parse(tmp);
                tmp = getUrlParameter("config");
                if (tmp) config = JSON.parse(tmp);
                await app.runPlugin(plugin, config, data);
            }
        }
        // or display a message
        await api.showMessage("ImJoy Loaded Successfully!");
    }
    catch(e){
        console.error(e)
        await api.alert(`Failed to connect to the Jupyter server: ${e}`)
    }
    finally{
        document.getElementById('loader').style.display = 'none';
    }
});