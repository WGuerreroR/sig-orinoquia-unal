from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from db.connection import Base


class Categoria(Base):
    __tablename__ = "categoria"
    __table_args__ = {"schema": "administracion"}

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    color_acento = Column(String(20))
    color_claro = Column(String(20))
    deleted = Column(Boolean, default=False)

    temas = relationship(
        "Tema",
        back_populates="categoria",
        cascade="all, delete"
    )