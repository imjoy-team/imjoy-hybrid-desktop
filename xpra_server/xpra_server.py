import os

def setup_server():
    return {
        'command': [
            'xpra', 'start',
            '--bind-tcp=0.0.0.0:5909',
            '--html=' + os.path.join(os.path.dirname(os.path.realpath(__file__)), 'html5'),
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
