CONFIG_JSON_FILE=$REPO_DIR/xpra_server/html5/jupyter_server_config.json 

while ! [ -s $CONFIG_JSON_FILE ]; do
    echo "File is empty - keep checking it... "
    sleep 0.5 # throttle the check
    python3 -m jupyter notebook list --json > $CONFIG_JSON_FILE
done