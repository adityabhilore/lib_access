from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Student, Teacher, Log

router = APIRouter()

class ScanRequest(BaseModel):
    barcodeId: str

class ScanResponse(BaseModel):
    status: str
    message: str

@router.post("/scan", response_model=ScanResponse)
def scan(req: ScanRequest, db: Session = Depends(get_db)):
    # Identify user role by barcode id
    student = db.query(Student).filter(Student.student_id == req.barcodeId).first()
    teacher = None if student else db.query(Teacher).filter(Teacher.teacher_id == req.barcodeId).first()

    if not student and not teacher:
        log = Log(user_id=req.barcodeId, role="unknown", action="scan", status="invalid", remarks="Not found")
        db.add(log)
        db.commit()
        return {"status": "invalid", "message": "Invalid ID"}

    role = "student" if student else "teacher"
    user_id = req.barcodeId

    # TODO: timetable and academic calendar checks can be implemented here.
    # For now, always grant access; if role is student, return 'granted' (no alert).
    log = Log(user_id=user_id, role=role, action="scan", status="granted", remarks="")
    db.add(log)
    db.commit()

    return {"status": "granted", "message": "Access Granted"}
