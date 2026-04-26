from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String, nullable=False)
    status = Column(String, default="Planning")
    budget = Column(Integer, default=0)
    parts_needed = Column(Text, default="")
    notes = Column(Text, default="")