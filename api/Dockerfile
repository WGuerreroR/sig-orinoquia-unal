FROM python:3.12-slim

WORKDIR /app

# ─────────────────────────────────────────────
# Instalar dependencias del sistema (GIS stack)
# ─────────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libproj-dev \
    proj-data \
    proj-bin \
    libgeos-dev \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Variables necesarias para compilar bindings GDAL
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV GDAL_CONFIG=/usr/bin/gdal-config

# ─────────────────────────────────────────────
# Instalar dependencias Python
# ─────────────────────────────────────────────
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────────
# Copiar código
# ─────────────────────────────────────────────
COPY . .

# Puerto
EXPOSE 8400

# Startup
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8400"]