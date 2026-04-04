from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.connection import get_db
from schemas.tema import TemaCreate,TemaUpdate, TemaResponse
from services.tema_service import TemaService  # 👈 IMPORTANTE

router = APIRouter(prefix="/tema", tags=["Temas"])

# CREATE
@router.post("/", response_model=dict)
def crear_tema(data: TemaCreate, db: Session = Depends(get_db)):
    return TemaService.create(db, data)


# UPDATE
@router.put("/{id}", response_model=dict)
def actualizar_tema(id: int, data: TemaUpdate, db: Session = Depends(get_db)):
    return TemaService.update(db, id, data)


# DELETE
@router.delete("/{id}", response_model=dict)
def eliminar_tema(id: int, db: Session = Depends(get_db)):
    return TemaService.delete(db, id)