REMOTE_HOST="root@saf-demo.online"
REMOTE_PATH="/root/"
LOCAL_FOLDER="."
ZIP_NAME="deploy-instance.zip"
REMOTE_COMMAND="cd /root/ && ./deploy-instance/setup.sh"

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
unzip -o "$ZIP_NAME"
cd "$LOCAL_FOLDER"
$REMOTE_COMMAND
EOF

# Clean up local zip file
echo "Cleaning up..."
rm "$ZIP_NAME"

echo "Done!"