import os

def setup_server():
    return {
        'command': [
            'xpra', 'start',
            '--bind-tcp=0.0.0.0:{port}',
            '--html=' + os.path.join(os.path.dirname(os.path.realpath(__file__)), 'html5'),
            '--start=Fiji.app/ImageJ-linux',
            '--daemon=no',
            ":200"
        ],
        'timeout': 30,
        'launcher_entry': {
            "title": "Desktop",
        },
    }
