from pydantic import BaseModel

# Input for creating a task
class TaskCreate(BaseModel):
    title: str
    completed: bool = False

# Input for updating a task
class TaskUpdate(BaseModel):
    title: str
    completed: bool

# Output format for returning a task
class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        orm_mode = True