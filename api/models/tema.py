from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from db.connection import Base


class Tema(Base):
    __tablename__ = "tema"
    __table_args__ = {"schema": "administracion"}

    id = Column(Integer, primary_key=True, index=True)
    id_categoria = Column(Integer, ForeignKey("administracion.categoria.id"))
    nombre = Column(String, nullable=False)
    url = Column(String, nullable=False)
    deleted = Column(Boolean, default=False)

    categoria = relationship("Categoria", back_populates="temas")