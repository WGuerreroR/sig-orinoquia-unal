from pathlib import Path
import zipfile
import shutil
import subprocess
from osgeo import gdal, ogr


class ConvertTilesService:

    def __init__(self, job_id, zip_path, job_store, data_dir):
        self.job_id = job_id
        self.zip_path = zip_path
        self.jobs = job_store

        self.job_dir = data_dir / job_id
        self.extract_dir = self.job_dir / "input"
        self.geojson_path = self.job_dir / "data.geojson"
        self.tileset_dir = self.job_dir / "tileset"

        # Crear directorios base
        self.job_dir.mkdir(parents=True, exist_ok=True)

    def run(self):
        try:
            self._update("processing", "Extrayendo archivos...")

            self._extract()
            shp_path = self._find_shp()


            self._validate_geometry(shp_path)

            self._update("processing", "Convirtiendo a GeoJSON (XYZ)...")
            self._convert_to_geojson(shp_path)

            
            #self._update("processing", "Generando 3D Tiles...")
            #self._generate_tiles()

            self.jobs[self.job_id].status = "done"
            self.jobs[self.job_id].tileset_url = self.geojson_path

        except Exception as e:
            self.jobs[self.job_id].status = "error"
            self.jobs[self.job_id].error = str(e)

        finally:
      
            self._cleanup()

    # -------------------------
    # Helpers
    # -------------------------

    def _update(self, status, message):
        self.jobs[self.job_id].status = status
        self.jobs[self.job_id].message = message

    def _extract(self):
        self.extract_dir.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(self.zip_path, "r") as z:
            z.extractall(self.extract_dir)

    def _find_shp(self):
        shp_files = list(self.extract_dir.rglob("*.shp"))

        if not shp_files:
            raise FileNotFoundError("No se encontró shapefile en el ZIP")

        return shp_files[0]

    def _validate_geometry(self, shp_path):
        ds = ogr.Open(str(shp_path))
        layer = ds.GetLayer(0)

        geom_type = ogr.GeometryTypeToName(layer.GetGeomType())

        self._update("processing", f"Geometría detectada: {geom_type}")

        # Validar si tiene Z
        feature = layer.GetNextFeature()
        if feature:
            geom = feature.GetGeometryRef()
            if not geom or not geom.Is3D():
                self._update("processing", "⚠️ El shapefile no tiene coordenada Z real")

    def _convert_to_geojson(self, shp_path):
        options = gdal.VectorTranslateOptions(
            format="GeoJSON",
            dstSRS="EPSG:4326",  # Cesium requiere WGS84
            dim="XYZ"            # Forzar 3D
        )

        result = gdal.VectorTranslate(
            destNameOrDestDS=str(self.geojson_path),
            srcDS=str(shp_path),
            options=options
        )


        if result is None:
            raise RuntimeError("Error en GDAL VectorTranslate")

    def _generate_tiles(self):

        process = subprocess.Popen(
            [
                "py3dtiles", "convert",
                str(self.geojson_path),
                "--out", str(self.tileset_dir),
                "--jobs", "2",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        for line in process.stdout:
            print("LOG:", line.strip())

        process.wait()

        if process.returncode != 0:
            raise RuntimeError("Error en py3dtiles")

    def _cleanup(self):
        try:
            if self.zip_path.exists():
                self.zip_path.unlink()

            shutil.rmtree(self.extract_dir, ignore_errors=True)


        except Exception:
            pass