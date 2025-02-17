# This script will be the first thing that runs on a new instance
echo "Hello world!"

# Install docker if it's not already installed
if ! command -v docker &> /dev/null; then
    echo "Docker could not be found, installing..."
    apt-get update
    apt-get install -y docker.io
fi

# Install docker-compose if it's not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose could not be found, installing..."
    apt-get update
    apt-get install -y docker-compose
fi

# If docker service is not running, try to restart it
if ! systemctl is-active --quiet docker; then
    echo "Docker service is not running, trying to restart..."
    systemctl restart docker
fi

# If docker is not running anything, start docker-compose base + blue

# Otherwise, run the script to deploy