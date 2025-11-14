from datetime import datetime, date as date_cls
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import Log, Student

router = APIRouter()

class AttendanceListItem(BaseModel):
    student_id: Optional[str] = None
    name: Optional[str] = None
    subject: Optional[str] = None
    in_time: Optional[datetime] = None
    out_time: Optional[datetime] = None
    status: Optional[str] = None
    source: Optional[str] = None

@router.get("/attendance")
def list_attendance(
    date: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[str] = None,
    division: Optional[str] = None,
    subject: Optional[str] = None,
    student_id: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
):
    # For now, derive attendance from logs table (simple stream)
    q = db.query(Log).order_by(desc(Log.scan_time))
    if student_id:
        q = q.filter(Log.user_id == student_id)
    # Basic date filter (YYYY-MM-DD)
    if date:
        try:
            d = datetime.strptime(date, "%Y-%m-%d").date()
            # naive filter by comparing date portion
            next_d = datetime(d.year, d.month, d.day, 23, 59, 59)
            start = datetime(d.year, d.month, d.day, 0, 0, 0)
            q = q.filter(Log.scan_time >= start, Log.scan_time <= next_d)
        except ValueError:
            pass

    total = q.count()
    rows = q.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for r in rows:
        stu = db.query(Student).filter(Student.student_id == r.user_id).first()
        items.append({
            "student_id": r.user_id,
            "name": getattr(stu, 'name', None),
            "subject": subject,
            "in_time": r.scan_time if (r.action or '').upper() in ("IN", "SCAN") else None,
            "out_time": r.scan_time if (r.action or '').upper() == "OUT" else None,
            "status": r.status,
            "source": "manual" if (r.remarks or '').startswith('attendance.mark') else ("scan" if (r.action or '').lower() == 'scan' else 'manual'),
        })

    return {"items": items, "total": total}

class MarkRequest(BaseModel):
    student_id: str
    date: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    division: Optional[str] = None
    subject: Optional[str] = None
    action: str  # 'in' or 'out'

@router.post("/attendance/mark")
def mark_attendance(req: MarkRequest, db: Session = Depends(get_db)):
    action = req.action.upper()
    if action not in ("IN", "OUT"):
        raise HTTPException(status_code=400, detail="action must be IN or OUT")

    log = Log(
        user_id=req.student_id,
        role="student",
        action=action,
        status="manual",
        remarks=f"attendance.mark; dept={req.department or ''}; year={req.year or ''}; div={req.division or ''}; subj={req.subject or ''}"
    )
    db.add(log)
    db.commit()
    return {"message": "ok"}

@router.get("/attendance/export")
def export_attendance(
    date: Optional[str] = None,
    student_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Log).order_by(desc(Log.scan_time))
    if student_id:
        q = q.filter(Log.user_id == student_id)
    if date:
        try:
            d = datetime.strptime(date, "%Y-%m-%d").date()
            next_d = datetime(d.year, d.month, d.day, 23, 59, 59)
            start = datetime(d.year, d.month, d.day, 0, 0, 0)
            q = q.filter(Log.scan_time >= start, Log.scan_time <= next_d)
        except ValueError:
            pass
    rows = q.limit(1000).all()
    headers = ["student_id","time","action","status","remarks"]
    lines = [",".join(headers)]
    for r in rows:
        lines.append(
            ",".join([
                r.user_id or '',
                r.scan_time.strftime("%Y-%m-%d %H:%M:%S") if r.scan_time else '',
                r.action or '',
                r.status or '',
                (r.remarks or '').replace(',', ';')
            ])
        )
    csv = "\n".join(lines)
    return PlainTextResponse(content=csv, media_type='text/csv', headers={"Content-Disposition": "attachment; filename=attendance.csv"})
