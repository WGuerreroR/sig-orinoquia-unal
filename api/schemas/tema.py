from pydantic import BaseModel, HttpUrl


class TemaBase(BaseModel):
    nombre: str
    url: HttpUrl


class TemaCreate(TemaBase):
    id_categoria: int


class TemaUpdate(TemaBase):
    id_categoria: int


class TemaResponse(TemaBase):
    id: int

    class Config:
        from_attributes = True

class TemaOut(BaseModel):
    id: int
    name: str   
    url: str