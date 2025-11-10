from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Admin(Base):
    __tablename__ = "admins"
    admin_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")

class Student(Base):
    __tablename__ = "students"
    student_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    department = Column(String(50))
    year = Column(String(10))
    division = Column(String(10))
    email = Column(String(150))
    contact_no = Column(String(30))

class Teacher(Base):
    __tablename__ = "teachers"
    teacher_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    department = Column(String(50))
    email = Column(String(150))
    contact_no = Column(String(30))
    designation = Column(String(100))

class Timetable(Base):
    __tablename__ = "timetables"
    timetable_id = Column(Integer, primary_key=True, index=True)
    department = Column(String(50))
    year = Column(String(10))
    division = Column(String(10))
    subject = Column(String(150))
    teacher_id = Column(String(50), ForeignKey("teachers.teacher_id"))
    day_of_week = Column(Integer)  # 0=Mon ... 6=Sun
    start_time = Column(String(5)) # 'HH:MM'
    end_time = Column(String(5))   # 'HH:MM'
    type = Column(String(50))      # Lecture/Lab

class Log(Base):
    __tablename__ = "logs"
    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50))
    role = Column(String(20))
    scan_time = Column(DateTime, default=datetime.utcnow)
    action = Column(String(50))
    status = Column(String(50))
    remarks = Column(String(255))

class AcademicCalendar(Base):
    __tablename__ = "academic_calendar"
    event_id = Column(Integer, primary_key=True, index=True)
    date = Column(String(10))          # 'YYYY-MM-DD'
    event_type = Column(String(50))
    description = Column(String(255))
