from pydantic import BaseModel
from typing import List,Optional
from .tema import TemaResponse, TemaOut


class CategoriaBase(BaseModel):
    nombre: str
    color_acento: Optional[str] = None
    color_claro: Optional[str] = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int
    temas: List[TemaResponse] = []

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True


class CategoriaOut(BaseModel):
    id: int
    category: str
    accent: Optional[str] = None
    light: Optional[str] = None
    topics: List[TemaOut] = []

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True