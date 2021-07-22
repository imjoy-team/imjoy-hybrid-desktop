import setuptools


setuptools.setup(
    name="imjoy-worker",
    # py_modules rather than packages, since we only have 1 file
    py_modules=['imjoy_server'],
    entry_points={
        'imjoy_core_server_extension': [
            'worker = imjoy_server:setup_imjoy_engine_extension',
        ],
        'jupyter_serverproxy_servers': [
            'imjoy = imjoy_server:setup_imjoy_engine_server',
        ]
    },
    install_requires=['imjoy>=0.11.16'],
    package_data={},
)
