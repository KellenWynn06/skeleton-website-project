from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    display_name = Column(String, default="")
    major = Column(String, default="")
    school = Column(String, default="")
    bio = Column(Text, default="")