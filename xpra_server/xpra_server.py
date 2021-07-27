def setup_server():
    return {
        'command': [
            'xpra', 'start',
            '--bind-tcp=0.0.0.0:5909',
            '--html=on',
            '--start=lxterminal',
            '--daemon=no',
            ":200"
        ],
        'port': 5909,
        'timeout': 30,
        'launcher_entry': {
            "title": "Desktop",
        },
    }
