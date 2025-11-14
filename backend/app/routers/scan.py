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


# ---- Manual entry (no barcode) ----
class ManualScanRequest(BaseModel):
    department: str
    year: str
    division: str
    roll_no: str | None = None
    name: str | None = None
    direction: str  # 'IN' or 'OUT'


@router.post("/scan/manual", response_model=ScanResponse)
def manual_scan(req: ManualScanRequest, db: Session = Depends(get_db)):
    # Restrict to Computer dept and SY/TY/Final as per current requirement
    allowed_years = {"SY", "TY", "Final"}
    if req.department.lower() != "computer" or req.year not in allowed_years:
        raise HTTPException(status_code=400, detail="Only Computer SY/TY/Final allowed currently")

    # Try to find student by roll_no if provided, else by name+dept+year+div
    student = None
    if req.roll_no:
        student = db.query(Student).filter(Student.student_id == req.roll_no).first()
    if not student and req.name:
        student = (
            db.query(Student)
            .filter(
                Student.name == req.name,
                Student.department == req.department,
                Student.year == req.year,
                Student.division == req.division,
            )
            .first()
        )

    # Log regardless (for now) so manual entries are tracked even if student master is incomplete
    remarks = f"manual; dept={req.department}; year={req.year}; div={req.division}; roll={req.roll_no or ''}; name={req.name or ''}"
    status = "granted" if student else "unknown"
    log = Log(
        user_id=student.student_id if student else (req.roll_no or req.name or "unknown"),
        role="student",
        action=req.direction.upper(),
        status=status,
        remarks=remarks,
    )
    db.add(log)
    db.commit()

    msg = "Recorded" if student else "Recorded (student not found in master)"
    return {"status": status, "message": msg}
