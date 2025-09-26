from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models.task import Task
from schemas import TaskCreate, TaskUpdate, TaskOut
from routes import tasks

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskMaster API 🚀",
    description="A task management API with full CRUD operations built with FastAPI and PostgreSQL.",
    version="1.0.0"
)

# Enable CORS so frontend can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to TaskMaster API 🚀"}

# CRUD endpoints

@app.get("/tasks", response_model=list[TaskOut])
def read_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@app.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(title=task.title, completed=task.completed)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.title = task.title
    db_task.completed = task.completed
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

# Include additional routers
app.include_router(tasks.router)