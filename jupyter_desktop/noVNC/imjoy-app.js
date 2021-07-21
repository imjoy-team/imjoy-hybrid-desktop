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
    const baseURL = window.location.href.split('?')[0].replace('/desktop/', '/');
    app.addMenuItem({
        label: "📁 elFinder",
        callback() {
            api.createWindow({src: baseURL+'elfinder', name: 'elFinder', passive: true})
        },
    });
    
    // make sure we can drag/resize the imjoy windows
    const vncContainer = document.getElementById('noVNC_container');
    window.addEventListener('mousedown', function(event){
        if(vncContainer.contains(event.target)){
            vncContainer.style.pointerEvents = 'all';
        }
        else{
            vncContainer.style.pointerEvents = 'none';
        }
    })
    window.addEventListener('mouseup', function(event){
        document.getElementById('noVNC_container').style.pointerEvents = 'all';
    })
    // or display a message
    await api.showMessage("ImJoy Loaded Successfully!");
    // or progress
    await api.showProgress(50);
});