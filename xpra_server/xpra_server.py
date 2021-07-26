def setup_server():
    return {
        'command': [
            'xpra', 'start',
            '--bind-tcp=0.0.0.0:5909',
            '--html=on',
            '--start-child=xterm',
            '--daemon=no',
            ":1"
        ],
        'port': 5909,
        'timeout': 30,
        'launcher_entry': {
            "title": "Desktop",
        },
    }
