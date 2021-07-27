import setuptools


setuptools.setup(
    name="xpra-server",
    # py_modules rather than packages, since we only have 1 file
    py_modules=['xpra_server'],
    entry_points={
        'jupyter_serverproxy_servers': [
            'desktop = xpra_server:setup_server',
        ]
    },
    include_package_data=True,
    install_requires=['jupyter-server-proxy'],
)
