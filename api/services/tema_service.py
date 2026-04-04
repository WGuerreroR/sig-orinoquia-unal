from sqlalchemy.orm import Session
from sqlalchemy import text


class TemaService:

    @staticmethod
    def create(db: Session, data):
        data = dict(data)  
        data["url"] = str(data["url"]) 
        result = db.execute(text("""
            INSERT INTO administracion.tema (
                id_categoria, nombre, url
            )
            VALUES (:id_categoria, :nombre, :url)
            RETURNING id;
        """), data)

        db.commit()
        return {"id": result.scalar()}


    @staticmethod
    def update(db: Session, id: int, data):
        data = data.model_dump()  # 👈 SOLUCIÓN
        data["url"] = str(data["url"])
        result = db.execute(text("""
            UPDATE administracion.tema
            SET id_categoria = :id_categoria,
                nombre = :nombre,
                url = :url
            WHERE id = :id AND deleted = FALSE;
        """), {**data, "id": id})

        db.commit()

        if result.rowcount == 0:
            return {"error": "No encontrado o eliminado"}

        return {"status": "updated"}
    
    @staticmethod
    def delete(db: Session, id: int):
        db.execute(text("""
            UPDATE administracion.tema
            SET deleted = TRUE
            WHERE id = :id;
        """), {"id": id})

        db.commit()
        return {"status": "deleted"}