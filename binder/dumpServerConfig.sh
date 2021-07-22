while ! [ -s $CONDA_DIR/vnc/noVNC/jupyter_server_config.json ]; do
    echo "File is empty - keep checking it... "
    sleep 0.5 # throttle the check
    python3 -m jupyter notebook list --json > $CONDA_DIR/vnc/noVNC/jupyter_server_config.json
done