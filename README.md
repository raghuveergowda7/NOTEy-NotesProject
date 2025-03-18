# Notes Project-Notey

A full-stack notes application built with Django and React, featuring rich text editing, drawing capabilities, and goal tracking.

## Features

- 📝 Rich text note creation and editing
- 🎨 Drawing canvas for visual notes
- 📸 Image upload support
- 🎯 Goal timer for productivity
- 🤖 AI-powered chatbot assistance
- 📱 Responsive design

## Tech Stack

- **Backend**: Django REST Framework
- **Frontend**: React with Vite
- **Database**: SQLite
- **Authentication**: JWT

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login
3. Start creating notes, drawings, and tracking your goals!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
