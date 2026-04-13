from fastapi import APIRouter,BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import asyncio
import os
import shutil
import subprocess
import uuid
import zipfile
import tempfile
from enum import Enum
from pathlib import Path
from typing import Dict, Optional
from pydantic import BaseModel
from services.convert_tiles_service import ConvertTilesService

router = APIRouter(prefix="/data", tags=["Procesamiento datos"])

DATA_DIR = Path(os.getenv("DATA_DIR", "./data/geojson"))
DATA_DIR.mkdir(parents=True, exist_ok=True)

class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    ERROR = "error"
 
 
class JobInfo(BaseModel):
    job_id: str
    status: JobStatus
    message: str
    tileset_url: Optional[str] = None
    error: Optional[str] = None
 
 
# Job store en memoria (usar Redis en producción)
jobs: Dict[str, JobInfo] = {}

MIME_TYPES = {
    ".json": "application/json",
    ".geojson": "application/geo+json",
    ".b3dm": "application/octet-stream",   # Batched 3D Model
    ".pnts": "application/octet-stream",   # Point Cloud
    ".i3dm": "application/octet-stream",   # Instanced 3D Model
    ".cmpt": "application/octet-stream",   # Composite
    ".glb":  "model/gltf-binary",
    ".gltf": "model/gltf+json",
}

# ─── Endpoints ────────────────────────────────────────────────────────────────
 
@router.get("/health")
def health():
    return {"status": "ok", "service": "data"}
 
 
@router.post("/convert", response_model=JobInfo)
async def convert( id:str,file: UploadFile = File(...)):
    # Validar tipo de archivo
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos .zip")

   
    zip_path = DATA_DIR / f"{id}.zip"
   
    try:
        # Guardar archivo (async-safe)
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Crear job usando tu modelo
        jobs[id] = JobInfo(
            job_id=id,
            status=JobStatus.PENDING,
            message="Archivo recibido, en cola..."
        )

        # Instanciar servicio
        #delete_data(id)
        service = ConvertTilesService(id, zip_path, jobs, DATA_DIR)
        service.run()
        # Ejecutar en background (no bloqueante)
        #asyncio.create_task(run_in_thread(service.run))

        return  jobs.get(id)

    except Exception as e:
        # Limpieza en caso de error temprano
        #if zip_path.exists():
        #    zip_path.unlink()

        raise HTTPException(status_code=500, detail=str(e))

async def run_in_thread(func):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, func)


 

 
@router.get("/status/{id}", response_model=JobInfo)
def get_status(id: str):
    job = jobs.get(id)

    if not job:
        raise HTTPException(status_code=404, detail="Job no encontrado")

    return job


@router.get("/geojson/list")
def list_tilesets():
    """Lista los datasets disponibles con sus URLs."""
    tilesets = []
    for job_dir in sorted(DATA_DIR.iterdir()):
        if not job_dir.is_dir():
            continue
        tileset_file = job_dir / "data.geojson"
        if tileset_file.exists():
            stat = tileset_file.stat()
            tilesets.append({
                "job_id": job_dir.name,
                "dataset_url": f"/{job_dir.name}/data.geojson",
                "created_at": stat.st_mtime,
                "size_mb": round(
                    sum(f.stat().st_size for f in (job_dir / "dataset").rglob("*") if f.is_file())
                    / 1_048_576,
                    2,
                ),
            })
    return {"datasets": tilesets, "count": len(tilesets)}
 
 
 
@router.get("/{id}/data.geojson")
def serve_tile(id: str):
    """
    Sirve cualquier archivo geojson.
    """
    tile_path = DATA_DIR / id / "data.geojson"
 
    if not tile_path.exists():
        raise HTTPException(404, f" geojson no encontrado en job '{id}'")
 
    if not tile_path.is_file():
        raise HTTPException(400, "La ruta no apunta a un archivo")
 
    # Detectar MIME type por extensión
    suffix = tile_path.suffix.lower()
    media_type = MIME_TYPES.get(suffix, "application/octet-stream")
 
    return FileResponse(
        path=tile_path,
        media_type=media_type,
        headers={
            # Cache agresivo para tiles individuales (no cambian)
            "Cache-Control": "public, max-age=86400",
            "Access-Control-Allow-Origin": "*",
        },
    )
 

#@router.delete("/{id}")
def delete_data(id: str):

    import shutil
    job_dir = DATA_DIR / id
    if not job_dir.exists():
        raise HTTPException(404, f"Tileset '{id}' no encontrado")
    shutil.rmtree(job_dir)
    return {"message": f"datasets '{id}' eliminado"}

    
