#!/bin/bash

# The Algorithm Website Setup Script
# This script helps set up and run the website with event scraping functionality

echo "🚀 The Algorithm Website Setup"
echo "==============================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Python
if command_exists python3; then
    echo "✅ Python 3 found"
    PYTHON_CMD="python3"
elif command_exists python; then
    echo "✅ Python found"
    PYTHON_CMD="python"
else
    echo "❌ Python not found. Please install Python 3."
    exit 1
fi

# Setup virtual environment if it doesn't exist
setup_venv() {
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        $PYTHON_CMD -m venv venv
        
        echo "📥 Installing required packages..."
        source venv/bin/activate
        pip install requests beautifulsoup4 lxml
        echo "✅ Virtual environment setup complete!"
    else
        echo "✅ Virtual environment found"
    fi
}

# Function to update events
update_events() {
    echo "📅 Updating events from Facebook..."
    setup_venv
    source venv/bin/activate
    $PYTHON_CMD facebook_events_scraper.py --export events.json
    if [ $? -eq 0 ]; then
        echo "✅ Events updated successfully!"
    else
        echo "❌ Failed to update events"
    fi
}

# Function to start a simple HTTP server
start_server() {
    echo "🌐 Starting local web server..."
    echo "📍 Website will be available at: http://localhost:8000"
    echo "📍 Events API will be available at: http://localhost:8080/events"
    echo ""
    echo "Press Ctrl+C to stop the servers"
    echo ""
    
    # Start events API server in background
    setup_venv
    source venv/bin/activate
    $PYTHON_CMD facebook_events_scraper.py --serve &
    EVENTS_PID=$!
    
    # Start web server
    if command_exists python3; then
        python3 -m http.server 8000 &
    else
        python -m http.server 8000 &
    fi
    WEB_PID=$!
    
    # Wait for user to stop
    echo "🔄 Servers running... Press Ctrl+C to stop"
    trap "echo ''; echo '🛑 Stopping servers...'; kill $EVENTS_PID $WEB_PID 2>/dev/null; exit 0" INT
    
    # Keep script running
    while true; do
        sleep 1
    done
}

# Function to force refresh events from Facebook
refresh_events() {
    echo "🔄 Force refreshing events from Facebook..."
    setup_venv
    source venv/bin/activate
    rm -f events_cache.json
    $PYTHON_CMD facebook_events_scraper.py --refresh --export events.json
    if [ $? -eq 0 ]; then
        echo "✅ Events refreshed successfully!"
    else
        echo "❌ Failed to refresh events"
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  update-events    Update events from cache or Facebook"
    echo "  refresh-events   Force refresh events from Facebook"
    echo "  serve           Start local web server and events API"
    echo "  setup           Setup virtual environment and dependencies"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup          # Setup environment first time"
    echo "  $0 update-events  # Update events and exit"
    echo "  $0 refresh-events # Force refresh from Facebook"
    echo "  $0 serve          # Start servers for development"
}

# Main script logic
case "${1:-serve}" in
    "setup")
        setup_venv
        update_events
        ;;
    "update-events")
        update_events
        ;;
    "refresh-events")
        refresh_events
        ;;
    "serve")
        update_events
        start_server
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
