#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed."
    echo "Please install it from https://nodejs.org (download the LTS version)"
    exit 1
fi

# Check Node.js version (need 18+)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js 18 or later is required (you have $(node -v))"
    echo "Please update from https://nodejs.org"
    exit 1
fi

# Run the build
node build.js

echo ""
echo "Done! Open dist/index.html in your browser to preview."
