# TaskMaster | FastAPI & PostgreSQL | Sep 2025

TaskMaster is a full-stack to-do list application that allows users to create, read, update, and delete tasks. Built with FastAPI, SQLAlchemy, and PostgreSQL, it demonstrates backend API development with a connection-ready frontend.

## Features
- Add, view, update, and delete tasks
- Persistent storage using PostgreSQL
- Interactive API documentation (/docs)
- Frontend-ready API with CORS enabled

## Technologies Used
- Python, FastAPI, SQLAlchemy
- PostgreSQL
- HTML, CSS, JavaScript (Fetch API)

## Installation
Clone the repository and navigate into the backend folder:

```bash
git clone https://github.com/yourusername/taskmaster.git
cd Taskmaster/Backend

python3 -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt

uvicorn main:app --reload

then open up the index.html file


