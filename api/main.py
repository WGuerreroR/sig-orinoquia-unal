from fastapi import FastAPI, HTTPException, Depends, Request , Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse



app = FastAPI()

# Middleware CORS para permitir solicitudes de todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los encabezados
)

# Función auxiliar para obtener el cuerpo de la solicitud
async def get_body(request: Request):
    """
    Función auxiliar para extraer el cuerpo de la solicitud en formato bytes.
    Se utiliza en varios endpoints donde el cuerpo es necesario.
    """
    return await request.body()

@app.get("/consulta/prueba")
async def prueba():
    """
    Endpoint de prueba para verificar que el servidor está activo.
    
    Devuelve una lista simple con el valor "feliz".
    """
    bbox = ["feliz"]
    return bbox
