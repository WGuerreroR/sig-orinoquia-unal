from sqlalchemy.orm import Session
from sqlalchemy import text


class CategoriaService:

    @staticmethod
    def get_all(db: Session):
        result = db.execute(text("""
            SELECT 
                c.id,
                c.nombre ,
                c.color_acento, 
                c.color_claro,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', t.id,
                            'nombre', t.nombre,
                            'url', t.url
                        )
                    ) FILTER (WHERE t.id IS NOT NULL),
                    '[]'
                ) AS temas
            FROM administracion.categoria c
            LEFT JOIN administracion.tema t 
                ON t.id_categoria = c.id AND t.deleted = FALSE
            WHERE c.deleted = FALSE
            GROUP BY c.id, c.nombre, c.color_acento, c.color_claro
            ORDER BY c.id;
        """))

        return [dict(row._mapping) for row in result]


    
    @staticmethod
    def get_all_format(db: Session):
        result = db.execute(text("""
            SELECT 
                c.id,
                c.nombre AS category,
                c.color_acento AS accent,
                c.color_claro AS light,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', t.id,
                            'name', t.nombre,
                            'url', t.url
                        )
                    ) FILTER (WHERE t.id IS NOT NULL),
                    '[]'
                ) AS topics
            FROM administracion.categoria c
            LEFT JOIN administracion.tema t 
                ON t.id_categoria = c.id AND t.deleted = FALSE
            WHERE c.deleted = FALSE
            GROUP BY c.id, c.nombre, c.color_acento, c.color_claro
            ORDER BY c.id;
        """))

        return [dict(row._mapping) for row in result]


    @staticmethod
    def create(db: Session, data):
        result = db.execute(text("""
            INSERT INTO administracion.categoria (
                nombre, color_acento, color_claro
            )
            VALUES (:nombre, :color_acento, :color_claro)
            RETURNING id;
        """), data)

        db.commit()
        return {"id": result.scalar()}

    @staticmethod
    def update(db: Session, id: int, data):
        db.execute(text("""
            UPDATE administracion.categoria
            SET nombre = :nombre,
                color_acento = :color_acento,
                color_claro = :color_claro
            WHERE id = :id AND deleted = FALSE;
        """), {**data, "id": id})

        db.commit()
        return {"status": "updated"}

    @staticmethod
    def delete(db: Session, id: int):
        db.execute(text("""
            UPDATE administracion.categoria
            SET deleted = TRUE
            WHERE id = :id;
        """), {"id": id})

        db.commit()
        return {"status": "deleted"}