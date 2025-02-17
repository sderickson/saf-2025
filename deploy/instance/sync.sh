REMOTE_HOST="root@saf-demo.online"
REMOTE_PATH="/root/"
REMOTE_FOLDER="saf-2025/deploy/instance"
LOCAL_FOLDER="."
ZIP_NAME="deploy-instance.zip"
REMOTE_COMMAND="./setup.sh"

# Create zip file
echo "Creating zip file..."
zip -r "$ZIP_NAME" "$LOCAL_FOLDER"

# Push file via sftp
echo "Transferring zip file..."
sftp "$REMOTE_HOST" << EOF
put "$ZIP_NAME" "$REMOTE_PATH/$ZIP_NAME"
exit
EOF

# SSH into remote, unzip file and run command
echo "Unzipping and running command on remote..."
ssh "$REMOTE_HOST" << EOF
cd "$REMOTE_PATH"
# Check if unzip is installed, if not install it
if ! command -v unzip &> /dev/null; then
    echo "unzip not found, installing..."
    apt-get update
    apt-get install -y unzip
fi
mkdir -p "$REMOTE_FOLDER"
rm -rf "$REMOTE_FOLDER/*"
unzip -o "$ZIP_NAME" -d "$REMOTE_FOLDER"
cd "$REMOTE_FOLDER"
pwd
echo "Running command..."
echo "$REMOTE_COMMAND"
$REMOTE_COMMAND
echo "Done!"
EOF

# Clean up local zip file
echo "Cleaning up..."
rm "$ZIP_NAME"

echo "Done!"