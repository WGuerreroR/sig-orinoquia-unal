import geopandas as gpd
import zipfile
import os
import tempfile
from sqlalchemy import text
from db.connection import engine


class ShapefileService:

    def __init__(self, target_srid: int, schema: str, table: str):
        self.target_srid = target_srid
        self.schema = schema
        self.table = table

    def _extract_zip(self, zip_path: str) -> str:
        temp_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        return temp_dir

    def _find_shp(self, directory: str) -> str:
        for file in os.listdir(directory):
            if file.lower().endswith(".shp"):
                return os.path.join(directory, file)
        raise Exception("No se encontró archivo .shp en el ZIP")

    def load_shapefile(self, zip_path: str):

        # 1. Extraer ZIP
        folder = self._extract_zip(zip_path)

        # 2. Buscar shapefile
        shp_path = self._find_shp(folder)

        # 3. Leer shapefile
        gdf = gpd.read_file(shp_path)

        if gdf.empty:
            raise Exception("El shapefile está vacío")

        if gdf.crs is None:
            raise Exception("El shapefile no tiene CRS definido")

        print(f"CRS origen: {gdf.crs}")

        # 4. Reproyectar si es necesario
        source_srid = gdf.crs.to_epsg()
        if source_srid != self.target_srid:
            print(f"Reproyectando de {source_srid} a {self.target_srid}")
            gdf = gdf.to_crs(epsg=self.target_srid)

        # 5. Renombrar geometría a 'geom'
        gdf = gdf.rename_geometry("geom")

        # 6. Guardar en PostGIS
        gdf.to_postgis(
            name=self.table,
            con=engine,
            schema=self.schema,
            if_exists="replace",
            index=False
        )

        # 7. Crear índice espacial
        with engine.connect() as conn:
            conn.execute(text(f"""
                CREATE INDEX IF NOT EXISTS idx_{self.table}_geom
                ON {self.schema}.{self.table}
                USING GIST (geom);
            """))

        return {
            "status": "success",
            "rows": len(gdf),
            "source_srid": source_srid,
            "target_srid": self.target_srid
        }