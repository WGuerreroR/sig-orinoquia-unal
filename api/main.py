from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routers import geo_carga, categoria, tema
app = FastAPI(title="GeoVisor API SIG Orinoquia UNAL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o una lista de dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers con prefijos
app.include_router(geo_carga.router, prefix="/api/v1")
app.include_router(categoria.router, prefix="/api/v1")
app.include_router(tema.router, prefix="/api/v1")