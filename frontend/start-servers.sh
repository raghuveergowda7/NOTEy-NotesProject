#!/bin/bash

# Kill any existing processes on the required ports
lsof -ti:8008,5173,5174,5175,5176 | xargs kill -9 2>/dev/null

# Start Django server
cd ../notes-crud-api
python manage.py runserver 8008 &

# Start React development server
cd ../react-note-app
npm run dev 