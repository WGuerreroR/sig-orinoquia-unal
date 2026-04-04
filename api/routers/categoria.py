from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_db
from services.categoria_service import CategoriaService
from schemas.categoria import CategoriaCreate, CategoriaUpdate, CategoriaResponse, CategoriaOut

router = APIRouter(
    prefix="/categoria",
    tags=["Categorias"]
)


# 🔵 GET - listar todas
@router.get("/", response_model=List[CategoriaResponse])
def get_all(db: Session = Depends(get_db)):
    return CategoriaService.get_all(db)

@router.get("/formato", response_model=List[CategoriaOut])
def get_all(db: Session = Depends(get_db)):
    return CategoriaService.get_all_format(db)



@router.get("/{id}", response_model=CategoriaResponse)
def get_one(id: int, db: Session = Depends(get_db)):
    data = CategoriaService.get_all(db)
    for item in data:
        if item["id"] == id:
            return item
    return {"error": "No encontrado"}



@router.post("/", response_model=dict)
def create(data: CategoriaCreate, db: Session = Depends(get_db)):
    return CategoriaService.create(db, data.dict())

@router.put("/{id}", response_model=dict)
def update(id: int, data: CategoriaUpdate, db: Session = Depends(get_db)):
    return CategoriaService.update(db, id, data.dict())


@router.delete("/{id}", response_model=dict)
def delete(id: int, db: Session = Depends(get_db)):
    return CategoriaService.delete(db, id)