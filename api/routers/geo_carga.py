from fastapi import APIRouter, UploadFile, File, Form
import shutil
import tempfile
from services.shapefile_service import ShapefileService

router = APIRouter(prefix="/carga", tags=["Carga datos"])

@router.post("/upload-shapefile/")
async def upload_shapefile(
    file: UploadFile = File(...),
    schema: str = Form(...),
    table: str = Form(...),
    srid: int = Form(...)
):
    # Guardar archivo temporal
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    
    with temp_file as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Procesar shapefile
    service = ShapefileService(
        target_srid=srid,
        schema=schema,
        table=table
    )

    result = service.load_shapefile(temp_file.name)

    return result