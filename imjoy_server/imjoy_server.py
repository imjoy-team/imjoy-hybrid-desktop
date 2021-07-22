import os

def setup_imjoy_engine_extension(imjoy_api):
    imjoy_api.test_worker = 123



def setup_imjoy_engine_server():
    return {
        "command": [
            "imjoy",
            "--serve",
            "--port",
            "{port}",
            "--allow-origin",
            '"*"',
            "--base-url",
            "/imjoy"
        ],
        "environment": {},
        "launcher_entry": {
            "title": "ImJoy Server",
            "icon_path": "https://imjoy.io/static/img/imjoy-icon.png",
        },
    }
